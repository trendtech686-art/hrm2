import * as React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { BreadcrumbItem } from '../lib/breadcrumb-system';
import { generateBreadcrumb, generatePageTitle } from '../lib/breadcrumb-system';

/**
 * Page Header State Interface
 * Defines the structure of page header data
 */
export interface PageHeaderState {
  title?: string | React.ReactNode;
  subtitle?: string;
  badge?: React.ReactNode;
  showBackButton?: boolean;
  backPath?: string;
  onBack?: () => void;
  actions?: React.ReactNode[] | React.ReactNode;
  breadcrumb?: BreadcrumbItem[];
  context?: Record<string, any>; // For dynamic breadcrumb generation
}

/**
 * Page Header Context
 */
interface PageHeaderContextValue {
  pageHeader: PageHeaderState;
  setPageHeader: (state: PageHeaderState) => void;
  clearPageHeader: () => void;
}

const PageHeaderContext = React.createContext<PageHeaderContextValue | null>(null);

/**
 * Page Header Provider
 * Wrap your app with this provider to enable page header functionality
 */
export function PageHeaderProvider({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [pageHeader, setPageHeaderState] = React.useState<PageHeaderState>({});

  // Auto-clear on route change (optional - can be disabled)
  React.useEffect(() => {
    // Don't auto-clear, let pages set their own headers
    // setPageHeaderState({});
  }, [location.pathname]);

  const setPageHeader = React.useCallback((state: PageHeaderState) => {
    setPageHeaderState(prev => {
      // Auto-generate breadcrumb if not provided
      let breadcrumb = state.breadcrumb;
      if (!breadcrumb) {
        breadcrumb = generateBreadcrumb(location.pathname, state.context);
      } else {
        // ✨ Transform route metadata breadcrumb format
        // Convert: ['Nhân viên', 'Chi tiết'] or [{ label: 'Nhân viên', href: '/employees' }, 'Chi tiết']
        // To: [{ label: 'Nhân viên', href: '/employees', isCurrent: false }, { label: 'Chi tiết', href: pathname, isCurrent: true }]
        breadcrumb = breadcrumb.map((item, index) => {
          if (typeof item === 'string') {
            return {
              label: item,
              href: location.pathname,
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
        const pageTitle = generatePageTitle(location.pathname, state.context);
        title = pageTitle.title;
      }

      // Auto back handler if not provided
      let onBack = state.onBack;
      if (!onBack && state.showBackButton !== false) {
        onBack = () => {
          if (state.backPath) {
            navigate(state.backPath);
          } else {
            navigate(-1);
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
  }, [location.pathname, navigate]);

  const clearPageHeader = React.useCallback(() => {
    setPageHeaderState({});
  }, []);

  const value = React.useMemo(
    () => ({
      pageHeader,
      setPageHeader,
      clearPageHeader,
    }),
    [pageHeader, setPageHeader, clearPageHeader]
  );

  return (
    <PageHeaderContext.Provider value={value}>
      {children}
    </PageHeaderContext.Provider>
  );
}

/**
 * Hook to access page header context
 * @throws Error if used outside PageHeaderProvider
 */
export function usePageHeaderContext() {
  const context = React.useContext(PageHeaderContext);
  if (!context) {
    throw new Error('usePageHeaderContext must be used within PageHeaderProvider');
  }
  return context;
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
  const { setPageHeader, clearPageHeader } = usePageHeaderContext();
  const prevConfigRef = React.useRef<string>('');
  const configRef = React.useRef(config);
  
  // Update ref without causing re-render
  configRef.current = config;

  React.useEffect(() => {
    const currentConfig = configRef.current;
    
    // Helper to recursively extract text from React elements
    const extractText = (node: any): string => {
      if (!node) return '';
      if (typeof node === 'string' || typeof node === 'number') return String(node);
      if (Array.isArray(node)) return node.map(extractText).join('');
      if (typeof node === 'object' && 'props' in node) {
        return extractText(node.props?.children);
      }
      return '';
    };

    const extractTextFromActions = (actions?: React.ReactNode | React.ReactNode[]) => {
      if (!actions) return '';
      const actionsArray = Array.isArray(actions) ? actions : [actions];
      return actionsArray.map(extractText).join('|');
    };

    // Create a serializable fingerprint of the config
    const configFingerprint = currentConfig ? JSON.stringify({
      title: typeof currentConfig.title === 'string' ? currentConfig.title : extractText(currentConfig.title),
      subtitle: currentConfig.subtitle,
      showBackButton: currentConfig.showBackButton,
      backPath: currentConfig.backPath,
      actionsText: extractTextFromActions(currentConfig.actions),
      breadcrumbCount: currentConfig.breadcrumb?.length,
      context: currentConfig.context,
    }) : 'EMPTY';

    // Only update if fingerprint changed
    if (configFingerprint !== prevConfigRef.current) {
      prevConfigRef.current = configFingerprint;
      if (currentConfig) {
        setPageHeader(currentConfig);
      }
    }
  });

  return { setPageHeader, clearPageHeader };
}
