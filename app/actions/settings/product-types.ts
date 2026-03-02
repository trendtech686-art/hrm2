'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from '@/lib/revalidation';
import { generateIdWithPrefix } from '@/lib/id-generator';

type Category = NonNullable<Awaited<ReturnType<typeof prisma.category.findFirst>>>;

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export interface ProductTypeFilters {
  page?: number;
  limit?: number;
  search?: string;
  parentId?: string | null;
  isActive?: boolean;
  isDeleted?: boolean;
}

export interface PaginatedProductTypes {
  data: Category[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export async function getProductTypes(
  filters: ProductTypeFilters = {}
): Promise<ActionResult<PaginatedProductTypes>> {
  try {
    const { page = 1, limit = 50, search, parentId, isActive, isDeleted = false } = filters;

    const where: Record<string, unknown> = { isDeleted };
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { id: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (parentId !== undefined) where.parentId = parentId;
    if (isActive !== undefined) where.isActive = isActive;

    const [data, total] = await Promise.all([
      prisma.category.findMany({
        where,
        include: {
          parent: { select: { systemId: true, name: true } },
          children: { select: { systemId: true, name: true }, where: { isDeleted: false } },
          _count: { select: { productCategories: true } },
        },
        orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.category.count({ where }),
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
    console.error('Failed to fetch product types:', error);
    return { success: false, error: 'Không thể tải danh sách loại sản phẩm' };
  }
}

export async function getProductTypeById(
  systemId: string
): Promise<ActionResult<Category>> {
  try {
    const category = await prisma.category.findUnique({
      where: { systemId },
      include: {
        parent: { select: { systemId: true, name: true } },
        children: { 
          where: { isDeleted: false },
          orderBy: { sortOrder: 'asc' },
        },
      },
    });
    if (!category) {
      return { success: false, error: 'Không tìm thấy loại sản phẩm' };
    }
    return { success: true, data: category };
  } catch (error) {
    console.error('Failed to fetch product type:', error);
    return { success: false, error: 'Không thể tải thông tin loại sản phẩm' };
  }
}

export async function createProductType(
  data: Record<string, unknown>
): Promise<ActionResult<Category>> {
  try {
    const name = data.name as string;

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    // Check unique name
    const existing = await prisma.category.findFirst({
      where: { name, isDeleted: false },
    });
    if (existing) {
      return { success: false, error: 'Tên loại sản phẩm đã tồn tại' };
    }

    const systemId = await generateIdWithPrefix('DM', prisma);

    // Calculate path and level
    let path = name;
    let level = 0;
    if (data.parentId) {
      const parent = await prisma.category.findUnique({
        where: { systemId: data.parentId as string },
      });
      if (parent) {
        path = `${parent.path || parent.name} > ${name}`;
        level = (parent.level || 0) + 1;
      }
    }

    const category = await prisma.category.create({
      data: {
        systemId,
        id: systemId,
        name,
        slug,
        parentId: data.parentId as string | undefined,
        description: data.description as string | undefined,
        shortDescription: data.shortDescription as string | undefined,
        longDescription: data.longDescription as string | undefined,
        seoTitle: data.seoTitle as string | undefined,
        metaDescription: data.metaDescription as string | undefined,
        seoKeywords: data.seoKeywords as string | undefined,
        ogImage: data.ogImage as string | undefined,
        imageUrl: data.imageUrl as string | undefined,
        thumbnail: data.thumbnail as string | undefined,
        icon: data.icon as string | undefined,
        color: data.color as string | undefined,
        path,
        level,
        sortOrder: (data.sortOrder as number) ?? 0,
        isActive: (data.isActive as boolean) ?? true,
      },
    });

    revalidatePath('/settings/product-types');
    revalidatePath('/products');
    return { success: true, data: category };
  } catch (error) {
    console.error('Failed to create product type:', error);
    return { success: false, error: 'Không thể tạo loại sản phẩm' };
  }
}

export async function updateProductType(
  systemId: string,
  data: Record<string, unknown>
): Promise<ActionResult<Category>> {
  try {
    const existing = await prisma.category.findUnique({ where: { systemId } });
    if (!existing) {
      return { success: false, error: 'Không tìm thấy loại sản phẩm' };
    }

    // Prevent circular reference
    if (data.parentId === systemId) {
      return { success: false, error: 'Không thể chọn chính nó làm danh mục cha' };
    }

    // Check unique name if changed
    if (data.name && data.name !== existing.name) {
      const duplicate = await prisma.category.findFirst({
        where: {
          name: data.name as string,
          isDeleted: false,
          NOT: { systemId },
        },
      });
      if (duplicate) {
        return { success: false, error: 'Tên loại sản phẩm đã tồn tại' };
      }
    }

    // Update path and level if parent changed
    let pathData: Record<string, unknown> = {};
    if (data.parentId !== undefined && data.parentId !== existing.parentId) {
      const name = (data.name as string) || existing.name;
      if (data.parentId) {
        const parent = await prisma.category.findUnique({
          where: { systemId: data.parentId as string },
        });
        if (parent) {
          pathData = {
            path: `${parent.path || parent.name} > ${name}`,
            level: (parent.level || 0) + 1,
          };
        }
      } else {
        pathData = { path: name, level: 0 };
      }
    }

    // Generate new slug if name changed
    const slugData: Record<string, unknown> = {};
    if (data.name && data.name !== existing.name) {
      slugData.slug = (data.name as string)
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
    }

    const category = await prisma.category.update({
      where: { systemId },
      data: {
        name: data.name as string | undefined,
        parentId: data.parentId as string | null | undefined,
        description: data.description as string | undefined,
        shortDescription: data.shortDescription as string | undefined,
        longDescription: data.longDescription as string | undefined,
        seoTitle: data.seoTitle as string | undefined,
        metaDescription: data.metaDescription as string | undefined,
        seoKeywords: data.seoKeywords as string | undefined,
        ogImage: data.ogImage as string | undefined,
        imageUrl: data.imageUrl as string | undefined,
        thumbnail: data.thumbnail as string | undefined,
        icon: data.icon as string | undefined,
        color: data.color as string | undefined,
        sortOrder: data.sortOrder as number | undefined,
        isActive: data.isActive as boolean | undefined,
        ...pathData,
        ...slugData,
      },
    });

    revalidatePath('/settings/product-types');
    revalidatePath('/products');
    return { success: true, data: category };
  } catch (error) {
    console.error('Failed to update product type:', error);
    return { success: false, error: 'Không thể cập nhật loại sản phẩm' };
  }
}

export async function deleteProductType(
  systemId: string
): Promise<ActionResult<Category>> {
  try {
    const existing = await prisma.category.findUnique({
      where: { systemId },
      include: {
        children: { where: { isDeleted: false }, select: { systemId: true } },
        _count: { select: { productCategories: true } },
      },
    });
    if (!existing) {
      return { success: false, error: 'Không tìm thấy loại sản phẩm' };
    }

    // Check if has children
    if (existing.children.length > 0) {
      return { success: false, error: 'Không thể xóa danh mục có danh mục con' };
    }

    // Check if has products
    if (existing._count.productCategories > 0) {
      return { success: false, error: `Không thể xóa danh mục đang có ${existing._count.productCategories} sản phẩm` };
    }

    const category = await prisma.category.update({
      where: { systemId },
      data: { isDeleted: true, deletedAt: new Date() },
    });

    revalidatePath('/settings/product-types');
    revalidatePath('/products');
    return { success: true, data: category };
  } catch (error) {
    console.error('Failed to delete product type:', error);
    return { success: false, error: 'Không thể xóa loại sản phẩm' };
  }
}

export async function restoreProductType(
  systemId: string
): Promise<ActionResult<Category>> {
  try {
    const category = await prisma.category.update({
      where: { systemId },
      data: { isDeleted: false, deletedAt: null },
    });

    revalidatePath('/settings/product-types');
    revalidatePath('/products');
    return { success: true, data: category };
  } catch (error) {
    console.error('Failed to restore product type:', error);
    return { success: false, error: 'Không thể khôi phục loại sản phẩm' };
  }
}

export async function toggleProductTypeActive(
  systemId: string
): Promise<ActionResult<Category>> {
  try {
    const existing = await prisma.category.findUnique({ where: { systemId } });
    if (!existing) {
      return { success: false, error: 'Không tìm thấy loại sản phẩm' };
    }

    const category = await prisma.category.update({
      where: { systemId },
      data: { isActive: !existing.isActive },
    });

    revalidatePath('/settings/product-types');
    revalidatePath('/products');
    return { success: true, data: category };
  } catch (error) {
    console.error('Failed to toggle product type active:', error);
    return { success: false, error: 'Không thể thay đổi trạng thái' };
  }
}

export async function getActiveProductTypes(
  parentId?: string | null
): Promise<ActionResult<Category[]>> {
  try {
    const where: Record<string, unknown> = { isActive: true, isDeleted: false };
    if (parentId !== undefined) where.parentId = parentId;

    const categories = await prisma.category.findMany({
      where,
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    });
    return { success: true, data: categories };
  } catch (error) {
    console.error('Failed to fetch active product types:', error);
    return { success: false, error: 'Không thể tải danh sách loại sản phẩm' };
  }
}

export async function getProductTypeTree(): Promise<ActionResult<Category[]>> {
  try {
    // Get all root categories with nested children
    const categories = await prisma.category.findMany({
      where: { parentId: null, isDeleted: false },
      include: {
        children: {
          where: { isDeleted: false },
          include: {
            children: {
              where: { isDeleted: false },
              orderBy: { sortOrder: 'asc' },
            },
          },
          orderBy: { sortOrder: 'asc' },
        },
      },
      orderBy: { sortOrder: 'asc' },
    });
    return { success: true, data: categories };
  } catch (error) {
    console.error('Failed to fetch product type tree:', error);
    return { success: false, error: 'Không thể tải cây danh mục' };
  }
}

export async function updateProductTypeSortOrder(
  items: { systemId: string; sortOrder: number }[]
): Promise<ActionResult<{ count: number }>> {
  try {
    await prisma.$transaction(
      items.map((item) =>
        prisma.category.update({
          where: { systemId: item.systemId },
          data: { sortOrder: item.sortOrder },
        })
      )
    );

    revalidatePath('/settings/product-types');
    return { success: true, data: { count: items.length } };
  } catch (error) {
    console.error('Failed to update sort order:', error);
    return { success: false, error: 'Không thể cập nhật thứ tự' };
  }
}
