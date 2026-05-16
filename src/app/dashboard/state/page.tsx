import { Users, Clock, IndianRupee, Briefcase } from 'lucide-react';
import StatCard from '@/components/StatCard';
import DataTable from '@/components/DataTable';
import styles from '../dashboard.module.css';
import { getStateDashboardData } from '@/actions/dashboard';
import StateCharts from './StateCharts'; // Client component for charts

const districtColumns = [
  { key: 'district', header: 'District' },
  { key: 'deputation', header: 'Deputation' },
  { key: 'contract', header: 'Contract' },
  { key: 'daily', header: 'Daily Wages' },
  { key: 'service', header: 'Service Providers' },
  { key: 'total', header: 'Total', render: (val: any) => <strong>{val}</strong> },
];

export default async function StateDashboard() {
  const data = await getStateDashboardData();

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
          title="Extensions Needed" 
          value={data.extensionsNeeded} 
          icon={Clock} 
          color="warning"
        />
        <StatCard 
          title="Salary This Month" 
          value={`₹${data.salaryThisMonth.toLocaleString('en-IN')}`} 
          icon={IndianRupee} 
          color="success"
        />
        <StatCard 
          title="State Office Staff" 
          value={data.stateOfficeStaff} 
          icon={Briefcase} 
          color="primary"
        />
      </div>

      <StateCharts staffDistData={data.staffDistData} />

      <div className={styles.section}>
        <DataTable 
          title="District Staff Distribution" 
          columns={districtColumns} 
          data={data.staffDistData} 
        />
      </div>
    </div>
  );
}
