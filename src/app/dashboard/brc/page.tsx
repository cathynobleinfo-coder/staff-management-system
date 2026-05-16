import { getBrcDashboardData } from '@/actions/dashboard';
import BrcClientDashboard from './BrcClientDashboard';

export default async function BRCDashboard() {
  const data = await getBrcDashboardData();

  return <BrcClientDashboard data={data} />;
}
