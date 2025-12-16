import * as React from 'react';
import { cn } from '../../lib/utils';
import { Globe, ExternalLink } from 'lucide-react';
import { Badge } from '../ui/badge';

// =============================================================================
// SEO PREVIEW COMPONENT - Google Search Result Preview
// =============================================================================

export interface SeoPreviewProps {
  title?: string;
  description?: string;
  url?: string;
  siteName?: string;
  className?: string;
}

/**
 * SEO Preview - Xem trước kết quả tìm kiếm Google
 * 
 * Hiển thị preview giống như Google search results:
 * - Title (xanh dương, có thể click)
 * - URL (xanh lá)
 * - Description (xám đen)
 */
export function SeoPreview({
  title = '',
  description = '',
  url = '',
  siteName = 'example.com',
  className,
}: SeoPreviewProps) {
  // Truncate title và description theo chuẩn Google
  const truncatedTitle = title.length > 60 ? title.slice(0, 57) + '...' : title;
  const truncatedDesc = description.length > 160 ? description.slice(0, 157) + '...' : description;

  // Build display URL
  const displayUrl = url 
    ? `${siteName}/${url.replace(/^\//, '')}` 
    : siteName;

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
        <Globe className="h-3 w-3" />
        <span>Xem trước kết quả tìm kiếm Google</span>
      </div>
      
      {/* Google Search Result Preview Box */}
      <div className="p-4 rounded-lg border bg-white dark:bg-background">
        {/* Site URL with favicon */}
        <div className="flex items-center gap-2 text-sm">
          <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
            <Globe className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm text-foreground truncate">{siteName}</span>
            <span className="text-xs text-muted-foreground truncate">{displayUrl}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="mt-2 text-xl text-[#1a0dab] dark:text-blue-400 hover:underline cursor-pointer font-normal leading-tight">
          {truncatedTitle || <span className="text-muted-foreground italic">Chưa có tiêu đề SEO</span>}
        </h3>

        {/* Description */}
        <p className="mt-1 text-sm text-[#4d5156] dark:text-muted-foreground leading-snug">
          {truncatedDesc || <span className="italic">Chưa có mô tả SEO</span>}
        </p>
      </div>
    </div>
  );
}

// =============================================================================
// SEO SCORE COMPONENT - Tính điểm SEO
// =============================================================================

export interface SeoScoreProps {
  title?: string;
  description?: string;
  keywords?: string;
  slug?: string;
  className?: string;
  showDetails?: boolean;
}

interface SeoCheckResult {
  label: string;
  passed: boolean;
  message: string;
  points: number;
  maxPoints: number;
}

/**
 * Tính điểm SEO dựa trên các tiêu chí:
 * - Title: 50-60 ký tự (20 điểm)
 * - Description: 150-160 ký tự (20 điểm)
 * - Keywords: có keywords (15 điểm)
 * - Slug: có slug URL-friendly (15 điểm)
 * - Title có từ khóa (15 điểm)
 * - Description có từ khóa (15 điểm)
 */
