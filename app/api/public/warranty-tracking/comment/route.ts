/**
 * Public Warranty Comment API
 * No authentication required - allows customers to add comments to warranty tickets
 * 
 * POST /api/public/warranty-tracking/comment
 * Body: { trackingCode: string, content: string }
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateSubEntityId } from '@/lib/id-utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { trackingCode, content } = body as { trackingCode?: string; content?: string };

    if (!trackingCode || !content?.trim()) {
      return NextResponse.json(
        { error: 'Thiếu mã tra cứu hoặc nội dung bình luận' },
        { status: 400 }
      );
    }

    const trimmedContent = content.trim();

    // Validate content length
    if (trimmedContent.length > 2000) {
      return NextResponse.json(
        { error: 'Nội dung bình luận quá dài (tối đa 2000 ký tự)' },
        { status: 400 }
      );
    }

    // Check if customer comments are allowed
    const [trackingSettings, publicTrackingSettings] = await Promise.all([
      prisma.setting.findUnique({
        where: { key_group: { key: 'warranty_tracking_settings', group: 'warranty' } },
      }),
      prisma.setting.findUnique({
        where: { key_group: { key: 'warranty_public_tracking', group: 'warranty' } },
      }),
    ]);

    const trackingVal = trackingSettings?.value as Record<string, unknown> | null;
    const publicVal = publicTrackingSettings?.value as Record<string, unknown> | null;
    const allowComments = trackingVal?.allowCustomerComments ?? publicVal?.allowCustomerComments ?? false;

    if (!allowComments) {
      return NextResponse.json(
        { error: 'Tính năng bình luận hiện đang tắt' },
        { status: 403 }
      );
    }

    // Find the warranty ticket
    const warranty = await prisma.warranty.findFirst({
      where: {
        OR: [
          { publicTrackingCode: trackingCode },
          { trackingCode: trackingCode },
        ],
        isDeleted: false,
      },
      select: {
        systemId: true,
        comments: true,
      },
    });

    if (!warranty) {
      return NextResponse.json(
        { error: 'Không tìm thấy phiếu bảo hành' },
        { status: 404 }
      );
    }

    // Create the new comment
    const newComment = {
      systemId: generateSubEntityId('wc'),
      content: trimmedContent,
      contentText: trimmedContent,
      createdBy: 'Khách hàng',
      createdBySystemId: 'CUSTOMER',
      createdAt: new Date().toISOString(),
      attachments: [],
      mentions: [],
    };

    // Append to existing comments
    const existingComments = Array.isArray(warranty.comments)
      ? (warranty.comments as unknown[])
      : [];

    await prisma.warranty.update({
      where: { systemId: warranty.systemId },
      data: {
        comments: [...existingComments, newComment] as unknown as import('@prisma/client').Prisma.InputJsonValue,
        updatedAt: new Date().toISOString(),
      },
    });

    // Return the new comment in the same format as the GET endpoint
    return NextResponse.json({
      comment: {
        systemId: newComment.systemId,
        content: newComment.content,
        createdByName: 'Khách hàng',
        createdAt: newComment.createdAt,
      },
    });
  } catch (error) {
    console.error('[PUBLIC-WARRANTY-COMMENT] Error:', error);
    return NextResponse.json(
      { error: 'Đã xảy ra lỗi khi gửi bình luận' },
      { status: 500 }
    );
  }
}
