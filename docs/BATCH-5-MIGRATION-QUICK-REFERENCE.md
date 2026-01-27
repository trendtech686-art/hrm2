# BATCH 5 COMPONENT MIGRATION QUICK REFERENCE

Quick guide for migrating components from Zustand to React Query.

---

## 🎯 TRENDTECH COMPONENTS CHEAT SHEET

### Import Statement
```typescript
// ❌ OLD
import { useTrendtechSettingsStore } from '../store';

// ✅ NEW
import { 
  useTrendtechSettings,
  useTrendtechConfigMutations,
  useTrendtechCategoryMutations,
  useTrendtechBrandMutations,
  useTrendtechPriceMappingMutations,
  useTrendtechCategoryMappingMutations,
  useTrendtechBrandMappingMutations,
  useTrendtechSyncSettingsMutations,
  useTrendtechLogMutations,
  useTrendtechGetters
} from '../hooks/use-trendtech-settings';
```

### Component Hook Usage

#### Reading Settings
```typescript
// ❌ OLD
const { settings } = useTrendtechSettingsStore();

// ✅ NEW
const { data: settings } = useTrendtechSettings();
```

#### Config Mutations
```typescript
// ❌ OLD
const { setApiUrl, setApiKey, setEnabled } = useTrendtechSettingsStore();

// ✅ NEW
const { setApiUrl, setApiKey, setEnabled } = useTrendtechConfigMutations({
  onSuccess: () => toast.success('Updated successfully')
});

// Usage
setApiUrl.mutate('https://api.example.com');
```

#### Category Operations
```typescript
// ❌ OLD
const { addCategory, updateCategory, deleteCategory } = useTrendtechSettingsStore();

// ✅ NEW
const { addCategory, updateCategory, deleteCategory } = useTrendtechCategoryMutations();

// Usage
addCategory.mutate(newCategory);
updateCategory.mutate({ id: 1, updates: { name: 'New Name' } });
deleteCategory.mutate(categoryId);
```

#### Price Mapping
```typescript
// ❌ OLD
const { updatePriceMapping } = useTrendtechSettingsStore();
updatePriceMapping('price', policyId);

// ✅ NEW
const { updatePriceMapping } = useTrendtechPriceMappingMutations();
updatePriceMapping.mutate({ field: 'price', policyId });
```

#### Getters
```typescript
// ❌ OLD
const store = useTrendtechSettingsStore.getState();
const catId = store.getTrendtechCatIdByHrmCategory(hrmCategoryId);

// ✅ NEW
const { getTrendtechCatIdByHrmCategory } = useTrendtechGetters();
const catId = getTrendtechCatIdByHrmCategory(hrmCategoryId);
```

#### Loading States
```typescript
// ✅ NEW - Automatically available
const { data: settings, isLoading, isError, error } = useTrendtechSettings();

if (isLoading) return <div>Loading...</div>;
if (isError) return <div>Error: {error.message}</div>;
```

---

## 🎯 PKGX COMPONENTS CHEAT SHEET

### Import Statement
```typescript
// ❌ OLD
import { usePkgxSettingsStore } from '../store';

// ✅ NEW
import { 
  usePkgxSettings,
  usePkgxConfigMutations,
  usePkgxCategoryMutations,
  usePkgxBrandMutations,
  usePkgxPriceMappingMutations,
  usePkgxCategoryMappingMutations,
  usePkgxBrandMappingMutations,
  usePkgxSyncSettingsMutations,
  usePkgxLogMutations,
  usePkgxGetters
} from '../hooks/use-pkgx-settings';
```

### Component Hook Usage

#### Reading Settings
```typescript
// ❌ OLD
const { settings } = usePkgxSettingsStore();

// ✅ NEW
const { data: settings } = usePkgxSettings();
```

#### Config & Mutations
Same pattern as Trendtech, just replace "Trendtech" with "Pkgx":
```typescript
const { setApiUrl, setApiKey } = usePkgxConfigMutations();
const { updatePriceMapping } = usePkgxPriceMappingMutations();
const { addCategory } = usePkgxCategoryMutations();
```

