/**
 * localStorage to PostgreSQL Migration Script
 * 
 * This script migrates data from localStorage (Zustand persist) to PostgreSQL database.
 * Run this once for existing users who have data in localStorage.
 * 
 * Usage:
 * 1. Include this component in your app temporarily
 * 2. Click "Migrate Data" button
 * 3. Data will be synced to PostgreSQL
 * 4. Remove component after migration
 */

'use client';

import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, XCircle, Loader2, Database, Upload } from 'lucide-react';

interface MigrationStatus {
  store: string;
  status: 'pending' | 'migrating' | 'success' | 'error' | 'skipped';
  count: number;
  error?: string;
}

interface StorageConfig {
  localStorageKey: string;
  apiEndpoint: string;
  dataKey?: string; // Key to access data array in stored object
  mapFn?: (item: any) => any; // Transform function before sending to API
}

const STORAGE_CONFIGS: Record<string, StorageConfig> = {
  employees: {
    localStorageKey: 'employee-storage',
    apiEndpoint: '/api/employees',
    dataKey: 'state.data',
  },
  customers: {
    localStorageKey: 'customer-storage',
    apiEndpoint: '/api/customers',
    dataKey: 'state.data',
  },
  products: {
    localStorageKey: 'product-storage',
    apiEndpoint: '/api/products',
    dataKey: 'state.data',
  },
  orders: {
    localStorageKey: 'order-storage',
    apiEndpoint: '/api/orders',
    dataKey: 'state.data',
  },
  suppliers: {
    localStorageKey: 'supplier-storage',
    apiEndpoint: '/api/suppliers',
    dataKey: 'state.data',
  },
  warranties: {
    localStorageKey: 'warranty-tickets-storage',
    apiEndpoint: '/api/warranties',
    dataKey: 'state.data',
  },
  wiki: {
    localStorageKey: 'wiki-storage',
    apiEndpoint: '/api/wiki',
    dataKey: 'state.data',
  },
  branches: {
    localStorageKey: 'branch-storage',
    apiEndpoint: '/api/branches',
    dataKey: 'state.data',
  },
  departments: {
    localStorageKey: 'department-storage',
    apiEndpoint: '/api/departments',
    dataKey: 'state.data',
  },
  categories: {
    localStorageKey: 'category-storage',
    apiEndpoint: '/api/categories',
    dataKey: 'state.data',
  },
  brands: {
    localStorageKey: 'brand-storage',
    apiEndpoint: '/api/brands',
    dataKey: 'state.data',
  },
  complaints: {
    localStorageKey: 'complaint-storage',
    apiEndpoint: '/api/complaints',
    dataKey: 'state.data',
  },
  purchaseOrders: {
    localStorageKey: 'purchase-order-storage',
    apiEndpoint: '/api/purchase-orders',
    dataKey: 'state.data',
  },
};

function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((acc, key) => acc?.[key], obj);
}

async function migrateStore(config: StorageConfig): Promise<{ count: number; errors: string[] }> {
  const errors: string[] = [];
  let count = 0;

  try {
    // Get data from localStorage
    const stored = localStorage.getItem(config.localStorageKey);
    if (!stored) {
      return { count: 0, errors: [] };
    }

    const parsed = JSON.parse(stored);
    const data = config.dataKey ? getNestedValue(parsed, config.dataKey) : parsed;

    if (!Array.isArray(data) || data.length === 0) {
      return { count: 0, errors: [] };
    }

    // Migrate each item
    for (const item of data) {
      try {
        const payload = config.mapFn ? config.mapFn(item) : item;
        
        // Check if item already exists in database
        const checkResponse = await fetch(`${config.apiEndpoint}/${item.systemId}`);
        if (checkResponse.ok) {
          // Item exists, skip or update
          console.log(`[Migration] ${config.apiEndpoint}: ${item.systemId} already exists, skipping`);
          continue;
        }

        // Create new item
        const response = await fetch(config.apiEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errorText = await response.text();
          errors.push(`${item.systemId}: ${errorText}`);
        } else {
          count++;
        }
      } catch (itemError: any) {
        errors.push(`${item.systemId}: ${itemError.message}`);
      }
    }

    return { count, errors };
  } catch (error: any) {
    return { count: 0, errors: [error.message] };
  }
}

