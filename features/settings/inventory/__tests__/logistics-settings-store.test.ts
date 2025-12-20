import { beforeEach, describe, expect, it, vi } from 'vitest';

const STORE_PATH = '../logistics-settings-store.ts';

type LogisticsStoreModule = typeof import('../logistics-settings-store');

async function loadStore() {
  const mod: LogisticsStoreModule = await import(STORE_PATH);
  return mod.useProductLogisticsSettingsStore;
}

async function waitForHydration(store: Awaited<ReturnType<typeof loadStore>>) {
  if (store.persist.hasHydrated()) {
    return;
  }

  await new Promise<void>((resolve) => {
    const unsub = store.persist.onFinishHydration(() => {
      unsub();
      resolve();
    });
  });
}

beforeEach(async () => {
  vi.resetModules();
  localStorage.clear();
});

describe('useProductLogisticsSettingsStore persistence', () => {
  it('persists updates to localStorage and rehydrates on reload', async () => {
    const store = await loadStore();
    await waitForHydration(store);

    store.getState().update({
      physicalDefaults: {
        weight: 123,
        length: 40,
        width: 20,
        height: 10,
        weightUnit: 'kg',
      },
      comboDefaults: {
        weight: 999,
      },
    });

    const raw = localStorage.getItem('product-logistics-settings');
    expect(raw).toBeTruthy();
    const parsed = raw ? JSON.parse(raw) : null;
    expect(parsed?.state?.settings?.physicalDefaults?.weight).toBe(123);
    expect(parsed?.state?.settings?.physicalDefaults?.weightUnit).toBe('kg');

    vi.resetModules();
    const reloadedStore = await loadStore();
    await waitForHydration(reloadedStore);

    expect(reloadedStore.getState().settings.physicalDefaults.weight).toBe(123);
    expect(reloadedStore.getState().settings.physicalDefaults.weightUnit).toBe('kg');
    expect(reloadedStore.getState().settings.comboDefaults.weight).toBe(999);
  });

  it('save replaces the entire settings state', async () => {
    const store = await loadStore();
    await waitForHydration(store);

    store.getState().save({
      physicalDefaults: {
        weight: 10,
        weightUnit: 'kg',
        length: 1,
        width: 2,
        height: 3,
      },
      comboDefaults: {
        weight: 500,
        weightUnit: 'g',
        length: 4,
        width: 5,
        height: 6,
      },
    });

    const next = store.getState().settings;
    expect(next.physicalDefaults.weight).toBe(10);
    expect(next.comboDefaults.length).toBe(4);
  });
});
