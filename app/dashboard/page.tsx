"use client";

import { useState, useMemo } from "react";
import { APP_NAME } from "@/lib/brand";
import { mockCases } from "@/lib/mockData";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChatAssistant } from "@/components/dashboard/ChatAssistant";
import { ImageScanCard } from "@/components/dashboard/ImageScanCard";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  TrendingUp,
  ArrowRight,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const [showChat, setShowChat] = useState(false);

  // Calculate real-time stats from mock data
  const stats = useMemo(() => {
    const pending = mockCases.filter((c) => c.status === "pending").length;
    const highRisk = mockCases.filter((c) => c.riskScore > 75).length;
    const avgConfidence =
      mockCases.reduce((sum, c) => sum + c.confidence, 0) / mockCases.length;
    const todayReviews = mockCases.filter(
      (c) =>
        c.status === "finalized" &&
        new Date(c.createdAt).toDateString() === new Date().toDateString()
    ).length;

    return { pending, highRisk, avgConfidence, todayReviews };
  }, []);

  // Get high priority cases
  const highPriorityCases = useMemo(() => {
    return mockCases
      .filter(
        (c) => (c.riskScore > 75 || c.uncertaintyFlag) && c.status === "pending"
      )
      .sort((a, b) => b.riskScore - a.riskScore)
      .slice(0, 5);
  }, []);

  const handleChatAction = (action: string, payload?: any) => {
    switch (action) {
      case "next-case":
        router.push("/dashboard/queue");
        break;
      default:
        console.log("Unknown action:", action);
    }
  };

  const getRiskBadge = (score: number) => {
    if (score > 85) return <Badge variant="destructive">High: {score}</Badge>;
    if (score > 70) return <Badge variant="default">Elevated: {score}</Badge>;
    return <Badge variant="secondary">Medium: {score}</Badge>;
  };

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
          value={stats.pending}
          hint="Awaiting review"
          icon={Clock}
        />
        <StatCard
          label="Today's Reviews"
          value={stats.todayReviews}
          hint="Completed today"
          icon={CheckCircle2}
        />
        <StatCard
          label="High Risk"
          value={stats.highRisk}
          hint="Require attention"
          icon={AlertCircle}
        />
        <StatCard
          label="AI Confidence"
          value={`${Math.round(stats.avgConfidence * 100)}%`}
          hint="Average across queue"
          icon={TrendingUp}
        />
      </div>

      {/* High Priority Cases */}
      {highPriorityCases.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">High Priority Cases</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Cases requiring immediate attention
                </p>
              </div>
              <Link href="/dashboard/queue">
                <Button variant="outline" size="sm">
                  View All
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="font-semibold">Case ID</TableHead>
                    <TableHead className="font-semibold">Patient</TableHead>
                    <TableHead className="font-semibold">Risk</TableHead>
                    <TableHead className="font-semibold">Confidence</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="text-right font-semibold">
                      Action
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {highPriorityCases.map((caseItem) => (
                    <TableRow key={caseItem.id}>
                      <TableCell className="font-mono text-sm">
                        {caseItem.id}
                        {caseItem.uncertaintyFlag && (
                          <Badge
                            variant="outline"
                            className="ml-2 text-xs border-amber-400 text-amber-700"
                          >
                            !
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-sm">
                        {caseItem.patientMaskedId}
                      </TableCell>
                      <TableCell>{getRiskBadge(caseItem.riskScore)}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            caseItem.confidence >= 0.7 ? "outline" : "secondary"
                          }
                        >
                          {Math.round(caseItem.confidence * 100)}%
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="capitalize">
                          {caseItem.status.replace(/-/g, " ")}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Link href={`/dashboard/case/${caseItem.id}`}>
                          <Button variant="ghost" size="sm">
                            Review
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Image Scan Card */}
      <ImageScanCard />

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            <Link href="/dashboard/queue">
              <Button variant="outline" className="w-full justify-start">
                <Clock className="h-4 w-4 mr-2" />
                View Case Queue
              </Button>
            </Link>
            <Link href="/dashboard/audit">
              <Button variant="outline" className="w-full justify-start">
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Audit Log
              </Button>
            </Link>
            <Link href="/dashboard/bias">
              <Button variant="outline" className="w-full justify-start">
                <TrendingUp className="h-4 w-4 mr-2" />
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

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">AI Assistant</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Ask questions about cases, navigate the dashboard, or get help
              understanding AI decisions.
            </p>
            <Button
              variant="default"
              className="w-full"
              onClick={() => setShowChat(!showChat)}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              {showChat ? "Hide" : "Open"} Chat Assistant
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Floating Chat Assistant */}
      {showChat && (
        <div className="fixed right-4 bottom-4 w-96 h-[600px] z-50">
          <ChatAssistant onAction={handleChatAction} compact={false} />
        </div>
      )}
    </div>
  );
}
