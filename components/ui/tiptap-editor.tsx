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

'use client'

import * as React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { cn } from '../../lib/utils';
import { FileUploadAPI, type StagingFile } from '../../lib/file-upload-api';
import { Bold, Italic, Image as ImageIcon, Upload, Loader2, List, ListOrdered, Heading1, Heading2, Heading3, Heading4, Heading5, Heading6, Underline as UnderlineIcon, Strikethrough, Link as LinkIcon, Quote, Code, AlignLeft, AlignCenter, AlignRight, AlignJustify, Unlink, ChevronDown, Type } from 'lucide-react';
import { Button } from './button';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './dialog';
import { Input } from './input';
import { Label } from './label';

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
  
  // Image editing dialog state
  const [isImageDialogOpen, setIsImageDialogOpen] = React.useState(false);
  const [editingImageSrc, setEditingImageSrc] = React.useState('');
  const [editingImageAlt, setEditingImageAlt] = React.useState('');
  const [editingImageTitle, setEditingImageTitle] = React.useState('');
  
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

  // Validate and upload image - editor is accessed via closure at call time
  const handleImageFile = React.useCallback(
    async (file: File, source: 'select' | 'paste' | 'drop') => {
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
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps -- editor is defined after this callback and accessed via closure
    [uploadToStaging, maxImageSize]
  );

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
      }),
      Image.configure({
        inline: false,
        allowBase64: false, // No base64 - always upload!
        HTMLAttributes: {
          class: 'cursor-pointer rounded-lg max-w-full hover:ring-2 hover:ring-primary/50 transition-all',
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content,
    editable: !disabled,
    immediatelyRender: false, // Fix SSR hydration mismatch
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange?.(html);
    },
  });

  // Handle click on image to edit alt/title
  React.useEffect(() => {
    if (!editor) return;
    
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target.tagName === 'IMG') {
        event.preventDefault();
        const img = target as HTMLImageElement;
        setEditingImageSrc(img.src);
        setEditingImageAlt(img.alt || '');
        setEditingImageTitle(img.title || '');
        setIsImageDialogOpen(true);
      }
    };
    
    const editorElement = editor.view.dom;
    editorElement.addEventListener('click', handleClick);
    
    return () => {
      editorElement.removeEventListener('click', handleClick);
    };
  }, [editor]);

  // Save image attributes
  const handleSaveImageAttributes = () => {
    if (!editor || !editingImageSrc) return;
    
    // Find and update the image node
    const { state } = editor;
    let imagePos: number | null = null;
    
    state.doc.descendants((node, pos) => {
      if (node.type.name === 'image' && node.attrs.src === editingImageSrc) {
        imagePos = pos;
        return false;
      }
      return true;
    });
    
    if (imagePos !== null) {
      editor.chain().focus().setNodeSelection(imagePos).updateAttributes('image', {
        alt: editingImageAlt,
        title: editingImageTitle,
      }).run();
    }
    
    setIsImageDialogOpen(false);
    toast.success('Đã cập nhật thuộc tính ảnh');
  };

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
    editorElement.addEventListener('paste', handlePaste as EventListener);
    return () => {
      editorElement.removeEventListener('paste', handlePaste as EventListener);
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
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={cn('h-8 w-8 p-0', editor.isActive('underline') && 'bg-muted')}
          disabled={disabled}
          title="Gạch chân (Ctrl+U)"
        >
          <UnderlineIcon className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={cn('h-8 w-8 p-0', editor.isActive('strike') && 'bg-muted')}
          disabled={disabled}
          title="Gạch ngang"
        >
          <Strikethrough className="h-4 w-4" />
        </Button>
        
        <div className="w-px h-6 bg-border mx-1" />
        
        {/* Headings Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className={cn(
                'h-8 px-2 gap-1',
                (editor.isActive('heading', { level: 1 }) ||
                  editor.isActive('heading', { level: 2 }) ||
                  editor.isActive('heading', { level: 3 }) ||
                  editor.isActive('heading', { level: 4 }) ||
                  editor.isActive('heading', { level: 5 }) ||
                  editor.isActive('heading', { level: 6 })) &&
                  'bg-muted'
              )}
              disabled={disabled}
              title="Tiêu đề"
            >
              {editor.isActive('heading', { level: 1 }) ? <Heading1 className="h-4 w-4" /> :
               editor.isActive('heading', { level: 2 }) ? <Heading2 className="h-4 w-4" /> :
               editor.isActive('heading', { level: 3 }) ? <Heading3 className="h-4 w-4" /> :
               editor.isActive('heading', { level: 4 }) ? <Heading4 className="h-4 w-4" /> :
               editor.isActive('heading', { level: 5 }) ? <Heading5 className="h-4 w-4" /> :
               editor.isActive('heading', { level: 6 }) ? <Heading6 className="h-4 w-4" /> :
               <Heading2 className="h-4 w-4" />}
              <ChevronDown className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
              <Heading1 className="h-4 w-4 mr-2" /> Tiêu đề H1
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
              <Heading2 className="h-4 w-4 mr-2" /> Tiêu đề H2
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
              <Heading3 className="h-4 w-4 mr-2" /> Tiêu đề H3
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}>
              <Heading4 className="h-4 w-4 mr-2" /> Tiêu đề H4
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}>
              <Heading5 className="h-4 w-4 mr-2" /> Tiêu đề H5
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}>
              <Heading6 className="h-4 w-4 mr-2" /> Tiêu đề H6
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => editor.chain().focus().setParagraph().run()}>
              <Type className="h-4 w-4 mr-2" /> Văn bản thường
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
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
        
        {/* Blockquote & Code */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={cn('h-8 w-8 p-0', editor.isActive('blockquote') && 'bg-muted')}
          disabled={disabled}
          title="Trích dẫn"
        >
          <Quote className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={cn('h-8 w-8 p-0', editor.isActive('codeBlock') && 'bg-muted')}
          disabled={disabled}
          title="Khối code"
        >
          <Code className="h-4 w-4" />
        </Button>
        
        <div className="w-px h-6 bg-border mx-1" />
        
        {/* Link */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            const previousUrl = editor.getAttributes('link').href;
            const url = window.prompt('Nhập URL:', previousUrl);
            if (url === null) return;
            if (url === '') {
              editor.chain().focus().extendMarkRange('link').unsetLink().run();
              return;
            }
            editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
          }}
          className={cn('h-8 w-8 p-0', editor.isActive('link') && 'bg-muted')}
          disabled={disabled}
          title="Chèn link"
        >
          <LinkIcon className="h-4 w-4" />
        </Button>
        {editor.isActive('link') && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().unsetLink().run()}
            className="h-8 w-8 p-0"
            disabled={disabled}
            title="Xóa link"
          >
            <Unlink className="h-4 w-4" />
          </Button>
        )}
        
        <div className="w-px h-6 bg-border mx-1" />
        
        {/* Alignment */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={cn('h-8 w-8 p-0', editor.isActive({ textAlign: 'left' }) && 'bg-muted')}
          disabled={disabled}
          title="Căn trái"
        >
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={cn('h-8 w-8 p-0', editor.isActive({ textAlign: 'center' }) && 'bg-muted')}
          disabled={disabled}
          title="Căn giữa"
        >
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={cn('h-8 w-8 p-0', editor.isActive({ textAlign: 'right' }) && 'bg-muted')}
          disabled={disabled}
          title="Căn phải"
        >
          <AlignRight className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
          className={cn('h-8 w-8 p-0', editor.isActive({ textAlign: 'justify' }) && 'bg-muted')}
          disabled={disabled}
          title="Căn đều"
        >
          <AlignJustify className="h-4 w-4" />
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

      {/* Image Edit Dialog */}
      <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa thuộc tính hình ảnh</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Image Preview */}
            {editingImageSrc && (
              <div className="border rounded-lg p-2 bg-muted/30">
                <img 
                  src={editingImageSrc} 
                  alt={editingImageAlt || 'Preview'} 
                  className="max-h-32 w-auto mx-auto rounded"
                />
              </div>
            )}
            
            {/* Alt Text */}
            <div className="space-y-2">
              <Label htmlFor="img-alt">
                Văn bản thay thế (Alt text)
                <span className="text-xs text-muted-foreground ml-2">
                  Mô tả hình ảnh cho SEO và trợ năng
                </span>
              </Label>
              <Input
                id="img-alt"
                value={editingImageAlt}
                onChange={(e) => setEditingImageAlt(e.target.value)}
                placeholder="Mô tả nội dung hình ảnh..."
              />
            </div>

            {/* Title (SEO) */}
            <div className="space-y-2">
              <Label htmlFor="img-title">
                Tiêu đề (Title)
                <span className="text-xs text-muted-foreground ml-2">
                  Hiển thị khi di chuột qua ảnh
                </span>
              </Label>
              <Input
                id="img-title"
                value={editingImageTitle}
                onChange={(e) => setEditingImageTitle(e.target.value)}
                placeholder="Tiêu đề SEO cho hình ảnh..."
              />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsImageDialogOpen(false)}
            >
              Hủy
            </Button>
            <Button type="button" onClick={handleSaveImageAttributes}>
              Lưu thay đổi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}