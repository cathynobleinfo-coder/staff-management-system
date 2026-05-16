'use client';

import { usePathname } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import styles from './layout.module.css';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // Extract role from pathname (e.g., /dashboard/brc -> brc)
  const role = pathname.split('/')[2] || 'brc';
  
  const getPageTitle = () => {
    if (pathname.includes('/staff')) return 'Staff Directory';
    if (pathname.includes('/salary')) return 'Salary Management';
    if (pathname.includes('/extensions')) return 'Extensions Tracking';
    return 'Dashboard Overview';
  };

  const getRoleDisplay = () => {
    switch (role) {
      case 'state': return 'State Administrator';
      case 'district': return 'District Manager';
      case 'brc': return 'BRC Coordinator';
      default: return 'User';
    }
  };

  return (
    <div className={styles.dashboardWrapper}>
      <Sidebar role={role} />
      
      <main className={styles.mainContent}>
        <header className={styles.topbar}>
          <h1 className={styles.pageTitle}>{getPageTitle()}</h1>
          
          <div className={styles.userInfo}>
            <div style={{ textAlign: 'right' }}>
              <div className={styles.userName}>Admin User</div>
              <div className={styles.userRole}>{getRoleDisplay()}</div>
            </div>
            <div className={styles.avatar}>
              {role.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        <div className={styles.contentArea}>
          {children}
        </div>
      </main>
    </div>
  );
}
