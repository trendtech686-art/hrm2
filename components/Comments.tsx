import * as React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { MessageSquare, Reply, Edit2, Trash2, Send, FileText } from 'lucide-react';
import { cn } from '../lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

export interface Comment<AuthorId extends string = string, CommentId extends string = string> {
  id: CommentId;
  content: string;
  author: {
    systemId: AuthorId;
    name: string;
    avatar?: string;
  };
  createdAt: Date;
  updatedAt?: Date;
  parentId?: CommentId; // For replies
  attachments?: {
    id: string;
    name: string;
    url: string;
    type: string;
  }[];
}

interface CommentsProps<
  EntityId extends string = string,
  AuthorId extends string = string,
  CommentId extends string = string
> {
  entityType: string;
  entityId: EntityId;
  comments: Comment<AuthorId, CommentId>[];
  onAddComment?: (content: string, parentId?: CommentId) => void;
  onUpdateComment?: (commentId: CommentId, content: string) => void;
  onDeleteComment?: (commentId: CommentId) => void;
  readOnly?: boolean;
  currentUser?: {
    systemId: AuthorId;
    name: string;
    avatar?: string;
  };
  title?: string;
  placeholder?: string;
  className?: string;
  // Local storage for draft comments
  enableDraftSaving?: boolean;
}

/**
 * Generic Comments Component
 * 
 * Dùng chung cho: Warranty, Orders, Complaints, Projects...
 * 
 * Features:
 * - Add/edit/delete comments
 * - Threaded replies (parent-child)
 * - Draft saving to localStorage
 * - Rich text display
 * - Attachments support
 * - Relative timestamps
 * - User avatars
 * 
 * Usage:
 * ```tsx
 * <Comments
 *   entityType="warranty"
 *   entityId={ticket.systemId}
 *   comments={ticket.comments}
 *   onAddComment={(content, parentId) => addComment(content, parentId)}
 *   onUpdateComment={(id, content) => updateComment(id, content)}
 *   onDeleteComment={(id) => deleteComment(id)}
 *   currentUser={currentUser}
 * />
 * ```
 */
export function Comments<
  EntityId extends string = string,
  AuthorId extends string = string,
  CommentId extends string = string
