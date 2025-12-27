'use client'

import * as React from 'react';
import { useRouter, useParams, usePathname } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useWikiStore } from './store';
import { useEmployeeStore } from '../employees/store';
import type { WikiArticle } from '@/lib/types/prisma-extended';
import { asSystemId, asBusinessId } from '../../lib/id-types';
import { usePageHeader } from '../../contexts/page-header-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../components/ui/form';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';

type WikiFormValues = {
  title: string;
  content: string;
  category: string;
  tags: string; // Comma-separated string
  author: string;
};

export function WikiFormPage() {
  const { systemId } = useParams<{ systemId: string }>();
  const router = useRouter();
  const pathname = usePathname();
  const { findById, add, update, data: articles } = useWikiStore();
  const { data: employees } = useEmployeeStore();
  
  const article = React.useMemo(() => (systemId ? findById(asSystemId(systemId)) : null), [systemId, findById]);
  const isEdit = Boolean(article);

  const headerActions = React.useMemo(() => ([
    <Button
      key="cancel"
      variant="outline"
      className="h-9 gap-2"
      onClick={() => router.push(article ? `/wiki/${article.systemId}` : '/wiki')}
    >
      Hủy
    </Button>,
    <Button key="save" type="submit" form="wiki-form" className="h-9 gap-2">
      Lưu
    </Button>
  ]), [article, router]);

  usePageHeader({
    title: isEdit ? 'Chỉnh sửa bài viết' : 'Tạo bài viết mới',
    backPath: isEdit ? `/wiki/${article?.systemId ?? ''}` : '/wiki',
    breadcrumb: [
      { label: 'Wiki', href: '/wiki', isCurrent: !isEdit },
      ...(isEdit
        ? [
            { label: article?.title ?? 'Bài viết', href: `/wiki/${article?.systemId ?? ''}`, isCurrent: false },
            { label: 'Chỉnh sửa', href: pathname, isCurrent: true },
          ]
        : [
            { label: 'Tạo mới', href: '/wiki/new', isCurrent: true },
          ]),
    ],
    actions: headerActions,
  });

  const existingCategories = React.useMemo(() => [...new Set(articles.map(a => a.category))], [articles]);

  const form = useForm<WikiFormValues>({
    defaultValues: {
      title: article?.title || '',
      content: article?.content || '',
      category: article?.category || '',
      tags: article?.tags?.join(', ') || '',
      author: article?.author || '',
    },
  });

  const { control, handleSubmit } = form;

  const onSubmit = (data: WikiFormValues) => {
    const finalData = {
        ...data,
        tags: data.tags.split(',').map(tag => tag.trim()).filter(Boolean),
    };

    if (article) {
      update(article.systemId, finalData);
      router.push(`/wiki/${article.systemId}`);
    } else {
      add(finalData);
      router.push('/wiki');
    }
  };

  return (
    <Form {...form}>
      <form id="wiki-form" onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardContent className="pt-6 space-y-6">
            <FormField control={control} name="title" render={({ field }) => (
              <FormItem><FormLabel>Tiêu đề</FormLabel><FormControl><Input placeholder="VD: Quy định nghỉ phép năm" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={control} name="content" render={({ field }) => (
              <FormItem><FormLabel>Nội dung</FormLabel><FormControl><Textarea placeholder="Viết nội dung tại đây. Hỗ trợ cú pháp Markdown cơ bản (dòng trống để xuống đoạn, # cho tiêu đề, - cho danh sách)." {...field} rows={15} /></FormControl><FormMessage /></FormItem>
            )} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField control={control} name="category" render={({ field }) => (
                    <FormItem><FormLabel>Chuyên mục</FormLabel><FormControl><Input placeholder="VD: Quy định & Chính sách" {...field} list="categories" /></FormControl>
                    {/* FIX: Add explicit string type to map parameter to fix type inference issue. */}
                    <datalist id="categories">{existingCategories.map((c: string) => <option key={c} value={c} />)}</datalist>
                    <FormMessage /></FormItem>
                )} />
                <FormField control={control} name="tags" render={({ field }) => (
                    <FormItem><FormLabel>Tags (phân cách bởi dấu phẩy)</FormLabel><FormControl><Input placeholder="VD: nghỉ phép, chính sách" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={control} name="author" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Tác giả</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Chọn tác giả" /></SelectTrigger></FormControl>
                            <SelectContent>{employees.map(e => <SelectItem key={e.id} value={e.fullName}>{e.fullName}</SelectItem>)}</SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )} />
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}
