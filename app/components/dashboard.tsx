import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ActivityItem, DashboardCounts } from "../actions/dashboard";
import { CalendarDays, Archive } from "lucide-react";

interface DashboardProps {
  counts: DashboardCounts;
  initialActivities: ActivityItem[];
}

export default function Dashboard({
  counts,
  initialActivities,
}: DashboardProps) {
  return (
    <div className="container mt-10 mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-10">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 ">
        <StatCard
          title="Scheduled Posts"
          value={counts.scheduledCount}
          icon={<CalendarDays className="h-4 w-4" />}
        />
        <StatCard
          title="Archived Posts"
          value={counts.archivedCount}
          icon={<Archive className="h-4 w-4" />}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {initialActivities.map((activity) => (
              <li key={activity.id} className="flex items-center space-x-4">
                <span className="text-sm text-muted-foreground">
                  {new Date(activity.timestamp).toLocaleString()}
                </span>
                <span className="font-medium">{activity.type}</span>
                <span className="text-sm truncate flex-1">
                  {activity.content}
                </span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}
