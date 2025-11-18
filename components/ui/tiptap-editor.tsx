/**
 * TipTap Rich Text Editor
 * 
 * Features:
 * - @mention employees
 * - Upload/paste images
 * - Rich text formatting
 * - Facebook-like UX
 */

import * as React from 'react';
import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Mention from '@tiptap/extension-mention';
import Placeholder from '@tiptap/extension-placeholder';
import { cn } from '../../lib/utils';
import { Bold, Italic, Image as ImageIcon, AtSign, X } from 'lucide-react';
import { Button } from './button';
import { toast } from 'sonner';
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import { MentionCombobox } from './mention-combobox.tsx';

export interface TipTapEditorProps {
  content?: string;
  onChange?: (content: string, contentText: string) => void;
  placeholder?: string;
  mentions?: Array<{ id: string; label: string; avatar?: string }>;
  onImageUpload?: (file: File) => Promise<string>; // Returns image URL
  disabled?: boolean;
  className?: string;
  minHeight?: string;
  onSubmit?: () => void; // ===== NEW: Enter to submit =====
}

export function TipTapEditor({
  content = '',
  onChange,
  placeholder = 'Viết bình luận...',
  mentions = [],
  onImageUpload,
  disabled = false,
  className,
  minHeight = '100px',
  onSubmit, // ===== NEW =====
}: TipTapEditorProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = React.useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        inline: true,
        allowBase64: true,
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
            // Search through all employees
            return mentions
              .filter(item => item.label.toLowerCase().includes(query.toLowerCase()));
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

  // Handle image upload
  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Chỉ chấp nhận file ảnh');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Ảnh quá lớn', { description: 'Kích thước tối đa 5MB' });
      return;
    }

    setIsUploading(true);
    try {
      if (onImageUpload) {
        // Upload via API
        const url = await onImageUpload(file);
        editor?.chain().focus().setImage({ src: url }).run();
      } else {
        // Use base64 as fallback
        const reader = new FileReader();
        reader.onload = () => {
          const base64 = reader.result as string;
          editor?.chain().focus().setImage({ src: base64 }).run();
        };
        reader.readAsDataURL(file);
      }
      toast.success('Đã thêm ảnh');
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Không thể tải ảnh lên');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
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
          if (!file) continue;

          setIsUploading(true);
          try {
            if (onImageUpload) {
              const url = await onImageUpload(file);
              editor.chain().focus().setImage({ src: url }).run();
            } else {
              const reader = new FileReader();
              reader.onload = () => {
                const base64 = reader.result as string;
                editor.chain().focus().setImage({ src: base64 }).run();
              };
              reader.readAsDataURL(file);
            }
            toast.success('Đã dán ảnh');
          } catch (error) {
            console.error('Paste failed:', error);
            toast.error('Không thể dán ảnh');
          } finally {
            setIsUploading(false);
          }
        }
      }
    };

    const editorElement = editor.view.dom;
    editorElement.addEventListener('paste', handlePaste as any);
    return () => {
      editorElement.removeEventListener('paste', handlePaste as any);
    };
  }, [editor, onImageUpload]);

  // Sync content prop with editor state (clear content when parent resets)
  React.useEffect(() => {
    if (!editor) return;
    
    // Only update if content is different from current editor content
    const currentContent = editor.getHTML();
    if (content !== currentContent) {
      editor.commands.setContent(content);
    }
  }, [editor, content]);

  if (!editor) {
    return null;
  }

  return (
    <div className={cn('border rounded-lg bg-background', className)}>
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 border-b bg-muted/50">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={cn('h-8 w-8 p-0', editor.isActive('bold') && 'bg-muted')}
          disabled={disabled}
          title="Bold (Ctrl+B)"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={cn('h-8 w-8 p-0', editor.isActive('italic') && 'bg-muted')}
          disabled={disabled}
          title="Italic (Ctrl+I)"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <div className="w-px h-6 bg-border mx-1" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          className="h-8 w-8 p-0"
          disabled={disabled || isUploading}
          title="Thêm ảnh"
        >
          <ImageIcon className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            // Insert @ to trigger mention
            editor.chain().focus().insertContent('@').run();
          }}
          className="h-8 w-8 p-0"
          disabled={disabled}
          title="Tag người (@)"
        >
          <AtSign className="h-4 w-4" />
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageSelect}
          className="hidden"
        />
      </div>

      {/* Editor Content - Wrapped với div clickable */}
      <div
        onClick={() => editor?.commands.focus()}
        className="cursor-text"
        style={{ minHeight }}
      >
        <EditorContent
          editor={editor}
          className={cn('prose prose-sm max-w-none p-3', disabled && 'opacity-50')}
        />
      </div>

      {isUploading && (
        <div className="p-2 border-t text-xs text-muted-foreground">
          Đang tải ảnh lên...
        </div>
      )}
    </div>
  );
}

