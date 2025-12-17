"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { voiceService } from "@/lib/voice";
import { VoiceCommand } from "@/lib/types";
import {
  Mic,
  MicOff,
  AlertCircle,
  CheckCircle,
  Lightbulb,
  Send,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface VoiceAssistantProps {
  onCommand?: (command: VoiceCommand) => void;
}

export function VoiceAssistant({ onCommand }: VoiceAssistantProps) {
  const router = useRouter();
  const [isSupported, setIsSupported] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [lastCommand, setLastCommand] = useState<VoiceCommand | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [suggestedCommand, setSuggestedCommand] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    setIsSupported(voiceService.isSupported());
  }, []);

  const handleVoiceCommand = (command: VoiceCommand) => {
    setLastCommand(command);
    setIsListening(false);
    setError(null);

    // Execute the command
    if (command.action.startsWith("navigate:")) {
      const path = command.action.replace("navigate:", "");
      if (path === "next-case") {
        router.push("/dashboard/queue");
      } else if (path === "previous-case") {
        router.back();
      } else {
        router.push(`/dashboard${path}`);
      }
    }

    // Notify parent component
    onCommand?.(command);
  };

  const startListening = () => {
    setError(null);
    setIsListening(true);

    voiceService.startListening(handleVoiceCommand, (err) => {
      setError(err.message || "Failed to recognize speech");
      setIsListening(false);
    });
  };

  const stopListening = () => {
    voiceService.stopListening();
    setIsListening(false);
  };

  const handleSuggestCommand = () => {
    if (!suggestedCommand.trim()) return;

    // Send suggestion to console (in a real app, this would go to a backend)
    console.log("User suggested command:", suggestedCommand);

    // Show success feedback
    alert(
      `Thank you for suggesting: "${suggestedCommand}"\n\nYour suggestion has been recorded and will help improve our voice commands.`
    );

    setSuggestedCommand("");
    setShowFeedback(false);
  };

  const exampleCommands = [
    "Open queue",
    "Show audit log",
    "Open bias monitoring",
    "Show settings",
    "Approve this case",
    "Reject this case",
    "Refer for review",
    "Next case",
    "Previous case",
    "Help",
  ];

  if (!isSupported) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
            <div className="flex-1">
              <CardTitle className="text-lg">
                Voice Assistant (Not Available)
              </CardTitle>
              <CardDescription className="mt-1">
                Voice recognition is not supported in your browser. Try Chrome,
                Edge, or Safari.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Feedback Section */}
          <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg space-y-3">
            <div className="flex items-start gap-2">
              <Lightbulb className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold text-sm text-blue-900 dark:text-blue-100">
                  Help Us Improve
                </h4>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                  What voice commands would be most useful to you?
                </p>
              </div>
            </div>

            {!showFeedback ? (
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => setShowFeedback(true)}
              >
                Suggest Commands
              </Button>
            ) : (
              <div className="space-y-2">
                <Textarea
                  placeholder="Example: 'Show me high-risk cases' or 'Read the patient notes'"
                  value={suggestedCommand}
                  onChange={(e) => setSuggestedCommand(e.target.value)}
                  className="min-h-[80px]"
                />
                <div className="flex gap-2">
                  <Button
                    variant="default"
                    size="sm"
                    className="flex-1"
                    onClick={handleSuggestCommand}
                    disabled={!suggestedCommand.trim()}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Submit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setShowFeedback(false);
                      setSuggestedCommand("");
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Example Commands that would be available */}
          <div>
            <h4 className="text-sm font-semibold mb-2">
              Commands We're Planning:
            </h4>
            <div className="flex flex-wrap gap-2">
              {exampleCommands.slice(0, 6).map((cmd) => (
                <Badge key={cmd} variant="secondary" className="text-xs">
                  "{cmd}"
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Voice Assistant</CardTitle>
            <CardDescription className="mt-1">
              Click the microphone to give voice commands
            </CardDescription>
          </div>
          <Badge variant={isListening ? "default" : "secondary"}>
            {isListening ? "Listening..." : "Ready"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Voice Control Button */}
        <div className="flex flex-col items-center gap-3 p-6 bg-muted/50 rounded-lg">
          <Button
            size="lg"
            variant={isListening ? "destructive" : "default"}
            className="h-20 w-20 rounded-full"
            onClick={isListening ? stopListening : startListening}
          >
            {isListening ? (
              <MicOff className="h-8 w-8" />
            ) : (
              <Mic className="h-8 w-8" />
            )}
          </Button>
          <p className="text-sm text-muted-foreground text-center">
            {isListening
              ? "Listening... speak your command"
              : "Tap to start voice command"}
          </p>
        </div>

        {/* Last Command Display */}
        {lastCommand && (
          <div className="bg-green-50 dark:bg-green-950/20 p-3 rounded-lg">
            <div className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-green-900 dark:text-green-100">
                  Recognized Command
                </p>
                <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                  "{lastCommand.transcript}"
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline" className="text-xs">
                    Action: {lastCommand.action}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Confidence:{" "}
                    {Math.round((lastCommand.confidence || 0) * 100)}%
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 dark:bg-red-950/20 p-3 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-900 dark:text-red-100">
                  Error
                </p>
                <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                  {error}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Example Commands */}
        <div>
          <h4 className="text-sm font-semibold mb-2">Try saying:</h4>
          <div className="flex flex-wrap gap-2">
            {exampleCommands.map((cmd) => (
              <Badge key={cmd} variant="secondary" className="text-xs">
                "{cmd}"
              </Badge>
            ))}
          </div>
        </div>

        {/* Feedback Section */}
        <div className="pt-4 border-t">
          <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg">
            <div className="flex items-start gap-2">
              <Lightbulb className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div className="flex-1">
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  Missing a command?{" "}
                  <button
                    onClick={() => setShowFeedback(!showFeedback)}
                    className="underline font-medium hover:text-blue-900 dark:hover:text-blue-100"
                  >
                    Suggest one
                  </button>
                </p>
              </div>
            </div>
          </div>

          {showFeedback && (
            <div className="mt-3 space-y-2">
              <Textarea
                placeholder="Example: 'Show me high-risk cases' or 'Read the patient notes'"
                value={suggestedCommand}
                onChange={(e) => setSuggestedCommand(e.target.value)}
                className="min-h-[80px]"
              />
              <div className="flex gap-2">
                <Button
                  variant="default"
                  size="sm"
                  className="flex-1"
                  onClick={handleSuggestCommand}
                  disabled={!suggestedCommand.trim()}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Submit Suggestion
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowFeedback(false);
                    setSuggestedCommand("");
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
