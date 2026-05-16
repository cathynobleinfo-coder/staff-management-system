'use client';

import { useState } from 'react';
import { Users, UserPlus, FileEdit, IndianRupee, Clock } from 'lucide-react';
import StatCard from '@/components/StatCard';
import DataTable from '@/components/DataTable';
import styles from '../dashboard.module.css';
import badgeStyles from '@/components/DataTable.module.css';
import AddStaffModal from './AddStaffModal';
import { toggleStaffStatus } from '@/actions/staff';
import { submitBrcSalary } from '@/actions/salary';
import { submitBrcExtension } from '@/actions/extensions';

interface BrcClientDashboardProps {
  data: {
    totalStaff: number;
    deputation: number;
    contract: number;
    dailyService: number;
    staffData: any[];
  }
}

export default function BrcClientDashboard({ data }: BrcClientDashboardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [salaryAmount, setSalaryAmount] = useState('');
  const [isSubmittingSalary, setIsSubmittingSalary] = useState(false);

  const handleSalarySubmit = async () => {
    if (!salaryAmount) return;
    setIsSubmittingSalary(true);
    await submitBrcSalary(Number(salaryAmount));
    setIsSubmittingSalary(false);
    setSalaryAmount('');
    alert('Salary submitted successfully!');
  };

  const staffColumns = [
    { key: 'id', header: 'Emp ID' },
    { key: 'name', header: 'Name' },
    { key: 'category', header: 'Category' },
    { 
      key: 'status', 
      header: 'Status',
      render: (val: string) => (
        <span className={`${badgeStyles.badge} ${val === 'Active' ? badgeStyles.badgeSuccess : badgeStyles.badgeNeutral}`}>
          {val}
        </span>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (val: any, row: any) => (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button 
            className="btn btn-outline" 
            style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
            onClick={async () => {
              if(row.dbId) await toggleStaffStatus(row.dbId, row.status.toUpperCase());
            }}
          >
            {row.status === 'Active' ? 'Deactivate' : 'Activate'}
          </button>
          
          {row.category === 'Deputation' && (
            <button 
              className="btn btn-outline" 
              style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem', color: 'var(--warning)', borderColor: 'var(--warning)' }}
              onClick={async () => {
                if(row.dbId) {
                  await submitBrcExtension(row.dbId);
                  alert('Extension requested successfully!');
                }
              }}
            >
              <Clock size={12} style={{marginRight: '2px'}}/> Extend
            </button>
          )}

          <button className="btn btn-outline" style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem', color: 'var(--danger)' }}>
            Transfer
          </button>
        </div>
      )
    }
  ];

  return (
    <div>
      <div className={styles.grid}>
        <StatCard 
          title="Total Staff" 
          value={data.totalStaff} 
          icon={Users} 
          color="primary"
        />
        <StatCard 
          title="Deputation Staff" 
          value={data.deputation} 
          icon={UserPlus} 
          color="success"
        />
        <StatCard 
          title="Contract Staff" 
          value={data.contract} 
          icon={FileEdit} 
          color="warning"
        />
        <StatCard 
          title="Daily / Service" 
          value={data.dailyService} 
          icon={IndianRupee} 
          color="danger"
        />
      </div>

      <div className={styles.grid} style={{ marginTop: '2rem' }}>
        <div className={styles.section} style={{ background: 'var(--surface)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)'}}>
          <h3 className={styles.sectionTitle} style={{marginBottom: '1rem'}}>Submit Monthly Salary</h3>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
            <div className="input-group" style={{ marginBottom: 0, flex: 1 }}>
              <label>Amount (₹)</label>
              <input 
                type="number" 
                className="input" 
                placeholder="Enter total required amount" 
                value={salaryAmount}
                onChange={(e) => setSalaryAmount(e.target.value)}
              />
            </div>
            <button 
              className="btn btn-primary" 
              onClick={handleSalarySubmit}
              disabled={isSubmittingSalary || !salaryAmount}
            >
              {isSubmittingSalary ? 'Submitting...' : 'Submit Salary'}
            </button>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.flexBetween} style={{marginBottom: '1rem'}}>
          <h3 className={styles.sectionTitle}>Staff Directory Overview</h3>
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
            <UserPlus size={16} /> Add New Staff
          </button>
        </div>
        <DataTable 
          columns={staffColumns} 
          data={data.staffData} 
        />
      </div>

      <AddStaffModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
