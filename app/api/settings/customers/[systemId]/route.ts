import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type RouteContext = {
  params: Promise<{ systemId: string }>;
};

// GET - Get single customer setting by systemId
export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  const { systemId } = await context.params;

  try {
    const setting = await prisma.customerSetting.findUnique({
      where: { systemId },
    });

    if (!setting) {
      return NextResponse.json(
        { error: 'Customer setting not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      systemId: setting.systemId,
      id: setting.id,
      name: setting.name,
      type: setting.type,
      description: setting.description,
      color: setting.color,
      isDefault: setting.isDefault,
      isActive: setting.isActive,
      orderIndex: setting.orderIndex,
      createdAt: setting.createdAt.toISOString(),
      updatedAt: setting.updatedAt.toISOString(),
      createdBy: setting.createdBy,
      updatedBy: setting.updatedBy,
      ...(setting.metadata as Record<string, unknown> || {}),
    });
  } catch (error) {
    console.error('[Customer Settings API] GET by ID error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch customer setting' },
      { status: 500 }
    );
  }
}

// PATCH - Update customer setting
export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  const { systemId } = await context.params;

  try {
    const body = await request.json();
    const { 
      id, 
      name, 
      description, 
      color, 
      isDefault, 
      isActive,
      orderIndex,
      updatedBy,
      ...extraFields 
    } = body;

    // Check if exists
    const existing = await prisma.customerSetting.findUnique({
      where: { systemId },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Customer setting not found' },
        { status: 404 }
      );
    }

    // Merge existing metadata with new extra fields
    const existingMetadata = (existing.metadata as Record<string, unknown>) || {};
    const newMetadata = { ...existingMetadata, ...extraFields };

    const updated = await prisma.customerSetting.update({
      where: { systemId },
      data: {
        ...(id !== undefined && { id }),
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(color !== undefined && { color }),
        ...(isDefault !== undefined && { isDefault }),
        ...(isActive !== undefined && { isActive }),
        ...(orderIndex !== undefined && { orderIndex }),
        ...(Object.keys(extraFields).length > 0 && { metadata: newMetadata }),
        updatedBy,
      },
    });

    return NextResponse.json({
      systemId: updated.systemId,
      id: updated.id,
      name: updated.name,
      type: updated.type,
      description: updated.description,
      color: updated.color,
      isDefault: updated.isDefault,
      isActive: updated.isActive,
      orderIndex: updated.orderIndex,
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
      createdBy: updated.createdBy,
      updatedBy: updated.updatedBy,
      ...(updated.metadata as Record<string, unknown> || {}),
    });
  } catch (error: any) {
    console.error('[Customer Settings API] PATCH error:', error);
    
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'A setting with this ID already exists for this type' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update customer setting' },
      { status: 500 }
    );
  }
}

// DELETE - Soft delete customer setting
export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  const { systemId } = await context.params;

  try {
    // Check if exists
    const existing = await prisma.customerSetting.findUnique({
      where: { systemId },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Customer setting not found' },
        { status: 404 }
      );
    }

    // Check request body for hard delete flag
    let hard = false;
    try {
      const body = await request.json();
      hard = body.hard === true;
    } catch {
      // No body or invalid JSON - use soft delete
    }

    if (hard) {
      await prisma.customerSetting.delete({
        where: { systemId },
      });
    } else {
      await prisma.customerSetting.update({
        where: { systemId },
        data: {
          isDeleted: true,
          deletedAt: new Date(),
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Customer Settings API] DELETE error:', error);
    return NextResponse.json(
      { error: 'Failed to delete customer setting' },
      { status: 500 }
    );
  }
}
