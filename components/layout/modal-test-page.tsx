import * as React from 'react';
import { ModalContextDemo } from './modal-context-demo';

export function TestPage() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Modal Context Test Page</h1>
      
      <div className="grid gap-6">
        <ModalContextDemo />
      </div>
    </div>
  );
}
