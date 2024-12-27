import Dashboard from "./components/dashboard";
import { getDashboardCounts, getRecentActivity } from "./actions/dashboard";

export default async function DashboardPage() {
  const [counts, activities] = await Promise.all([
    getDashboardCounts(),
    getRecentActivity(),
  ]);

  return <Dashboard counts={counts} initialActivities={activities} />;
}
