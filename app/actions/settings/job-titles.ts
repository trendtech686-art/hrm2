'use server'

/**
 * Server Actions for Job Title Management (Chức danh)
 */

import { prisma } from '@/lib/prisma'
import { revalidatePath } from '@/lib/revalidation'
import { generateIdWithPrefix } from '@/lib/id-generator'

// Types
type JobTitle = NonNullable<Awaited<ReturnType<typeof prisma.jobTitle.findFirst>>>

export type ActionResult<T = unknown> = {
  success: boolean
  data?: T
  error?: string
}

export type CreateJobTitleInput = {
  name: string
  description?: string
  createdBy?: string
}

export type UpdateJobTitleInput = {
  systemId: string
  name?: string
  description?: string
  updatedBy?: string
}

// ====================================
// ACTIONS
// ====================================

export async function createJobTitleAction(
  input: CreateJobTitleInput
): Promise<ActionResult<JobTitle>> {
  try {
    const systemId = await generateIdWithPrefix('CD', prisma)

    const jobTitle = await prisma.jobTitle.create({
      data: {
        systemId,
        id: systemId,
        name: input.name,
        description: input.description,
        createdBy: input.createdBy,
      },
    })

    revalidatePath('/settings/job-titles')
    return { success: true, data: jobTitle }
  } catch (error) {
    console.error('Error creating job title:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create job title',
    }
  }
}

export async function updateJobTitleAction(
  input: UpdateJobTitleInput
): Promise<ActionResult<JobTitle>> {
  try {
    const { systemId, ...data } = input

    const existing = await prisma.jobTitle.findUnique({
      where: { systemId },
    })

    if (!existing) {
      return { success: false, error: 'Job title not found' }
    }

    const updateData: Record<string, unknown> = {}
    
    if (data.name !== undefined) updateData.name = data.name
    if (data.description !== undefined) updateData.description = data.description
    if (data.updatedBy !== undefined) updateData.updatedBy = data.updatedBy

    const jobTitle = await prisma.jobTitle.update({
      where: { systemId },
      data: updateData,
    })

    revalidatePath('/settings/job-titles')
    return { success: true, data: jobTitle }
  } catch (error) {
    console.error('Error updating job title:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update job title',
    }
  }
}

export async function deleteJobTitleAction(
  systemId: string
): Promise<ActionResult<JobTitle>> {
  try {
    const existing = await prisma.jobTitle.findUnique({
      where: { systemId },
      include: { employees: true },
    })

    if (!existing) {
      return { success: false, error: 'Job title not found' }
    }

    if (existing.employees.length > 0) {
      return { success: false, error: 'Cannot delete job title with employees' }
    }

    const jobTitle = await prisma.jobTitle.update({
      where: { systemId },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    })

    revalidatePath('/settings/job-titles')
    return { success: true, data: jobTitle }
  } catch (error) {
    console.error('Error deleting job title:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete job title',
    }
  }
}

export async function restoreJobTitleAction(
  systemId: string
): Promise<ActionResult<JobTitle>> {
  try {
    const jobTitle = await prisma.jobTitle.update({
      where: { systemId },
      data: {
        isDeleted: false,
        deletedAt: null,
      },
    })

    revalidatePath('/settings/job-titles')
    return { success: true, data: jobTitle }
  } catch (error) {
    console.error('Error restoring job title:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to restore job title',
    }
  }
}

export async function getJobTitleAction(
  systemId: string
): Promise<ActionResult<JobTitle>> {
  try {
    const jobTitle = await prisma.jobTitle.findUnique({
      where: { systemId },
      include: {
        _count: { select: { employees: true } },
      },
    })

    if (!jobTitle) {
      return { success: false, error: 'Job title not found' }
    }

    return { success: true, data: jobTitle }
  } catch (error) {
    console.error('Error getting job title:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get job title',
    }
  }
}
