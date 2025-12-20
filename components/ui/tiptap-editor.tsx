/**
 * TipTap Rich Text Editor - For rich content (categories, products, etc.)
 * 
 * Features:
 * - Upload/paste/drop images → STAGING (confirm on save)
 * - Rich text formatting (bold, italic, headings, lists)
 * - Drag & drop support
 * 
 * IMPORTANT: Images are uploaded to staging first!
 * Parent component must call FileUploadAPI.confirmEditorImages() on save
 * to move images from staging to permanent storage.
 * 
 * For comments/quick notes, use CommentEditor instead (direct upload)
 */

import * as React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import { cn } from '../../lib/utils';
import { FileUploadAPI, type StagingFile } from '../../lib/file-upload-api';
import { Bold, Italic, Image as ImageIcon, Upload, Loader2, List, ListOrdered, Heading2 } from 'lucide-react';
import { Button } from './button';
import { toast } from 'sonner';

export interface TipTapEditorProps {
  content?: string;
  onChange?: (content: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  minHeight?: string;
  maxImageSize?: number; // Max image size in bytes (default 5MB)
  // Staging mode props
  sessionId?: string; // Existing session ID (for edit mode)
  onSessionChange?: (sessionId: string) => void; // Callback when session changes
  onStagingFilesChange?: (files: StagingFile[]) => void; // Track staging files
}

export function TipTapEditor({
  content = '',
  onChange,
  placeholder = 'Nhập nội dung...',
  disabled = false,
  className,
  minHeight = '200px',
  maxImageSize = 5 * 1024 * 1024, // 5MB default
  // Staging mode
  sessionId: externalSessionId,
  onSessionChange,
  onStagingFilesChange,
}: TipTapEditorProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = React.useState(false);
  const [isDragging, setIsDragging] = React.useState(false);
  const dragCounterRef = React.useRef(0);
  
  // Staging state
  const [internalSessionId, setInternalSessionId] = React.useState<string | undefined>(externalSessionId);
  const [stagingFiles, setStagingFiles] = React.useState<StagingFile[]>([]);
  
  const currentSessionId = externalSessionId || internalSessionId;

  // Notify parent of staging files changes
  React.useEffect(() => {
    onStagingFilesChange?.(stagingFiles);
  }, [stagingFiles, onStagingFilesChange]);

  // Upload to staging
  const uploadToStaging = React.useCallback(async (file: File): Promise<string> => {
    const result = await FileUploadAPI.uploadEditorImageToStaging(file, currentSessionId);
    
    // Update session ID if new
    if (!currentSessionId || currentSessionId !== result.sessionId) {
      setInternalSessionId(result.sessionId);
      onSessionChange?.(result.sessionId);
    }
    
    // Track staging file
    setStagingFiles(prev => [...prev, result.file]);
    
    return result.file.url;
  }, [currentSessionId, onSessionChange]);

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
      const url = await uploadToStaging(file);
      editor?.chain().focus().setImage({ src: url }).run();
      toast.success(source === 'paste' ? 'Đã dán ảnh' : source === 'drop' ? 'Đã thả ảnh' : 'Đã thêm ảnh');
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Không thể tải ảnh lên');
    } finally {
      setIsUploading(false);
    }
  }, [uploadToStaging, maxImageSize]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
      }),
      Image.configure({
        inline: false,
        allowBase64: false, // No base64 - always upload!
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    editable: !disabled,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange?.(html);
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

  // Handle drag & drop image
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

  // Reset staging when content is cleared (new form)
  React.useEffect(() => {
    if (content === '' || content === '<p></p>') {
      setStagingFiles([]);
      setInternalSessionId(undefined);
    }
  }, [content]);

  if (!editor) {
    return null;
  }

  return (
    <div 
      className={cn(
        'border rounded-lg bg-background relative overflow-hidden',
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
        <div className="absolute inset-0 z-10 bg-primary/10 flex items-center justify-center pointer-events-none">
          <div className="flex flex-col items-center gap-2 text-primary">
            <Upload className="h-8 w-8" />
            <span className="font-medium">Thả ảnh vào đây</span>
          </div>
        </div>
      )}
      
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 border-b bg-muted/30 flex-wrap">
        {/* Text formatting */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={cn('h-8 w-8 p-0', editor.isActive('bold') && 'bg-muted')}
          disabled={disabled}
          title="In đậm (Ctrl+B)"
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
          title="In nghiêng (Ctrl+I)"
        >
          <Italic className="h-4 w-4" />
        </Button>
        
        <div className="w-px h-6 bg-border mx-1" />
        
        {/* Headings */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={cn('h-8 w-8 p-0', editor.isActive('heading', { level: 2 }) && 'bg-muted')}
          disabled={disabled}
          title="Tiêu đề"
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        
        <div className="w-px h-6 bg-border mx-1" />
        
        {/* Lists */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={cn('h-8 w-8 p-0', editor.isActive('bulletList') && 'bg-muted')}
          disabled={disabled}
          title="Danh sách"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={cn('h-8 w-8 p-0', editor.isActive('orderedList') && 'bg-muted')}
          disabled={disabled}
          title="Danh sách số"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        
        <div className="w-px h-6 bg-border mx-1" />
        
        {/* Image */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          className="h-8 w-8 p-0"
          disabled={disabled || isUploading}
          title="Chèn ảnh"
        >
          {isUploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ImageIcon className="h-4 w-4" />
          )}
        </Button>
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageSelect}
          className="hidden"
        />
        
        {/* Staging indicator */}
        {stagingFiles.length > 0 && (
          <span className="ml-auto text-xs text-muted-foreground">
            {stagingFiles.length} ảnh chờ lưu
          </span>
        )}
      </div>

      {/* Editor Content */}
      <div
        onClick={() => editor?.commands.focus()}
        className="cursor-text"
        style={{ minHeight }}
      >
        <EditorContent
          editor={editor}
          className={cn(
            'prose prose-sm max-w-none p-4',
            'prose-headings:font-semibold prose-headings:text-foreground',
            'prose-p:text-foreground prose-p:leading-relaxed',
            'prose-img:rounded-lg prose-img:max-w-full',
            disabled && 'opacity-50'
          )}
        />
      </div>

      {/* Upload indicator */}
      {isUploading && (
        <div className="absolute bottom-0 left-0 right-0 p-2 bg-muted/80 text-xs text-muted-foreground flex items-center gap-2 border-t">
          <Loader2 className="h-3 w-3 animate-spin" />
          Đang tải ảnh lên...
        </div>
      )}
    </div>
  );
}