function calculateSeoScore(props: SeoScoreProps): { score: number; checks: SeoCheckResult[] } {
  const { title = '', description = '', keywords = '', slug = '' } = props;
  const checks: SeoCheckResult[] = [];

  // 1. Title length check (20 points)
  const titleLen = title.length;
  if (titleLen === 0) {
    checks.push({
      label: 'Tiêu đề SEO',
      passed: false,
      message: 'Chưa có tiêu đề',
      points: 0,
      maxPoints: 20,
    });
  } else if (titleLen >= 50 && titleLen <= 60) {
    checks.push({
      label: 'Tiêu đề SEO',
      passed: true,
      message: `Độ dài tốt (${titleLen} ký tự)`,
      points: 20,
      maxPoints: 20,
    });
  } else if (titleLen >= 30 && titleLen < 50) {
    checks.push({
      label: 'Tiêu đề SEO',
      passed: true,
      message: `Hơi ngắn (${titleLen}/50-60 ký tự)`,
      points: 15,
      maxPoints: 20,
    });
  } else if (titleLen > 60 && titleLen <= 70) {
    checks.push({
      label: 'Tiêu đề SEO',
      passed: true,
      message: `Hơi dài (${titleLen}/50-60 ký tự)`,
      points: 15,
      maxPoints: 20,
    });
  } else if (titleLen > 70) {
    checks.push({
      label: 'Tiêu đề SEO',
      passed: false,
      message: `Quá dài (${titleLen} ký tự, nên ≤60)`,
      points: 5,
      maxPoints: 20,
    });
  } else {
    checks.push({
      label: 'Tiêu đề SEO',
      passed: false,
      message: `Quá ngắn (${titleLen} ký tự, nên 50-60)`,
      points: 5,
      maxPoints: 20,
    });
  }

  // 2. Description length check (20 points)
  const descLen = description.length;
  if (descLen === 0) {
    checks.push({
      label: 'Meta Description',
      passed: false,
      message: 'Chưa có mô tả',
      points: 0,
      maxPoints: 20,
    });
  } else if (descLen >= 150 && descLen <= 160) {
    checks.push({
      label: 'Meta Description',
      passed: true,
      message: `Độ dài tốt (${descLen} ký tự)`,
      points: 20,
      maxPoints: 20,
    });
  } else if (descLen >= 120 && descLen < 150) {
    checks.push({
      label: 'Meta Description',
      passed: true,
      message: `Hơi ngắn (${descLen}/150-160 ký tự)`,
      points: 15,
      maxPoints: 20,
    });
  } else if (descLen > 160 && descLen <= 180) {
    checks.push({
      label: 'Meta Description',
      passed: true,
      message: `Hơi dài (${descLen}/150-160 ký tự)`,
      points: 15,
      maxPoints: 20,
    });
  } else if (descLen > 180) {
    checks.push({
      label: 'Meta Description',
      passed: false,
      message: `Quá dài (${descLen} ký tự, nên ≤160)`,
      points: 5,
      maxPoints: 20,
    });
  } else {
    checks.push({
      label: 'Meta Description',
      passed: false,
      message: `Quá ngắn (${descLen} ký tự, nên 120-160)`,
      points: 5,
      maxPoints: 20,
    });
  }

  // 3. Keywords check (15 points)
  const keywordList = keywords.split(',').map(k => k.trim()).filter(Boolean);
  if (keywordList.length === 0) {
    checks.push({
      label: 'Từ khóa SEO',
      passed: false,
      message: 'Chưa có từ khóa',
      points: 0,
      maxPoints: 15,
    });
  } else if (keywordList.length >= 3 && keywordList.length <= 5) {
    checks.push({
      label: 'Từ khóa SEO',
      passed: true,
      message: `Tốt (${keywordList.length} từ khóa)`,
      points: 15,
      maxPoints: 15,
    });
  } else if (keywordList.length < 3) {
    checks.push({
      label: 'Từ khóa SEO',
      passed: true,
      message: `Ít từ khóa (${keywordList.length}, nên 3-5)`,
      points: 10,
      maxPoints: 15,
    });
  } else {
    checks.push({
      label: 'Từ khóa SEO',
      passed: true,
      message: `Nhiều từ khóa (${keywordList.length}, nên 3-5)`,
      points: 10,
      maxPoints: 15,
    });
  }

  // 4. Slug check (15 points)
  if (!slug) {
    checks.push({
      label: 'URL Slug',
      passed: false,
      message: 'Chưa có slug',
      points: 0,
      maxPoints: 15,
    });
  } else if (/^[a-z0-9-]+$/.test(slug) && slug.length <= 50) {
    checks.push({
      label: 'URL Slug',
      passed: true,
      message: 'URL-friendly và ngắn gọn',
      points: 15,
      maxPoints: 15,
    });
  } else if (/^[a-z0-9-]+$/.test(slug)) {
    checks.push({
      label: 'URL Slug',
      passed: true,
      message: `Hơi dài (${slug.length} ký tự)`,
      points: 10,
      maxPoints: 15,
    });
  } else {
    checks.push({
      label: 'URL Slug',
      passed: false,
      message: 'Chứa ký tự không hợp lệ',
      points: 5,
      maxPoints: 15,
    });
  }

  // 5. Title contains keyword (15 points)
  const titleLower = title.toLowerCase();
  const hasKeywordInTitle = keywordList.some(kw => titleLower.includes(kw.toLowerCase()));
  if (keywordList.length === 0) {
    checks.push({
      label: 'Từ khóa trong tiêu đề',
      passed: false,
      message: 'Chưa có từ khóa để kiểm tra',
      points: 0,
      maxPoints: 15,
    });
  } else if (hasKeywordInTitle) {
    checks.push({
      label: 'Từ khóa trong tiêu đề',
      passed: true,
      message: 'Tiêu đề có chứa từ khóa',
      points: 15,
      maxPoints: 15,
    });
  } else {
    checks.push({
      label: 'Từ khóa trong tiêu đề',
      passed: false,
      message: 'Tiêu đề chưa chứa từ khóa',
      points: 0,
      maxPoints: 15,
    });
  }

  // 6. Description contains keyword (15 points)
  const descLower = description.toLowerCase();
  const hasKeywordInDesc = keywordList.some(kw => descLower.includes(kw.toLowerCase()));
  if (keywordList.length === 0) {
    checks.push({
      label: 'Từ khóa trong mô tả',
      passed: false,
      message: 'Chưa có từ khóa để kiểm tra',
      points: 0,
      maxPoints: 15,
    });
  } else if (hasKeywordInDesc) {
    checks.push({
      label: 'Từ khóa trong mô tả',
      passed: true,
      message: 'Mô tả có chứa từ khóa',
      points: 15,
      maxPoints: 15,
    });
  } else {
    checks.push({
      label: 'Từ khóa trong mô tả',
      passed: false,
      message: 'Mô tả chưa chứa từ khóa',
      points: 0,
      maxPoints: 15,
    });
  }

  // Calculate total score
  const totalPoints = checks.reduce((sum, c) => sum + c.points, 0);
  const maxTotalPoints = checks.reduce((sum, c) => sum + c.maxPoints, 0);
  const score = Math.round((totalPoints / maxTotalPoints) * 100);

  return { score, checks };
}

