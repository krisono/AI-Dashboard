import { APP_NAME } from "@/lib/brand";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle2, Clock, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="max-w-[1400px] mx-auto px-4 py-6 space-y-6">
      <PageHeader
        title="Dashboard Overview"
        subtitle={`Welcome to ${APP_NAME} collaboration system`}
      />

      {/* Stats Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Pending Cases"
          value={24}
          hint="Awaiting review"
          icon={Clock}
        />
        <StatCard
          label="Today's Reviews"
          value={12}
          hint="Completed today"
          icon={CheckCircle2}
        />
        <StatCard
          label="High Risk"
          value={3}
          hint="Require attention"
          icon={AlertCircle}
        />
        <StatCard
          label="AI Confidence"
          value="94%"
          hint="Average across queue"
          icon={TrendingUp}
        />
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-3">
          <Link href="/dashboard/queue">
            <Button variant="outline" className="w-full justify-start">
              View Case Queue
            </Button>
          </Link>
          <Link href="/dashboard/audit">
            <Button variant="outline" className="w-full justify-start">
              Audit Log
            </Button>
          </Link>
          <Link href="/dashboard/bias">
            <Button variant="outline" className="w-full justify-start">
              Bias Monitoring
            </Button>
          </Link>
          <Link href="/dashboard/settings">
            <Button variant="outline" className="w-full justify-start">
              Settings
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
