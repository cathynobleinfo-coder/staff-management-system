import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Staff Management System',
  description: 'A dynamic staff management system with role-based access control.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
