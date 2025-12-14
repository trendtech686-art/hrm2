import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Printer, 
  Save, 
  RotateCcw, 
  Copy, 
  Check, 
  Code,
  Eye,
  Search,
  Plus,
  X,
  Bold,
  Italic,
  Strikethrough,
  Underline as UnderlineIcon,
  Table as TableIcon,
  Image as ImageIcon,
  Smile,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Quote,
  ChevronDown,
  Undo,
  Redo,
  Minus,
  TableProperties,
  Rows,
  Columns,
  Trash2,
  Link,
  Link2,
  Link2Off,
  Upload,
  Loader2
} from 'lucide-react';
import { useSettingsPageHeader } from '../use-settings-page-header';
import { usePrintTemplateStore } from './store';
import { TemplateType, PaperSize, TEMPLATE_TYPES as ALL_TEMPLATE_TYPES } from './types';
import { PREVIEW_DATA } from './preview-data';
import { TEMPLATE_VARIABLES } from './variables';
import { useBranchStore } from '../branches/store';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from '@/components/ui/dropdown-menu';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { FileUploadAPI } from '@/lib/file-upload-api';

// TipTap imports
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { Table } from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import Image from '@tiptap/extension-image';

// Use template types from types.ts
const TEMPLATE_TYPES = ALL_TEMPLATE_TYPES;

const PAPER_SIZES: { value: PaperSize; label: string }[] = [
  { value: 'A4', label: 'Khổ in A4' },
  { value: 'A5', label: 'Khổ in A5' },
  { value: 'A6', label: 'Khổ in A6' },
  { value: 'K80', label: 'Khổ in K80' },
  { value: 'K57', label: 'Khổ in K57' },
];

const FONT_SIZES = [
  { value: '10px', label: '10' },
  { value: '12px', label: '12' },
  { value: '14px', label: '14' },
  { value: '16px', label: '16' },
  { value: '18px', label: '18' },
  { value: '20px', label: '20' },
  { value: '24px', label: '24' },
  { value: '28px', label: '28' },
  { value: '32px', label: '32' },
];

const TEXT_COLORS = [
  { value: '#000000', label: 'Đen' },
  { value: '#dc2626', label: 'Đỏ' },
  { value: '#ea580c', label: 'Cam' },
  { value: '#ca8a04', label: 'Vàng đậm' },
  { value: '#16a34a', label: 'Xanh lá' },
  { value: '#2563eb', label: 'Xanh dương' },
  { value: '#7c3aed', label: 'Tím' },
];

const HIGHLIGHT_COLORS = [
  { value: '#fef08a', label: 'Vàng' },
  { value: '#bbf7d0', label: 'Xanh lá nhạt' },
  { value: '#bfdbfe', label: 'Xanh dương nhạt' },
  { value: '#fecaca', label: 'Đỏ nhạt' },
  { value: '#e9d5ff', label: 'Tím nhạt' },
];

