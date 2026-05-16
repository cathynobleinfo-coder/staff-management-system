import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, CreditCard, Clock, LogOut } from 'lucide-react';
import styles from './Sidebar.module.css';

export default function Sidebar({ role }: { role: string }) {
  const pathname = usePathname();
  
  const getLinks = () => {
    const base = `/dashboard/${role}`;
    return [
      { href: base, label: 'Dashboard', icon: LayoutDashboard },
      { href: `${base}/staff`, label: 'Staff Directory', icon: Users },
      { href: `${base}/salary`, label: 'Salary Management', icon: CreditCard },
      { href: `${base}/extensions`, label: 'Extensions', icon: Clock },
    ];
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <div className={styles.logoIcon}></div>
        <h2>GovStaff</h2>
        <span className={styles.roleBadge}>{role.toUpperCase()}</span>
      </div>

      <nav className={styles.nav}>
        {getLinks().map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link 
              key={link.href} 
              href={link.href}
              className={`${styles.navLink} ${isActive ? styles.active : ''}`}
            >
              <Icon size={20} />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className={styles.footer}>
        <Link href="/" className={styles.logoutBtn}>
          <LogOut size={20} />
          <span>Logout</span>
        </Link>
      </div>
    </aside>
  );
}
