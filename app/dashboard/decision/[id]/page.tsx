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
  Save,
  Send,
  Loader2,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [isFinalized, setIsFinalized] = useState(false);

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

  const saveDraft = () => {
    if (!caseData) return;
    setIsSavingDraft(true);

    // Simulate saving draft
    setTimeout(() => {
      console.log("Draft saved:", {
        caseId: caseData.id,
        feedbackNote,
        selectedTags,
        draftReport,
      });
      setIsSavingDraft(false);
    }, 500);
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

    // Mark as finalized
    setIsFinalized(true);

    // Navigate back to queue after a short delay
    setTimeout(() => {
      router.push("/dashboard/queue");
    }, 1500);
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
              Additional Notes
            </label>
            <Textarea
              id="feedback-note"
              placeholder="Add any additional context, observations, or clinical reasoning..."
              value={feedbackNote}
              onChange={(e) => setFeedbackNote(e.target.value)}
              rows={4}
            />
          </div>

          {/* Save Draft Button */}
          <div className="flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={saveDraft}
              disabled={isSavingDraft}
            >
              {isSavingDraft ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Draft
                </>
              )}
            </Button>
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
        <CardContent className="space-y-4">
          {draftReport ? (
            <>
              <Textarea
                value={draftReport}
                onChange={(e) => setDraftReport(e.target.value)}
                className="font-mono text-xs min-h-[400px]"
              />
              <div className="flex justify-between items-center">
                <p className="text-xs text-muted-foreground">
                  Edit the report as needed before finalizing
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDraftReport("")}
                  >
                    Clear
                  </Button>
                  <Button variant="outline" size="sm" onClick={saveDraft}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Draft
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">
              Click "Generate Report" to create a draft report for this case
            </p>
          )}
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Action</DialogTitle>
            <DialogDescription>
              This is a {caseData.riskScore > 75 ? "high-risk" : "uncertain"}{" "}
              case. Please confirm your decision.
            </DialogDescription>
          </DialogHeader>

          <div className="bg-muted p-4 rounded-lg text-sm space-y-2">
            <p>
              <strong>Case:</strong> {caseData.id}
            </p>
            <p>
              <strong>Patient:</strong> {caseData.patientMaskedId}
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
            {feedbackNote && (
              <p>
                <strong>Note:</strong> {feedbackNote.substring(0, 100)}
                {feedbackNote.length > 100 ? "..." : ""}
              </p>
            )}
          </div>

          {caseData.riskScore > 75 && (
            <div className="bg-red-50 dark:bg-red-950/20 p-3 rounded-lg text-sm text-red-800 dark:text-red-200">
              <AlertCircle className="h-4 w-4 inline mr-2" />
              <strong>Warning:</strong> This is a high-risk case. Ensure all
              information is accurate before finalizing.
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowConfirmation(false);
                setPendingAction(null);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleConfirm}>
              <Send className="h-4 w-4 mr-2" />
              Finalize Decision
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={isFinalized} onOpenChange={setIsFinalized}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              Decision Finalized
            </DialogTitle>
            <DialogDescription>
              Your decision has been recorded and saved to the audit trail.
            </DialogDescription>
          </DialogHeader>

          <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg text-sm">
            <p className="text-green-800 dark:text-green-200">
              Case {caseData.id} has been successfully processed. You will be
              redirected to the queue shortly.
            </p>
          </div>
        </DialogContent>
      </Dialog>

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
