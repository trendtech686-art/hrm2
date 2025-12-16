import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { asSystemId, asBusinessId, type SystemId, type BusinessId } from '@/lib/id-types';
import type { Brand } from './types';

interface BrandState {
  data: Brand[];
  counter: number;
  add: (brand: Omit<Brand, 'systemId' | 'createdAt' | 'updatedAt'> & { id?: string }) => void;
  update: (systemId: SystemId, brand: Partial<Brand>) => void;
  remove: (systemId: SystemId) => void;
  getActive: () => Brand[];
  findById: (systemId: SystemId) => Brand | undefined;
  findByBusinessId: (id: BusinessId) => Brand | undefined;
  getNextId: () => BusinessId;
  isBusinessIdExists: (id: string) => boolean;
}

const generateSystemId = (currentCounter: number): SystemId => {
  return asSystemId(`BRAND${String(currentCounter + 1).padStart(6, '0')}`);
};

const generateBusinessId = (currentCounter: number): BusinessId => {
  return asBusinessId(`TH${String(currentCounter + 1).padStart(6, '0')}`);
};

// Sample brand data
const rawData = [
  {
    systemId: 'BRAND000001',
    id: 'HOCO',
    name: 'Hoco',
    description: 'Thương hiệu phụ kiện điện thoại cao cấp từ Hồng Kông',
    website: 'https://hoco.com.vn',
    logo: '',
    isActive: true,
    isDeleted: false,
    createdAt: '2024-01-15T08:00:00.000Z',
    updatedAt: '2024-01-15T08:00:00.000Z',
    websiteSeo: {
      pkgx: {
        seoTitle: 'Hoco - Phụ kiện điện thoại cao cấp Hồng Kông | Phụ Kiện Giá Xưởng',
        metaDescription: 'Mua phụ kiện Hoco chính hãng: sạc, cáp, tai nghe, ốp lưng điện thoại chất lượng cao. Bảo hành 12 tháng, giao hàng toàn quốc.',
        seoKeywords: 'hoco, phụ kiện hoco, sạc hoco, cáp hoco, tai nghe hoco',
        slug: 'hoco',
        shortDescription: 'Hoco - Thương hiệu phụ kiện điện thoại cao cấp từ Hồng Kông',
        longDescription: 'Hoco là thương hiệu phụ kiện điện thoại nổi tiếng đến từ Hồng Kông, chuyên cung cấp các sản phẩm chất lượng cao như sạc, cáp, tai nghe, ốp lưng với thiết kế sang trọng và độ bền vượt trội.',
      },
      trendtech: {
        seoTitle: 'Hoco - Phụ kiện điện thoại chính hãng | Trendtech',
        metaDescription: 'Khám phá bộ sưu tập phụ kiện Hoco tại Trendtech. Sản phẩm chính hãng, giá tốt nhất.',
        seoKeywords: 'hoco trendtech, phụ kiện hoco',
        slug: 'hoco',
      },
    },
  },
  {
    systemId: 'BRAND000002',
    id: 'BASEUS',
    name: 'Baseus',
    description: 'Thương hiệu phụ kiện công nghệ hàng đầu Trung Quốc',
    website: 'https://baseus.com',
    logo: '',
    isActive: true,
    isDeleted: false,
    createdAt: '2024-01-15T08:00:00.000Z',
    updatedAt: '2024-01-15T08:00:00.000Z',
    websiteSeo: {
      pkgx: {
        seoTitle: 'Baseus - Thương hiệu phụ kiện công nghệ #1 | Phụ Kiện Giá Xưởng',
        metaDescription: 'Phụ kiện Baseus chính hãng: sạc nhanh, cáp type-c, tai nghe bluetooth, pin dự phòng. Thiết kế đẹp, công nghệ tiên tiến. Freeship đơn từ 300k.',
        seoKeywords: 'baseus, phụ kiện baseus, sạc baseus, pin dự phòng baseus',
        slug: 'baseus',
        shortDescription: 'Baseus - Thương hiệu phụ kiện công nghệ hàng đầu từ Trung Quốc',
        longDescription: 'Baseus là thương hiệu phụ kiện công nghệ hàng đầu Trung Quốc với hơn 10 năm kinh nghiệm. Sản phẩm Baseus nổi tiếng với thiết kế hiện đại, công nghệ sạc nhanh tiên tiến và chất lượng vượt trội.',
      },
      trendtech: {
        seoTitle: 'Baseus Việt Nam - Phụ kiện công nghệ cao cấp | Trendtech',
        metaDescription: 'Mua phụ kiện Baseus chính hãng tại Trendtech. Đa dạng sản phẩm, giá cạnh tranh.',
        seoKeywords: 'baseus vietnam, baseus trendtech',
        slug: 'baseus',
      },
    },
  },
  {
    systemId: 'BRAND000003',
    id: 'REMAX',
    name: 'Remax',
    description: 'Thương hiệu phụ kiện di động phổ biến',
    website: 'https://remax.com',
    logo: '',
    isActive: true,
    isDeleted: false,
    createdAt: '2024-01-15T08:00:00.000Z',
    updatedAt: '2024-01-15T08:00:00.000Z',
    websiteSeo: {
      pkgx: {
        seoTitle: 'Remax - Phụ kiện di động giá tốt | Phụ Kiện Giá Xưởng',
        metaDescription: 'Phụ kiện Remax chính hãng giá rẻ: cáp sạc, tai nghe, loa bluetooth, giá đỡ điện thoại. Bảo hành 6 tháng.',
        seoKeywords: 'remax, phụ kiện remax, cáp remax, tai nghe remax',
        slug: 'remax',
      },
    },
  },
  {
    systemId: 'BRAND000004',
    id: 'BOROFONE',
    name: 'Borofone',
    description: 'Thương hiệu phụ kiện điện tử từ châu Âu',
    website: 'https://borofone.com',
    logo: '',
    isActive: true,
    isDeleted: false,
    createdAt: '2024-01-15T08:00:00.000Z',
    updatedAt: '2024-01-15T08:00:00.000Z',
    websiteSeo: {
      pkgx: {
        seoTitle: 'Borofone - Phụ kiện điện tử châu Âu | Phụ Kiện Giá Xưởng',
        metaDescription: 'Phụ kiện Borofone thiết kế châu Âu: sạc, cáp, tai nghe cao cấp. Chất lượng đảm bảo, bảo hành chính hãng.',
        seoKeywords: 'borofone, phụ kiện borofone, sạc borofone',
        slug: 'borofone',
        shortDescription: 'Borofone - Phụ kiện điện tử phong cách châu Âu',
      },
    },
  },
  {
    systemId: 'BRAND000005',
    id: 'WEKOME',
    name: 'WK Wekome',
    description: 'Thương hiệu phụ kiện thời trang cho giới trẻ',
    website: 'https://wekome.com',
    logo: '',
    isActive: true,
    isDeleted: false,
    createdAt: '2024-01-15T08:00:00.000Z',
    updatedAt: '2024-01-15T08:00:00.000Z',
  },
  {
    systemId: 'BRAND000006',
    id: 'MAXITECH',
    name: 'Maxitech',
    description: 'Thương hiệu phụ kiện công nghệ Việt Nam',
    website: 'https://maxitech.vn',
    logo: '',
    isActive: true,
    isDeleted: false,
    createdAt: '2024-01-15T08:00:00.000Z',
    updatedAt: '2024-01-15T08:00:00.000Z',
  },
] as const;

