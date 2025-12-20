import * as React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import type { BreadcrumbItem } from '../lib/breadcrumb-system';
import { generateBreadcrumb, generatePageTitle } from '../lib/breadcrumb-system';

/**
 * Page Header State Interface
 * Defines the structure of page header data
 */
export interface PageHeaderDocLink {
  href: string;
  label?: string;
}

export interface PageHeaderState {
  title?: string | React.ReactNode | undefined;
  subtitle?: string | undefined;
  badge?: React.ReactNode | undefined;
  showBackButton?: boolean | undefined;
  backPath?: string | undefined;
  onBack?: (() => void) | undefined;
  actions?: React.ReactNode[] | React.ReactNode | undefined;
  breadcrumb?: BreadcrumbItem[] | undefined;
  context?: Record<string, any> | undefined; // For dynamic breadcrumb generation
  docLink?: PageHeaderDocLink | undefined;
}

/**
 * Page Header Context
 */
interface PageHeaderContextValue {
  pageHeader: PageHeaderState;
  setPageHeader: (state: PageHeaderState) => void;
  clearPageHeader: () => void;
}

const PageHeaderStateContext = React.createContext<PageHeaderState | null>(null);
const PageHeaderDispatchContext = React.createContext<Omit<PageHeaderContextValue, 'pageHeader'> | null>(null);

/**
 * Page Header Provider
 * Wrap your app with this provider to enable page header functionality
 */
export function PageHeaderProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [pageHeader, setPageHeaderState] = React.useState<PageHeaderState>({});

  // Auto-clear on route change (optional - can be disabled)
  React.useEffect(() => {
    // Don't auto-clear, let pages set their own headers
    // setPageHeaderState({});
  }, [pathname]);

  const setPageHeader = React.useCallback((state: PageHeaderState) => {
    setPageHeaderState(prev => {
      // Auto-generate breadcrumb if not provided
      let breadcrumb = state.breadcrumb;
      if (!breadcrumb) {
        breadcrumb = generateBreadcrumb(pathname, state.context);
      } else {
        // ✨ Transform route metadata breadcrumb format
        // Convert: ['Nhân viên', 'Chi tiết'] or [{ label: 'Nhân viên', href: '/employees' }, 'Chi tiết']
        // To: [{ label: 'Nhân viên', href: '/employees', isCurrent: false }, { label: 'Chi tiết', href: pathname, isCurrent: true }]
        breadcrumb = breadcrumb.map((item, index) => {
          if (typeof item === 'string') {
            return {
              label: item,
              href: pathname,
              isCurrent: index === breadcrumb!.length - 1
            };
          }
          return {
            ...item,
            isCurrent: index === breadcrumb!.length - 1
          };
        });
      }

      // Auto-generate title if not provided
      let title = state.title;
      if (!title) {
        const pageTitle = generatePageTitle(pathname, state.context);
        title = pageTitle.title;
      }

      // Auto back handler if not provided
      let onBack = state.onBack;
      if (!onBack && state.showBackButton !== false) {
        onBack = () => {
          if (state.backPath) {
            router.push(state.backPath);
          } else {
            router.back();
          }
        };
      }

      // ✅ KHÔNG spread prev để tránh giữ lại state cũ (như badge)
      return {
        ...state,
        breadcrumb,
        title,
        onBack,
      };
    });
  }, [pathname, router]);

  const clearPageHeader = React.useCallback(() => {
    setPageHeaderState({});
  }, []);

  const dispatchValue = React.useMemo(
    () => ({
      setPageHeader,
      clearPageHeader,
    }),
    [setPageHeader, clearPageHeader]
  );

  return (
    <PageHeaderDispatchContext.Provider value={dispatchValue}>
      <PageHeaderStateContext.Provider value={pageHeader}>
        {children}
      </PageHeaderStateContext.Provider>
    </PageHeaderDispatchContext.Provider>
  );
}

/**
 * Hook to access page header state (for rendering)
 */
export function usePageHeaderState() {
  const context = React.useContext(PageHeaderStateContext);
  if (!context) {
    throw new Error('usePageHeaderState must be used within PageHeaderProvider');
  }
  return context;
}

/**
 * Hook to access page header dispatch (for setting header)
 */
export function usePageHeaderDispatch() {
  const context = React.useContext(PageHeaderDispatchContext);
  if (!context) {
    throw new Error('usePageHeaderDispatch must be used within PageHeaderProvider');
  }
  return context;
}

/**
 * Legacy hook to access full context
 * @deprecated Use usePageHeaderState or usePageHeaderDispatch instead
 */
export function usePageHeaderContext() {
  const state = usePageHeaderState();
  const dispatch = usePageHeaderDispatch();
  return { pageHeader: state, ...dispatch };
}

/**
 * Hook to set page header from any component
 * 
 * @example
 * // Auto-generated breadcrumb + title
 * usePageHeader();
 * 
 * @example
 * // Custom configuration
 * usePageHeader({
 *   title: 'Bùi My',
 *   subtitle: 'Trưởng nhóm • Kinh doanh',
 *   badge: <Badge>Active</Badge>,
 *   showBackButton: true,
 *   actions: [
 *     <Button key="edit">Chỉnh sửa</Button>
 *   ]
 * });
 * 
 * @example
 * // With dynamic context for breadcrumb
 * usePageHeader({
 *   context: {
 *     employeeName: employee.fullName,
 *     employeeCode: employee.code
 *   }
 * });
 */
export function usePageHeader(config?: PageHeaderState) {
  const { setPageHeader, clearPageHeader } = usePageHeaderDispatch();
  const configRef = React.useRef(config);
  
  // Update ref without causing re-render
  configRef.current = config;

  // Create a serializable fingerprint of the config
  const configFingerprint = React.useMemo(() => {
    const currentConfig = config;
    
    // Helper to recursively extract text from React elements
    const extractText = (node: any): string => {
      if (!node) return '';
      if (typeof node === 'string' || typeof node === 'number') return String(node);
      if (Array.isArray(node)) return node.map(extractText).join('');
      if (React.isValidElement(node)) {
        return extractText((node.props as any).children);
      }
      if (typeof node === 'object' && 'props' in node) {
        return extractText((node as any).props?.children);
      }
      return '';
    };

    const extractTextFromActions = (actions?: React.ReactNode | React.ReactNode[]) => {
      if (!actions) return '';
      const actionsArray = Array.isArray(actions) ? actions : [actions];
      return actionsArray.map(node => {
        if (!React.isValidElement(node)) return extractText(node);
        const props = node.props as any;
        return `${extractText(node)}|${props.disabled}|${props.hidden}|${node.key}`;
      }).join('||');
    };

    return currentConfig ? JSON.stringify({
      title: typeof currentConfig.title === 'string' ? currentConfig.title : extractText(currentConfig.title),
      subtitle: currentConfig.subtitle,
      showBackButton: currentConfig.showBackButton,
      backPath: currentConfig.backPath,
      actionsText: extractTextFromActions(currentConfig.actions),
      breadcrumb: currentConfig.breadcrumb,
      badgeKey: React.isValidElement(currentConfig.badge) ? currentConfig.badge.key : undefined,
      context: currentConfig.context,
      docLink: currentConfig.docLink,
    }) : 'EMPTY';
  }, [config]);

  React.useEffect(() => {
    const currentConfig = configRef.current;
    if (currentConfig) {
      setPageHeader(currentConfig);
    }
  }, [configFingerprint, setPageHeader]);

  return { setPageHeader, clearPageHeader };
}
