"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  getCaseById,
  getFindingsByCaseId,
  getNextCase,
  getPreviousCase,
} from "@/lib/mockData";
import { getCaseFindings, summarizeRationale } from "@/lib/mockAi";
import { Case, Finding } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChatAssistant } from "@/components/dashboard/ChatAssistant";
import { DecisionWidget } from "@/components/dashboard/DecisionWidget";
import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";

export default function CaseViewerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();

  const [caseData, setCaseData] = useState<Case | null>(null);
  const [findings, setFindings] = useState<Finding[]>([]);
  const [rationale, setRationale] = useState<string>("");
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [manualMode, setManualMode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCaseData = async () => {
      setLoading(true);
      const foundCase = getCaseById(resolvedParams.id);
      if (foundCase) {
        setCaseData(foundCase);
        const fetchedFindings = await getCaseFindings(foundCase.id);
        setFindings(fetchedFindings);
        const fetchedRationale = await summarizeRationale(foundCase.id);
        setRationale(fetchedRationale);
      }
      setLoading(false);
    };

    fetchCaseData();
  }, [resolvedParams.id]);

  const handlePrevious = () => {
    if (!caseData) return;
    const prev = getPreviousCase(caseData.id);
    if (prev) router.push(`/dashboard/case/${prev.id}`);
  };

  const handleNext = () => {
    if (!caseData) return;
    const next = getNextCase(caseData.id);
    if (next) router.push(`/dashboard/case/${next.id}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="space-y-6">
        <Card className="border-red-200 bg-red-50 dark:bg-red-950/20">
          <CardContent className="pt-6">
            <p className="text-sm text-red-800 dark:text-red-200">
              Case not found. Please return to the queue and select a valid
              case.
            </p>
            <Link href="/dashboard/queue">
              <Button className="mt-4" variant="outline">
                Return to Queue
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getRiskColor = (score: number) => {
    if (score > 85) return "text-red-500";
    if (score > 70) return "text-orange-500";
    if (score > 50) return "text-yellow-500";
    return "text-green-500";
  };

  const hasNextCase = getNextCase(caseData.id) !== undefined;
  const hasPreviousCase = getPreviousCase(caseData.id) !== undefined;

  const handleChatAction = (action: string, payload?: any) => {
    switch (action) {
      case "toggle-heatmap":
        setShowHeatmap(!showHeatmap);
        break;
      case "next-case":
        handleNext();
        break;
      case "go-to-decision":
        router.push(`/dashboard/decision/${caseData.id}`);
        break;
      case "summarize":
        // Scroll to findings section
        window.scrollTo({ top: 400, behavior: "smooth" });
        break;
      default:
        console.log("Unknown action:", action);
    }
  };

  return (
    <div className="space-y-6">
      &lt;
      {/* Header with Navigation */}
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/dashboard/queue"
            className="text-sm text-muted-foreground hover:underline mb-2 inline-block"
          >
            ← Back to Queue
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">{caseData.id}</h1>
          <p className="text-muted-foreground mt-1">
            Patient: {caseData.patientMaskedId}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevious}
            disabled={!hasPreviousCase}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNext}
            disabled={!hasNextCase}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
      {/* Uncertainty Alert */}
      {caseData.uncertaintyFlag && (
        <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/20">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-900 dark:text-amber-100">
                  Uncertainty Detected
                </p>
                <p className="text-sm text-amber-800 dark:text-amber-200 mt-1">
                  The AI has low confidence (
                  {Math.round(caseData.confidence * 100)}%) in this assessment.
                  Consider requesting a second radiologist review or enabling
                  manual review mode.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Image Viewer (2/3 width) */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Image Viewer</CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant={showHeatmap ? "default" : "outline"}
                    size="sm"
                    onClick={() => setShowHeatmap(!showHeatmap)}
                  >
                    {showHeatmap ? (
                      <Eye className="h-4 w-4 mr-2" />
                    ) : (
                      <EyeOff className="h-4 w-4 mr-2" />
                    )}
                    Heatmap
                  </Button>
                  <Button
                    variant={manualMode ? "default" : "outline"}
                    size="sm"
                    onClick={() => setManualMode(!manualMode)}
                  >
                    {manualMode ? "AI Assist" : "Manual Review"}
                  </Button>
                </div>
              </div>
              <CardDescription>
                {manualMode
                  ? "Manual review mode: AI annotations hidden"
                  : "AI-assisted view with findings overlay"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Placeholder Image with Heatmap */}
              <div className="relative bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden aspect-[4/3]">
                {/* Simulated mammogram image */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg
                    viewBox="0 0 400 300"
                    className="w-full h-full"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* Background tissue pattern */}
                    <rect width="400" height="300" fill="#d0d0d0" />
                    <circle
                      cx="200"
                      cy="150"
                      r="120"
                      fill="#b0b0b0"
                      opacity="0.5"
                    />
                    <circle
                      cx="250"
                      cy="180"
                      r="80"
                      fill="#a0a0a0"
                      opacity="0.4"
                    />

                    {/* Heatmap overlay */}
                    {showHeatmap &&
                      !manualMode &&
                      findings.length > 0 &&
                      findings[0].heatmapRegions.map((region, idx) => {
                        const x = region.x * 400;
                        const y = region.y * 300;
                        const w = region.w * 400;
                        const h = region.h * 300;
                        const opacity = region.intensity * 0.6;
                        const color =
                          region.intensity > 0.7
                            ? "#ef4444"
                            : region.intensity > 0.5
                            ? "#f97316"
                            : "#eab308";

                        return (
                          <rect
                            key={idx}
                            x={x}
                            y={y}
                            width={w}
                            height={h}
                            fill={color}
                            opacity={opacity}
                            stroke={color}
                            strokeWidth="2"
                          />
                        );
                      })}

                    <text
                      x="200"
                      y="290"
                      textAnchor="middle"
                      fontSize="12"
                      fill="#666"
                    >
                      Simulated Mammogram Image - Demo Only
                    </text>
                  </svg>
                </div>
              </div>

              {/* Image Controls */}
              <div className="mt-4 flex gap-2 text-sm text-muted-foreground">
                <span>
                  Modality:{" "}
                  <strong className="text-foreground capitalize">
                    {caseData.modality}
                  </strong>
                </span>
                <span className="mx-2">•</span>
                <span>
                  Density:{" "}
                  <strong className="text-foreground uppercase">
                    {caseData.densityCategory.split("-")[1]}
                  </strong>
                </span>
                <span className="mx-2">•</span>
                <span>
                  Device:{" "}
                  <strong className="text-foreground">
                    {caseData.deviceType}
                  </strong>
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Top Reasons Panel */}
          {!manualMode && (
            <Card>
              <CardHeader>
                <CardTitle>AI Findings & Rationale</CardTitle>
                <CardDescription>
                  Top reasons for risk assessment
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm leading-relaxed">{rationale}</p>
                </div>

                {findings.length > 0 && (
                  <div className="border-t pt-4">
                    <h4 className="font-semibold text-sm mb-2">
                      Key Observations:
                    </h4>
                    <ul className="space-y-2">
                      {findings[0].rationaleBullets.map((bullet, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2 text-sm"
                        >
                          <span className="text-muted-foreground mt-0.5">
                            •
                          </span>
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Case Details Sidebar (1/3 width) */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Case Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Risk Score
                </label>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className={`text-3xl font-bold ${getRiskColor(
                      caseData.riskScore
                    )}`}
                  >
                    {caseData.riskScore}
                  </span>
                  <span className="text-muted-foreground">/100</span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Confidence
                </label>
                <div className="mt-1">
                  <Badge
                    variant={caseData.confidence >= 0.7 ? "default" : "outline"}
                  >
                    {Math.round(caseData.confidence * 100)}%
                  </Badge>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Status
                </label>
                <div className="mt-1">
                  <Badge variant="outline" className="capitalize">
                    {caseData.status.replace(/-/g, " ")}
                  </Badge>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Age Band
                </label>
                <p className="text-sm mt-1">{caseData.ageBand} years</p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Created
                </label>
                <p className="text-sm mt-1">
                  {new Date(caseData.createdAt).toLocaleString()}
                </p>
              </div>

              {caseData.notes && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Notes
                  </label>
                  <p className="text-sm mt-1">{caseData.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link
                href={`/dashboard/decision/${caseData.id}`}
                className="block"
              >
                <Button className="w-full" variant="default">
                  Go to Decision
                </Button>
              </Link>
              <Button
                className="w-full"
                variant="outline"
                onClick={handleNext}
                disabled={!hasNextCase}
              >
                Next Case
              </Button>
              <Button
                className="w-full"
                variant="outline"
                onClick={handlePrevious}
                disabled={!hasPreviousCase}
              >
                Previous Case
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      {/* Floating Chat Assistant */}
      <ChatAssistant caseId={caseData.id} onAction={handleChatAction} />
      {/* Demo Disclaimer */}
      <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/20">
        <CardContent className="pt-6">
          <p className="text-sm text-amber-800 dark:text-amber-200">
            ⚠️ <strong>Demo Prototype:</strong> Simulated image and findings for
            demonstration only. Not for use with real patient data or clinical
            decision-making.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