const initialData: Brand[] = rawData.map((item) => ({
  ...item,
  systemId: asSystemId(item.systemId),
  id: asBusinessId(item.id),
}));

const INITIAL_COUNTER = rawData.length;

export const useBrandStore = create<BrandState>()(
  persist(
    (set, get) => ({
      data: initialData,
      counter: INITIAL_COUNTER,
      
      add: (brand) => {
        const currentCounter = get().counter;
        const { id, ...rest } = brand;
        const businessId = id && id.trim() 
          ? asBusinessId(id.trim())
          : generateBusinessId(currentCounter);
          
        set((state) => ({
          data: [
            ...state.data,
            {
              ...rest,
              systemId: generateSystemId(currentCounter),
              id: businessId,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              isActive: brand.isActive ?? true,
              isDeleted: false,
            },
          ],
          counter: state.counter + 1,
        }));
      },
      
      update: (systemId, brand) => set((state) => ({
        data: state.data.map((item) =>
          item.systemId === systemId
            ? { ...item, ...brand, updatedAt: new Date().toISOString() }
            : item
        ),
      })),
      
      remove: (systemId) => set((state) => ({
        data: state.data.map((item) =>
          item.systemId === systemId
            ? { ...item, isDeleted: true, updatedAt: new Date().toISOString() }
            : item
        ),
      })),
      
      getActive: () => get().data.filter((item) => !item.isDeleted && item.isActive),
      
      findById: (systemId) => get().data.find((item) => item.systemId === systemId),
      
      findByBusinessId: (id) => get().data.find((item) => item.id === id),
      
      getNextId: () => generateBusinessId(get().counter),
      
      isBusinessIdExists: (id: string) => get().data.some((item) => String(item.id) === id),
    }),
    {
      name: 'brand-storage',
    }
  )
);
