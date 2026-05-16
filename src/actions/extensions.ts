'use server';

import { prisma } from '@/lib/prisma';
import { getSession } from './auth';
import { revalidatePath } from 'next/cache';

export async function submitBrcExtension(staffId: string) {
  const session = await getSession();
  if (!session || session.role !== 'BRC') {
    return { error: 'Unauthorized' };
  }

  try {
    const existing = await prisma.extension.findFirst({
      where: { staffId, status: { in: ['NOT_STARTED', 'PENDING'] } }
    });

    if (existing) {
      await prisma.extension.update({
        where: { id: existing.id },
        data: { status: 'BRC_SUBMITTED' }
      });
    } else {
      // Create new extension request with expiry date 3 months from now
      const expiryDate = new Date();
      expiryDate.setMonth(expiryDate.getMonth() + 3);

      await prisma.extension.create({
        data: {
          staffId,
          status: 'BRC_SUBMITTED',
          expiryDate
        }
      });
    }

    revalidatePath('/dashboard/brc');
    revalidatePath('/dashboard/district');
    return { success: true };
  } catch (error) {
    return { error: 'Failed to submit extension' };
  }
}
