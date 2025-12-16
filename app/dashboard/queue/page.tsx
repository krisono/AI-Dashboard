"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { mockCases } from "@/lib/mockData";
import { Case, QueueFilters } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AlertTriangle, TrendingUp, Clock, CheckCircle2 } from "lucide-react";

export default function QueuePage() {
  const [filters, setFilters] = useState<QueueFilters>({
    status: [],
    riskRange: [0, 100],
    confidenceRange: [0, 1],
    uncertaintyOnly: false,
  });

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
      return true;
    });
  }, [filters]);

  // Sort by risk score descending
  const sortedCases = useMemo(() => {
    return [...filteredCases].sort((a, b) => b.riskScore - a.riskScore);
  }, [filteredCases]);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = sortedCases.length;
    const highRisk = sortedCases.filter((c) => c.riskScore > 75).length;
    const needsReview = sortedCases.filter(
      (c) => c.status === "needs-second-review" || c.uncertaintyFlag
    ).length;
    const lowConfidence = sortedCases.filter((c) => c.confidence < 0.6).length;

    return { total, highRisk, needsReview, lowConfidence };
  }, [sortedCases]);

  // Quick filter actions
  const applyQuickFilter = (
    type: "all" | "high-risk" | "uncertain" | "low-confidence"
  ) => {
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
      case "low-confidence":
        setFilters({
          status: [],
          riskRange: [0, 100],
          confidenceRange: [0, 0.6],
          uncertaintyOnly: false,
        });
        break;
    }
  };

  const getRiskBadgeVariant = (score: number) => {
    if (score > 85) return "destructive";
    if (score > 70) return "default";
    if (score > 50) return "secondary";
    return "outline";
  };

  const getConfidenceBadgeVariant = (confidence: number) => {
    if (confidence >= 0.8) return "default";
    if (confidence >= 0.6) return "secondary";
    return "outline";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Case Queue</h1>
        <p className="text-muted-foreground mt-2">
          Review and prioritize pending mammography cases
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cases</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">In current queue</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Risk</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              {stats.highRisk}
            </div>
            <p className="text-xs text-muted-foreground">Risk score &gt; 75</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Needs Review</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-500">
              {stats.needsReview}
            </div>
            <p className="text-xs text-muted-foreground">
              Uncertain or flagged
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Low Confidence
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">
              {stats.lowConfidence}
            </div>
            <p className="text-xs text-muted-foreground">Confidence &lt; 60%</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Filters</CardTitle>
          <CardDescription>Filter cases by priority and status</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => applyQuickFilter("all")}
          >
            All Cases
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => applyQuickFilter("high-risk")}
          >
            High Risk (&gt;75)
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => applyQuickFilter("uncertain")}
          >
            Uncertain Only
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => applyQuickFilter("low-confidence")}
          >
            Low Confidence (&lt;60%)
          </Button>
        </CardContent>
      </Card>

      {/* Cases Table */}
      <Card>
        <CardHeader>
          <CardTitle>Cases ({sortedCases.length})</CardTitle>
          <CardDescription>
            Sorted by risk score (highest first)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Case ID</TableHead>
                <TableHead>Patient ID</TableHead>
                <TableHead>Modality</TableHead>
                <TableHead>Risk Score</TableHead>
                <TableHead>Confidence</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedCases.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center text-muted-foreground"
                  >
                    No cases match the current filters
                  </TableCell>
                </TableRow>
              ) : (
                sortedCases.map((caseItem) => (
                  <TableRow
                    key={caseItem.id}
                    className="hover:bg-muted/50 cursor-pointer"
                  >
                    <TableCell className="font-medium">
                      <Link
                        href={`/dashboard/case/${caseItem.id}`}
                        className="hover:underline"
                      >
                        {caseItem.id}
                      </Link>
                    </TableCell>
                    <TableCell>{caseItem.patientMaskedId}</TableCell>
                    <TableCell className="capitalize">
                      {caseItem.modality}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={getRiskBadgeVariant(caseItem.riskScore)}
                        >
                          {caseItem.riskScore}
                        </Badge>
                        {caseItem.uncertaintyFlag && (
                          <Badge
                            variant="outline"
                            className="text-amber-500 border-amber-500"
                          >
                            UNCERTAIN
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={getConfidenceBadgeVariant(caseItem.confidence)}
                      >
                        {Math.round(caseItem.confidence * 100)}%
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {caseItem.status.replace(/-/g, " ")}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(caseItem.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/dashboard/case/${caseItem.id}`}>
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Demo Disclaimer */}
      <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/20">
        <CardContent className="pt-6">
          <p className="text-sm text-amber-800 dark:text-amber-200">
            ⚠️ <strong>Demo Prototype:</strong> This queue displays simulated
            cases for demonstration purposes only. Not for use with real patient
            data or clinical decision-making.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