export function DataMigrationTool() {
  const [migrationStatus, setMigrationStatus] = useState<MigrationStatus[]>(
    Object.keys(STORAGE_CONFIGS).map(store => ({
      store,
      status: 'pending',
      count: 0,
    }))
  );
  const [isMigrating, setIsMigrating] = useState(false);
  const [progress, setProgress] = useState(0);

  const runMigration = useCallback(async () => {
    setIsMigrating(true);
    setProgress(0);

    const stores = Object.entries(STORAGE_CONFIGS);
    let completed = 0;

    for (const [storeName, config] of stores) {
      // Update status to migrating
      setMigrationStatus(prev =>
        prev.map(s => (s.store === storeName ? { ...s, status: 'migrating' } : s))
      );

      try {
        const result = await migrateStore(config);

        // Update status based on result
        setMigrationStatus(prev =>
          prev.map(s =>
            s.store === storeName
              ? {
                  ...s,
                  status: result.count > 0 ? 'success' : result.errors.length > 0 ? 'error' : 'skipped',
                  count: result.count,
                  error: result.errors.join('; '),
                }
              : s
          )
        );
      } catch (error: any) {
        setMigrationStatus(prev =>
          prev.map(s =>
            s.store === storeName
              ? { ...s, status: 'error', error: error.message }
              : s
          )
        );
      }

      completed++;
      setProgress((completed / stores.length) * 100);
    }

    setIsMigrating(false);
  }, []);

  const getTotalMigrated = () =>
    migrationStatus.reduce((sum, s) => sum + s.count, 0);

  const getStatusIcon = (status: MigrationStatus['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'migrating':
        return <Loader2 className="h-4 w-4 animate-spin" />;
      case 'skipped':
        return <span className="text-muted-foreground">-</span>;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: MigrationStatus['status']) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      success: 'default',
      error: 'destructive',
      migrating: 'secondary',
      skipped: 'outline',
      pending: 'outline',
    };
    return <Badge variant={variants[status] || 'outline'}>{status}</Badge>;
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Data Migration Tool
        </CardTitle>
        <CardDescription>
          Migrate data from localStorage to PostgreSQL database
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isMigrating && (
          <div className="space-y-2">
            <Progress value={progress} />
            <p className="text-sm text-muted-foreground text-center">
              Migrating... {Math.round(progress)}%
            </p>
          </div>
        )}

        <div className="space-y-2">
          {migrationStatus.map(status => (
            <div
              key={status.store}
              className="flex items-center justify-between p-2 rounded-lg border"
            >
              <div className="flex items-center gap-2">
                {getStatusIcon(status.status)}
                <span className="font-medium capitalize">{status.store}</span>
              </div>
              <div className="flex items-center gap-2">
                {status.count > 0 && (
                  <span className="text-sm text-muted-foreground">
                    {status.count} items
                  </span>
                )}
                {getStatusBadge(status.status)}
              </div>
            </div>
          ))}
        </div>

        {getTotalMigrated() > 0 && (
          <p className="text-center text-sm text-green-600">
            Total migrated: {getTotalMigrated()} items
          </p>
        )}

        <Button
          onClick={runMigration}
          disabled={isMigrating}
          className="w-full"
        >
          {isMigrating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Migrating...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Start Migration
            </>
          )}
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          This will migrate existing localStorage data to the PostgreSQL database.
          Existing records in database will be skipped.
        </p>
      </CardContent>
    </Card>
  );
}

export default DataMigrationTool;
