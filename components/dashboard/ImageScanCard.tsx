"use client";

import { useState, useRef } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Upload,
  Scan,
  X,
  Loader2,
  Image as ImageIcon,
  MessageSquare,
  Send,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

interface ScanResult {
  id: string;
  timestamp: string;
  findings: string[];
  riskScore: number;
  confidence: number;
  aiNotes: string;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export function ImageScanCard() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [questionInput, setQuestionInput] = useState("");
  const [isAsking, setIsAsking] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setUploadedImage(e.target?.result as string);
          setFileName(file.name);
          setScanResult(null);
          setMessages([]);
        };
        reader.readAsDataURL(file);
      } else {
        alert("Please upload an image file");
      }
    }
  };

  const handleScan = async () => {
    if (!uploadedImage) return;

    setIsScanning(true);

    // Simulate AI scanning delay
    await new Promise((resolve) => setTimeout(resolve, 2500));

    // Mock scan results
    const mockResult: ScanResult = {
      id: `SCAN-${Date.now()}`,
      timestamp: new Date().toISOString(),
      findings: [
        "Focal asymmetry detected in upper outer quadrant",
        "Increased density compared to previous imaging",
        "No suspicious calcifications observed",
        "Architectural distortion noted",
      ],
      riskScore: Math.floor(Math.random() * 40) + 50, // 50-90
      confidence: 0.75 + Math.random() * 0.2, // 0.75-0.95
      aiNotes:
        "AI analysis detected areas of interest that warrant radiologist review. Pattern recognition suggests follow-up imaging may be beneficial.",
    };

    setScanResult(mockResult);
    setIsScanning(false);

    // Add initial AI message
    const initialMessage: Message = {
      id: `msg-${Date.now()}`,
      role: "assistant",
      content: `I've completed the scan. I found ${mockResult.findings.length} notable observations with a risk score of ${mockResult.riskScore}/100. What would you like to know about these findings?`,
      timestamp: new Date().toISOString(),
    };
    setMessages([initialMessage]);
  };

  const handleAskQuestion = async () => {
    if (!questionInput.trim() || !scanResult) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: questionInput,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setQuestionInput("");
    setIsAsking(true);

    // Simulate AI response delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock AI responses based on question keywords
    let aiResponse = "Based on the scan analysis, ";
    const lowerQuestion = questionInput.toLowerCase();

    if (lowerQuestion.includes("risk") || lowerQuestion.includes("serious")) {
      aiResponse += `the risk score of ${scanResult.riskScore}/100 suggests ${
        scanResult.riskScore > 75
          ? "elevated risk that requires immediate radiologist review and possible biopsy."
          : scanResult.riskScore > 60
          ? "moderate risk. Follow-up imaging in 6 months is recommended."
          : "lower risk, but continued monitoring is advised."
      }`;
    } else if (
      lowerQuestion.includes("finding") ||
      lowerQuestion.includes("detected")
    ) {
      aiResponse += `the key finding is: ${
        scanResult.findings[0]
      }. This was identified with ${Math.round(
        scanResult.confidence * 100
      )}% confidence.`;
    } else if (
      lowerQuestion.includes("next") ||
      lowerQuestion.includes("recommend")
    ) {
      aiResponse +=
        scanResult.riskScore > 75
          ? "I recommend immediate consultation with a specialist and scheduling a biopsy."
          : "I recommend scheduling follow-up imaging in 6 months and comparing with this baseline scan.";
    } else if (
      lowerQuestion.includes("confidence") ||
      lowerQuestion.includes("sure")
    ) {
      aiResponse += `my confidence level for this analysis is ${Math.round(
        scanResult.confidence * 100
      )}%. This is based on image quality, pattern recognition, and comparison with training data.`;
    } else if (
      lowerQuestion.includes("compare") ||
      lowerQuestion.includes("previous")
    ) {
      aiResponse +=
        "without access to previous imaging, I can only analyze this current scan. However, I detected changes in tissue density that suggest temporal comparison would be valuable.";
    } else {
      aiResponse +=
        "that's an important question. Based on the detected patterns and my analysis, I recommend discussing these findings with a radiologist for expert interpretation.";
    }

    const aiMessage: Message = {
      id: `msg-${Date.now() + 1}`,
      role: "assistant",
      content: aiResponse,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, aiMessage]);
    setIsAsking(false);
  };

  const clearImage = () => {
    setUploadedImage(null);
    setFileName("");
    setScanResult(null);
    setMessages([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Image Scan & Analysis
            </CardTitle>
            <CardDescription>
              Upload medical imaging for AI-powered analysis
            </CardDescription>
          </div>
          {uploadedImage && (
            <Button variant="ghost" size="sm" onClick={clearImage}>
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {!uploadedImage ? (
          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
            <div className="flex flex-col items-center gap-4">
              <Upload className="h-12 w-12 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium mb-1">
                  Upload medical imaging
                </p>
                <p className="text-xs text-muted-foreground">
                  Supports JPEG, PNG, DICOM preview
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload">
                <Button variant="default" asChild>
                  <span>
                    <Upload className="h-4 w-4 mr-2" />
                    Choose File
                  </span>
                </Button>
              </label>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Image Preview */}
            <div className="relative border rounded-lg overflow-hidden bg-muted">
              <img
                src={uploadedImage}
                alt="Uploaded medical image"
                className="w-full h-64 object-contain"
              />
              <div className="absolute top-2 right-2">
                <Badge variant="secondary">{fileName}</Badge>
              </div>
            </div>

            {/* Scan Button */}
            {!scanResult && (
              <Button
                onClick={handleScan}
                disabled={isScanning}
                className="w-full"
                size="lg"
              >
                {isScanning ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Scanning Image...
                  </>
                ) : (
                  <>
                    <Scan className="h-4 w-4 mr-2" />
                    Scan & Analyze
                  </>
                )}
              </Button>
            )}

            {/* Scan Results */}
            {scanResult && (
              <div className="space-y-4">
                <div className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      Scan Complete
                    </h3>
                    <Badge
                      variant={
                        scanResult.riskScore > 75
                          ? "destructive"
                          : scanResult.riskScore > 60
                          ? "default"
                          : "secondary"
                      }
                    >
                      Risk: {scanResult.riskScore}/100
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-muted-foreground">Confidence:</span>
                      <span className="ml-2 font-medium">
                        {Math.round(scanResult.confidence * 100)}%
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Findings:</span>
                      <span className="ml-2 font-medium">
                        {scanResult.findings.length}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground uppercase">
                      Key Findings:
                    </p>
                    <ul className="space-y-1.5">
                      {scanResult.findings.map((finding, idx) => (
                        <li
                          key={idx}
                          className="text-sm flex items-start gap-2"
                        >
                          <AlertCircle className="h-4 w-4 mt-0.5 text-amber-600 flex-shrink-0" />
                          <span>{finding}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-muted p-3 rounded text-sm">
                    <p className="font-medium mb-1">AI Notes:</p>
                    <p className="text-muted-foreground">
                      {scanResult.aiNotes}
                    </p>
                  </div>
                </div>

                {/* Q&A Section */}
                <div className="border rounded-lg p-4 space-y-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Ask Follow-up Questions
                  </h3>

                  {messages.length > 0 && (
                    <ScrollArea className="h-48 pr-4">
                      <div className="space-y-3">
                        {messages.map((msg) => (
                          <div
                            key={msg.id}
                            className={`flex flex-col gap-1 ${
                              msg.role === "user" ? "items-end" : "items-start"
                            }`}
                          >
                            <div
                              className={`rounded-lg px-3 py-2 max-w-[85%] text-sm ${
                                msg.role === "user"
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted"
                              }`}
                            >
                              {msg.content}
                            </div>
                          </div>
                        ))}
                        {isAsking && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span className="text-sm">Thinking...</span>
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                  )}

                  <div className="flex gap-2">
                    <Input
                      placeholder="Ask about the findings..."
                      value={questionInput}
                      onChange={(e) => setQuestionInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleAskQuestion();
                        }
                      }}
                      disabled={isAsking}
                    />
                    <Button
                      onClick={handleAskQuestion}
                      disabled={!questionInput.trim() || isAsking}
                      size="icon"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setQuestionInput("What is the main risk here?");
                        setTimeout(handleAskQuestion, 100);
                      }}
                      disabled={isAsking}
                    >
                      What's the risk?
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setQuestionInput("What should I do next?");
                        setTimeout(handleAskQuestion, 100);
                      }}
                      disabled={isAsking}
                    >
                      Next steps?
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setQuestionInput("How confident are you?");
                        setTimeout(handleAskQuestion, 100);
                      }}
                      disabled={isAsking}
                    >
                      Confidence level?
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Demo Disclaimer */}
        <div className="bg-amber-50 dark:bg-amber-950/20 p-3 rounded-lg text-xs text-amber-800 dark:text-amber-200">
          <strong>Demo Mode:</strong> This is a simulated AI analysis for
          demonstration purposes only. Not for clinical use.
        </div>
      </CardContent>
    </Card>
  );
}
