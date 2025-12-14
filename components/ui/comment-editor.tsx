/**
 * Comment Editor - Simplified TipTap for comments
 * 
 * Features:
 * - @mention employees
 * - Upload/paste/drop images → direct to server (no staging)
 * - Rich text formatting
 * - Enter to submit
 * 
 * Use this for: Comments, quick notes, chat-like UX
 * For rich content (category, product descriptions), use TipTapEditor instead
 */

import * as React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Mention from '@tiptap/extension-mention';
import Placeholder from '@tiptap/extension-placeholder';
import { cn } from '../../lib/utils';
import { FileUploadAPI } from '../../lib/file-upload-api.ts';
import { Bold, Italic, Image as ImageIcon, AtSign, Upload, Loader2 } from 'lucide-react';
import { Button } from './button';
import { toast } from 'sonner';
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import { MentionCombobox } from './mention-combobox.tsx';

export interface CommentEditorProps {
  content?: string;
  onChange?: (content: string, contentText: string) => void;
  placeholder?: string;
  mentions?: Array<{ id: string; label: string; avatar?: string }>;
  onImageUpload?: (file: File) => Promise<string>; // Custom uploader
  disabled?: boolean;
  className?: string;
  minHeight?: string;
  onSubmit?: () => void; // Enter to submit
  maxImageSize?: number; // Max image size in bytes (default 5MB)
}

