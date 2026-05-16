'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import styles from '../dashboard.module.css';

const salaryData = [
  { month: 'Jan', amount: 2050000 },
  { month: 'Feb', amount: 2100000 },
  { month: 'Mar', amount: 2123564 },
];

export default function StateCharts({ staffDistData }: { staffDistData: any[] }) {
  return (
    <div className={styles.chartGrid}>
      <div className={styles.chartContainer}>
        <h3 className={styles.sectionTitle} style={{marginBottom: '1rem'}}>Staff by Category (Districts)</h3>
        <ResponsiveContainer width="100%" height="85%">
          <BarChart data={staffDistData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} />
            <Tooltip cursor={{fill: '#f8fafc'}} />
            <Legend />
            <Bar dataKey="Deputation" stackId="a" fill="#2563eb" />
            <Bar dataKey="Contract" stackId="a" fill="#3b82f6" />
            <Bar dataKey="Daily" stackId="a" fill="#93c5fd" />
            <Bar dataKey="Service" stackId="a" fill="#bfdbfe" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className={styles.chartContainer}>
        <h3 className={styles.sectionTitle} style={{marginBottom: '1rem'}}>Salary Expenditure (Last 3 Months)</h3>
        <ResponsiveContainer width="100%" height="85%">
          <LineChart data={salaryData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis dataKey="month" axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} />
            <Tooltip />
            <Line type="monotone" dataKey="amount" stroke="#10b981" strokeWidth={3} dot={{r: 6}} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
