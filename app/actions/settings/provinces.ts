'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from '@/lib/revalidation';
import { generateIdWithPrefix } from '@/lib/id-generator';

type Province = NonNullable<Awaited<ReturnType<typeof prisma.province.findFirst>>>;
type District = NonNullable<Awaited<ReturnType<typeof prisma.district.findFirst>>>;
type Ward = NonNullable<Awaited<ReturnType<typeof prisma.ward.findFirst>>>;

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

// ============== PROVINCES ==============

export interface ProvinceFilters {
  page?: number;
  limit?: number;
  search?: string;
  level?: '2-level' | '3-level';
  isDeleted?: boolean;
}

export interface PaginatedProvinces {
  data: Province[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export async function getProvinces(
  filters: ProvinceFilters = {}
): Promise<ActionResult<PaginatedProvinces>> {
  try {
    const { page = 1, limit = 100, search, level = '2-level', isDeleted = false } = filters;

    const where: Record<string, unknown> = { level, isDeleted };
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { id: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      prisma.province.findMany({
        where,
        orderBy: { name: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.province.count({ where }),
    ]);

    return {
      success: true,
      data: {
        data,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    };
  } catch (error) {
    console.error('Failed to fetch provinces:', error);
    return { success: false, error: 'Không thể tải danh sách tỉnh/thành phố' };
  }
}

export async function getAllProvinces(
  level: '2-level' | '3-level' = '2-level'
): Promise<ActionResult<Province[]>> {
  try {
    const provinces = await prisma.province.findMany({
      where: { level, isDeleted: false },
      orderBy: { name: 'asc' },
    });
    return { success: true, data: provinces };
  } catch (error) {
    console.error('Failed to fetch all provinces:', error);
    return { success: false, error: 'Không thể tải danh sách tỉnh/thành phố' };
  }
}

export async function getProvinceById(
  systemId: string
): Promise<ActionResult<Province>> {
  try {
    const province = await prisma.province.findUnique({
      where: { systemId },
    });
    if (!province) {
      return { success: false, error: 'Không tìm thấy tỉnh/thành phố' };
    }
    return { success: true, data: province };
  } catch (error) {
    console.error('Failed to fetch province:', error);
    return { success: false, error: 'Không thể tải thông tin tỉnh/thành phố' };
  }
}

export async function createProvince(
  data: Record<string, unknown>
): Promise<ActionResult<Province>> {
  try {
    const id = data.id as string;
    const name = data.name as string;
    const level = (data.level as '2-level' | '3-level') || '2-level';

    // Check unique id within level
    const existing = await prisma.province.findFirst({
      where: { id, level },
    });
    if (existing) {
      return { success: false, error: 'Mã tỉnh/thành phố đã tồn tại' };
    }

    const province = await prisma.province.create({
      data: {
        systemId: await generateIdWithPrefix('PROV', prisma),
        id,
        name,
        level,
        createdBy: data.createdBy as string | undefined,
      },
    });

    revalidatePath('/settings/provinces');
    return { success: true, data: province };
  } catch (error) {
    console.error('Failed to create province:', error);
    return { success: false, error: 'Không thể tạo tỉnh/thành phố' };
  }
}

export async function updateProvince(
  systemId: string,
  data: Record<string, unknown>
): Promise<ActionResult<Province>> {
  try {
    const existing = await prisma.province.findUnique({ where: { systemId } });
    if (!existing) {
      return { success: false, error: 'Không tìm thấy tỉnh/thành phố' };
    }

    const province = await prisma.province.update({
      where: { systemId },
      data: {
        name: data.name as string | undefined,
        updatedBy: data.updatedBy as string | undefined,
      },
    });

    revalidatePath('/settings/provinces');
    return { success: true, data: province };
  } catch (error) {
    console.error('Failed to update province:', error);
    return { success: false, error: 'Không thể cập nhật tỉnh/thành phố' };
  }
}

export async function deleteProvince(
  systemId: string
): Promise<ActionResult<Province>> {
  try {
    const province = await prisma.province.update({
      where: { systemId },
      data: { isDeleted: true },
    });

    revalidatePath('/settings/provinces');
    return { success: true, data: province };
  } catch (error) {
    console.error('Failed to delete province:', error);
    return { success: false, error: 'Không thể xóa tỉnh/thành phố' };
  }
}

// ============== DISTRICTS ==============

export interface DistrictFilters {
  page?: number;
  limit?: number;
  search?: string;
  provinceId?: string;
  level?: '2-level' | '3-level';
  isDeleted?: boolean;
}

export interface PaginatedDistricts {
  data: District[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export async function getDistricts(
  filters: DistrictFilters = {}
): Promise<ActionResult<PaginatedDistricts>> {
  try {
    const { page = 1, limit = 100, search, provinceId, level = '3-level', isDeleted = false } = filters;

    const where: Record<string, unknown> = { level, isDeleted };
    if (search) {
      where.name = { contains: search, mode: 'insensitive' };
    }
    if (provinceId) where.provinceId = provinceId;

    const [data, total] = await Promise.all([
      prisma.district.findMany({
        where,
        orderBy: { name: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.district.count({ where }),
    ]);

    return {
      success: true,
      data: {
        data,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    };
  } catch (error) {
    console.error('Failed to fetch districts:', error);
    return { success: false, error: 'Không thể tải danh sách quận/huyện' };
  }
}

export async function getDistrictsByProvince(
  provinceId: string,
  level: '2-level' | '3-level' = '3-level'
): Promise<ActionResult<District[]>> {
  try {
    const districts = await prisma.district.findMany({
      where: { provinceId, level, isDeleted: false },
      orderBy: { name: 'asc' },
    });
    return { success: true, data: districts };
  } catch (error) {
    console.error('Failed to fetch districts by province:', error);
    return { success: false, error: 'Không thể tải danh sách quận/huyện' };
  }
}

export async function createDistrict(
  data: Record<string, unknown>
): Promise<ActionResult<District>> {
  try {
    const id = data.id as number;
    const name = data.name as string;
    const provinceId = data.provinceId as string;
    const level = (data.level as '2-level' | '3-level') || '3-level';

    // Check unique id within level
    const existing = await prisma.district.findFirst({
      where: { id, level },
    });
    if (existing) {
      return { success: false, error: 'Mã quận/huyện đã tồn tại' };
    }

    const district = await prisma.district.create({
      data: {
        systemId: await generateIdWithPrefix('DIST', prisma),
        id,
        name,
        provinceId,
        level,
        createdBy: data.createdBy as string | undefined,
      },
    });

    revalidatePath('/settings/provinces');
    return { success: true, data: district };
  } catch (error) {
    console.error('Failed to create district:', error);
    return { success: false, error: 'Không thể tạo quận/huyện' };
  }
}

export async function updateDistrict(
  systemId: string,
  data: Record<string, unknown>
): Promise<ActionResult<District>> {
  try {
    const district = await prisma.district.update({
      where: { systemId },
      data: {
        name: data.name as string | undefined,
        updatedBy: data.updatedBy as string | undefined,
      },
    });

    revalidatePath('/settings/provinces');
    return { success: true, data: district };
  } catch (error) {
    console.error('Failed to update district:', error);
    return { success: false, error: 'Không thể cập nhật quận/huyện' };
  }
}

export async function deleteDistrict(
  systemId: string
): Promise<ActionResult<District>> {
  try {
    const district = await prisma.district.update({
      where: { systemId },
      data: { isDeleted: true },
    });

    revalidatePath('/settings/provinces');
    return { success: true, data: district };
  } catch (error) {
    console.error('Failed to delete district:', error);
    return { success: false, error: 'Không thể xóa quận/huyện' };
  }
}

// ============== WARDS ==============

export interface WardFilters {
  page?: number;
  limit?: number;
  search?: string;
  provinceId?: string;
  districtId?: number;
  level?: '2-level' | '3-level';
  isDeleted?: boolean;
}

export interface PaginatedWards {
  data: Ward[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export async function getWards(
  filters: WardFilters = {}
): Promise<ActionResult<PaginatedWards>> {
  try {
    const { page = 1, limit = 100, search, provinceId, districtId, level, isDeleted = false } = filters;

    const where: Record<string, unknown> = { isDeleted };
    if (search) {
      where.name = { contains: search, mode: 'insensitive' };
    }
    if (provinceId) where.provinceId = provinceId;
    if (districtId !== undefined) where.districtId = districtId;
    if (level) where.level = level;

    const [data, total] = await Promise.all([
      prisma.ward.findMany({
        where,
        orderBy: { name: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.ward.count({ where }),
    ]);

    return {
      success: true,
      data: {
        data,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    };
  } catch (error) {
    console.error('Failed to fetch wards:', error);
    return { success: false, error: 'Không thể tải danh sách phường/xã' };
  }
}

export async function getWardsByProvince(
  provinceId: string,
  level: '2-level' | '3-level' = '2-level'
): Promise<ActionResult<Ward[]>> {
  try {
    const wards = await prisma.ward.findMany({
      where: { provinceId, level, isDeleted: false },
      orderBy: { name: 'asc' },
    });
    return { success: true, data: wards };
  } catch (error) {
    console.error('Failed to fetch wards by province:', error);
    return { success: false, error: 'Không thể tải danh sách phường/xã' };
  }
}

export async function getWardsByDistrict(
  districtId: number
): Promise<ActionResult<Ward[]>> {
  try {
    const wards = await prisma.ward.findMany({
      where: { districtId, isDeleted: false },
      orderBy: { name: 'asc' },
    });
    return { success: true, data: wards };
  } catch (error) {
    console.error('Failed to fetch wards by district:', error);
    return { success: false, error: 'Không thể tải danh sách phường/xã' };
  }
}

export async function createWard(
  data: Record<string, unknown>
): Promise<ActionResult<Ward>> {
  try {
    const id = data.id as string;
    const name = data.name as string;
    const provinceId = data.provinceId as string;
    const level = (data.level as '2-level' | '3-level') || '2-level';

    // Check unique id within province and level
    const existing = await prisma.ward.findFirst({
      where: { id, provinceId, level },
    });
    if (existing) {
      return { success: false, error: 'Mã phường/xã đã tồn tại' };
    }

    const ward = await prisma.ward.create({
      data: {
        systemId: await generateIdWithPrefix('WARD', prisma),
        id,
        name,
        provinceId,
        provinceName: data.provinceName as string | undefined,
        districtId: data.districtId as number | undefined,
        districtName: data.districtName as string | undefined,
        level,
        createdBy: data.createdBy as string | undefined,
      },
    });

    revalidatePath('/settings/provinces');
    return { success: true, data: ward };
  } catch (error) {
    console.error('Failed to create ward:', error);
    return { success: false, error: 'Không thể tạo phường/xã' };
  }
}

export async function updateWard(
  systemId: string,
  data: Record<string, unknown>
): Promise<ActionResult<Ward>> {
  try {
    const ward = await prisma.ward.update({
      where: { systemId },
      data: {
        name: data.name as string | undefined,
        provinceName: data.provinceName as string | undefined,
        districtName: data.districtName as string | undefined,
        updatedBy: data.updatedBy as string | undefined,
      },
    });

    revalidatePath('/settings/provinces');
    return { success: true, data: ward };
  } catch (error) {
    console.error('Failed to update ward:', error);
    return { success: false, error: 'Không thể cập nhật phường/xã' };
  }
}

export async function deleteWard(
  systemId: string
): Promise<ActionResult<Ward>> {
  try {
    const ward = await prisma.ward.update({
      where: { systemId },
      data: { isDeleted: true },
    });

    revalidatePath('/settings/provinces');
    return { success: true, data: ward };
  } catch (error) {
    console.error('Failed to delete ward:', error);
    return { success: false, error: 'Không thể xóa phường/xã' };
  }
}

// ============== UTILITY ==============

export async function searchAddressUnits(
  query: string,
  level: '2-level' | '3-level' = '2-level'
): Promise<ActionResult<{ provinces: Province[]; districts: District[]; wards: Ward[] }>> {
  try {
    const searchFilter = { contains: query, mode: 'insensitive' as const };

    const [provinces, districts, wards] = await Promise.all([
      prisma.province.findMany({
        where: { name: searchFilter, level, isDeleted: false },
        take: 10,
        orderBy: { name: 'asc' },
      }),
      level === '3-level'
        ? prisma.district.findMany({
            where: { name: searchFilter, level, isDeleted: false },
            take: 10,
            orderBy: { name: 'asc' },
          })
        : [],
      prisma.ward.findMany({
        where: { name: searchFilter, level, isDeleted: false },
        take: 10,
        orderBy: { name: 'asc' },
      }),
    ]);

    return { success: true, data: { provinces, districts, wards } };
  } catch (error) {
    console.error('Failed to search address units:', error);
    return { success: false, error: 'Không thể tìm kiếm địa chỉ' };
  }
}
