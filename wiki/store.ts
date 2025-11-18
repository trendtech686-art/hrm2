import { createCrudStore } from '../lib/store-factory.ts';
import type { WikiArticle } from './types.ts';

const initialData: WikiArticle[] = [];

const baseStore = createCrudStore<WikiArticle>(initialData, 'wiki');

export const useWikiStore = baseStore;
