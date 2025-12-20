import { afterEach, describe, expect, it } from 'vitest';
import { act, cleanup, render, screen } from '@testing-library/react';
import React from 'react';
import { useSalesManagementSettingsStore } from '../sales-management-store';

function Harness() {
  const printCopies = useSalesManagementSettingsStore((state) => state.printCopies);
  return <span data-testid="copies">{printCopies}</span>;
}

describe('sales management store', () => {
  afterEach(() => {
    cleanup();
    localStorage.clear();
  });

  it('updates and resets values without crashing', () => {
    render(<Harness />);

    act(() => {
      useSalesManagementSettingsStore.getState().updateSetting('printCopies', '3');
    });
    expect(screen.getByTestId('copies').textContent).toBe('3');

    act(() => {
      useSalesManagementSettingsStore.getState().reset();
    });
    expect(screen.getByTestId('copies').textContent).toBe('1');
  });
});
