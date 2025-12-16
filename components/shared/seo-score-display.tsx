import * as React from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, AlertCircle, XCircle } from 'lucide-react';

interface SeoScoreDisplayProps {
  title?: string;
  description?: string;
  keywords?: string;
  slug?: string;
  shortDescription?: string;
  longDescription?: string;
  ogImage?: string;
  className?: string;
  compact?: boolean;
}

interface SeoCheck {
  label: string;
  passed: boolean;
  score: number;
  message?: string;
}

export function calculateSeoScore(data: {
  title?: string;
  description?: string;
  keywords?: string;
  slug?: string;
  shortDescription?: string;
  longDescription?: string;
  ogImage?: string;
}): { score: number; checks: SeoCheck[] } {
  const checks: SeoCheck[] = [];
  
  // Title check (25 points)
  const titleLength = data.title?.length || 0;
  const titlePassed = titleLength >= 30 && titleLength <= 70;
  checks.push({
    label: 'Tiêu đề SEO',
    passed: titlePassed,
    score: titlePassed ? 25 : (titleLength > 0 ? 10 : 0),
    message: titlePassed 
      ? `Tốt (${titleLength} ký tự)` 
      : titleLength === 0 
        ? 'Chưa có tiêu đề' 
        : titleLength < 30 
          ? `Quá ngắn (${titleLength}/30-70)` 
          : `Quá dài (${titleLength}/30-70)`
  });
  
  // Meta Description check (25 points)
  const descLength = data.description?.length || 0;
  const descPassed = descLength >= 120 && descLength <= 160;
  checks.push({
    label: 'Meta Description',
    passed: descPassed,
    score: descPassed ? 25 : (descLength > 0 ? 10 : 0),
    message: descPassed 
      ? `Tốt (${descLength} ký tự)` 
      : descLength === 0 
        ? 'Chưa có mô tả' 
        : descLength < 120 
          ? `Quá ngắn (${descLength}/120-160)` 
          : `Quá dài (${descLength}/120-160)`
  });
  
  // Keywords check (15 points)
  const keywordCount = data.keywords?.split(',').filter(k => k.trim()).length || 0;
  const keywordPassed = keywordCount >= 3 && keywordCount <= 10;
  checks.push({
    label: 'Từ khóa',
    passed: keywordPassed,
    score: keywordPassed ? 15 : (keywordCount > 0 ? 5 : 0),
    message: keywordPassed 
      ? `${keywordCount} từ khóa` 
      : keywordCount === 0 
        ? 'Chưa có từ khóa' 
        : keywordCount < 3 
          ? `Ít từ khóa (${keywordCount}/3-10)` 
          : `Nhiều từ khóa (${keywordCount}/3-10)`
  });
  
  // Slug check (10 points)
  const slugValid = !!data.slug && /^[a-z0-9-]+$/.test(data.slug);
  checks.push({
    label: 'URL Slug',
    passed: slugValid,
    score: slugValid ? 10 : 0,
    message: slugValid ? 'Hợp lệ' : data.slug ? 'Chứa ký tự không hợp lệ' : 'Chưa có slug'
  });
  
  // Short Description check (10 points)
  const shortDescLength = data.shortDescription?.length || 0;
  const shortDescPassed = shortDescLength >= 50;
  checks.push({
    label: 'Mô tả ngắn',
    passed: shortDescPassed,
    score: shortDescPassed ? 10 : (shortDescLength > 0 ? 5 : 0),
    message: shortDescPassed ? `${shortDescLength} ký tự` : shortDescLength === 0 ? 'Chưa có' : 'Quá ngắn'
  });
  
  // Long Description check (10 points)
  const longDescLength = data.longDescription?.replace(/<[^>]*>/g, '').length || 0;
  const longDescPassed = longDescLength >= 200;
  checks.push({
    label: 'Mô tả chi tiết',
    passed: longDescPassed,
    score: longDescPassed ? 10 : (longDescLength > 0 ? 5 : 0),
    message: longDescPassed ? `${longDescLength} ký tự` : longDescLength === 0 ? 'Chưa có' : 'Quá ngắn'
  });
  
  // OG Image check (5 points)
  const hasOgImage = !!data.ogImage;
  checks.push({
    label: 'Hình ảnh OG',
    passed: hasOgImage,
    score: hasOgImage ? 5 : 0,
    message: hasOgImage ? 'Đã có' : 'Chưa có'
  });
  
  const totalScore = checks.reduce((sum, check) => sum + check.score, 0);
  
  return { score: totalScore, checks };
}

export function SeoScoreDisplay({
  title,
  description,
  keywords,
  slug,
  shortDescription,
  longDescription,
  ogImage,
  className,
  compact = false
}: SeoScoreDisplayProps) {
  const { score, checks } = React.useMemo(() => 
    calculateSeoScore({ title, description, keywords, slug, shortDescription, longDescription, ogImage }),
    [title, description, keywords, slug, shortDescription, longDescription, ogImage]
  );
  
  const getScoreColor = () => {
    if (score >= 80) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };
  
  const getProgressColor = () => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  
  const getScoreLabel = () => {
    if (score >= 80) return 'Tốt';
    if (score >= 50) return 'Trung bình';
    if (score > 0) return 'Cần cải thiện';
    return 'Chưa cấu hình';
  };

  if (compact) {
    return (
      <Badge 
        variant="outline" 
        className={cn(getScoreColor(), 'font-medium', className)}
      >
        {score}%
      </Badge>
    );
  }

  return (
    <div className={cn('space-y-4 p-4 border rounded-lg bg-muted/30', className)}>
      <div className="flex items-center justify-between">
        <h4 className="font-medium">Điểm SEO</h4>
        <div className="flex items-center gap-2">
          <span className={cn('text-2xl font-bold', getScoreColor())}>{score}</span>
          <span className="text-muted-foreground">/100</span>
        </div>
      </div>
      
      <div className="space-y-1">
        <Progress value={score} className={cn("h-2", getProgressColor())} />
        <p className={cn('text-sm font-medium', getScoreColor())}>{getScoreLabel()}</p>
      </div>
      
      <div className="space-y-2">
        {checks.map((check, i) => (
          <div key={i} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              {check.passed ? (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              ) : check.score > 0 ? (
                <AlertCircle className="h-4 w-4 text-yellow-500" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
              <span>{check.label}</span>
            </div>
            <span className={cn(
              check.passed ? 'text-green-600' : check.score > 0 ? 'text-yellow-600' : 'text-red-600',
              'text-xs'
            )}>
              {check.message}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
