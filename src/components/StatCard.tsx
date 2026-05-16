import { LucideIcon } from 'lucide-react';
import styles from './StatCard.module.css';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  color?: 'primary' | 'success' | 'warning' | 'danger';
}

export default function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  trendUp,
  color = 'primary'
}: StatCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
        <div className={`${styles.iconWrapper} ${styles[color]}`}>
          <Icon size={20} />
        </div>
      </div>
      <div className={styles.content}>
        <div className={styles.value}>{value}</div>
        {trend && (
          <div className={`${styles.trend} ${trendUp ? styles.trendUp : styles.trendDown}`}>
            {trendUp ? '↑' : '↓'} {trend}
          </div>
        )}
      </div>
    </div>
  );
}
