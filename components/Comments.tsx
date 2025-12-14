import * as React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { CommentEditor } from './ui/comment-editor';
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
    avatar?: string | undefined;
  };
  createdAt: Date | string;
  updatedAt?: Date | string | undefined;
  parentId?: CommentId | undefined; // For replies
  attachments?: (
    {
      id: string;
      name: string;
      url: string;
      type: string;
    }[] | string[]
  ) | undefined;
}

interface CommentsProps<
  EntityId extends string = string,
  AuthorId extends string = string,
  CommentId extends string = string
> {
  entityType: string;
  entityId: EntityId;
  comments: Comment<AuthorId, CommentId>[];
  onAddComment?: (content: string, parentIdOrAttachments?: CommentId | string[], parentId?: CommentId) => void;
  onUpdateComment?: (commentId: CommentId, content: string) => void;
  onDeleteComment?: (commentId: CommentId) => void;
  readOnly?: boolean;
  currentUser?: {
    systemId: AuthorId;
    name: string;
    avatar?: string;
  } | undefined;
  title?: string;
  placeholder?: string;
  className?: string;
  // Local storage for draft comments
  enableDraftSaving?: boolean;
  // Mentionable users for @tag functionality
  mentions?: Array<{ id: string; label: string; avatar?: string }>;
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
  mentions = [],
}: CommentsProps<EntityId, AuthorId, CommentId>) {
  const [newComment, setNewComment] = React.useState('');
  const [newCommentText, setNewCommentText] = React.useState(''); // Plain text version
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
    if (!newCommentText.trim() || !onAddComment) return;
    
    onAddComment(newComment.trim(), undefined, undefined); // Send HTML content
    setNewComment('');
    setNewCommentText('');
    if (enableDraftSaving) {
      localStorage.removeItem(draftKey);
    }
  };

  const handleAddReply = (parentId: CommentId) => {
    if (!replyContent.trim() || !onAddComment) return;
    
    onAddComment(replyContent.trim(), undefined, parentId);
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
    const createdAtDate = new Date(comment.createdAt);
    const updatedAtDate = comment.updatedAt ? new Date(comment.updatedAt) : null;

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
                {formatDistanceToNow(createdAtDate, {
                  addSuffix: true,
                  locale: vi,
                })}
              </span>
              {updatedAtDate && updatedAtDate.getTime() > createdAtDate.getTime() && (
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
                <div 
                  className="text-sm bg-muted/30 p-3 rounded-md prose prose-sm max-w-none [&_.mention]:text-primary [&_.mention]:font-medium"
                  dangerouslySetInnerHTML={{ __html: comment.content }}
                />

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

                {/* Actions - Only reply allowed, no edit/delete to preserve data */}
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
        <CardTitle className="text-h5 flex items-center gap-2">
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
            <CommentEditor
              content={newComment}
              onChange={(html, text) => {
                setNewComment(html);
                setNewCommentText(text);
              }}
              placeholder={placeholder}
              mentions={mentions}
              onSubmit={handleAddComment}
              minHeight="80px"
            />
            <Button onClick={handleAddComment} disabled={!newCommentText.trim()}>
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
