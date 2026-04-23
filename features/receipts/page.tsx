'use client'

/**
 * ReceiptsPage - Thin wrapper for receipts list
 * Main content extracted to components/receipts-content.tsx
 * 
 * @see Thin Page Pattern - page.tsx < 100 lines
 */

import * as React from "react";
import { useRouter } from 'next/navigation';
import { usePageHeader } from "@/contexts/page-header-context";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ROUTES } from "@/lib/router";
import { ReceiptsContent } from "./components/receipts-content";
import type { ReceiptStats } from "./hooks/use-receipts";
import { useAuth } from "@/contexts/auth-context";

// Props from Server Component
export interface ReceiptsPageProps {
  initialStats?: ReceiptStats;
}

export function ReceiptsPage({ initialStats }: ReceiptsPageProps = {}) {
  // Permission checks
  const { can } = useAuth();
  const canCreate = can('create_receipts');
  const router = useRouter();

  // Header Actions
  const headerActions = React.useMemo(() => [
    canCreate && <Button
      key="add"
      size="sm"
      onClick={() => router.push(ROUTES.FINANCE.RECEIPT_NEW)}
    >
      <Plus className="mr-2 h-4 w-4" />
      Tạo phiếu thu
    </Button>
  ], [router, canCreate]);

  usePageHeader({
    title: 'Danh sách phiếu thu',
    breadcrumb: [
      { label: 'Trang chủ', href: '/', isCurrent: false },
      { label: 'Phiếu thu', href: ROUTES.FINANCE.RECEIPTS, isCurrent: true }
    ],
    actions: headerActions,
    showBackButton: false
  });

  return <ReceiptsContent initialStats={initialStats} />;
}
