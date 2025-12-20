'use client'

import * as React from 'react';
import * as ReactRouterDOM from '@/lib/next-compat';
import Fuse from 'fuse.js';
import { useWikiStore } from './store';
import { usePageHeader } from '../../contexts/page-header-context';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Search, PlusCircle, User, Calendar } from 'lucide-react';
import { Badge } from '../../components/ui/badge';
import type { WikiArticle } from './types';
import { formatDate, formatDateTime, formatDateTimeSeconds, formatDateCustom, parseDate, getCurrentDate } from '@/lib/date-utils';

function ArticleCard({ article }: { article: WikiArticle }) {
  const navigate = ReactRouterDOM.useNavigate();
  const contentSnippet = article.content.split('\n').find(line => line.trim() && !line.trim().startsWith('#')) || '';

  return (
    <Card 
      className="cursor-pointer hover:shadow-md hover:-translate-y-1 transition-transform duration-200"
      onClick={() => navigate(`/wiki/${article.systemId}`)}
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && navigate(`/wiki/${article.systemId}`)}
    >
      <CardHeader>
        <CardTitle>{article.title}</CardTitle>
        <CardDescription className="flex items-center gap-4 pt-1">
            <span className="flex items-center gap-1.5"><User className="h-3.5 w-3.5" /> {article.author}</span>
            <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> {formatDate(article.updatedAt)}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-2">{contentSnippet}</p>
        <div className="flex flex-wrap gap-2 mt-4">
            {article.tags?.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
        </div>
      </CardContent>
    </Card>
  );
}

export function WikiPage() {
  const { data: articles } = useWikiStore();
  const navigate = ReactRouterDOM.useNavigate();
  
  const articleStats = React.useMemo(() => {
    return {
      total: articles.length,
      categories: new Set(articles.map((a) => a.category || 'Chưa phân loại')).size,
      tags: new Set(articles.flatMap((a) => a.tags || [])).size,
    };
  }, [articles]);

  const headerActions = React.useMemo(() => ([
    <Button key="add" size="sm" className="h-9 gap-2" onClick={() => navigate('/wiki/new')}>
      <PlusCircle className="mr-2 h-4 w-4" />
      Thêm bài viết
    </Button>
  ]), [navigate]);

  usePageHeader({
    title: 'Wiki nội bộ',
    actions: headerActions,
    breadcrumb: [
      { label: 'Trang chủ', href: '/', isCurrent: false },
      { label: 'Wiki', href: '/wiki', isCurrent: true },
    ],
  });
  const [searchQuery, setSearchQuery] = React.useState('');

  const fuse = React.useMemo(() => new Fuse(articles, { 
    keys: ['title', 'category', 'tags', 'author', 'content'],
    threshold: 0.4,
  }), [articles]);
  
  const filteredArticles = React.useMemo(() => 
    searchQuery ? fuse.search(searchQuery).map(result => result.item) : articles,
    [searchQuery, fuse, articles]
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
        <Button size="sm" className="h-9 gap-2" onClick={() => navigate('/wiki/new')}>
          <PlusCircle className="mr-2 h-4 w-4" /> Tạo bài viết mới
        </Button>
      </div>

      {Object.keys(articlesByCategory).length > 0 ? (
        <div className="space-y-8">
            {/* FIX: Replaced `Object.entries` with `Object.keys` for iteration to resolve a TypeScript type inference issue where the array of articles was being typed as `unknown`. */}
            {Object.keys(articlesByCategory).map((category) => (
                <section key={category}>
                    <h2 className="text-h3 font-semibold tracking-tight mb-4">{category}</h2>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
                <h3 className="text-h5 font-semibold tracking-tight">Không tìm thấy bài viết</h3>
                <p className="text-sm">Thử tìm kiếm với từ khóa khác hoặc tạo bài viết mới.</p>
            </div>
        </div>
      )}
    </div>
  );
}
