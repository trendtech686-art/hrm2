import type { RegisterTabActions } from '../use-tab-action-registry';

export interface TabContentProps {
  isActive: boolean;
  onRegisterActions: RegisterTabActions;
}
