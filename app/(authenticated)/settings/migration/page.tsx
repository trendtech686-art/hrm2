'use client';

import React from 'react';
import { DataMigrationTool } from '@/components/settings/data-migration-tool';

export default function DataMigrationPage() {
  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Data Migration: localStorage → PostgreSQL
      </h1>
      <DataMigrationTool />
    </div>
  );
}