function getScoreColor(score: number): string {
  if (score >= 80) return 'text-green-600 dark:text-green-400';
  if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
  if (score >= 40) return 'text-orange-600 dark:text-orange-400';
  return 'text-red-600 dark:text-red-400';
}

function getScoreBgColor(score: number): string {
  if (score >= 80) return 'bg-green-100 dark:bg-green-900/30';
  if (score >= 60) return 'bg-yellow-100 dark:bg-yellow-900/30';
  if (score >= 40) return 'bg-orange-100 dark:bg-orange-900/30';
  return 'bg-red-100 dark:bg-red-900/30';
}

function getScoreLabel(score: number): string {
  if (score >= 80) return 'Tốt';
  if (score >= 60) return 'Khá';
  if (score >= 40) return 'Trung bình';
  return 'Cần cải thiện';
}

/**
 * SEO Score - Hiển thị điểm SEO với các tiêu chí chi tiết
 */
export function SeoScore({
  title = '',
  description = '',
  keywords = '',
  slug = '',
  className,
  showDetails = true,
}: SeoScoreProps) {
  const { score, checks } = React.useMemo(
    () => calculateSeoScore({ title, description, keywords, slug }),
    [title, description, keywords, slug]
  );

  return (
    <div className={cn('space-y-3', className)}>
      {/* Score Display */}
      <div className="flex items-center gap-3">
        <div className={cn(
          'flex items-center justify-center w-14 h-14 rounded-full font-bold text-lg',
          getScoreBgColor(score),
          getScoreColor(score)
        )}>
          {score}
        </div>
        <div>
          <div className={cn('font-semibold', getScoreColor(score))}>
            {getScoreLabel(score)}
          </div>
          <div className="text-xs text-muted-foreground">
            Điểm SEO
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
        <div
          className={cn(
            'h-full transition-all duration-300',
            score >= 80 ? 'bg-green-500' :
            score >= 60 ? 'bg-yellow-500' :
            score >= 40 ? 'bg-orange-500' : 'bg-red-500'
          )}
          style={{ width: `${score}%` }}
        />
      </div>

      {/* Detailed Checks */}
      {showDetails && (
        <div className="space-y-2 pt-2">
          {checks.map((check, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className={cn(
                  'w-2 h-2 rounded-full',
                  check.passed ? 'bg-green-500' : 'bg-red-500'
                )} />
                <span className="text-muted-foreground">{check.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={check.passed ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}>
                  {check.message}
                </span>
                <Badge variant="secondary" className="text-xs h-5">
                  {check.points}/{check.maxPoints}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// =============================================================================
// COMBINED SEO ANALYSIS PANEL
// =============================================================================

export interface SeoAnalysisPanelProps {
  title?: string;
  description?: string;
  keywords?: string;
  slug?: string;
  siteName?: string;
  className?: string;
}

/**
 * SEO Analysis Panel - Kết hợp Preview và Score
 */
export function SeoAnalysisPanel({
  title = '',
  description = '',
  keywords = '',
  slug = '',
  siteName = 'example.com',
  className,
}: SeoAnalysisPanelProps) {
  return (
    <div className={cn('space-y-6', className)}>
      {/* SEO Score */}
      <SeoScore
        title={title}
        description={description}
        keywords={keywords}
        slug={slug}
        showDetails={true}
      />

      {/* Separator */}
      <div className="border-t" />

      {/* SEO Preview */}
      <SeoPreview
        title={title}
        description={description}
        url={slug}
        siteName={siteName}
      />
    </div>
  );
}
