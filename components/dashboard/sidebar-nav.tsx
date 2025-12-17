"use client";

import Link from "next/link";
import { APP_NAME, MODEL_BADGE } from "@/lib/brand";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Activity, List, FileText, BarChart3, Settings, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Activity,
  },
  {
    title: "Queue",
    href: "/dashboard/queue",
    icon: List,
  },
  {
    title: "Audit Log",
    href: "/dashboard/audit",
    icon: FileText,
  },
  {
    title: "Bias & Monitoring",
    href: "/dashboard/bias",
    icon: BarChart3,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

interface SidebarNavProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function SidebarNav({ isOpen, onToggle }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-64 border-r bg-card transition-transform duration-300 lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b px-6 py-4">
            <Link href="/dashboard" className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              <div className="flex flex-col">
                <span className="text-lg font-semibold">{APP_NAME}</span>
                <Badge
                  variant="outline"
                  className="text-[10px] w-fit mt-0.5 px-1.5 py-0"
                >
                  Demo
                </Badge>
              </div>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={onToggle}
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-0.5 p-3" aria-label="Main navigation">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    isActive
                      ? "bg-accent text-accent-foreground before:absolute before:left-0 before:top-1 before:bottom-1 before:w-1 before:bg-primary before:rounded-r"
                      : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground"
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="border-t p-3 space-y-2">
            <div className="rounded-md bg-muted/50 p-2.5 text-xs">
              <p className="font-medium mb-1 text-muted-foreground">
                Demo Mode
              </p>
              <p className="text-muted-foreground/80 text-[11px]">
                Mock data and simulated AI
              </p>
            </div>
            <div className="text-[10px] text-muted-foreground/60 px-1">
              {MODEL_BADGE}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
