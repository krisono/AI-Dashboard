"use client";

import { useState } from "react";
import { SidebarNav } from "./sidebar-nav";
import { TopBar } from "./top-bar";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(true);

  return (
    <div className="min-h-screen bg-background">
      <SidebarNav
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <div
        className={`transition-all duration-300 ${
          isSidebarOpen ? "lg:pl-64" : "lg:pl-0"
        }`}
      >
        <TopBar
          onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
          isDemoMode={isDemoMode}
          onDemoModeToggle={() => setIsDemoMode(!isDemoMode)}
        />

        <main className="p-6">{children}</main>

        <footer className="border-t bg-muted/30 p-4 text-center text-xs text-muted-foreground">
          <p>
            <strong>Disclaimer:</strong> AI recommendations are advisory only.
            All clinical decisions must be confirmed by qualified healthcare
            professionals. Not for use in actual patient care. Demo prototype
            only.
          </p>
        </footer>
      </div>
    </div>
  );
}