export function PrintTemplatesPage() {
  useSettingsPageHeader({
    title: 'Tùy chỉnh mẫu in',
    subtitle: 'Tùy chỉnh các mẫu in hóa đơn, phiếu thu chi, bảo hành...',
    icon: <Printer className="h-5 w-5" />,
  });

  const { updateTemplate, updateTemplateAllBranches, resetTemplate, getTemplate, setDefaultSize, getDefaultSize } = usePrintTemplateStore();
  const branchStore = useBranchStore();
  const branches = branchStore.data;
  const defaultBranch = branches.find(b => b.isDefault) || branches[0];
  const [selectedBranch, setSelectedBranch] = useState<string>(defaultBranch?.systemId || '');
  const [selectedType, setSelectedType] = useState<TemplateType>('order');
  const [selectedSize, setSelectedSize] = useState<PaperSize>(() => getDefaultSize('order'));
  const [content, setContent] = useState('');
  const [previewHtml, setPreviewHtml] = useState('');
  const [isDefaultSize, setIsDefaultSize] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [showVariablesDialog, setShowVariablesDialog] = useState(false);
  const [searchVar, setSearchVar] = useState('');
  const [copiedVar, setCopiedVar] = useState<string | null>(null);
  const [isHtmlMode, setIsHtmlMode] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const [showImageUrlDialog, setShowImageUrlDialog] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [originalContent, setOriginalContent] = useState(''); // Track original content for dirty check

  // Handle context menu (right-click) - chỉ hiển thị khi ở trong bảng
  const handleContextMenu = (e: React.MouseEvent) => {
    if (isHtmlMode) return;
    // Chỉ hiển thị context menu khi cursor ở trong bảng
    if (editor?.isActive('table')) {
      e.preventDefault();
      setContextMenu({ x: e.clientX, y: e.clientY });
    }
  };

  // Close context menu
  const closeContextMenu = useCallback(() => {
    setContextMenu(null);
  }, []);

  // Close context menu when clicking outside
  useEffect(() => {
    const handleClick = () => closeContextMenu();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeContextMenu();
    };
    if (contextMenu) {
      document.addEventListener('click', handleClick);
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('click', handleClick);
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [contextMenu, closeContextMenu]);

  // Initialize TipTap editor
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4],
        },
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      TextStyle,
      Color,
      Highlight.configure({
        multicolor: true,
      }),
      Image,
    ],
    content: '',
    onUpdate: ({ editor }) => {
      if (!isHtmlMode) {
        const newContent = editor.getHTML();
        setContent(newContent);
        setHasUnsavedChanges(newContent !== originalContent);
      }
    },
  });

  // Load default size when type changes
  useEffect(() => {
    const defaultSize = getDefaultSize(selectedType);
    setSelectedSize(defaultSize);
    setIsDefaultSize(true); // Vì đang load khổ mặc định
  }, [selectedType, getDefaultSize]);

  // Load template content when type or size changes
  useEffect(() => {
    const template = getTemplate(selectedType, selectedSize, selectedBranch);
    setContent(template.content);
    setOriginalContent(template.content);
    setHasUnsavedChanges(false);
    if (editor && !isHtmlMode) {
      editor.commands.setContent(template.content);
    }
  }, [selectedType, selectedSize, selectedBranch, getTemplate, editor, isHtmlMode]);

  // Check if current size is default size
  useEffect(() => {
    const defaultSize = getDefaultSize(selectedType);
    setIsDefaultSize(selectedSize === defaultSize);
  }, [selectedSize, selectedType, getDefaultSize]);

  // Update preview when content changes
  useEffect(() => {
    let html = content;
    const data = PREVIEW_DATA[selectedType];
    
    if (data) {
      Object.entries(data).forEach(([key, value]) => {
        html = html.split(key).join(value);
      });
    }
    
    setPreviewHtml(html);
  }, [content, selectedType]);

  // Handle save for current branch
  const handleSave = () => {
    updateTemplate(selectedType, selectedSize, content, selectedBranch);
    if (isDefaultSize) {
      setDefaultSize(selectedType, selectedSize);
    }
    setOriginalContent(content);
    setHasUnsavedChanges(false);
    toast.success('Đã lưu mẫu in thành công');
  };

  // Handle save for all branches
  const handleSaveAllBranches = () => {
    updateTemplateAllBranches(selectedType, selectedSize, content);
    if (isDefaultSize) {
      setDefaultSize(selectedType, selectedSize);
    }
    setOriginalContent(content);
    setHasUnsavedChanges(false);
    toast.success('Đã lưu và áp dụng mẫu in cho tất cả chi nhánh');
  };

  // Handle exit with unsaved changes check
  const handleExit = () => {
    if (hasUnsavedChanges) {
      setShowExitDialog(true);
    } else {
      window.history.back();
    }
  };

  // Confirm exit without saving
  const confirmExit = () => {
    setShowExitDialog(false);
    window.history.back();
  };

  // Handle default size checkbox change
  const handleDefaultSizeChange = (checked: boolean) => {
    setIsDefaultSize(checked);
    if (checked) {
      setDefaultSize(selectedType, selectedSize);
      toast.success(`Đã đặt ${selectedSize} làm khổ in mặc định cho ${TEMPLATE_TYPES.find(t => t.value === selectedType)?.label}`);
    }
  };

  const handleReset = () => {
    setShowResetDialog(true);
  };

  // Confirm reset template
  const confirmReset = () => {
    resetTemplate(selectedType, selectedSize);
    const template = getTemplate(selectedType, selectedSize);
    setContent(template.content);
    if (editor) {
      editor.commands.setContent(template.content);
    }
    toast.success('Đã khôi phục mẫu mặc định');
    setShowResetDialog(false);
  };

  // Toggle HTML/WYSIWYG mode
  const toggleHtmlMode = () => {
    if (isHtmlMode && editor) {
      // Switching from HTML to WYSIWYG - apply HTML content to editor
      editor.commands.setContent(content);
    } else if (!isHtmlMode && editor) {
      // Switching from WYSIWYG to HTML - get HTML from editor
      setContent(editor.getHTML());
    }
    setIsHtmlMode(!isHtmlMode);
  };

  // Handle HTML textarea change
  const handleHtmlChange = (value: string) => {
    setContent(value);
  };

  const handlePrint = () => {
    // Tạo iframe ẩn để in trực tiếp không mở tab mới
    const printFrame = document.createElement('iframe');
    printFrame.style.position = 'absolute';
    printFrame.style.top = '-10000px';
    printFrame.style.left = '-10000px';
    document.body.appendChild(printFrame);
    
    const printDoc = printFrame.contentDocument || printFrame.contentWindow?.document;
    if (printDoc) {
      printDoc.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>In thử - ${TEMPLATE_TYPES.find(t => t.value === selectedType)?.label}</title>
          <style>
            * { box-sizing: border-box; }
            body { 
              font-family: 'Times New Roman', Times, serif;
              font-size: 13px;
              line-height: 1.5;
              margin: 0;
              padding: 20px;
              color: #000;
            }
            h1, h2, h3, h4 { margin: 0.5em 0; }
            h2 { font-size: 18px; font-weight: bold; }
            p { margin: 0.3em 0; }
            table { 
              width: 100%; 
              border-collapse: collapse; 
              margin: 10px 0;
            }
            th, td { 
              border: 1px solid #333; 
              padding: 6px 8px; 
              text-align: left;
              vertical-align: top;
            }
            th { 
              background: #f0f0f0; 
              font-weight: bold;
            }
            strong { font-weight: bold; }
            em { font-style: italic; }
            hr { border: none; border-top: 1px solid #333; margin: 10px 0; }
            ul { margin: 0.5em 0; padding-left: 25px; list-style-type: disc; }
            ol { margin: 0.5em 0; padding-left: 25px; list-style-type: decimal; }
            li { margin: 0.2em 0; display: list-item; }
            img { max-width: 100%; height: auto; }
            @media print { 
              body { padding: 0; } 
              @page { margin: 15mm; }
            }
          </style>
        </head>
        <body>${previewHtml}</body>
        </html>
      `);
      printDoc.close();
      
      // Đợi load xong rồi in - chỉ gọi 1 lần
      setTimeout(() => {
        printFrame.contentWindow?.print();
        // Xóa iframe sau khi in
        setTimeout(() => {
          if (document.body.contains(printFrame)) {
            document.body.removeChild(printFrame);
          }
        }, 1000);
      }, 100);
    }
  };

  const insertVariable = (variable: string) => {
    if (isHtmlMode) {
      // Insert at cursor position in textarea
      const textarea = document.querySelector('textarea');
      if (textarea) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const newContent = content.substring(0, start) + variable + content.substring(end);
        setContent(newContent);
        // Focus and set cursor after inserted variable
        setTimeout(() => {
          textarea.focus();
          textarea.setSelectionRange(start + variable.length, start + variable.length);
        }, 0);
      } else {
        setContent(content + variable);
      }
    } else if (editor) {
      // Insert in TipTap editor at cursor position
      editor.chain().focus().insertContent(variable).run();
    }
    setCopiedVar(variable);
    setTimeout(() => setCopiedVar(null), 1500);
    toast.success(`Đã thêm: ${variable}`);
  };

  // Add image from URL - show dialog
  const addImage = () => {
    setShowImageUrlDialog(true);
  };

  // Confirm insert image from URL
  const confirmAddImage = () => {
    if (imageUrl && editor) {
      editor.chain().focus().setImage({ src: imageUrl }).run();
      toast.success('Đã chèn hình ảnh');
    }
    setImageUrl('');
    setShowImageUrlDialog(false);
  };

  // Upload image handler
  const handleImageUpload = async (file: File) => {
    if (!file || !editor) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Chỉ hỗ trợ file hình ảnh');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Kích thước file không được vượt quá 5MB');
      return;
    }

    setIsUploading(true);
    try {
      const result = await FileUploadAPI.uploadPrintTemplateImage(file);
      editor.chain().focus().setImage({ src: result.url }).run();
      toast.success('Đã tải hình ảnh lên thành công');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Không thể tải hình ảnh lên');
    } finally {
      setIsUploading(false);
    }
  };

  // Handle file input change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
    // Reset input
    if (e.target) {
      e.target.value = '';
    }
  };

  // Handle paste event for images
  const handlePaste = async (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        e.preventDefault();
        const file = items[i].getAsFile();
        if (file) {
          await handleImageUpload(file);
        }
        break;
      }
    }
  };

  // Handle drop event for images
  const handleDrop = async (e: React.DragEvent) => {
    const files = e.dataTransfer?.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (file.type.startsWith('image/')) {
      e.preventDefault();
      await handleImageUpload(file);
    }
  };

  // Trigger file input click
  const triggerImageUpload = () => {
    fileInputRef.current?.click();
  };

  // Filter variables by search
  const filteredVariables = TEMPLATE_VARIABLES[selectedType]?.filter(v => 
    searchVar === '' || 
    v.key.toLowerCase().includes(searchVar.toLowerCase()) ||
    v.label.toLowerCase().includes(searchVar.toLowerCase())
  ) || [];

  // Group variables by group
  const groupedVariables = filteredVariables.reduce((acc, v) => {
    const group = v.group || 'Khác';
    if (!acc[group]) acc[group] = [];
    acc[group].push(v);
    return acc;
  }, {} as Record<string, typeof filteredVariables>);

  return (
    <div className="flex flex-col gap-4">
      {/* Hidden file input for image upload */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileInputChange}
        className="hidden"
      />
      
      {/* Header Row - Dropdowns and Actions */}
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div className="flex items-end gap-6 flex-wrap">
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">Chọn mẫu in</Label>
            <Select value={selectedType} onValueChange={(v) => setSelectedType(v as TemplateType)}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TEMPLATE_TYPES.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm font-medium">Chọn chi nhánh áp dụng</Label>
            <Select value={selectedBranch} onValueChange={setSelectedBranch}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {branches.map((branch) => (
                  <SelectItem key={branch.systemId} value={branch.systemId}>
                    {branch.isDefault ? `${branch.name} (mặc định)` : branch.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm font-medium">Chọn khổ in</Label>
            <Select value={selectedSize} onValueChange={(v) => setSelectedSize(v as PaperSize)}>
              <SelectTrigger className="w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PAPER_SIZES.map((size) => (
                  <SelectItem key={size.value} value={size.value}>
                    {size.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2 pb-0.5">
            <Checkbox 
              id="default-size" 
              checked={isDefaultSize}
              onCheckedChange={(checked) => handleDefaultSizeChange(!!checked)}
            />
            <Label htmlFor="default-size" className="text-sm cursor-pointer">
              Đặt làm khổ in mặc định
            </Label>
          </div>
        </div>

        {/* Action Buttons - moved to header */}
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleExit}>
            Thoát
          </Button>
          <Button variant="outline" onClick={handleSaveAllBranches}>
            Lưu & áp dụng tất cả chi nhánh
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Lưu
          </Button>
        </div>
      </div>

      {/* Main Content - 2 Columns */}
      <div className="flex gap-4 h-[calc(100vh-14rem)]">
        {/* Left Column - Editor */}
        <div className="flex-1 flex flex-col border rounded-lg overflow-hidden bg-background">
          {/* Editor Toolbar */}
          <div className="flex items-center gap-1 px-3 py-2 border-b bg-muted/30 flex-wrap">
            {/* HTML Toggle */}
            <Button 
              variant={isHtmlMode ? "default" : "outline"} 
              size="sm" 
              className="h-8 gap-1.5 text-xs"
              onClick={toggleHtmlMode}
            >
              <Code className="h-3.5 w-3.5" />
              Mã HTML
            </Button>
            
            <Separator orientation="vertical" className="h-6 mx-1" />
            
            {/* Undo/Redo */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0"
              onClick={() => editor?.chain().focus().undo().run()}
              disabled={!editor?.can().undo() || isHtmlMode}
            >
              <Undo className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0"
              onClick={() => editor?.chain().focus().redo().run()}
              disabled={!editor?.can().redo() || isHtmlMode}
            >
              <Redo className="h-4 w-4" />
            </Button>
            
            <Separator orientation="vertical" className="h-6 mx-1" />
            
            {/* Heading dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 text-xs text-muted-foreground"
                  disabled={isHtmlMode}
                >
                  Định dạng <ChevronDown className="h-3 w-3 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => editor?.chain().focus().setParagraph().run()}>
                  Đoạn văn
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}>
                  Tiêu đề 1
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}>
                  Tiêu đề 2
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}>
                  Tiêu đề 3
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => editor?.chain().focus().toggleHeading({ level: 4 }).run()}>
                  Tiêu đề 4
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Text color */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 px-2 relative"
                  disabled={isHtmlMode}
                >
                  <span className="text-sm font-bold">A</span>
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-current" />
                  <ChevronDown className="h-3 w-3 ml-0.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {TEXT_COLORS.map((color) => (
                  <DropdownMenuItem 
                    key={color.value}
                    onClick={() => editor?.chain().focus().setColor(color.value).run()}
                  >
                    <span 
                      className="w-4 h-4 rounded mr-2" 
                      style={{ backgroundColor: color.value }}
                    />
                    {color.label}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => editor?.chain().focus().unsetColor().run()}>
                  Xóa màu chữ
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Highlight color */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 px-2"
                  disabled={isHtmlMode}
                >
                  <span className="text-sm font-bold bg-yellow-200 px-1">A</span>
                  <ChevronDown className="h-3 w-3 ml-0.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {HIGHLIGHT_COLORS.map((color) => (
                  <DropdownMenuItem 
                    key={color.value}
                    onClick={() => editor?.chain().focus().toggleHighlight({ color: color.value }).run()}
                  >
                    <span 
                      className="w-4 h-4 rounded mr-2" 
                      style={{ backgroundColor: color.value }}
                    />
                    {color.label}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => editor?.chain().focus().unsetHighlight().run()}>
                  Xóa highlight
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Separator orientation="vertical" className="h-6 mx-1" />
            
            {/* Insert Image */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 px-2"
                  disabled={isHtmlMode || isUploading}
                >
                  {isUploading ? (
                    <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <ImageIcon className="h-4 w-4" />
                  )}
                  <ChevronDown className="h-3 w-3 ml-0.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={triggerImageUpload}>
                  <Upload className="h-4 w-4 mr-2" />
                  Tải ảnh lên
                </DropdownMenuItem>
                <DropdownMenuItem onClick={addImage}>
                  <Link2 className="h-4 w-4 mr-2" />
                  Chèn URL ảnh
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Table dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 px-2"
                  disabled={isHtmlMode}
                >
                  <TableIcon className="h-4 w-4" />
                  <ChevronDown className="h-3 w-3 ml-0.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem 
                  onClick={() => editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
                >
                  <TableIcon className="h-4 w-4 mr-2" />
                  Chèn bảng 3x3
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => editor?.chain().focus().insertTable({ rows: 4, cols: 4, withHeaderRow: true }).run()}
                >
                  <TableIcon className="h-4 w-4 mr-2" />
                  Chèn bảng 4x4
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => editor?.chain().focus().insertTable({ rows: 5, cols: 5, withHeaderRow: true }).run()}
                >
                  <TableIcon className="h-4 w-4 mr-2" />
                  Chèn bảng 5x5
                </DropdownMenuItem>
                {editor?.isActive('table') && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => editor?.chain().focus().addColumnAfter().run()}>
                      <Columns className="h-4 w-4 mr-2" />
                      Thêm cột
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => editor?.chain().focus().addRowAfter().run()}>
                      <Rows className="h-4 w-4 mr-2" />
                      Thêm hàng
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => editor?.chain().focus().deleteColumn().run()}>
                      <Minus className="h-4 w-4 mr-2" />
                      Xóa cột
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => editor?.chain().focus().deleteRow().run()}>
                      <Minus className="h-4 w-4 mr-2" />
                      Xóa hàng
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => editor?.chain().focus().deleteTable().run()}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Xóa bảng
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Separator orientation="vertical" className="h-6 mx-1" />
            
            {/* Text format */}
            <Button 
              variant="ghost" 
              size="sm" 
              className={cn("h-8 w-8 p-0", editor?.isActive('bold') && "bg-muted")}
              onClick={() => editor?.chain().focus().toggleBold().run()}
              disabled={isHtmlMode}
            >
              <Bold className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className={cn("h-8 w-8 p-0", editor?.isActive('italic') && "bg-muted")}
              onClick={() => editor?.chain().focus().toggleItalic().run()}
              disabled={isHtmlMode}
            >
              <Italic className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className={cn("h-8 w-8 p-0", editor?.isActive('strike') && "bg-muted")}
              onClick={() => editor?.chain().focus().toggleStrike().run()}
              disabled={isHtmlMode}
            >
              <Strikethrough className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className={cn("h-8 w-8 p-0", editor?.isActive('underline') && "bg-muted")}
              onClick={() => editor?.chain().focus().toggleUnderline().run()}
              disabled={isHtmlMode}
            >
              <UnderlineIcon className="h-4 w-4" />
            </Button>
            
            {/* Spacer */}
            <div className="flex-1" />
            
            {/* Action buttons */}
            <Button variant="outline" size="sm" className="h-8 text-xs" onClick={handleReset}>
              Sử dụng mẫu có sẵn
            </Button>
            
            <Dialog open={showVariablesDialog} onOpenChange={setShowVariablesDialog}>
              <DialogTrigger asChild>
                <Button size="sm" className="h-8 text-xs">
                  Thêm từ khóa
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[80vh]">
                <DialogHeader>
                  <DialogTitle>Danh sách từ khóa</DialogTitle>
                  <p className="text-sm text-muted-foreground">
                    Từ khóa được chọn sẽ được thêm tại vị trí con trỏ chuột trên màn hình Sửa mẫu in.
                  </p>
                </DialogHeader>
                
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Tìm kiếm từ khóa"
                    value={searchVar}
                    onChange={(e) => setSearchVar(e.target.value)}
                    className="pl-9"
                  />
                </div>
                
                <ScrollArea className="h-[50vh] pr-4">
                  {Object.entries(groupedVariables).map(([group, vars]) => (
                    <div key={group} className="mb-6">
                      <h4 className="font-semibold text-sm mb-3 text-center">{group}</h4>
                      <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                        {vars.map((variable) => (
                          <div 
                            key={variable.key}
                            className="flex items-center justify-between py-1.5 border-b"
                          >
                            <div className="flex-1 min-w-0">
                              <div className="text-sm truncate">{variable.label}</div>
                              <code className="text-xs text-muted-foreground">{variable.key}</code>
                            </div>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="h-7 text-xs ml-2 shrink-0"
                              onClick={() => {
                                insertVariable(variable.key);
                                setShowVariablesDialog(false);
                              }}
                            >
                              {copiedVar === variable.key ? (
                                <Check className="h-3 w-3" />
                              ) : (
                                'Chọn'
                              )}
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </ScrollArea>
              </DialogContent>
            </Dialog>
          </div>
          
          {/* Second toolbar row */}
          <div className="flex items-center gap-1 px-3 py-1.5 border-b bg-muted/20">
            <Button 
              variant="ghost" 
              size="sm" 
              className={cn("h-7 w-7 p-0", editor?.isActive('bulletList') && "bg-muted")}
              onClick={() => editor?.chain().focus().toggleBulletList().run()}
              disabled={isHtmlMode}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className={cn("h-7 w-7 p-0", editor?.isActive('orderedList') && "bg-muted")}
              onClick={() => editor?.chain().focus().toggleOrderedList().run()}
              disabled={isHtmlMode}
            >
              <ListOrdered className="h-4 w-4" />
            </Button>
            
            <Separator orientation="vertical" className="h-5 mx-1" />
            
            <Button 
              variant="ghost" 
              size="sm" 
              className={cn("h-7 w-7 p-0", editor?.isActive('blockquote') && "bg-muted")}
              onClick={() => editor?.chain().focus().toggleBlockquote().run()}
              disabled={isHtmlMode}
            >
              <Quote className="h-4 w-4" />
            </Button>
            
            <Separator orientation="vertical" className="h-5 mx-1" />
            
            <Button 
              variant="ghost" 
              size="sm" 
              className={cn("h-7 w-7 p-0", editor?.isActive({ textAlign: 'left' }) && "bg-muted")}
              onClick={() => editor?.chain().focus().setTextAlign('left').run()}
              disabled={isHtmlMode}
            >
              <AlignLeft className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className={cn("h-7 w-7 p-0", editor?.isActive({ textAlign: 'center' }) && "bg-muted")}
              onClick={() => editor?.chain().focus().setTextAlign('center').run()}
              disabled={isHtmlMode}
            >
              <AlignCenter className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className={cn("h-7 w-7 p-0", editor?.isActive({ textAlign: 'right' }) && "bg-muted")}
              onClick={() => editor?.chain().focus().setTextAlign('right').run()}
              disabled={isHtmlMode}
            >
              <AlignRight className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className={cn("h-7 w-7 p-0", editor?.isActive({ textAlign: 'justify' }) && "bg-muted")}
              onClick={() => editor?.chain().focus().setTextAlign('justify').run()}
              disabled={isHtmlMode}
            >
              <AlignJustify className="h-4 w-4" />
            </Button>
            
            <Separator orientation="vertical" className="h-5 mx-1" />
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 px-2 text-xs"
              onClick={() => editor?.chain().focus().setHorizontalRule().run()}
              disabled={isHtmlMode}
            >
              <Minus className="h-4 w-4 mr-1" />
              Đường kẻ
            </Button>
          </div>

          {/* Editor Content */}
          {isHtmlMode ? (
            <Textarea 
              value={content}
              onChange={(e) => handleHtmlChange(e.target.value)}
              className="flex-1 resize-none border-0 rounded-none focus-visible:ring-0 font-mono text-sm p-4"
              spellCheck={false}
              placeholder="Nhập mã HTML cho mẫu in..."
            />
          ) : (
            <div 
              className="flex-1 overflow-auto p-4 relative"
              onContextMenu={handleContextMenu}
              onPaste={handlePaste}
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
            >
              <EditorContent 
                editor={editor} 
                className="prose prose-sm max-w-none min-h-full focus:outline-none [&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-[400px]"
              />
              
              {/* Context Menu - chỉ cho bảng */}
              {contextMenu && editor?.isActive('table') && (
                <div 
                  className="fixed z-50 bg-popover border rounded-md shadow-lg py-1 min-w-[180px]"
                  style={{ left: contextMenu.x, top: contextMenu.y }}
                >
                  <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground border-b mb-1">
                    Thao tác bảng
                  </div>
                  <button
                    className="w-full px-3 py-1.5 text-sm flex items-center gap-2 hover:bg-accent"
                    onClick={() => { editor?.chain().focus().addColumnBefore().run(); closeContextMenu(); }}
                  >
                    <Columns className="h-4 w-4" /> Thêm cột trước
                  </button>
                  <button
                    className="w-full px-3 py-1.5 text-sm flex items-center gap-2 hover:bg-accent"
                    onClick={() => { editor?.chain().focus().addColumnAfter().run(); closeContextMenu(); }}
                  >
                    <Columns className="h-4 w-4" /> Thêm cột sau
                  </button>
                  <button
                    className="w-full px-3 py-1.5 text-sm flex items-center gap-2 hover:bg-accent"
                    onClick={() => { editor?.chain().focus().deleteColumn().run(); closeContextMenu(); }}
                  >
                    <Minus className="h-4 w-4" /> Xóa cột
                  </button>
                  <div className="border-t my-1" />
                  <button
                    className="w-full px-3 py-1.5 text-sm flex items-center gap-2 hover:bg-accent"
                    onClick={() => { editor?.chain().focus().addRowBefore().run(); closeContextMenu(); }}
                  >
                    <Rows className="h-4 w-4" /> Thêm hàng trước
                  </button>
                  <button
                    className="w-full px-3 py-1.5 text-sm flex items-center gap-2 hover:bg-accent"
                    onClick={() => { editor?.chain().focus().addRowAfter().run(); closeContextMenu(); }}
                  >
                    <Rows className="h-4 w-4" /> Thêm hàng sau
                  </button>
                  <button
                    className="w-full px-3 py-1.5 text-sm flex items-center gap-2 hover:bg-accent"
                    onClick={() => { editor?.chain().focus().deleteRow().run(); closeContextMenu(); }}
                  >
                    <Minus className="h-4 w-4" /> Xóa hàng
                  </button>
                  <div className="border-t my-1" />
                  <button
                    className="w-full px-3 py-1.5 text-sm flex items-center gap-2 hover:bg-accent"
                    onClick={() => { editor?.chain().focus().mergeCells().run(); closeContextMenu(); }}
                  >
                    <TableIcon className="h-4 w-4" /> Gộp ô
                  </button>
                  <button
                    className="w-full px-3 py-1.5 text-sm flex items-center gap-2 hover:bg-accent"
                    onClick={() => { editor?.chain().focus().splitCell().run(); closeContextMenu(); }}
                  >
                    <TableIcon className="h-4 w-4" /> Tách ô
                  </button>
                  <div className="border-t my-1" />
                  <button
                    className="w-full px-3 py-1.5 text-sm flex items-center gap-2 hover:bg-accent text-destructive"
                    onClick={() => { editor?.chain().focus().deleteTable().run(); closeContextMenu(); }}
                  >
                    <Trash2 className="h-4 w-4" /> Xóa bảng
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column - Preview */}
        <div className="w-[45%] flex flex-col border rounded-lg overflow-hidden bg-background">
          {/* Preview Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/30">
            <h3 className="text-lg font-medium">Bản xem trước</h3>
            <Button variant="outline" size="sm" onClick={handlePrint}>
              In thử
            </Button>
          </div>
          
          {/* Preview Content */}
          <ScrollArea className="flex-1 bg-white">
            <div className="p-6">
              <div 
                className={cn(
                  "mx-auto",
                  selectedSize === 'A4' ? "max-w-[210mm]" : 
                  selectedSize === 'A5' ? "max-w-[148mm]" : 
                  selectedSize === 'K80' ? "max-w-[80mm]" : 
                  "max-w-[57mm]"
                )}
              >
                <div 
                  dangerouslySetInnerHTML={{ __html: previewHtml }} 
                  className="print-preview-content"
                />
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>
      
      <style>{`
        .print-preview-content {
          font-family: Arial, sans-serif;
          font-size: 13px;
          line-height: 1.5;
          color: #000;
        }
        .print-preview-content table {
          width: 100%;
          border-collapse: collapse;
        }
        .print-preview-content th, 
        .print-preview-content td {
          padding: 6px 8px;
          border: 1px solid #ddd;
        }
        .print-preview-content th {
          background: #f5f5f5;
          font-weight: 600;
        }
        .print-preview-content .text-center { text-align: center; }
        .print-preview-content .text-right { text-align: right; }
        .print-preview-content .text-left { text-align: left; }
        .print-preview-content .font-bold { font-weight: bold; }
        .print-preview-content .uppercase { text-transform: uppercase; }
        .print-preview-content .header { text-align: center; margin-bottom: 20px; }
        .print-preview-content .company-name { font-size: 16px; font-weight: bold; text-transform: uppercase; }
        .print-preview-content .title { font-size: 20px; font-weight: bold; text-transform: uppercase; margin: 15px 0; }
        .print-preview-content .info-table { width: 100%; margin-bottom: 20px; }
        .print-preview-content .info-table td { border: none; padding: 4px 0; }
        .print-preview-content .signature-section { margin-top: 40px; display: flex; justify-content: space-between; }
        .print-preview-content .signature-box { text-align: center; width: 45%; }
        .print-preview-content .signature-title { font-weight: 600; margin-bottom: 60px; }
        .print-preview-content .signature-note { font-style: italic; font-size: 12px; color: #666; }
        .print-preview-content ul { list-style-type: disc; padding-left: 25px; margin: 0.5em 0; }
        .print-preview-content ol { list-style-type: decimal; padding-left: 25px; margin: 0.5em 0; }
        .print-preview-content li { display: list-item; margin: 0.2em 0; }
        
        /* TipTap Editor Styles */
        .ProseMirror {
          min-height: 400px;
          outline: none;
        }
        .ProseMirror p {
          margin: 0.5em 0;
        }
        .ProseMirror table {
          border-collapse: collapse;
          margin: 1em 0;
          overflow: hidden;
          table-layout: fixed;
          width: 100%;
        }
        .ProseMirror table td,
        .ProseMirror table th {
          border: 1px solid #ddd;
          box-sizing: border-box;
          min-width: 1em;
          padding: 6px 8px;
          position: relative;
          vertical-align: top;
        }
        .ProseMirror table th {
          background-color: #f5f5f5;
          font-weight: bold;
          text-align: left;
        }
        .ProseMirror table .selectedCell:after {
          background: rgba(200, 200, 255, 0.4);
          content: "";
          left: 0; right: 0; top: 0; bottom: 0;
          pointer-events: none;
          position: absolute;
          z-index: 2;
        }
        .ProseMirror table .column-resize-handle {
          background-color: #adf;
          bottom: -2px;
          position: absolute;
          right: -2px;
          pointer-events: none;
          top: 0;
          width: 4px;
        }
        .ProseMirror blockquote {
          border-left: 3px solid #ddd;
          margin: 1em 0;
          padding-left: 1em;
          color: #666;
        }
        .ProseMirror ul {
          padding-left: 25px;
          margin: 0.5rem 0;
          list-style-type: disc;
        }
        .ProseMirror ol {
          padding-left: 25px;
          margin: 0.5rem 0;
          list-style-type: decimal;
        }
        .ProseMirror li {
          display: list-item;
        }
        .ProseMirror hr {
          border: none;
          border-top: 1px solid #ddd;
          margin: 1em 0;
        }
        .ProseMirror img {
          max-width: 100%;
          height: auto;
        }
        .ProseMirror mark {
          border-radius: 0.25em;
          box-decoration-break: clone;
          padding: 0.1em 0.25em;
        }
      `}</style>

      {/* Dialog chèn URL ảnh */}
      <Dialog open={showImageUrlDialog} onOpenChange={setShowImageUrlDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Chèn URL hình ảnh</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="imageUrl">Nhập URL hình ảnh</Label>
              <Input
                id="imageUrl"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            {imageUrl && (
              <div className="border rounded-lg p-2">
                <p className="text-xs text-muted-foreground mb-2">Xem trước:</p>
                <img 
                  src={imageUrl} 
                  alt="Preview" 
                  className="max-h-32 mx-auto"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => { setImageUrl(''); setShowImageUrlDialog(false); }}>
              Huỷ
            </Button>
            <Button onClick={confirmAddImage} disabled={!imageUrl}>
              OK
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog sử dụng mẫu có sẵn */}
      <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Sử dụng mẫu có sẵn</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Bạn có chắc chắn muốn sử dụng mẫu có sẵn? Nội dung hiện tại sẽ bị thay thế.</p>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowResetDialog(false)}>
              Huỷ
            </Button>
            <Button onClick={confirmReset}>
              OK
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog xác nhận thoát khi có thay đổi chưa lưu */}
      <Dialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Thay đổi chưa được lưu</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Bạn có thay đổi chưa được lưu. Bạn có chắc chắn muốn thoát không?</p>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowExitDialog(false)}>
              Tiếp tục chỉnh sửa
            </Button>
            <Button variant="destructive" onClick={confirmExit}>
              Thoát không lưu
            </Button>
            <Button onClick={() => {
              handleSave();
              setShowExitDialog(false);
              window.history.back();
            }}>
              Lưu và thoát
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
