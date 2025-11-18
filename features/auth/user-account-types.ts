/**
 * User Account Management Types
 * For admin to manage employee login accounts
 */

export type UserRole = 'admin' | 'user' | 'manager';
export type AccountStatus = 'active' | 'inactive' | 'locked';

export interface UserAccount {
  systemId: string; // User account ID (e.g., "USER001")
  employeeSystemId: string; // Link to Employee.systemId
  email: string; // Login email (usually employee's workEmail)
  role: UserRole;
  status: AccountStatus;
  createdAt: string;
  createdBy: string; // Admin who created
  lastLogin?: string;
  lastPasswordChange?: string;
  passwordChangedBy?: string; // Admin who changed password
  isLocked: boolean;
  lockedAt?: string;
  lockedBy?: string; // Admin who locked
  lockedReason?: string;
  verified: boolean;
}

export interface AccountActivity {
  id: string;
  accountSystemId: string; // Link to UserAccount.systemId
  employeeSystemId: string; // Link to Employee.systemId
  action: 'account_created' | 'password_reset' | 'role_changed' | 'account_locked' | 'account_unlocked' | 'status_changed';
  performedBy: string; // Admin systemId
  performedByName: string; // Admin name
  timestamp: string;
  details?: string; // Additional info
  oldValue?: string;
  newValue?: string;
}
