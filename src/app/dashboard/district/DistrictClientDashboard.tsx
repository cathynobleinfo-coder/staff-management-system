'use client';

import { useState } from 'react';
import { Users, Clock, CreditCard, Activity } from 'lucide-react';
import StatCard from '@/components/StatCard';
import DataTable from '@/components/DataTable';
import styles from '../dashboard.module.css';
import badgeStyles from '@/components/DataTable.module.css';
import { submitDistrictSalary } from '@/actions/salary';

interface DistrictClientDashboardProps {
  data: {
    totalStaff: number;
    brcsPendingSalary: string;
    totalExtensions: number;
    brcData: any[];
  }
}

export default function DistrictClientDashboard({ data }: DistrictClientDashboardProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDistrictSalarySubmit = async () => {
    setIsSubmitting(true);
    const result = await submitDistrictSalary();
    setIsSubmitting(false);
    
    if (result.error) {
      alert(result.error);
    } else {
      alert('District salary submitted successfully!');
    }
  };

  const brcColumns = [
    { key: 'brc', header: 'BRC Name' },
    { key: 'staff', header: 'Total Staff' },
    { 
      key: 'salaryStatus', 
      header: 'Salary Status',
      render: (val: string) => (
        <span className={`${badgeStyles.badge} ${val === 'Submitted' ? badgeStyles.badgeSuccess : badgeStyles.badgeWarning}`}>
          {val}
        </span>
      )
    },
    { 
      key: 'extPending', 
      header: 'Extensions Pending',
      render: (val: number) => (
        <span style={{ color: val > 0 ? 'var(--danger)' : 'inherit', fontWeight: val > 0 ? '600' : 'normal' }}>
          {val}
        </span>
      )
    },
  ];

  return (
    <div>
      <div className={styles.grid}>
        <StatCard 
          title="Total District Staff" 
          value={data.totalStaff} 
          icon={Users} 
          color="primary"
        />
        <StatCard 
          title="BRCs Pending Salary" 
          value={data.brcsPendingSalary} 
          icon={CreditCard} 
          color="warning"
        />
        <StatCard 
          title="Extensions Due" 
          value={data.totalExtensions} 
          icon={Clock} 
          color="danger"
        />
        <StatCard 
          title="Active Applications" 
          value={data.totalExtensions} 
          icon={Activity} 
          color="success"
        />
      </div>

      <div className={styles.section}>
        <div className={styles.flexBetween} style={{marginBottom: '1rem'}}>
          <h3 className={styles.sectionTitle}>BRC Status Overview</h3>
          <button 
            className="btn btn-primary" 
            onClick={handleDistrictSalarySubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit District Salary'}
          </button>
        </div>
        <DataTable 
          columns={brcColumns} 
          data={data.brcData} 
        />
      </div>
    </div>
  );
}