>({
  entityType,
  entityId,
  comments = [],
  onAddComment,
  onUpdateComment,
  onDeleteComment,
  readOnly = false,
  currentUser,
  title = 'Bình luận',
  placeholder = 'Nhập bình luận...',
  className,
  enableDraftSaving = true,
}: CommentsProps<EntityId, AuthorId, CommentId>) {
  const [newComment, setNewComment] = React.useState('');
  const [editingId, setEditingId] = React.useState<CommentId | null>(null);
  const [editContent, setEditContent] = React.useState('');
  const [replyingTo, setReplyingTo] = React.useState<CommentId | null>(null);
  const [replyContent, setReplyContent] = React.useState('');

  // Local storage key for draft
  const draftKey = `comment-draft-${entityType}-${entityId}`;

  // Load draft on mount
  React.useEffect(() => {
    if (enableDraftSaving) {
      const draft = localStorage.getItem(draftKey);
      if (draft) {
        setNewComment(draft);
      }
    }
  }, [draftKey, enableDraftSaving]);

  // Save draft on change
  React.useEffect(() => {
    if (enableDraftSaving && newComment) {
      localStorage.setItem(draftKey, newComment);
    } else if (enableDraftSaving && !newComment) {
      localStorage.removeItem(draftKey);
    }
  }, [newComment, draftKey, enableDraftSaving]);

  // Organize comments into tree structure
  const commentTree = React.useMemo(() => {
    const topLevel = comments.filter((c) => !c.parentId);
    const childrenMap = new Map<CommentId, Comment<AuthorId, CommentId>[]>();

    comments.forEach((comment) => {
      if (!comment.parentId) {
        return;
      }
      const siblings = childrenMap.get(comment.parentId) || [];
      siblings.push(comment);
      childrenMap.set(comment.parentId, siblings);
    });

    return { topLevel, childrenMap };
  }, [comments]);

  const handleAddComment = () => {
    if (!newComment.trim() || !onAddComment) return;
    
    onAddComment(newComment.trim());
    setNewComment('');
    if (enableDraftSaving) {
      localStorage.removeItem(draftKey);
    }
  };

  const handleAddReply = (parentId: CommentId) => {
    if (!replyContent.trim() || !onAddComment) return;
    
    onAddComment(replyContent.trim(), parentId);
    setReplyContent('');
    setReplyingTo(null);
  };

  const handleUpdateComment = (commentId: CommentId) => {
    if (!editContent.trim() || !onUpdateComment) return;
    
    onUpdateComment(commentId, editContent.trim());
    setEditingId(null);
    setEditContent('');
  };

  const handleDeleteComment = (commentId: CommentId) => {
    if (!onDeleteComment) return;
    
    if (confirm('Bạn có chắc muốn xóa bình luận này?')) {
      onDeleteComment(commentId);
    }
  };

  const startEdit = (comment: Comment<AuthorId, CommentId>) => {
    setEditingId(comment.id);
    setEditContent(comment.content);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditContent('');
  };

  const startReply = (commentId: CommentId) => {
    setReplyingTo(commentId);
    setReplyContent('');
  };

  const cancelReply = () => {
    setReplyingTo(null);
    setReplyContent('');
  };

  const renderComment = (comment: Comment<AuthorId, CommentId>, depth: number = 0) => {
    const isEditing = editingId === comment.id;
    const isReplying = replyingTo === comment.id;
    const isOwn = currentUser?.systemId === comment.author.systemId;
    const children = commentTree.childrenMap.get(comment.id) || [];

    return (
      <div key={comment.id} className={cn("space-y-2", depth > 0 && "ml-12")}>
        <div className="flex gap-3">
          {/* Avatar */}
          <Avatar className="h-8 w-8 flex-shrink-0">
            <AvatarImage src={comment.author.avatar} />
            <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0 space-y-1">
            {/* Header */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-medium text-sm">{comment.author.name}</span>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(comment.createdAt), {
                  addSuffix: true,
                  locale: vi,
                })}
              </span>
              {comment.updatedAt && comment.updatedAt > comment.createdAt && (
                <Badge variant="outline" className="text-xs">Đã chỉnh sửa</Badge>
              )}
            </div>

            {/* Content */}
            {isEditing ? (
              <div className="space-y-2">
                <Textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      if (editContent.trim()) {
                        handleUpdateComment(comment.id);
                      }
                    } else if (e.key === 'Escape') {
                      cancelEdit();
                    }
                  }}
                  className="min-h-[80px]"
                  autoFocus
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => handleUpdateComment(comment.id)}>
                    Lưu
                  </Button>
                  <Button size="sm" variant="outline" onClick={cancelEdit}>
                    Hủy
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="text-sm whitespace-pre-wrap bg-muted/30 p-3 rounded-md">
                  {comment.content}
                </div>

                {/* Attachments */}
                {comment.attachments && comment.attachments.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {comment.attachments.map((file) => (
                      <a
                        key={file.id}
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-md hover:bg-muted/80 transition-colors text-sm"
                      >
                        <FileText className="h-4 w-4" />
                        {file.name}
                      </a>
                    ))}
                  </div>
                )}

                {/* Actions */}
                {!readOnly && (
                  <div className="flex items-center gap-2 text-xs">
                    {onAddComment && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => startReply(comment.id)}
                        className="h-7 px-2"
                      >
                        <Reply className="h-3 w-3 mr-1" />
                        Trả lời
                      </Button>
                    )}

                    {isOwn && onUpdateComment && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => startEdit(comment)}
                        className="h-7 px-2"
                      >
                        <Edit2 className="h-3 w-3 mr-1" />
                        Sửa
                      </Button>
                    )}

                    {isOwn && onDeleteComment && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteComment(comment.id)}
                        className="h-7 px-2 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Xóa
                      </Button>
                    )}
                  </div>
                )}
              </>
            )}

            {/* Reply form */}
            {isReplying && (
              <div className="space-y-2 pt-2">
                <Textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      if (replyContent.trim()) {
                        handleAddReply(comment.id);
                      }
                    } else if (e.key === 'Escape') {
                      cancelReply();
                    }
                  }}
                  placeholder={`Trả lời ${comment.author.name}...`}
                  className="min-h-[80px]"
                  autoFocus
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => handleAddReply(comment.id)}>
                    <Send className="h-4 w-4 mr-2" />
                    Gửi
                  </Button>
                  <Button size="sm" variant="outline" onClick={cancelReply}>
                    Hủy
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Render replies */}
        {children.length > 0 && (
          <div className="space-y-2">
            {children.map(child => renderComment(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          {title}
          <Badge variant="secondary" className="ml-auto">
            {comments.length}
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Add new comment */}
        {!readOnly && onAddComment && (
          <div className="space-y-2">
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  if (newComment.trim()) {
                    handleAddComment();
                  }
                }
              }}
              placeholder={placeholder}
              className="min-h-[100px]"
            />
            <Button onClick={handleAddComment} disabled={!newComment.trim()}>
              <Send className="h-4 w-4 mr-2" />
              Gửi bình luận
            </Button>
          </div>
        )}

        {/* Comments list */}
        {commentTree.topLevel.length === 0 ? (
          <div className="text-sm text-muted-foreground text-center py-8">
            Chưa có bình luận nào
          </div>
        ) : (
          <div className="space-y-4">
            {commentTree.topLevel.map(comment => renderComment(comment))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
