'use server';

import { prisma } from '@/lib/prisma';
import { getSession } from './auth';
import { redirect } from 'next/navigation';

export async function getStateDashboardData() {
  const session = await getSession();
  if (!session || session.role !== 'STATE') redirect('/');

  const totalStaff = await prisma.staff.count();
  
  // Pending extensions
  const extensionsNeeded = await prisma.extension.count({
    where: { status: 'DISTRICT_SUBMITTED' }
  });

  // Salary
  const totalSalary = await prisma.salaryRecord.aggregate({
    where: { status: 'SUBMITTED', month: new Date().getMonth() + 1, year: new Date().getFullYear() },
    _sum: { amount: true }
  });

  const stateOfficeStaff = await prisma.staff.count({
    where: { districtId: 'state_office' } // Assuming this exists or just mock 78 for now if schema doesn't have it
  });

  // District distribution
  const districts = await prisma.district.findMany({
    include: {
      _count: {
        select: { staff: true }
      },
      staff: {
        select: { category: true }
      }
    }
  });

  const staffDistData = districts.map(d => {
    const dep = d.staff.filter(s => s.category === 'DEPUTATION').length;
    const con = d.staff.filter(s => s.category === 'CONTRACT').length;
    const daily = d.staff.filter(s => s.category === 'DAILY').length;
    const service = d.staff.filter(s => s.category === 'SERVICE').length;

    return {
      name: d.name,
      district: d.name,
      Deputation: dep,
      Contract: con,
      Daily: daily,
      Service: service,
      deputation: dep,
      contract: con,
      daily: daily,
      service: service,
      total: d._count.staff
    };
  });

  return {
    totalStaff,
    extensionsNeeded,
    salaryThisMonth: totalSalary._sum.amount || 0,
    stateOfficeStaff: 78, // Mocked for now
    staffDistData,
  };
}

export async function getDistrictDashboardData() {
  const session = await getSession();
  if (!session || session.role !== 'DISTRICT' || !session.districtId) redirect('/');

  const districtId = session.districtId;

  const totalStaff = await prisma.staff.count({ where: { districtId } });
  
  const brcs = await prisma.brc.findMany({
    where: { districtId },
    include: {
      _count: { select: { staff: true } },
      salaries: {
        where: { month: new Date().getMonth() + 1, year: new Date().getFullYear() },
        take: 1
      },
      staff: {
        include: {
          extensions: {
            where: { status: 'BRC_SUBMITTED' }
          }
        }
      }
    }
  });

  const brcData = brcs.map(brc => {
    let extPending = 0;
    brc.staff.forEach(s => { extPending += s.extensions.length; });

    return {
      brc: brc.name,
      staff: brc._count.staff,
      salaryStatus: brc.salaries.length > 0 && brc.salaries[0].status === 'SUBMITTED' ? 'Submitted' : 'Pending',
      extPending
    };
  });

  const brcsPendingSalary = brcData.filter(b => b.salaryStatus === 'Pending').length;
  const totalExtensions = brcData.reduce((acc, b) => acc + b.extPending, 0);

  return {
    totalStaff,
    brcsPendingSalary: `${brcsPendingSalary}/${brcs.length}`,
    totalExtensions,
    brcData
  };
}

export async function getBrcDashboardData() {
  const session = await getSession();
  if (!session || session.role !== 'BRC' || !session.brcId) redirect('/');

  const brcId = session.brcId;

  const staff = await prisma.staff.findMany({
    where: { brcId }
  });

  const totalStaff = staff.length;
  const deputation = staff.filter(s => s.category === 'DEPUTATION').length;
  const contract = staff.filter(s => s.category === 'CONTRACT').length;
  const dailyService = staff.filter(s => s.category === 'DAILY' || s.category === 'SERVICE').length;

  return {
    totalStaff,
    deputation,
    contract,
    dailyService,
    staffData: staff.map(s => ({
      id: s.empId,
      dbId: s.id,
      name: s.name,
      category: s.category.charAt(0) + s.category.slice(1).toLowerCase(),
      status: s.status === 'ACTIVE' ? 'Active' : 'Inactive'
    }))
  };
}
