import * as React from "react";
import type { ProductCategory } from '../settings/inventory/types';
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { TouchButton } from "@/components/mobile/touch-button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, Pencil, Trash2, Image as ImageIcon, MapPin } from "lucide-react";

const formatDate = (dateString?: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date);
};

// SEO Score calculation
const calculateSeoScore = (category: ProductCategory, website: 'pkgx' | 'trendtech'): number => {
  const seo = category.websiteSeo?.[website];
  if (!seo) return 0;
  
  let score = 0;
  if (seo.seoTitle && seo.seoTitle.length >= 30) score += 25;
  if (seo.metaDescription && seo.metaDescription.length >= 100) score += 25;
  if (seo.seoKeywords) score += 15;
  if (seo.shortDescription) score += 15;
  if (seo.longDescription && seo.longDescription.length >= 200) score += 20;
  
  return score;
};

const getSeoStatusBadge = (score: number, website: string) => {
  const color = website === 'pkgx' ? 'text-red-500' : 'text-blue-500';
  if (score >= 80) return <Badge variant="outline" className="text-green-600 text-[10px]"><span className={color}>●</span> {score}%</Badge>;
  if (score >= 50) return <Badge variant="outline" className="text-yellow-600 text-[10px]"><span className={color}>●</span> {score}%</Badge>;
  if (score > 0) return <Badge variant="outline" className="text-red-600 text-[10px]"><span className={color}>●</span> {score}%</Badge>;
  return null;
};

export interface MobileCategoryCardProps {
  category: ProductCategory;
  childCount: number;
  onDelete: (systemId: string) => void;
  onToggleActive: (systemId: string, isActive: boolean) => void;
  navigate: (path: string) => void;
  handleRowClick: (category: ProductCategory) => void;
}

export const MobileCategoryCard = ({ 
  category, 
  childCount,
  onDelete, 
  onToggleActive, 
  navigate, 
  handleRowClick 
}: MobileCategoryCardProps) => {
  const level = category.level ?? 0;
  const pkgxScore = calculateSeoScore(category, 'pkgx');
  const trendtechScore = calculateSeoScore(category, 'trendtech');

  return (
    <Card 
      className="hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => handleRowClick(category)}
    >
      <CardContent className="p-4">
        {/* Header: Image + Name + Switch + Menu */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {/* Thumbnail */}
            <Avatar className="h-12 w-12 rounded-md flex-shrink-0">
              {category.thumbnailImage ? (
                <AvatarImage src={category.thumbnailImage} alt={category.name} className="object-cover" />
              ) : null}
              <AvatarFallback className="rounded-md bg-muted">
                <ImageIcon className="h-5 w-5 text-muted-foreground" />
              </AvatarFallback>
            </Avatar>
            
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <CardTitle className="font-semibold text-sm truncate">{category.name}</CardTitle>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="font-mono">{category.id}</span>
                <span>•</span>
                <span>Cấp {level}</span>
                {childCount > 0 && (
                  <>
                    <span>•</span>
                    <span>{childCount} danh mục con</span>
                  </>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Switch trạng thái */}
            <Switch
              checked={category.isActive !== false}
              onCheckedChange={(checked) => {
                onToggleActive(String(category.systemId), checked);
              }}
              onClick={(e) => e.stopPropagation()}
            />
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <TouchButton
                  variant="ghost"
                  size="sm"
                  className="h-9 w-10 p-0 flex-shrink-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </TouchButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); navigate(`/categories/${category.systemId}`); }}>
                  <Eye className="mr-2 h-4 w-4" />
                  Xem chi tiết
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); navigate(`/categories/${category.systemId}/edit`); }}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Chỉnh sửa
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="text-destructive focus:text-destructive"
                  onClick={(e) => { e.stopPropagation(); onDelete(String(category.systemId)); }}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Xóa danh mục
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Path (nếu có parent) */}
        {category.path && level > 0 && (
          <p className="text-xs text-muted-foreground mb-2 truncate flex items-center gap-1">
            <MapPin className="h-3 w-3" /> {category.path}
          </p>
        )}

        {/* Footer: SEO Status */}
        {(pkgxScore > 0 || trendtechScore > 0) && (
          <div className="flex items-center gap-2 mt-2 pt-2 border-t">
            <span className="text-xs text-muted-foreground">SEO:</span>
            {getSeoStatusBadge(pkgxScore, 'pkgx')}
            {getSeoStatusBadge(trendtechScore, 'trendtech')}
          </div>
        )}

        {/* Created date */}
        <div className="text-[10px] text-muted-foreground mt-2">
          Tạo: {formatDate(category.createdAt)}
        </div>
      </CardContent>
    </Card>
  );
};
