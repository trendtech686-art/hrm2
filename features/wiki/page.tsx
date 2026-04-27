'use client'

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { simpleSearch } from '@/lib/simple-search';
import { useAllWiki } from './hooks/use-all-wiki';
import { usePageHeader } from '../../contexts/page-header-context';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Search, PlusCircle, User, Calendar } from 'lucide-react';
import { Badge } from '../../components/ui/badge';
import type { WikiArticle } from '@/lib/types/prisma-extended';
import { formatDate } from '@/lib/date-utils';
import { useAuth } from "@/contexts/auth-context";
import { useBreakpoint } from '@/contexts/breakpoint-context';
import { FAB } from '@/components/mobile/fab';

function ArticleCard({ article }: { article: WikiArticle }) {
  const router = useRouter();
  const contentSnippet = article.content.split('\n').find((line: string) => line.trim() && !line.trim().startsWith('#')) || '';

  return (
    <div
      className="rounded-xl border border-border/50 bg-card p-4 cursor-pointer active:scale-[0.98] transition-transform touch-manipulation"
      onClick={() => router.push(`/wiki/${article.systemId}`)}
      onKeyDown={(e) => { if (e.key === 'Enter') router.push(`/wiki/${article.systemId}`); }}
      role="button"
      tabIndex={0}
    >
      <h3 className="font-semibold text-sm line-clamp-2">{article.title}</h3>
      <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
        <span className="flex items-center gap-1"><User className="h-3 w-3" /> {article.author}</span>
        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {formatDate(article.updatedAt)}</span>
      </div>
      <p className="text-xs text-muted-foreground line-clamp-2 mt-2">{contentSnippet}</p>
      {article.tags && article.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {article.tags.map(tag => <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>)}
        </div>
      )}
    </div>
  );
}

export function WikiPage() {
  // Permission checks
  const { can } = useAuth();
  const canCreate = can('create_wiki');
  const _canDelete = can('delete_wiki');
  const _canEdit = can('edit_wiki');
  const { data: articles } = useAllWiki();
  const router = useRouter();
  const { isMobile } = useBreakpoint();
  
  const headerActions = React.useMemo(() => ([
    canCreate && <Button key="add" size="sm" className="gap-2" onClick={() => router.push('/wiki/new')}>
      <PlusCircle className="mr-2 h-4 w-4" />
      Thêm bài viết
    </Button>
  ]), [router, canCreate]);

  usePageHeader({
    title: 'Wiki nội bộ',
    actions: headerActions,
    breadcrumb: [
      { label: 'Trang chủ', href: '/', isCurrent: false },
      { label: 'Wiki', href: '/wiki', isCurrent: true },
    ],
  });
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredArticles = React.useMemo(() => 
    simpleSearch(articles, searchQuery, { keys: ['title', 'category', 'tags', 'author', 'content'] }), 
    [articles, searchQuery]
  );
  
  const articlesByCategory = React.useMemo(() => {
    return filteredArticles.reduce((acc, article) => {
        const category = article.category || 'Chưa phân loại';
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(article);
        return acc;
    }, {} as Record<string, WikiArticle[]>);
  }, [filteredArticles]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm bài viết..."
            className="w-full pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        {!isMobile && (
          <Button size="sm" className="gap-2" onClick={() => router.push('/wiki/new')}>
            <PlusCircle className="mr-2 h-4 w-4" /> Tạo bài viết mới
          </Button>
        )}
      </div>

      {Object.keys(articlesByCategory).length > 0 ? (
        <div className="space-y-8">
            {/* FIX: Replaced `Object.entries` with `Object.keys` for iteration to resolve a TypeScript type inference issue where the array of articles was being typed as `unknown`. */}
            {Object.keys(articlesByCategory).map((category) => (
                <section key={category}>
                    <h2 className="text-lg font-semibold tracking-tight mb-4">{category}</h2>
                    <div className="grid gap-3 md:gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {articlesByCategory[category].map((article) => (
                            <React.Fragment key={article.id}>
                                <ArticleCard article={article} />
                            </React.Fragment>
                        ))}
                    </div>
                </section>
            ))}
        </div>
      ) : (
        <div className="flex h-64 items-center justify-center rounded-lg border border-dashed shadow-sm">
            <div className="flex flex-col items-center gap-1 text-center text-muted-foreground">
                <h3 className="text-base font-semibold tracking-tight">Không tìm thấy bài viết</h3>
                <p className="text-sm">Thử tìm kiếm với từ khóa khác hoặc tạo bài viết mới.</p>
            </div>
        </div>
      )}

      {isMobile && canCreate && (
        <FAB onClick={() => router.push('/wiki/new')} />
      )}
    </div>
  );
}
