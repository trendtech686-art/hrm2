import * as React from 'react';
import { Badge } from '../../../components/ui/badge.tsx';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../../components/ui/tooltip.tsx';
import { AlertTriangle, AlertCircle, PackageX, TrendingUp } from 'lucide-react';
import type { Product } from '../types.ts';
import { getProductStockAlerts, STOCK_ALERT_CONFIG, type StockAlert, type StockAlertType } from '../stock-alert-utils.ts';

const AlertIcon = ({ type }: { type: StockAlertType }) => {
  switch (type) {
    case 'out_of_stock':
      return <PackageX className="h-3.5 w-3.5" />;
    case 'low_stock':
    case 'below_safety':
      return <AlertTriangle className="h-3.5 w-3.5" />;
    case 'over_stock':
      return <TrendingUp className="h-3.5 w-3.5" />;
    default:
      return <AlertCircle className="h-3.5 w-3.5" />;
  }
};

type StockAlertBadgesProps = {
  product: Product;
  showDescription?: boolean;
  className?: string;
};

/**
 * Display stock alert badges for a product
 * Shows badges for: out of stock, low stock, below safety, over stock
 */
export function StockAlertBadges({ product, showDescription = false, className }: StockAlertBadgesProps) {
  const alerts = React.useMemo(() => getProductStockAlerts(product), [product]);
  
  if (alerts.length === 0) return null;
  
  return (
    <div className={`flex flex-wrap gap-1.5 ${className || ''}`}>
      <TooltipProvider>
        {alerts.map((alert, index) => {
          const config = STOCK_ALERT_CONFIG[alert.type];
          
          return (
            <Tooltip key={`${alert.type}-${index}`}>
              <TooltipTrigger asChild>
                <Badge 
                  variant={config.badgeVariant}
                  className="gap-1 cursor-help"
                >
                  <AlertIcon type={alert.type} />
                  {config.label}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>{alert.description}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </TooltipProvider>
      
      {showDescription && alerts.length > 0 && (
        <div className="w-full mt-1 text-body-sm text-muted-foreground">
          {alerts.map((alert, i) => (
            <p key={i}>• {alert.description}</p>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Compact version - just show the most critical alert
 */
export function StockAlertBadge({ product, className }: { product: Product; className?: string }) {
  const alerts = React.useMemo(() => getProductStockAlerts(product), [product]);
  
  if (alerts.length === 0) return null;
  
  // Show most critical alert
  const alert = alerts[0]; // Already sorted by severity in getProductStockAlerts
  const config = STOCK_ALERT_CONFIG[alert.type];
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge 
            variant={config.badgeVariant}
            className={`gap-1 cursor-help ${className || ''}`}
          >
            <AlertIcon type={alert.type} />
            {config.label}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          {alerts.length === 1 ? (
            <p>{alert.description}</p>
          ) : (
            <div>
              {alerts.map((a, i) => (
                <p key={i}>• {a.description}</p>
              ))}
            </div>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
