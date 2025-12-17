"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getCaseById, mockAuditEvents, mockDecisions } from "@/lib/mockData";
import { Case, Decision, AuditEvent } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertCircle,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
} from "lucide-react";

export default function DecisionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();

  const [caseData, setCaseData] = useState<Case | null>(null);
  const [feedbackNote, setFeedbackNote] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingAction, setPendingAction] = useState<
    "confirm" | "reject" | "second-review" | null
  >(null);
  const [draftReport, setDraftReport] = useState("");

  useEffect(() => {
    const foundCase = getCaseById(resolvedParams.id);
    if (foundCase) {
      setCaseData(foundCase);
    }
  }, [resolvedParams.id]);

  const availableTags = [
    "Agreed with AI",
    "Disagreed with AI",
    "Image Quality Issue",
    "Dense Tissue",
    "Prior Studies Needed",
    "Patient History Relevant",
    "Technical Artifact",
    "Requires Biopsy",
    "Follow-up Recommended",
  ];

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleActionClick = (
    action: "confirm" | "reject" | "second-review"
  ) => {
    if (!caseData) return;

    // High risk cases require confirmation
    if (caseData.riskScore > 75 || caseData.uncertaintyFlag) {
      setPendingAction(action);
      setShowConfirmation(true);
    } else {
      executeAction(action);
    }
  };

  const executeAction = (action: "confirm" | "reject" | "second-review") => {
    if (!caseData) return;

    // Create audit event
    const auditEvent: AuditEvent = {
      id: `AUD-${Date.now()}`,
      timestamp: new Date().toISOString(),
      user: "Dr. Demo User",
      caseId: caseData.id,
      action: "decision-made",
      details: `Decision: ${action}, Tags: ${selectedTags.join(
        ", "
      )}, Note: ${feedbackNote}`,
    };

    mockAuditEvents.push(auditEvent);

    // Create decision record
    const decision: Decision = {
      id: `DEC-${Date.now()}`,
      caseId: caseData.id,
      timestamp: new Date().toISOString(),
      decision:
        action === "confirm"
          ? "confirm-finding"
          : action === "reject"
          ? "reject-finding"
          : "request-second-review",
      userId: "Dr. Demo User",
      feedbackNote,
      feedbackTags: selectedTags,
      draftReport: draftReport || "",
      requiresConfirmation: caseData.riskScore > 75 || caseData.uncertaintyFlag,
    };

    mockDecisions.push(decision);

    // In a real app, this would update the case status
    console.log("Decision recorded:", decision);

    // Navigate back to queue
    router.push("/dashboard/queue");
  };

  const handleConfirm = () => {
    if (pendingAction) {
      executeAction(pendingAction);
    }
    setShowConfirmation(false);
    setPendingAction(null);
  };

  const generateDraftReport = () => {
    if (!caseData) return;

    const template = `
SCREENING MAMMOGRAM REPORT

Patient ID: ${caseData.patientMaskedId}
Case ID: ${caseData.id}
Date: ${new Date(caseData.createdAt).toLocaleDateString()}
Modality: ${caseData.modality.toUpperCase()}

FINDINGS:
${
  caseData.riskScore > 75
    ? `Suspicious findings identified in the breast parenchyma. Irregular mass with concerning features noted. AI risk score: ${
        caseData.riskScore
      }/100 (${Math.round(caseData.confidence * 100)}% confidence).`
    : caseData.riskScore > 50
    ? `Focal asymmetry or subtle density changes observed. AI risk score: ${
        caseData.riskScore
      }/100 (${Math.round(caseData.confidence * 100)}% confidence).`
    : `No significant abnormalities detected. Normal breast parenchyma. AI risk score: ${
        caseData.riskScore
      }/100 (${Math.round(caseData.confidence * 100)}% confidence).`
}

Breast Density: ${caseData.densityCategory.split("-")[1].toUpperCase()}

IMPRESSION:
${
  caseData.riskScore > 75
    ? `BI-RADS 4: Suspicious abnormality. Biopsy should be considered.`
    : caseData.riskScore > 50
    ? `BI-RADS 3: Probably benign. Short-interval follow-up suggested.`
    : `BI-RADS 1: Negative. Routine screening recommended.`
}

RECOMMENDATIONS:
${
  caseData.riskScore > 75
    ? `- Immediate biopsy recommended\n- Specialist consultation advised\n- Patient notification priority: High`
    : caseData.riskScore > 50
    ? `- Short-term follow-up in 6 months\n- Comparison with prior studies if available`
    : `- Continue routine annual screening\n- No immediate action required`
}

${
  caseData.uncertaintyFlag
    ? `\n⚠️ NOTE: AI uncertainty flag present. Independent radiologist review completed.`
    : ""
}

Reporting Radiologist: Dr. Demo User
Report Status: DRAFT - Requires Review and Signature
    `.trim();

    setDraftReport(template);
  };

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          href={`/dashboard/case/${caseData.id}`}
          className="text-sm text-muted-foreground hover:underline mb-2 inline-block"
        >
          ← Back to Case Viewer
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Make Decision</h1>
        <p className="text-muted-foreground mt-1">
          Case: {caseData.id} • Patient: {caseData.patientMaskedId}
        </p>
      </div>

      {/* High Risk Warning */}
      {(caseData.riskScore > 75 || caseData.uncertaintyFlag) && (
        <Card className="border-red-200 bg-red-50 dark:bg-red-950/20">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-900 dark:text-red-100">
                  {caseData.riskScore > 75
                    ? "High Risk Case"
                    : "Uncertainty Detected"}
                </p>
                <p className="text-sm text-red-800 dark:text-red-200 mt-1">
                  {caseData.riskScore > 75
                    ? "This case has a high risk score. All actions will require explicit confirmation before finalization."
                    : "The AI has flagged this case with uncertainty. Ensure thorough independent review before making a decision."}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Actions */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card
          className="hover:border-green-300 transition-colors cursor-pointer"
          onClick={() => handleActionClick("confirm")}
        >
          <CardHeader>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <CardTitle>Confirm Finding</CardTitle>
            </div>
            <CardDescription>
              Agree with AI assessment and finalize case
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" variant="outline">
              Confirm
            </Button>
          </CardContent>
        </Card>

        <Card
          className="hover:border-red-300 transition-colors cursor-pointer"
          onClick={() => handleActionClick("reject")}
        >
          <CardHeader>
            <div className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-600" />
              <CardTitle>Reject Finding</CardTitle>
            </div>
            <CardDescription>
              Disagree with AI and mark as negative
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" variant="outline">
              Reject
            </Button>
          </CardContent>
        </Card>

        <Card
          className="hover:border-amber-300 transition-colors cursor-pointer"
          onClick={() => handleActionClick("second-review")}
        >
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              <CardTitle>Request Second Review</CardTitle>
            </div>
            <CardDescription>
              Escalate to another radiologist for review
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" variant="outline">
              Request Review
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Feedback Section */}
      <Card>
        <CardHeader>
          <CardTitle>Feedback & Notes</CardTitle>
          <CardDescription>
            Add context to your decision for audit trail
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Tags */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              Feedback Tags
            </label>
            <div className="flex flex-wrap gap-2">
              {availableTags.map((tag) => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Note */}
          <div>
            <label
              htmlFor="feedback-note"
              className="text-sm font-medium mb-2 block"
            >
              Additional Notes (Optional)
            </label>
            <Input
              id="feedback-note"
              placeholder="Add any additional context or observations..."
              value={feedbackNote}
              onChange={(e) => setFeedbackNote(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Draft Report */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Draft Report</CardTitle>
              <CardDescription>
                Generate a preliminary report for this case
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={generateDraftReport}>
              <FileText className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {draftReport ? (
            <pre className="text-xs bg-muted p-4 rounded-lg overflow-auto max-h-96 whitespace-pre-wrap font-mono">
              {draftReport}
            </pre>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">
              Click "Generate Report" to create a draft report for this case
            </p>
          )}
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full">
            <CardHeader>
              <CardTitle>Confirm Action</CardTitle>
              <CardDescription>
                This is a {caseData.riskScore > 75 ? "high-risk" : "uncertain"}{" "}
                case. Please confirm your decision.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted p-4 rounded-lg text-sm">
                <p>
                  <strong>Case:</strong> {caseData.id}
                </p>
                <p>
                  <strong>Risk Score:</strong> {caseData.riskScore}/100
                </p>
                <p>
                  <strong>Action:</strong>{" "}
                  {pendingAction?.replace(/-/g, " ").toUpperCase()}
                </p>
                <p>
                  <strong>Selected Tags:</strong>{" "}
                  {selectedTags.length > 0 ? selectedTags.join(", ") : "None"}
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setShowConfirmation(false);
                    setPendingAction(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="default"
                  className="flex-1"
                  onClick={handleConfirm}
                >
                  Confirm Decision
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Demo Disclaimer */}
      <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/20">
        <CardContent className="pt-6">
          <p className="text-sm text-amber-800 dark:text-amber-200">
            ⚠️ <strong>Demo Prototype:</strong> Decisions are simulated and not
            stored persistently. Not for use with real patient data or clinical
            decision-making.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
