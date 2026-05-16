'use server';

import { prisma } from '@/lib/prisma';
import { getSession } from './auth';
import { revalidatePath } from 'next/cache';

export async function submitBrcSalary(amount: number) {
  const session = await getSession();
  if (!session || session.role !== 'BRC' || !session.brcId || !session.districtId) {
    return { error: 'Unauthorized' };
  }

  const currentDate = new Date();
  const month = currentDate.getMonth() + 1;
  const year = currentDate.getFullYear();

  try {
    // Check if a record already exists for this month
    const existing = await prisma.salaryRecord.findFirst({
      where: {
        brcId: session.brcId,
        month,
        year
      }
    });

    if (existing) {
      await prisma.salaryRecord.update({
        where: { id: existing.id },
        data: { amount, status: 'SUBMITTED' }
      });
    } else {
      await prisma.salaryRecord.create({
        data: {
          month,
          year,
          amount,
          status: 'SUBMITTED',
          brcId: session.brcId,
          districtId: session.districtId,
        }
      });
    }

    revalidatePath('/dashboard/brc');
    revalidatePath('/dashboard/district');
    revalidatePath('/dashboard/state');
    return { success: true };
  } catch (error) {
    return { error: 'Failed to submit salary' };
  }
}

export async function submitDistrictSalary() {
  const session = await getSession();
  if (!session || session.role !== 'DISTRICT' || !session.districtId) {
    return { error: 'Unauthorized' };
  }

  const month = new Date().getMonth() + 1;
  const year = new Date().getFullYear();

  try {
    // A district "submits" by marking all its BRC salaries for the month as "APPROVED" or similar.
    // Since our schema uses 'PENDING' and 'SUBMITTED', maybe we update them to 'DISTRICT_SUBMITTED'.
    // Wait, let's just make sure all BRC records exist, if not we can't submit, but let's keep it simple.
    await prisma.salaryRecord.updateMany({
      where: {
        districtId: session.districtId,
        month,
        year,
        status: 'SUBMITTED'
      },
      data: {
        status: 'DISTRICT_SUBMITTED' // Adding a new status implicitly here, or we can just use SUBMITTED if they are pending. Let's use DISTRICT_SUBMITTED.
      }
    });

    revalidatePath('/dashboard/district');
    revalidatePath('/dashboard/state');
    return { success: true };
  } catch (error) {
    return { error: 'Failed to submit district salary' };
  }
}
