import * as React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { formatDate, formatDateTime, formatDateTimeSeconds, formatDateCustom, parseDate, getCurrentDate } from '@/lib/date-utils';
import { useWikiStore } from './store.ts';
import { asSystemId, asBusinessId } from '../../lib/id-types.ts';
import { usePageHeader } from '../../contexts/page-header-context.tsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card.tsx';
import { Button } from '../../components/ui/button.tsx';
import { Badge } from '../../components/ui/badge.tsx';
import { ArrowLeft, Edit, User, Calendar, Tag } from 'lucide-react';
import { MarkdownRenderer } from './components/markdown-renderer.tsx';

export function WikiDetailPage() {
  const { systemId } = ReactRouterDOM.useParams<{ systemId: string }>();
  const navigate = ReactRouterDOM.useNavigate();
  const { findById } = useWikiStore();

  const article = React.useMemo(() => (systemId ? findById(asSystemId(systemId)) : null), [systemId, findById]);
  
  usePageHeader({
    title: article?.title,
    subtitle: 'Xem chi tiết bài viết',
    showBackButton: true,
    backPath: '/wiki',
    actions: [
      <Button key="edit" onClick={() => navigate(`/wiki/${article?.systemId}/edit`)}>
        <Edit className="mr-2 h-4 w-4" />
        Chỉnh sửa
      </Button>
    ]
  });

  if (!article) {
    return (
       <div className="flex h-full items-center justify-center">
            <div className="text-center">
                <h2 className="text-2xl font-bold">Không tìm thấy bài viết</h2>
                <p className="text-muted-foreground mt-2">Bài viết bạn đang tìm kiếm không tồn tại.</p>
                <Button onClick={() => navigate('/wiki')} className="mt-4">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Quay về trang Wiki
                </Button>
            </div>
        </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
        <Card>
            <CardHeader>
                <CardTitle className="text-4xl font-extrabold tracking-tight">{article.title}</CardTitle>
                <CardDescription className="pt-4 flex flex-wrap items-center gap-x-6 gap-y-2">
                    <span className="flex items-center gap-2"><User className="h-4 w-4" /> {article.author}</span>
                    <span className="flex items-center gap-2"><Calendar className="h-4 w-4" /> Cập nhật lần cuối: {formatDate(article.updatedAt)}</span>
                    <span className="flex items-center gap-2"><Tag className="h-4 w-4" /> {article.category}</span>
                </CardDescription>
            </CardHeader>
            <CardContent>
                <MarkdownRenderer content={article.content} />
                 {article.tags && article.tags.length > 0 && (
                    <div className="mt-8 pt-4 border-t">
                        <h4 className="font-semibold mb-2">Tags</h4>
                        <div className="flex flex-wrap gap-2">
                            {article.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                        </div>
                    </div>
                 )}
            </CardContent>
        </Card>
    </div>
  );
}
