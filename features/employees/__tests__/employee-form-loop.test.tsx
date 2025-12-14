import { describe, it } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import React from 'react';
import { EmployeeForm } from '../employee-form';

const noop = () => {};

describe('EmployeeForm render', () => {
  afterEach(() => {
    cleanup();
    localStorage.clear();
    sessionStorage.clear?.();
  });

  it('renders new employee form without crashing', () => {
    render(
      <EmployeeForm initialData={null} onSubmit={noop} onCancel={noop} />
    );
  });
});