---

## 🔧 SERVICE LAYER CALLS

### Trendtech API Calls
```typescript
// ❌ OLD
import { getCategories } from '@/lib/trendtech/api-service';
const result = await getCategories();

// ✅ NEW
import { getCategories } from '@/lib/trendtech/api-service';
import { useTrendtechSettings } from '../hooks/use-trendtech-settings';

const { data: settings } = useTrendtechSettings();
const handleSync = async () => {
  if (!settings) return;
  const result = await getCategories(settings);
};
```

### PKGX API Calls
```typescript
// ❌ OLD
import { syncProducts } from '@/lib/pkgx/api-service';
const result = await syncProducts();

// ✅ NEW
import { syncProducts } from '@/lib/pkgx/api-service';
import { usePkgxSettings } from '../hooks/use-pkgx-settings';

const { data: settings } = usePkgxSettings();
if (settings) {
  const result = await syncProducts(settings);
}
```

---

## 🔧 MAPPING FUNCTIONS

### Trendtech Mapping
```typescript
// ❌ OLD
import { mapHrmToTrendtechPayload } from '@/lib/trendtech/mapping-service';
const payload = mapHrmToTrendtechPayload(product);

// ✅ NEW
import { mapHrmToTrendtechPayload } from '@/lib/trendtech/mapping-service';
import { useTrendtechSettings } from '../hooks/use-trendtech-settings';

const { data: settings } = useTrendtechSettings();
if (settings) {
  const payload = mapHrmToTrendtechPayload(settings, product);
}
```

### PKGX Mapping
```typescript
// ❌ OLD
import { mapHrmToPkgxPayload } from '@/lib/pkgx/mapping-service';
const payload = mapHrmToPkgxPayload(product);

// ✅ NEW
import { mapHrmToPkgxPayload } from '@/lib/pkgx/mapping-service';
import { usePkgxSettings } from '../hooks/use-pkgx-settings';

const { data: settings } = usePkgxSettings();
if (settings) {
  const payload = mapHrmToPkgxPayload(settings, product);
}
```

---

## 📋 COMMON PATTERNS

### Pattern 1: Simple Read
```typescript
// Component that only reads settings
const { data: settings } = useTrendtechSettings();
const isEnabled = settings?.enabled ?? false;
```

### Pattern 2: Read + Single Mutation
```typescript
const { data: settings } = useTrendtechSettings();
const { setEnabled } = useTrendtechConfigMutations();

const handleToggle = () => {
  setEnabled.mutate(!settings?.enabled);
};
```

### Pattern 3: Read + Multiple Mutations
```typescript
const { data: settings } = useTrendtechSettings();
const { updateCategory } = useTrendtechCategoryMutations();
const { addLog } = useTrendtechLogMutations();

const handleUpdate = async (id: number, updates: any) => {
  updateCategory.mutate({ id, updates });
  addLog.mutate({
    action: 'update_category',
    status: 'success',
    message: 'Category updated'
  });
};
```

### Pattern 4: Read + Service Call
```typescript
const { data: settings } = useTrendtechSettings();
const { addLog } = useTrendtechLogMutations();

const handleSync = async () => {
  if (!settings) return;
  
  try {
    const result = await getCategories(settings);
    addLog.mutate({
      action: 'sync_categories',
      status: 'success',
      message: `Synced ${result.data?.length ?? 0} categories`
    });
  } catch (error) {
    addLog.mutate({
      action: 'sync_categories',
      status: 'error',
      message: error.message
    });
  }
};
```

### Pattern 5: Conditional Rendering
```typescript
const { data: settings, isLoading } = useTrendtechSettings();

if (isLoading) return <Skeleton />;
if (!settings) return <div>No settings found</div>;

return <div>{settings.apiUrl}</div>;
```

---

## 🚨 COMMON MISTAKES TO AVOID

