import { getDistrictDashboardData } from '@/actions/dashboard';
import DistrictClientDashboard from './DistrictClientDashboard';

export default async function DistrictDashboard() {
  const data = await getDistrictDashboardData();

  return <DistrictClientDashboard data={data} />;
}
