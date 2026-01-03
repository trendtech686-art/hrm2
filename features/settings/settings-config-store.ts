import { create } from 'zustand';

export type SettingsConfigStoreState<TState> = {
  data: TState;
  setSection: <K extends keyof TState>(
    key: K,
    value: TState[K] | ((previous: TState[K]) => TState[K])
  ) => void;
  setData: (updater: (previous: TState) => TState) => void;
  resetSection: <K extends keyof TState>(key: K) => void;
  resetAll: () => void;
};

export type SettingsConfigStore<TState> = ReturnType<typeof createSettingsConfigStore<TState>>;

interface SettingsConfigStoreOptions<TState> {
  storageKey: string;
  getDefaultState: () => TState;
}

export function createSettingsConfigStore<TState>({
  storageKey: _storageKey,
  getDefaultState,
}: SettingsConfigStoreOptions<TState>) {
  return create<SettingsConfigStoreState<TState>>()(
      (set, get) => ({
        data: getDefaultState(),
        setSection: (key, value) => {
          const current = get().data;
          const nextValue =
            typeof value === 'function'
              ? (value as (previous: TState[typeof key]) => TState[typeof key])(current[key])
              : value;

          set({
            data: {
              ...current,
              [key]: nextValue,
            },
          });
        },
        setData: (updater) => set({ data: updater(get().data) }),
        resetSection: (key) => {
          const defaults = getDefaultState();
          set({
            data: {
              ...get().data,
              [key]: defaults[key],
            },
          });
        },
        resetAll: () => set({ data: getDefaultState() }),
      })
  );
}
