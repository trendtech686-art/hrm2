import * as React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useWikiStore } from './store.ts';
import { useEmployeeStore } from '../employees/store.ts';
import type { WikiArticle } from './types.ts';
import { asSystemId, asBusinessId } from '../../lib/id-types.ts';
import { usePageHeader } from '../../contexts/page-header-context.tsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card.tsx';
import { Button } from '../../components/ui/button.tsx';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../components/ui/form.tsx';
import { Input } from '../../components/ui/input.tsx';
import { Textarea } from '../../components/ui/textarea.tsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select.tsx';

type WikiFormValues = {
  title: string;
  content: string;
  category: string;
  tags: string; // Comma-separated string
  author: string;
};

export function WikiFormPage() {
  const { systemId } = ReactRouterDOM.useParams<{ systemId: string }>();
  const navigate = ReactRouterDOM.useNavigate();
  const { findById, add, update, data: articles } = useWikiStore();
  const { data: employees } = useEmployeeStore();
  
  const article = React.useMemo(() => (systemId ? findById(asSystemId(systemId)) : null), [systemId, findById]);
  
  usePageHeader({
    actions: [
      <Button key="cancel" variant="outline" onClick={() => navigate(article ? `/wiki/${article.systemId}` : '/wiki')}>
        Hủy
      </Button>,
      <Button key="save" type="submit" form="wiki-form">
        Lưu
      </Button>
    ]
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
      navigate(`/wiki/${article.systemId}`);
    } else {
      add(finalData);
      navigate('/wiki');
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
