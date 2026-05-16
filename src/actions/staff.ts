'use server';

import { prisma } from '@/lib/prisma';
import { getSession } from './auth';
import { revalidatePath } from 'next/cache';

export async function addStaff(formData: FormData) {
  const session = await getSession();
  if (!session || session.role !== 'BRC' || !session.brcId || !session.districtId) {
    return { error: 'Unauthorized. Only BRC can add staff.' };
  }

  const empId = formData.get('empId') as string;
  const name = formData.get('name') as string;
  const category = formData.get('category') as string;

  if (!empId || !name || !category) {
    return { error: 'Missing required fields' };
  }

  try {
    await prisma.staff.create({
      data: {
        empId,
        name,
        category: category.toUpperCase(),
        status: 'ACTIVE',
        brcId: session.brcId,
        districtId: session.districtId,
      }
    });

    revalidatePath('/dashboard/brc');
    revalidatePath('/dashboard/district');
    revalidatePath('/dashboard/state');
    
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: 'Failed to add staff. Emp ID might already exist.' };
  }
}

export async function toggleStaffStatus(staffId: string, currentStatus: string) {
  const session = await getSession();
  if (!session || (session.role !== 'BRC' && session.role !== 'DISTRICT')) {
    return { error: 'Unauthorized' };
  }

  const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';

  try {
    await prisma.staff.update({
      where: { id: staffId }, // Notice: staffId is the cuid, not empId in this context, or we can use empId if passed. We will expect the cuid string.
      data: { status: newStatus }
    });

    revalidatePath('/dashboard/brc');
    return { success: true };
  } catch (error) {
    return { error: 'Failed to update status' };
  }
}