export function CommentEditor({
  content = '',
  onChange,
  placeholder = 'Viết bình luận...',
  mentions = [],
  onImageUpload,
  disabled = false,
  className,
  minHeight = '80px',
  onSubmit,
  maxImageSize = 5 * 1024 * 1024, // 5MB default
}: CommentEditorProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = React.useState(false);
  const [isDragging, setIsDragging] = React.useState(false);
  const dragCounterRef = React.useRef(0);

  // Default uploader - direct to comments folder
  const defaultUploader = React.useCallback(async (file: File): Promise<string> => {
    const asset = await FileUploadAPI.uploadCommentImage(file);
    return asset.url;
  }, []);

  // Use custom uploader or default
  const uploadImage = onImageUpload || defaultUploader;

  // Validate and upload image
  const handleImageFile = React.useCallback(async (file: File, source: 'select' | 'paste' | 'drop') => {
    if (!file.type.startsWith('image/')) {
      toast.error('Chỉ chấp nhận file ảnh');
      return;
    }

    if (file.size > maxImageSize) {
      const maxMB = Math.round(maxImageSize / 1024 / 1024);
      toast.error('Ảnh quá lớn', { description: `Kích thước tối đa ${maxMB}MB` });
      return;
    }

    setIsUploading(true);
    try {
      const url = await uploadImage(file);
      editor?.chain().focus().setImage({ src: url }).run();
      toast.success(source === 'paste' ? 'Đã dán ảnh' : source === 'drop' ? 'Đã thả ảnh' : 'Đã thêm ảnh');
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Không thể tải ảnh lên');
    } finally {
      setIsUploading(false);
    }
  }, [uploadImage, maxImageSize]);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        inline: true,
        allowBase64: false, // No base64!
      }),
      Placeholder.configure({
        placeholder,
      }),
      Mention.configure({
        HTMLAttributes: {
          class: 'mention',
        },
        suggestion: {
          items: ({ query }) => {
            return mentions.filter(item => 
              item.label.toLowerCase().includes(query.toLowerCase())
            );
          },
          render: () => {
            let component: any;
            let popup: any;

            return {
              onStart: (props: any) => {
                component = new MentionCombobox(props);
                popup = tippy('body', {
                  getReferenceClientRect: props.clientRect,
                  appendTo: () => document.body,
                  content: component.element,
                  showOnCreate: true,
                  interactive: true,
                  trigger: 'manual',
                  placement: 'bottom-start',
                  theme: 'mention',
                  maxWidth: 'none',
                });
              },
              onUpdate(props: any) {
                component.updateProps(props);
                popup[0].setProps({
                  getReferenceClientRect: props.clientRect,
                });
              },
              onKeyDown(props: any) {
                if (props.event.key === 'Escape') {
                  popup[0].hide();
                  return true;
                }
                return component.onKeyDown(props);
              },
              onExit() {
                popup[0].destroy();
                component.destroy();
              },
            };
          },
        },
      }),
    ],
    content,
    editable: !disabled,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const text = editor.getText();
      onChange?.(html, text);
    },
    editorProps: {
      handleKeyDown: (view, event) => {
        // Enter to submit (without Shift)
        if (event.key === 'Enter' && !event.shiftKey && onSubmit) {
          event.preventDefault();
          onSubmit();
          return true;
        }
        return false;
      },
    },
  });

  // Handle image upload from file input
  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await handleImageFile(file, 'select');
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle paste image
  React.useEffect(() => {
    if (!editor) return;

    const handlePaste = async (event: ClipboardEvent) => {
      const items = event.clipboardData?.items;
      if (!items) return;

      for (const item of Array.from(items)) {
        if (item.type.startsWith('image/')) {
          event.preventDefault();
          const file = item.getAsFile();
          if (file) {
            await handleImageFile(file, 'paste');
          }
          break;
        }
      }
    };

    const editorElement = editor.view.dom;
    editorElement.addEventListener('paste', handlePaste as any);
    return () => {
      editorElement.removeEventListener('paste', handlePaste as any);
    };
  }, [editor, handleImageFile]);

  // Handle drag & drop
  const handleDragEnter = React.useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current++;
    if (e.dataTransfer?.types.includes('Files')) {
      setIsDragging(true);
    }
  }, []);

  const handleDragLeave = React.useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current--;
    if (dragCounterRef.current === 0) {
      setIsDragging(false);
    }
  }, []);

  const handleDragOver = React.useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = React.useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    dragCounterRef.current = 0;

    const files = Array.from(e.dataTransfer?.files || []);
    const imageFile = files.find(f => f.type.startsWith('image/'));
    
    if (imageFile) {
      await handleImageFile(imageFile, 'drop');
    }
  }, [handleImageFile]);

  // Sync content prop with editor state
  React.useEffect(() => {
    if (!editor) return;
    const currentContent = editor.getHTML();
    if (content !== currentContent) {
      editor.commands.setContent(content);
    }
  }, [editor, content]);

  if (!editor) {
    return null;
  }

  return (
    <div 
      className={cn(
        'border rounded-lg bg-background relative',
        isDragging && 'ring-2 ring-primary border-primary',
        className
      )}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {/* Drag overlay */}
      {isDragging && (
        <div className="absolute inset-0 z-10 bg-primary/10 flex items-center justify-center rounded-lg pointer-events-none">
          <div className="flex flex-col items-center gap-2 text-primary">
            <Upload className="h-6 w-6" />
            <span className="text-sm font-medium">Thả ảnh vào đây</span>
          </div>
        </div>
      )}
      
      {/* Toolbar - Compact */}
      <div className="flex items-center gap-0.5 p-1.5 border-b bg-muted/30">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={cn('h-7 w-7 p-0', editor.isActive('bold') && 'bg-muted')}
          disabled={disabled}
          title="Bold"
        >
          <Bold className="h-3.5 w-3.5" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={cn('h-7 w-7 p-0', editor.isActive('italic') && 'bg-muted')}
          disabled={disabled}
          title="Italic"
        >
          <Italic className="h-3.5 w-3.5" />
        </Button>
        <div className="w-px h-5 bg-border mx-0.5" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          className="h-7 w-7 p-0"
          disabled={disabled || isUploading}
          title="Thêm ảnh"
        >
          {isUploading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <ImageIcon className="h-3.5 w-3.5" />
          )}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().insertContent('@').run()}
          className="h-7 w-7 p-0"
          disabled={disabled}
          title="Tag người (@)"
        >
          <AtSign className="h-3.5 w-3.5" />
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageSelect}
          className="hidden"
        />
      </div>

      {/* Editor Content */}
      <div
        onClick={() => editor?.commands.focus()}
        className="cursor-text"
        style={{ minHeight }}
      >
        <EditorContent
          editor={editor}
          className={cn('prose prose-sm max-w-none p-2', disabled && 'opacity-50')}
        />
      </div>
    </div>
  );
}
