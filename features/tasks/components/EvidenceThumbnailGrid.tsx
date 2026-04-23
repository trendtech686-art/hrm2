import * as React from 'react';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';
import { OptimizedImage } from '../../../components/ui/optimized-image';
import { Image, Eye, AlertCircle } from 'lucide-react';
import type { CompletionEvidence, ApprovalStatus } from '../types';
import { formatDateTimeForDisplay } from '@/lib/date-utils';

interface EvidenceThumbnailGridProps {
  evidence: CompletionEvidence;
  approvalStatus?: ApprovalStatus | undefined;
  onViewFullEvidence?: (() => void) | undefined;
  compact?: boolean | undefined;
}

export function EvidenceThumbnailGrid({ 
  evidence, 
  approvalStatus, 
  onViewFullEvidence,
  compact = false 
}: EvidenceThumbnailGridProps) {
  const maxDisplay = compact ? 3 : 5;
  const displayImages = evidence.images.slice(0, maxDisplay);
  const remainingCount = evidence.images.length - maxDisplay;

  const getStatusConfig = (status?: ApprovalStatus) => {
    if (!status) return null;
    
    const configs = {
      pending: {
        label: 'Chờ duyệt',
        variant: 'warning' as const,
        className: ''
      },
      approved: {
        label: 'Đã duyệt',
        variant: 'success' as const,
        className: ''
      },
      rejected: {
        label: 'Yêu cầu làm lại',
        variant: 'destructive' as const,
        className: ''
      },
    };
    
    return configs[status];
  };

  const statusConfig = getStatusConfig(approvalStatus);

  return (
    <Card className="border">
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Header với status badge */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Image className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Bằng chứng hoàn thành</span>
              <Badge variant="outline" className="text-xs">
                {evidence.images.length} ảnh
              </Badge>
            </div>
            {statusConfig && (
              <Badge variant={statusConfig.variant} className={statusConfig.className}>
                {approvalStatus === 'pending' && <AlertCircle className="mr-1 h-3 w-3" />}
                {statusConfig.label}
              </Badge>
            )}
          </div>

          {/* Thumbnail Grid */}
          <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
            {displayImages.map((imageData, idx) => (
              <div 
                key={idx}
                className="relative aspect-square rounded overflow-hidden border bg-muted group cursor-pointer"
                onClick={onViewFullEvidence}
              >
                <OptimizedImage 
                  src={imageData} 
                  alt={`Evidence ${idx + 1}`}
                  className="w-full h-full object-cover transition-transform group-hover:scale-110"
                  fill
                  unoptimized
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Eye className="h-5 w-5 text-white" />
                </div>
              </div>
            ))}
            
            {/* More indicator */}
            {remainingCount > 0 && (
              <div 
                className="relative aspect-square rounded border bg-muted/50 flex items-center justify-center cursor-pointer hover:bg-muted transition-colors"
                onClick={onViewFullEvidence}
              >
                <div className="text-center">
                  <p className="text-h4 font-bold">+{remainingCount}</p>
                  <p className="text-xs text-muted-foreground">ảnh</p>
                </div>
              </div>
            )}
          </div>

          {/* Metadata */}
          <div className="text-xs text-muted-foreground space-y-1">
            <p>
              <span className="font-medium">Người gửi:</span> {evidence.submittedByName}
            </p>
            <p>
              <span className="font-medium">Thời gian:</span>{' '}
              {formatDateTimeForDisplay(evidence.submittedAt)}
            </p>
            {evidence.note && (
              <p className="mt-2 p-2 bg-muted/50 rounded text-sm">
                <span className="font-medium">Ghi chú:</span>{' '}
                <span className="whitespace-pre-wrap">{evidence.note}</span>
              </p>
            )}
          </div>

          {/* View button */}
          {onViewFullEvidence && (
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full h-9"
              onClick={onViewFullEvidence}
            >
              <Eye className="mr-2 h-4 w-4" />
              Xem đầy đủ bằng chứng
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
