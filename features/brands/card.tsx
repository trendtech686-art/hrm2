import * as React from "react";
import type { Brand } from '../settings/inventory/types';
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TouchButton } from "@/components/mobile/touch-button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Globe, ExternalLink, Power, Eye, Pencil, Trash2, Image as ImageIcon } from "lucide-react";

const formatDate = (dateString?: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date);
};

export interface MobileBrandCardProps {
  brand: Brand;
  onDelete: (systemId: string) => void;
  onToggleActive: (systemId: string, isActive: boolean) => void;
  navigate: (path: string) => void;
  handleRowClick: (brand: Brand) => void;
}

export const MobileBrandCard = ({ brand, onDelete, onToggleActive, navigate, handleRowClick }: MobileBrandCardProps) => {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <Card 
      className="hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => handleRowClick(brand)}
    >
      <CardContent className="p-4">
        {/* Header: Logo + Name + Status + Menu */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Avatar className="h-12 w-12 flex-shrink-0">
              {brand.logo ? (
                <AvatarImage src={brand.logo} alt={brand.name} />
              ) : null}
              <AvatarFallback className="bg-muted">
                {brand.logo ? getInitials(brand.name) : <ImageIcon className="h-5 w-5 text-muted-foreground" />}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2">
                <CardTitle className="font-semibold text-sm truncate">{brand.name}</CardTitle>
                {brand.isActive !== false ? (
                  <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100 text-[10px] h-5">
                    Hoạt động
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="bg-gray-100 text-gray-600 text-[10px] h-5">
                    Tạm tắt
                  </Badge>
                )}
              </div>
              <span className="text-xs text-muted-foreground font-mono">#{brand.id}</span>
            </div>
          </div>
          
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
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); navigate(`/brands/${brand.systemId}`); }}>
                <Eye className="mr-2 h-4 w-4" />
                Xem chi tiết
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); navigate(`/brands/${brand.systemId}/edit`); }}>
                <Pencil className="mr-2 h-4 w-4" />
                Chỉnh sửa
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={(e) => { 
                e.stopPropagation(); 
                onToggleActive(brand.systemId, !brand.isActive); 
              }}>
                <Power className="mr-2 h-4 w-4" />
                {brand.isActive !== false ? 'Tắt hoạt động' : 'Bật hoạt động'}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-destructive focus:text-destructive"
                onClick={(e) => { e.stopPropagation(); onDelete(brand.systemId); }}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Xóa thương hiệu
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Description */}
        {brand.description && (
          <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
            {brand.description}
          </p>
        )}

        {/* Website */}
        {brand.website && (
          <div className="flex items-center gap-1.5 text-xs mb-3">
            <Globe className="h-3 w-3 text-muted-foreground flex-shrink-0" />
            <a 
              href={brand.website} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline truncate"
              onClick={(e) => e.stopPropagation()}
            >
              {brand.website.replace(/^https?:\/\//, '')}
            </a>
            <ExternalLink className="h-3 w-3 text-muted-foreground flex-shrink-0" />
          </div>
        )}

        {/* Footer: SEO Status + Date */}
        <div className="flex items-center justify-between pt-3 border-t">
          <div className="flex items-center gap-2">
            {/* SEO PKGX */}
            {(brand.websiteSeo?.pkgx?.seoTitle || brand.websiteSeo?.pkgx?.metaDescription || brand.websiteSeo?.pkgx?.slug) && (
              <Badge variant="outline" className="text-[10px] bg-red-50 text-red-700 border-red-200">
                PKGX
              </Badge>
            )}
            {/* SEO Trendtech */}
            {(brand.websiteSeo?.trendtech?.seoTitle || brand.websiteSeo?.trendtech?.metaDescription || brand.websiteSeo?.trendtech?.slug) && (
              <Badge variant="outline" className="text-[10px] bg-blue-50 text-blue-700 border-blue-200">
                Trendtech
              </Badge>
            )}
          </div>
          <span className="text-[10px] text-muted-foreground">
            Tạo: {formatDate(brand.createdAt)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
