// Bias monitoring and metrics calculation for MammoAssist

import { Case, BiasMetric } from './types';
import { mockCases } from './mockData';

// Calculate bias metrics across subgroups
export function calculateBiasMetrics(): BiasMetric[] {
  const metrics: BiasMetric[] = [];

  // Group cases by subgroup attributes
  const groupByAgeBand = groupBy(mockCases, 'ageBand');
  const groupByDevice = groupBy(mockCases, 'deviceType');
  const groupByDensity = groupBy(mockCases, 'densityCategory');

  // Calculate metrics for age bands
  metrics.push(...calculateSubgroupMetrics('Age Band', groupByAgeBand));

  // Calculate metrics for device types
  metrics.push(...calculateSubgroupMetrics('Device Type', groupByDevice));

  // Calculate metrics for density categories
  metrics.push(...calculateSubgroupMetrics('Density Category', groupByDensity));

  return metrics;
}

function groupBy(cases: Case[], key: 'ageBand' | 'deviceType' | 'densityCategory'): Record<string, Case[]> {
  return cases.reduce((acc, caseItem) => {
    const value = caseItem[key];
    if (!acc[value]) {
      acc[value] = [];
    }
    acc[value].push(caseItem);
    return acc;
  }, {} as Record<string, Case[]>);
}

function calculateSubgroupMetrics(metricType: string, groupedCases: Record<string, Case[]>): BiasMetric[] {
  const metrics: BiasMetric[] = [];
  const overallStats = calculateStats(Object.values(groupedCases).flat());

  for (const [subgroup, cases] of Object.entries(groupedCases)) {
    const stats = calculateStats(cases);
    
    // Calculate disparity (difference from overall rate)
    const falsePositiveDisparity = Math.abs(stats.falsePositiveRate - overallStats.falsePositiveRate);
    const falseNegativeDisparity = Math.abs(stats.falseNegativeRate - overallStats.falseNegativeRate);

    // Flag if disparity exceeds threshold (10%)
    const isFlagged = falsePositiveDisparity > 0.1 || falseNegativeDisparity > 0.1;

    // Generate recommendations if flagged
    const recommendedActions = isFlagged
      ? [
          'Review training data distribution for this subgroup',
          'Consider rebalancing dataset or applying fairness constraints',
          'Conduct expert review of cases in this subgroup',
          'Monitor closely in future evaluations',
        ]
      : [];

    metrics.push({
      id: `${metricType.toLowerCase().replace(/\s+/g, '-')}-${subgroup}`,
      metricType,
      subgroup: formatSubgroupLabel(subgroup),
      totalCases: cases.length,
      selectionRate: stats.selectionRate,
      falsePositiveRate: stats.falsePositiveRate,
      falseNegativeRate: stats.falseNegativeRate,
      averageConfidence: stats.averageConfidence,
      disparity: Math.max(falsePositiveDisparity, falseNegativeDisparity),
      isFlagged,
      recommendedActions,
    });
  }

  return metrics;
}

function calculateStats(cases: Case[]) {
  const total = cases.length;
  const highRisk = cases.filter(c => c.riskScore > 75).length;
  const selectionRate = highRisk / total;

  // Calculate false positives and negatives using ground truth
  const falsePositives = cases.filter(c => c.riskScore > 75 && c.groundTruth === 'benign').length;
  const falseNegatives = cases.filter(c => c.riskScore <= 75 && c.groundTruth === 'malignant').length;

  const benignCases = cases.filter(c => c.groundTruth === 'benign').length;
  const malignantCases = cases.filter(c => c.groundTruth === 'malignant').length;

  const falsePositiveRate = benignCases > 0 ? falsePositives / benignCases : 0;
  const falseNegativeRate = malignantCases > 0 ? falseNegatives / malignantCases : 0;

  const averageConfidence = cases.reduce((sum, c) => sum + c.confidence, 0) / total;

  return {
    selectionRate,
    falsePositiveRate,
    falseNegativeRate,
    averageConfidence,
  };
}

function formatSubgroupLabel(subgroup: string): string {
  // Convert hyphenated or underscored strings to readable labels
  return subgroup
    .split(/[-_]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Get overall statistics
export function getOverallStatistics() {
  const total = mockCases.length;
  const highRisk = mockCases.filter(c => c.riskScore > 75).length;
  const uncertain = mockCases.filter(c => c.uncertaintyFlag).length;
  const avgConfidence = mockCases.reduce((sum, c) => sum + c.confidence, 0) / total;

  // Calculate metrics using ground truth
  const truePositives = mockCases.filter(c => c.riskScore > 75 && c.groundTruth === 'malignant').length;
  const falsePositives = mockCases.filter(c => c.riskScore > 75 && c.groundTruth === 'benign').length;
  const trueNegatives = mockCases.filter(c => c.riskScore <= 75 && c.groundTruth === 'benign').length;
  const falseNegatives = mockCases.filter(c => c.riskScore <= 75 && c.groundTruth === 'malignant').length;

  const accuracy = (truePositives + trueNegatives) / total;
  const precision = (truePositives + falsePositives) > 0 ? truePositives / (truePositives + falsePositives) : 0;
  const recall = (truePositives + falseNegatives) > 0 ? truePositives / (truePositives + falseNegatives) : 0;

  return {
    total,
    highRisk,
    uncertain,
    avgConfidence,
    accuracy,
    precision,
    recall,
    truePositives,
    falsePositives,
    trueNegatives,
    falseNegatives,
  };
}
