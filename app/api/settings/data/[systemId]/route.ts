import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type RouteContext = {
  params: Promise<{ systemId: string }>;
};

// GET - Get single settings data by systemId
export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  const { systemId } = await context.params;

  try {
    const setting = await prisma.settingsData.findUnique({
      where: { systemId },
    });

    if (!setting) {
      return NextResponse.json(
        { error: 'Settings data not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      systemId: setting.systemId,
      id: setting.id,
      name: setting.name,
      type: setting.type,
      description: setting.description,
      isActive: setting.isActive,
      isDefault: setting.isDefault,
      createdAt: setting.createdAt.toISOString(),
      updatedAt: setting.updatedAt.toISOString(),
      createdBy: setting.createdBy,
      updatedBy: setting.updatedBy,
      ...(setting.metadata as Record<string, unknown> || {}),
    });
  } catch (error) {
    console.error('[Settings Data API] GET by ID error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch settings data' },
      { status: 500 }
    );
  }
}

// PATCH - Update settings data
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
      isActive,
      isDefault,
      updatedBy,
      ...extraFields 
    } = body;

    const existing = await prisma.settingsData.findUnique({
      where: { systemId },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Settings data not found' },
        { status: 404 }
      );
    }

    // Merge existing metadata with new extra fields
    const existingMetadata = (existing.metadata as Record<string, unknown>) || {};
    const newMetadata = { ...existingMetadata, ...extraFields };

    const updated = await prisma.settingsData.update({
      where: { systemId },
      data: {
        ...(id !== undefined && { id }),
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(isActive !== undefined && { isActive }),
        ...(isDefault !== undefined && { isDefault }),
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
      isActive: updated.isActive,
      isDefault: updated.isDefault,
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
      createdBy: updated.createdBy,
      updatedBy: updated.updatedBy,
      ...(updated.metadata as Record<string, unknown> || {}),
    });
  } catch (error: any) {
    console.error('[Settings Data API] PATCH error:', error);
    
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'A setting with this ID already exists for this type' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update settings data' },
      { status: 500 }
    );
  }
}

// DELETE - Soft delete settings data
export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  const { systemId } = await context.params;

  try {
    const existing = await prisma.settingsData.findUnique({
      where: { systemId },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Settings data not found' },
        { status: 404 }
      );
    }

    let hard = false;
    try {
      const body = await request.json();
      hard = body.hard === true;
    } catch {
      // No body - use soft delete
    }

    if (hard) {
      await prisma.settingsData.delete({
        where: { systemId },
      });
    } else {
      await prisma.settingsData.update({
        where: { systemId },
        data: {
          isDeleted: true,
          deletedAt: new Date(),
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Settings Data API] DELETE error:', error);
    return NextResponse.json(
      { error: 'Failed to delete settings data' },
      { status: 500 }
    );
  }
}
