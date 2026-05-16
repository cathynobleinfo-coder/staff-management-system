'use server';

import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'super-secret-key-for-dev-only');

export async function login(formData: FormData) {
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;
  const role = formData.get('role') as string;

  // Find user
  const user = await prisma.user.findUnique({
    where: { username }
  });

  if (!user || user.passwordHash !== password || user.role.toLowerCase() !== role.toLowerCase()) {
    return { error: 'Invalid credentials or role' };
  }

  // Create JWT
  const token = await new SignJWT({
    id: user.id,
    role: user.role,
    districtId: user.districtId,
    brcId: user.brcId
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('8h')
    .sign(JWT_SECRET);

  // Set cookie
  (await cookies()).set('session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 8 * 60 * 60, // 8 hours
    path: '/',
  });

  // Redirect based on role
  redirect(`/dashboard/${user.role.toLowerCase()}`);
}

export async function logout() {
  (await cookies()).delete('session');
  redirect('/');
}

export async function getSession() {
  const token = (await cookies()).get('session')?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as {
      id: string;
      role: string;
      districtId: string | null;
      brcId: string | null;
    };
  } catch (error) {
    return null;
  }
}
