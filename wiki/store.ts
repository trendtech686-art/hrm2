import { createCrudStore } from '../lib/store-factory';
import type { WikiArticle } from './types';

const initialData: WikiArticle[] = [];

const baseStore = createCrudStore<WikiArticle>(initialData, 'wiki');

export const useWikiStore = baseStore;
