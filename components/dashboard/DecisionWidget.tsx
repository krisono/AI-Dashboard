"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Case } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
  Save,
  Send,
  Loader2,
} from "lucide-react";

interface DecisionWidgetProps {
  caseData: Case;
  compact?: boolean;
}

export function DecisionWidget({
  caseData,
  compact = false,
}: DecisionWidgetProps) {
  const router = useRouter();
  const [feedbackNote, setFeedbackNote] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingAction, setPendingAction] = useState<
    "confirm" | "reject" | "second-review" | null
  >(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const availableTags = compact
    ? ["Agreed with AI", "Disagreed with AI", "Requires Follow-up"]
    : [
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
    if (caseData.riskScore > 75 || caseData.uncertaintyFlag) {
      setPendingAction(action);
      setShowConfirmation(true);
    } else {
      executeAction(action);
    }
  };

  const executeAction = (action: "confirm" | "reject" | "second-review") => {
    setIsProcessing(true);

    // Simulate API call
    setTimeout(() => {
      console.log("Decision recorded:", {
        caseId: caseData.id,
        action,
        tags: selectedTags,
        note: feedbackNote,
      });

      setIsProcessing(false);
      setShowConfirmation(false);

      // Navigate to queue or show success
      router.push("/dashboard/queue");
    }, 1000);
  };

  const handleConfirm = () => {
    if (pendingAction) {
      executeAction(pendingAction);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Decision</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Action Buttons */}
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleActionClick("confirm")}
              className="flex-col h-auto py-3"
            >
              <CheckCircle2 className="h-5 w-5 mb-1 text-green-600" />
              <span className="text-xs">Confirm</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleActionClick("reject")}
              className="flex-col h-auto py-3"
            >
              <XCircle className="h-5 w-5 mb-1 text-red-600" />
              <span className="text-xs">Reject</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleActionClick("second-review")}
              className="flex-col h-auto py-3"
            >
              <AlertTriangle className="h-5 w-5 mb-1 text-amber-600" />
              <span className="text-xs">2nd Review</span>
            </Button>
          </div>

          {/* Feedback Tags */}
          <div>
            <label className="text-xs font-medium mb-2 block">Quick Tags</label>
            <div className="flex flex-wrap gap-1">
              {availableTags.map((tag) => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? "default" : "outline"}
                  className="cursor-pointer text-xs"
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Notes */}
          {!compact && (
            <div>
              <label
                htmlFor="quick-note"
                className="text-xs font-medium mb-2 block"
              >
                Notes (Optional)
              </label>
              <Textarea
                id="quick-note"
                placeholder="Add quick notes..."
                value={feedbackNote}
                onChange={(e) => setFeedbackNote(e.target.value)}
                rows={2}
                className="text-sm"
              />
            </div>
          )}

          {/* Full Decision Link */}
          <Button
            variant="ghost"
            size="sm"
            className="w-full"
            onClick={() => router.push(`/dashboard/decision/${caseData.id}`)}
          >
            <FileText className="h-4 w-4 mr-2" />
            Full Decision Page
          </Button>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Decision</DialogTitle>
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
              <strong>Risk Score:</strong> {caseData.riskScore}/100
            </p>
            <p>
              <strong>Action:</strong>{" "}
              {pendingAction?.replace(/-/g, " ").toUpperCase()}
            </p>
            <p>
              <strong>Tags:</strong>{" "}
              {selectedTags.length > 0 ? selectedTags.join(", ") : "None"}
            </p>
          </div>

          {caseData.riskScore > 75 && (
            <div className="bg-red-50 dark:bg-red-950/20 p-3 rounded-lg text-sm text-red-800 dark:text-red-200">
              <AlertTriangle className="h-4 w-4 inline mr-2" />
              <strong>Warning:</strong> High-risk case. Ensure accuracy before
              finalizing.
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowConfirmation(false);
                setPendingAction(null);
              }}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button onClick={handleConfirm} disabled={isProcessing}>
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Confirm
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
