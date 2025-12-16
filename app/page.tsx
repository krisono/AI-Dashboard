import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Activity,
  Shield,
  Brain,
  FileText,
  AlertTriangle,
  Settings,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="max-w-5xl w-full">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <Activity className="h-12 w-12 text-primary" />
            <h1 className="text-5xl font-bold text-slate-900">MammoAssist</h1>
          </div>
          <p className="text-xl text-slate-600 mb-2">
            AI-Assisted Radiology Second-Reader Dashboard
          </p>
          <Badge variant="outline" className="text-xs">
            Demo Prototype - For Educational Purposes Only
          </Badge>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Key Features</CardTitle>
            <CardDescription>
              Comprehensive AI-powered tools for screening mammography review
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <FeatureItem
                icon={<Activity className="h-5 w-5" />}
                title="Case Queue Management"
                description="Prioritize and review cases with AI-powered triaging"
              />
              <FeatureItem
                icon={<Brain className="h-5 w-5" />}
                title="Multimodal AI Assistant"
                description="Voice commands and chat-based guidance with visual feedback"
              />
              <FeatureItem
                icon={<Shield className="h-5 w-5" />}
                title="Bias Monitoring"
                description="Continuous fairness analysis and demographic equity tracking"
              />
              <FeatureItem
                icon={<FileText className="h-5 w-5" />}
                title="Audit Trail"
                description="Complete decision history and compliance logging"
              />
              <FeatureItem
                icon={<AlertTriangle className="h-5 w-5" />}
                title="Error Recovery"
                description="Confirmations for high-risk actions and uncertainty warnings"
              />
              <FeatureItem
                icon={<Settings className="h-5 w-5" />}
                title="Flexible Configuration"
                description="Demo mode with mock data or OpenAI integration"
              />
            </div>
          </CardContent>
        </Card>

        <div className="text-center space-y-4">
          <Link href="/dashboard">
            <Button size="lg" className="text-lg px-8">
              Enter Dashboard
            </Button>
          </Link>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
            <p className="font-semibold mb-1">⚠️ Important Disclaimer</p>
            <p>
              This is a demonstration prototype only. AI recommendations are
              advisory. All clinical decisions must be made by qualified
              healthcare professionals. Not for use in actual patient care.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureItem({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
      <div className="text-primary mt-0.5">{icon}</div>
      <div>
        <h3 className="font-semibold text-slate-900 mb-1">{title}</h3>
        <p className="text-sm text-slate-600">{description}</p>
      </div>
    </div>
  );
}
