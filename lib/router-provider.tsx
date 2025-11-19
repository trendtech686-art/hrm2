import * as React from 'react';
import { 
  createBrowserRouter, 
  RouterProvider as ReactRouterProvider,
  Outlet,
  useRouteError,
  isRouteErrorResponse,
  useNavigation,
  useLocation,
  Navigate
} from 'react-router-dom';
import { MainLayout } from '../components/layout/main-layout';
import { routeDefinitions } from './route-definitions';
import { Spinner } from '../components/ui/spinner';
import { Button } from '../components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';
import { AlertTriangle, RotateCcw } from 'lucide-react';
import { ROUTES } from './router';
import { PageHeaderProvider } from '../contexts/page-header-context.tsx';
import { useAuth } from '../contexts/auth-context.tsx';

// Loading Component
function RouteLoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center space-y-4">
        <Spinner className="h-8 w-8" />
        <p className="text-sm text-muted-foreground">Đang tải...</p>
      </div>
    </div>
  );
}

// Error Boundary Component
function RouteErrorBoundary() {
  const error = useRouteError();
  
  let errorMessage = 'Đã xảy ra lỗi không xác định';
  let errorStatus: number | undefined;
  
  if (isRouteErrorResponse(error)) {
    errorStatus = error.status;
    errorMessage = error.statusText || error.data?.message || `Lỗi ${error.status}`;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }
  
  const handleRetry = () => {
    window.location.reload();
  };
  
  const handleGoHome = () => {
    window.location.href = '/';
  };
  
  return (
    <div className="flex items-center justify-center min-h-[400px] p-4">
      <div className="max-w-md w-full">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>
            {errorStatus ? `Lỗi ${errorStatus}` : 'Có lỗi xảy ra'}
          </AlertTitle>
          <AlertDescription className="mt-2">
            {errorMessage}
          </AlertDescription>
        </Alert>
        
        <div className="flex space-x-2 mt-4">
          <Button 
            onClick={handleRetry}
            variant="outline" 
            size="sm"
            className="flex items-center space-x-2"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Thử lại</span>
          </Button>
          <Button 
            onClick={handleGoHome}
            size="sm"
          >
            Về trang chủ
          </Button>
        </div>
      </div>
    </div>
  );
}

// Global loading indicator for route transitions
function GlobalLoadingIndicator() {
  const navigation = useNavigation();
  
  if (navigation.state === 'loading') {
    return (
      <div className="fixed top-0 left-0 right-0 z-50">
        <div className="h-1 bg-primary/20">
          <div className="h-full bg-primary animate-pulse w-1/3" />
        </div>
      </div>
    );
  }
  
  return null;
}

// Layout wrapper with global loading and error handling
function RootLayoutWrapper() {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  
  // Public routes that don't require authentication
  const publicRoutes: string[] = [
    ROUTES.AUTH.LOGIN,
    ROUTES.AUTH.SIGNUP,
    ROUTES.AUTH.VERIFY_OTP,
    ROUTES.AUTH.FORGOT_PASSWORD,
    ROUTES.AUTH.RESET_PASSWORD,
  ];
  
  // Check if it's a public tracking route (supports legacy hyphen + new nested path)
  const isTrackingRoute =
    location.pathname.startsWith('/complaint-tracking/') ||
    location.pathname.startsWith('/warranty-tracking/') ||
    location.pathname.startsWith('/warranty/tracking/');
  
  const isPublicRoute = publicRoutes.includes(location.pathname) || isTrackingRoute;
  
  // Redirect to login if not authenticated and trying to access protected route
  if (!isAuthenticated && !isPublicRoute) {
    return <Navigate to={ROUTES.AUTH.LOGIN} state={{ from: location.pathname }} replace />;
  }
  
  // Redirect to dashboard if authenticated and trying to access auth pages (but NOT tracking pages)
  if (isAuthenticated && publicRoutes.includes(location.pathname)) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }
  
  return (
    <>
      <GlobalLoadingIndicator />
      {/* Render public pages without MainLayout */}
      {isPublicRoute ? <Outlet /> : <MainLayout />}
    </>
  );
}

// Wrapper to provide PageHeaderProvider inside Router context
function RouterWithProviders() {
  return (
    <PageHeaderProvider>
      <RootLayoutWrapper />
    </PageHeaderProvider>
  );
}

// Transform route definitions to React Router format
function transformRoutes(routes: typeof routeDefinitions): any[] {
  return routes.map(route => {
    const routeConfig: any = {
      path: route.path,
      errorElement: <RouteErrorBoundary />,
    };
    
    // Handle element
    if (route.element) {
      const Component = route.element;
      routeConfig.element = (
        <React.Suspense fallback={<RouteLoadingFallback />}>
          <Component />
        </React.Suspense>
      );
    }
    
    // Handle children
    if (route.children && route.children.length > 0) {
      routeConfig.children = transformRoutes(route.children);
    }
    
    // Handle loader
    if (route.loader) {
      routeConfig.loader = route.loader;
    }
    
    // Handle action
    if (route.action) {
      routeConfig.action = route.action;
    }
    
    return routeConfig;
  });
}

// Create the router - wrapped in function for HMR support
function createAppRouter() {
  return createBrowserRouter([
    {
      path: '/',
      element: <RouterWithProviders />,
      errorElement: <RouteErrorBoundary />,
      children: transformRoutes(routeDefinitions)
    }
  ]);
}

// Initialize router at module level - will be recreated on HMR
let router = createAppRouter();

// HMR support - recreate router when module reloads
// @ts-ignore - Vite HMR API
if (import.meta.hot) {
  // @ts-ignore
  import.meta.hot.accept(() => {
    router = createAppRouter();
  });
}

// Router Provider Component
interface RouterProviderProps {
  children?: React.ReactNode;
}

export function RouterProvider({ children }: RouterProviderProps) {
  // Add route change analytics/tracking here if needed
  React.useEffect(() => {
    // Track route changes for analytics
    const handleRouteChange = () => {
      // gtag('config', 'GA_TRACKING_ID', {
      //   page_path: window.location.pathname,
      // });
    };
    
    // You can add route change listeners here
    // router.subscribe(handleRouteChange);
    
    return () => {
      // Cleanup listeners
    };
  }, []);
  
  return (
    <ReactRouterProvider router={router} />
  );
}

// Hook to get current route metadata
export function useRouteMetadata() {
  const [routeMeta, setRouteMeta] = React.useState<any>(null);
  
  React.useEffect(() => {
    // Find current route metadata based on pathname
    const pathname = window.location.pathname;
    
    const findRouteMetadata = (routes: typeof routeDefinitions, path: string): any => {
      for (const route of routes) {
        if (route.path === path && route.meta) {
          return route.meta;
        }
        if (route.children) {
          const childMeta = findRouteMetadata(route.children, path);
          if (childMeta) return childMeta;
        }
      }
      return null;
    };
    
    const meta = findRouteMetadata(routeDefinitions, pathname);
    setRouteMeta(meta);
  }, []);
  
  return routeMeta;
}

// Export router factory for testing or direct access
export { createAppRouter };
