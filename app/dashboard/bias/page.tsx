"use client";

import { useMemo } from "react";
import { calculateBiasMetrics, getOverallStatistics } from "@/lib/metrics";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Activity,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function BiasPage() {
  const biasMetrics = useMemo(() => calculateBiasMetrics(), []);
  const overallStats = useMemo(() => getOverallStatistics(), []);

  const flaggedMetrics = biasMetrics.filter((m) => m.isFlagged);

  // Group metrics by type
  const metricsByType = useMemo(() => {
    const grouped: Record<string, typeof biasMetrics> = {};
    biasMetrics.forEach((metric) => {
      if (!grouped[metric.metricType]) {
        grouped[metric.metricType] = [];
      }
      grouped[metric.metricType].push(metric);
    });
    return grouped;
  }, [biasMetrics]);

  const formatPercentage = (value: number) => `${(value * 100).toFixed(1)}%`;
  const formatDecimal = (value: number) => value.toFixed(3);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Bias & Monitoring</h1>
        <p className="text-muted-foreground mt-2">
          Fairness metrics and demographic equity analysis
        </p>
      </div>

      {/* Alert Banner if Flagged Metrics */}
      {flaggedMetrics.length > 0 && (
        <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/20">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-900 dark:text-amber-100">
                  {flaggedMetrics.length} Subgroup
                  {flaggedMetrics.length > 1 ? "s" : ""} Flagged
                </p>
                <p className="text-sm text-amber-800 dark:text-amber-200 mt-1">
                  Disparity exceeds threshold (10%) in the following subgroups.
                  Review recommended actions below.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Overall Performance Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Accuracy</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPercentage(overallStats.accuracy)}
            </div>
            <p className="text-xs text-muted-foreground">
              Overall model accuracy
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Precision</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPercentage(overallStats.precision)}
            </div>
            <p className="text-xs text-muted-foreground">
              Positive predictive value
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recall</CardTitle>
            <Activity className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPercentage(overallStats.recall)}
            </div>
            <p className="text-xs text-muted-foreground">Sensitivity</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg Confidence
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPercentage(overallStats.avgConfidence)}
            </div>
            <p className="text-xs text-muted-foreground">Model confidence</p>
          </CardContent>
        </Card>
      </div>

      {/* Confusion Matrix */}
      <Card>
        <CardHeader>
          <CardTitle>Confusion Matrix</CardTitle>
          <CardDescription>
            Performance breakdown across ground truth labels
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 max-w-2xl">
            <div></div>
            <div className="text-center font-semibold text-sm">
              Predicted Positive
            </div>
            <div className="text-center font-semibold text-sm">
              Predicted Negative
            </div>

            <div className="font-semibold text-sm">Actually Positive</div>
            <Card className="bg-green-50 dark:bg-green-950/20">
              <CardContent className="pt-6 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {overallStats.truePositives}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  True Positives
                </p>
              </CardContent>
            </Card>
            <Card className="bg-red-50 dark:bg-red-950/20">
              <CardContent className="pt-6 text-center">
                <div className="text-2xl font-bold text-red-600">
                  {overallStats.falseNegatives}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  False Negatives
                </p>
              </CardContent>
            </Card>

            <div className="font-semibold text-sm">Actually Negative</div>
            <Card className="bg-orange-50 dark:bg-orange-950/20">
              <CardContent className="pt-6 text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {overallStats.falsePositives}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  False Positives
                </p>
              </CardContent>
            </Card>
            <Card className="bg-blue-50 dark:bg-blue-950/20">
              <CardContent className="pt-6 text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {overallStats.trueNegatives}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  True Negatives
                </p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Bias Metrics by Subgroup Type */}
      {Object.entries(metricsByType).map(([type, metrics]) => (
        <Card key={type}>
          <CardHeader>
            <CardTitle>{type}</CardTitle>
            <CardDescription>
              Performance metrics across {type.toLowerCase()} subgroups
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Subgroup</TableHead>
                  <TableHead>Total Cases</TableHead>
                  <TableHead>Selection Rate</TableHead>
                  <TableHead>False Positive Rate</TableHead>
                  <TableHead>False Negative Rate</TableHead>
                  <TableHead>Avg Confidence</TableHead>
                  <TableHead>Disparity</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {metrics.map((metric) => (
                  <TableRow
                    key={metric.id}
                    className={
                      metric.isFlagged ? "bg-amber-50 dark:bg-amber-950/10" : ""
                    }
                  >
                    <TableCell className="font-medium">
                      {metric.subgroup}
                    </TableCell>
                    <TableCell>{metric.totalCases}</TableCell>
                    <TableCell>
                      {formatPercentage(metric.selectionRate)}
                    </TableCell>
                    <TableCell>
                      {formatPercentage(metric.falsePositiveRate)}
                    </TableCell>
                    <TableCell>
                      {formatPercentage(metric.falseNegativeRate)}
                    </TableCell>
                    <TableCell>
                      {formatPercentage(metric.averageConfidence)}
                    </TableCell>
                    <TableCell>{formatDecimal(metric.disparity)}</TableCell>
                    <TableCell>
                      {metric.isFlagged ? (
                        <Badge
                          variant="outline"
                          className="text-amber-600 border-amber-600"
                        >
                          Flagged
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="text-green-600 border-green-600"
                        >
                          OK
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ))}

      {/* Mitigation Actions */}
      {flaggedMetrics.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recommended Mitigation Actions</CardTitle>
            <CardDescription>
              Steps to address flagged disparities
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {flaggedMetrics.map((metric) => (
              <div key={metric.id} className="border-l-4 border-amber-500 pl-4">
                <h4 className="font-semibold text-sm mb-2">
                  {metric.metricType}: {metric.subgroup}
                </h4>
                <ul className="space-y-1">
                  {metric.recommendedActions.map((action, idx) => (
                    <li
                      key={idx}
                      className="text-sm text-muted-foreground flex items-start gap-2"
                    >
                      <span className="mt-1">•</span>
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Demo Disclaimer */}
      <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/20">
        <CardContent className="pt-6">
          <p className="text-sm text-amber-800 dark:text-amber-200">
            ⚠️ <strong>Demo Prototype:</strong> Bias metrics are calculated from
            simulated data for demonstration purposes only. In production, these
            metrics would be computed on real holdout test sets with validated
            ground truth labels.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
