import Link from "next/link";
import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/brand";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Shield, Brain, FileText, List } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-[900px] w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-primary/10 mb-2">
            <Activity className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-semibold tracking-tight">{APP_NAME}</h1>
          <p className="text-muted-foreground max-w-[600px] mx-auto">
            Interactive Human–AI collaboration dashboard for case review and
            decision support
          </p>
          <Badge variant="outline" className="text-xs">
            Demo Environment
          </Badge>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-4">
          <FeatureCard
            icon={<List className="h-5 w-5" />}
            title="Case Queue"
            description="Prioritized workflow with AI triaging and filtering"
          />
          <FeatureCard
            icon={<Brain className="h-5 w-5" />}
            title="AI Assistant"
            description="Voice commands and chat-based guidance"
          />
          <FeatureCard
            icon={<Shield className="h-5 w-5" />}
            title="Bias Monitoring"
            description="Continuous fairness and equity tracking"
          />
          <FeatureCard
            icon={<FileText className="h-5 w-5" />}
            title="Audit Trail"
            description="Complete decision history and logging"
          />
        </div>

        {/* CTA */}
        <div className="flex flex-col items-center gap-4 pt-4">
          <Link href="/dashboard">
            <Button size="lg">Enter Dashboard</Button>
          </Link>

          <Card className="w-full border-amber-200 bg-amber-50/50">
            <CardContent className="pt-4 pb-4">
              <p className="text-sm text-amber-900/80 text-center">
                <span className="font-medium">Educational Demo:</span> AI
                recommendations are advisory only. Not for clinical use.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Card className="border-muted">
      <CardContent className="pt-6">
        <div className="flex items-start gap-3">
          <div className="text-primary mt-0.5">{icon}</div>
          <div>
            <h3 className="font-medium mb-1">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
