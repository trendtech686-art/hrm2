import * as React from 'react';
import { useLocation } from 'react-router-dom';
import { Settings2 } from 'lucide-react';
import { usePageHeader, type PageHeaderState, type PageHeaderDocLink } from '../../contexts/page-header-context';
import type { BreadcrumbItem } from '../../lib/breadcrumb-system';

export type SettingsPageHeaderOptions = Omit<PageHeaderState, 'title' | 'docLink'> & {
  title: string;
  icon?: React.ReactNode;
  docLink?: string | PageHeaderDocLink;
};

const defaultDocLabel = 'Xem hướng dẫn';
const baseBreadcrumb: BreadcrumbItem[] = [
  { label: 'Trang chủ', href: '/', isCurrent: false },
  { label: 'Cài đặt', href: '/settings', isCurrent: false },
];

const normalizeLabel = (label?: string) => label?.trim().toLocaleLowerCase('vi');
const isHomeCrumb = (item: BreadcrumbItem) => item.href === '/' || normalizeLabel(item.label) === 'trang chủ';
const isSettingsCrumb = (item: BreadcrumbItem) => item.href === '/settings' || normalizeLabel(item.label) === 'cài đặt';

export function useSettingsPageHeader(options: SettingsPageHeaderOptions) {
  const location = useLocation();
  const { title, icon, docLink, breadcrumb, ...rest } = options;

  const normalizedDocLink = React.useMemo<PageHeaderDocLink | undefined>(() => {
    if (!docLink) return undefined;
    if (typeof docLink === 'string') {
      return { href: docLink, label: defaultDocLabel };
    }
    return {
      href: docLink.href,
      label: docLink.label ?? defaultDocLabel,
    };
  }, [docLink]);

  const decoratedTitle = React.useMemo(() => (
    <span className="inline-flex items-center gap-2">
      {(icon ?? <Settings2 className="h-5 w-5 text-muted-foreground" aria-hidden="true" />)}
      <span>{title}</span>
    </span>
  ), [icon, title]);

  const normalizedBreadcrumb = React.useMemo(() => {
    const custom = (breadcrumb ?? []).map((item) => ({
      ...item,
      href: item.href || location.pathname,
    }));

    let merged: BreadcrumbItem[] = custom.length
      ? [...custom]
      : [{ label: title, href: location.pathname, isCurrent: true }];

    if (!merged.some(isHomeCrumb)) {
      merged = [{ ...baseBreadcrumb[0] }, ...merged];
    }

    if (!merged.some(isSettingsCrumb)) {
      const homeIndex = merged.findIndex(isHomeCrumb);
      const insertionIndex = homeIndex >= 0 ? homeIndex + 1 : 0;
      merged = [
        ...merged.slice(0, insertionIndex),
        { ...baseBreadcrumb[1] },
        ...merged.slice(insertionIndex),
      ];
    }

    return merged.map((item, index) => ({
      ...item,
      isCurrent: index === merged.length - 1,
    }));
  }, [breadcrumb, location.pathname, title]);

  return usePageHeader({
    ...rest,
    breadcrumb: normalizedBreadcrumb,
    title: decoratedTitle,
    docLink: normalizedDocLink,
  });
}