### ❌ Don't call mutations directly
```typescript
// WRONG
updatePriceMapping('price', policyId);

// RIGHT
updatePriceMapping.mutate({ field: 'price', policyId });
```

### ❌ Don't forget to check settings existence
```typescript
// WRONG
const result = await getCategories(settings);

// RIGHT
if (settings) {
  const result = await getCategories(settings);
}
```

### ❌ Don't use .getState()
```typescript
// WRONG
const store = useTrendtechSettingsStore.getState();

// RIGHT
const { data: settings } = useTrendtechSettings();
```

### ❌ Don't forget mutation callbacks
```typescript
// WRONG (no feedback)
const { updateCategory } = useTrendtechCategoryMutations();

// RIGHT (with feedback)
const { updateCategory } = useTrendtechCategoryMutations({
  onSuccess: () => toast.success('Updated!')
});
```

---

## 📚 COMPLETE EXAMPLE

Here's a complete before/after example:

### ❌ BEFORE (Zustand)
```typescript
import { useTrendtechSettingsStore } from '../store';
import { getCategories } from '@/lib/trendtech/api-service';
import { toast } from 'sonner';

export function CategoryTab() {
  const { 
    settings, 
    setCategories, 
    addLog 
  } = useTrendtechSettingsStore();

  const handleSync = async () => {
    try {
      const result = await getCategories();
      if (result.success && result.data) {
        setCategories(result.data.categories);
        addLog({
          action: 'sync_categories',
          status: 'success',
          message: `Synced ${result.data.categories.length} categories`
        });
        toast.success('Synced successfully');
      }
    } catch (error) {
      toast.error('Sync failed');
    }
  };

  return (
    <div>
      <button onClick={handleSync}>Sync</button>
      <div>{settings.categories.length} categories</div>
    </div>
  );
}
```

### ✅ AFTER (React Query)
```typescript
import { 
  useTrendtechSettings,
  useTrendtechCategoryMutations,
  useTrendtechLogMutations
} from '../hooks/use-trendtech-settings';
import { getCategories } from '@/lib/trendtech/api-service';
import { toast } from 'sonner';

export function CategoryTab() {
  const { data: settings } = useTrendtechSettings();
  const { setCategories } = useTrendtechCategoryMutations({
    onSuccess: () => toast.success('Synced successfully')
  });
  const { addLog } = useTrendtechLogMutations();

  const handleSync = async () => {
    if (!settings) return;
    
    try {
      const result = await getCategories(settings);
      if (result.success && result.data) {
        setCategories.mutate(result.data.categories);
        addLog.mutate({
          action: 'sync_categories',
          status: 'success',
          message: `Synced ${result.data.categories.length} categories`
        });
      }
    } catch (error) {
      toast.error('Sync failed');
      addLog.mutate({
        action: 'sync_categories',
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  if (!settings) return <div>Loading...</div>;

  return (
    <div>
      <button onClick={handleSync}>Sync</button>
      <div>{settings.categories.length} categories</div>
    </div>
  );
}
```

---

## 🎯 QUICK CHECKLIST

For each component migration, check:

- [ ] Import statements updated
- [ ] `useTrendtechSettings()` or `usePkgxSettings()` added
- [ ] Mutation hooks added where needed
- [ ] `.mutate()` calls for all mutations
- [ ] Settings passed to service layer functions
- [ ] Settings passed to mapping functions
- [ ] Loading/error states handled
- [ ] No `.getState()` calls remaining
- [ ] Toast notifications working
- [ ] TypeScript errors resolved
- [ ] Component tested manually

---

## 📞 NEED HELP?

Refer to:
- Full documentation: `BATCH-5-ECOMMERCE-STORES-MIGRATION-REPORT.md`
- Final summary: `BATCH-5-FINAL-SUMMARY.md`
- Hook implementations: 
  - `features/settings/trendtech/hooks/use-trendtech-settings.ts`
  - `features/settings/pkgx/hooks/use-pkgx-settings.ts`

---

**Last Updated**: January 11, 2026  
**Status**: Ready for component migration
