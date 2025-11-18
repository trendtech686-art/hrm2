import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserAccount, AccountActivity } from './user-account-types';

interface UserAccountState {
  accounts: UserAccount[];
  activities: AccountActivity[];
  
  // Account CRUD
  createAccount: (account: Omit<UserAccount, 'systemId' | 'createdAt' | 'isLocked' | 'lastPasswordChange'>) => UserAccount;
  updateAccount: (systemId: string, updates: Partial<UserAccount>) => void;
  deleteAccount: (systemId: string) => void;
  findByEmployeeId: (employeeId: string) => UserAccount | undefined;
  findByEmail: (email: string) => UserAccount | undefined;
  
  // Account actions
  resetPassword: (systemId: string, performedBy: string, performedByName: string) => void;
  changeRole: (systemId: string, newRole: UserAccount['role'], performedBy: string, performedByName: string) => void;
  lockAccount: (systemId: string, reason: string, performedBy: string, performedByName: string) => void;
  unlockAccount: (systemId: string, performedBy: string, performedByName: string) => void;
  updateLastLogin: (systemId: string) => void;
  
  // Activity log
  addActivity: (activity: Omit<AccountActivity, 'id' | 'timestamp'>) => void;
  getActivitiesForEmployee: (employeeId: string) => AccountActivity[];
}

let accountCounter = 1;
let activityCounter = 1;

export const useUserAccountStore = create<UserAccountState>()(
  persist(
    (set, get) => ({
      accounts: [
        // Mock accounts matching existing employees
        {
          systemId: 'USER00000001',
          employeeId: 'NV00000001',
          email: 'an.nguyen@example.com',
          role: 'admin',
          status: 'active',
          createdAt: '2024-01-15T08:00:00Z',
          createdBy: 'SYSTEM',
          lastLogin: '2025-10-26T09:30:00Z',
          lastPasswordChange: '2024-01-15T08:00:00Z',
          isLocked: false,
          verified: true,
        },
        {
          systemId: 'USER00000002',
          employeeId: 'NV00000002',
          email: 'binh.tran@example.com',
          role: 'user',
          status: 'active',
          createdAt: '2024-02-01T08:00:00Z',
          createdBy: 'USER00000001',
          lastLogin: '2025-10-25T14:20:00Z',
          lastPasswordChange: '2024-02-01T08:00:00Z',
          isLocked: false,
          verified: true,
        },
      ],
      activities: [],
      
      createAccount: (accountData) => {
        const newAccount: UserAccount = {
          ...accountData,
          systemId: `USER${String(accountCounter++).padStart(8, '0')}`,
          createdAt: new Date().toISOString(),
          lastPasswordChange: new Date().toISOString(),
          isLocked: false,
          verified: false,
        };
        
        set(state => ({
          accounts: [...state.accounts, newAccount],
        }));
        
        // Log activity
        get().addActivity({
          accountId: newAccount.systemId,
          employeeId: newAccount.employeeId,
          action: 'account_created',
          performedBy: accountData.createdBy,
          performedByName: accountData.createdBy,
          details: `Tạo tài khoản với vai trò ${accountData.role}`,
        });
        
        return newAccount;
      },
      
      updateAccount: (systemId, updates) => {
        set(state => ({
          accounts: state.accounts.map(acc =>
            acc.systemId === systemId ? { ...acc, ...updates } : acc
          ),
        }));
      },
      
      deleteAccount: (systemId) => {
        set(state => ({
          accounts: state.accounts.filter(acc => acc.systemId !== systemId),
        }));
      },
      
      findByEmployeeId: (employeeId) => {
        return get().accounts.find(acc => acc.employeeId === employeeId);
      },
      
      findByEmail: (email) => {
        return get().accounts.find(acc => acc.email.toLowerCase() === email.toLowerCase());
      },
      
      resetPassword: (systemId, performedBy, performedByName) => {
        const now = new Date().toISOString();
        set(state => ({
          accounts: state.accounts.map(acc =>
            acc.systemId === systemId
              ? { ...acc, lastPasswordChange: now, passwordChangedBy: performedBy }
              : acc
          ),
        }));
        
        const account = get().accounts.find(acc => acc.systemId === systemId);
        if (account) {
          get().addActivity({
            accountId: systemId,
            employeeId: account.employeeId,
            action: 'password_reset',
            performedBy,
            performedByName,
            details: 'Admin đặt lại mật khẩu',
          });
        }
      },
      
      changeRole: (systemId, newRole, performedBy, performedByName) => {
        const account = get().accounts.find(acc => acc.systemId === systemId);
        const oldRole = account?.role;
        
        set(state => ({
          accounts: state.accounts.map(acc =>
            acc.systemId === systemId ? { ...acc, role: newRole } : acc
          ),
        }));
        
        if (account) {
          get().addActivity({
            accountId: systemId,
            employeeId: account.employeeId,
            action: 'role_changed',
            performedBy,
            performedByName,
            oldValue: oldRole,
            newValue: newRole,
            details: `Đổi vai trò từ ${oldRole} sang ${newRole}`,
          });
        }
      },
      
      lockAccount: (systemId, reason, performedBy, performedByName) => {
        const now = new Date().toISOString();
        set(state => ({
          accounts: state.accounts.map(acc =>
            acc.systemId === systemId
              ? { ...acc, isLocked: true, lockedAt: now, lockedBy: performedBy, lockedReason: reason, status: 'locked' as const }
              : acc
          ),
        }));
        
        const account = get().accounts.find(acc => acc.systemId === systemId);
        if (account) {
          get().addActivity({
            accountId: systemId,
            employeeId: account.employeeId,
            action: 'account_locked',
            performedBy,
            performedByName,
            details: `Khóa tài khoản: ${reason}`,
          });
        }
      },
      
      unlockAccount: (systemId, performedBy, performedByName) => {
        set(state => ({
          accounts: state.accounts.map(acc =>
            acc.systemId === systemId
              ? { ...acc, isLocked: false, lockedAt: undefined, lockedBy: undefined, lockedReason: undefined, status: 'active' as const }
              : acc
          ),
        }));
        
        const account = get().accounts.find(acc => acc.systemId === systemId);
        if (account) {
          get().addActivity({
            accountId: systemId,
            employeeId: account.employeeId,
            action: 'account_unlocked',
            performedBy,
            performedByName,
            details: 'Mở khóa tài khoản',
          });
        }
      },
      
      updateLastLogin: (systemId) => {
        set(state => ({
          accounts: state.accounts.map(acc =>
            acc.systemId === systemId
              ? { ...acc, lastLogin: new Date().toISOString() }
              : acc
          ),
        }));
      },
      
      addActivity: (activityData) => {
        const newActivity: AccountActivity = {
          ...activityData,
          id: `ACT${String(activityCounter++).padStart(8, '0')}`,
          timestamp: new Date().toISOString(),
        };
        
        set(state => ({
          activities: [newActivity, ...state.activities],
        }));
      },
      
      getActivitiesForEmployee: (employeeId) => {
        return get().activities.filter(act => act.employeeId === employeeId);
      },
    }),
    {
      name: 'user-accounts-storage',
    }
  )
);
