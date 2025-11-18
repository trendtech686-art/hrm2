import * as React from 'react';

export function PlaceholderPage() {
  return (
    <div className="flex h-full items-center justify-center rounded-lg border border-dashed shadow-sm">
      <div className="flex flex-col items-center gap-1 text-center">
        <h3 className="text-2xl font-bold tracking-tight text-muted-foreground">
          Chức năng đang phát triển
        </h3>
        <p className="text-sm text-muted-foreground">
          Tính năng này sẽ sớm được ra mắt. Vui lòng quay lại sau.
        </p>
      </div>
    </div>
  );
}
