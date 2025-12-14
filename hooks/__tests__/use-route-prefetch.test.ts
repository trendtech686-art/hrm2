import { describe, it, expect } from 'vitest';
import { routeImportMap } from '../use-route-prefetch';

describe('routeImportMap', () => {
  it('imports every registered route module', async () => {
    const failed: string[] = [];

    for (const [route, loader] of Object.entries(routeImportMap)) {
      try {
        await loader();
      } catch (error) {
        console.error(`[routeImportMap] Import failed for ${route}`, error);
        failed.push(route);
      }
    }

    expect(failed).toEqual([]);
  }, 60000);
});
