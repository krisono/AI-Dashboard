"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { mockCases } from "@/lib/mockData";
import { Case, QueueFilters } from "@/lib/types";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { EmptyState } from "@/components/common/EmptyState";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertTriangle,
  Clock,
  Search,
  Inbox,
  CheckCircle,
  XCircle,
  Eye,
} from "lucide-react";

export default function QueuePage() {
  const [filters, setFilters] = useState<QueueFilters>({
    status: [],
    riskRange: [0, 100],
    confidenceRange: [0, 1],
    uncertaintyOnly: false,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [quickActionCase, setQuickActionCase] = useState<Case | null>(null);
  const [showQuickAction, setShowQuickAction] = useState(false);

  // Apply filters
  const filteredCases = useMemo(() => {
    return mockCases.filter((c) => {
      if (filters.status.length > 0 && !filters.status.includes(c.status))
        return false;
      if (
        c.riskScore < filters.riskRange[0] ||
        c.riskScore > filters.riskRange[1]
      )
        return false;
      if (
        c.confidence < filters.confidenceRange[0] ||
        c.confidence > filters.confidenceRange[1]
      )
        return false;
      if (filters.uncertaintyOnly && !c.uncertaintyFlag) return false;
      if (
        searchQuery &&
        !c.id.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !c.patientMaskedId.toLowerCase().includes(searchQuery.toLowerCase())
      )
        return false;
      return true;
    });
  }, [filters, searchQuery]);

  // Sort by risk score descending
  const sortedCases = useMemo(() => {
    return [...filteredCases].sort((a, b) => b.riskScore - a.riskScore);
  }, [filteredCases]);

  // Calculate statistics
  const stats = useMemo(() => {
    const highRisk = mockCases.filter((c) => c.riskScore > 75).length;
    const uncertain = mockCases.filter((c) => c.uncertaintyFlag).length;
    const pending = mockCases.filter((c) => c.status === "pending").length;
    const finalized = mockCases.filter((c) => c.status === "finalized").length;

    return { highRisk, uncertain, pending, finalized };
  }, []);

  // Quick filter actions
  const applyQuickFilter = (type: "all" | "high-risk" | "uncertain") => {
    switch (type) {
      case "all":
        setFilters({
          status: [],
          riskRange: [0, 100],
          confidenceRange: [0, 1],
          uncertaintyOnly: false,
        });
        break;
      case "high-risk":
        setFilters({
          status: [],
          riskRange: [75, 100],
          confidenceRange: [0, 1],
          uncertaintyOnly: false,
        });
        break;
      case "uncertain":
        setFilters({
          status: [],
          riskRange: [0, 100],
          confidenceRange: [0, 1],
          uncertaintyOnly: true,
        });
        break;
    }
  };

  const getRiskBadge = (score: number) => {
    if (score > 85) return <Badge variant="destructive">High: {score}</Badge>;
    if (score > 70) return <Badge variant="default">Elevated: {score}</Badge>;
    if (score > 50) return <Badge variant="secondary">Medium: {score}</Badge>;
    return <Badge variant="outline">Low: {score}</Badge>;
  };

  const getConfidenceBadge = (confidence: number) => {
    const pct = Math.round(confidence * 100);
    if (confidence >= 0.8) return <Badge variant="outline">{pct}%</Badge>;
    if (confidence >= 0.6)
      return (
        <Badge variant="secondary" className="bg-amber-100 text-amber-900">
          {pct}%
        </Badge>
      );
    return (
      <Badge variant="secondary" className="bg-orange-100 text-orange-900">
        {pct}%
      </Badge>
    );
  };

  const getStatusBadge = (status: Case["status"]) => {
    const labels = {
      pending: "Pending",
      "in-review": "In Review",
      "needs-second-review": "2nd Review",
      finalized: "Finalized",
    };
    const variants: Record<
      Case["status"],
      "default" | "outline" | "secondary" | "destructive"
    > = {
      pending: "secondary",
      "in-review": "default",
      "needs-second-review": "destructive",
      finalized: "outline",
    };
    return <Badge variant={variants[status]}>{labels[status]}</Badge>;
  };

  const handleQuickAction = (caseItem: Case, e: React.MouseEvent) => {
    e.stopPropagation();
    setQuickActionCase(caseItem);
    setShowQuickAction(true);
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-6 space-y-6">
      <PageHeader
        title="Case Queue"
        subtitle="Review and prioritize cases by risk and confidence"
      />

      {/* Stats Row */}
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard
          label="High Risk"
          value={stats.highRisk}
          hint="Risk score > 75"
          icon={AlertTriangle}
        />
        <StatCard
          label="Uncertain"
          value={stats.uncertain}
          hint="Flagged for review"
          icon={Clock}
        />
        <StatCard
          label="Pending"
          value={stats.pending}
          hint="Awaiting first review"
        />
        <StatCard
          label="Finalized"
          value={stats.finalized}
          hint="Review complete"
        />
      </div>

      {/* Filter Toolbar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by case ID or patient ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={filters.riskRange[0] === 0 ? "outline" : "default"}
                size="sm"
                onClick={() => applyQuickFilter("all")}
              >
                All
              </Button>
              <Button
                variant={filters.riskRange[0] === 75 ? "default" : "outline"}
                size="sm"
                onClick={() => applyQuickFilter("high-risk")}
              >
                High Risk
              </Button>
              <Button
                variant={filters.uncertaintyOnly ? "default" : "outline"}
                size="sm"
                onClick={() => applyQuickFilter("uncertain")}
              >
                Uncertain
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cases Table */}
      {sortedCases.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <EmptyState
              icon={Inbox}
              title="No cases found"
              description="Try adjusting your filters or search query"
              action={{
                label: "Clear Filters",
                onClick: () => {
                  applyQuickFilter("all");
                  setSearchQuery("");
                },
              }}
            />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground mb-4">
              Showing {sortedCases.length} of {mockCases.length} cases (sorted
              by risk)
            </div>
            <div className="border rounded-lg">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="font-semibold">Case ID</TableHead>
                    <TableHead className="font-semibold">Patient</TableHead>
                    <TableHead className="font-semibold">Risk</TableHead>
                    <TableHead className="font-semibold">Confidence</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold">Date</TableHead>
                    <TableHead className="text-right font-semibold">
                      Action
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedCases.map((caseItem) => (
                    <TableRow
                      key={caseItem.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() =>
                        (window.location.href = `/dashboard/case/${caseItem.id}`)
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          window.location.href = `/dashboard/case/${caseItem.id}`;
                        }
                      }}
                      tabIndex={0}
                      role="link"
                      aria-label={`View case ${caseItem.id}`}
                    >
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
                        {getConfidenceBadge(caseItem.confidence)}
                      </TableCell>
                      <TableCell>{getStatusBadge(caseItem.status)}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(caseItem.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Link href={`/dashboard/case/${caseItem.id}`}>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </Link>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => handleQuickAction(caseItem, e)}
                          >
                            Quick Action
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Action Dialog */}
      <Dialog open={showQuickAction} onOpenChange={setShowQuickAction}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Quick Actions</DialogTitle>
            <DialogDescription>
              {quickActionCase && (
                <>
                  Case {quickActionCase.id} • Risk: {quickActionCase.riskScore}
                  /100
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <Link href={`/dashboard/case/${quickActionCase?.id}`}>
              <Button variant="outline" className="w-full justify-start">
                <Eye className="h-4 w-4 mr-2" />
                View Full Case Details
              </Button>
            </Link>
            <Link href={`/dashboard/decision/${quickActionCase?.id}`}>
              <Button variant="outline" className="w-full justify-start">
                <CheckCircle className="h-4 w-4 mr-2" />
                Make Decision
              </Button>
            </Link>
            {quickActionCase && quickActionCase.riskScore > 75 && (
              <div className="bg-amber-50 dark:bg-amber-950/20 p-3 rounded-lg text-sm">
                <AlertTriangle className="h-4 w-4 inline mr-2 text-amber-600" />
                <span className="text-amber-800 dark:text-amber-200">
                  High-risk case. Full review recommended before decision.
                </span>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowQuickAction(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
