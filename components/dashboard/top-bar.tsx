"use client";

import { useState } from "react";
import { Menu, Search, Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface TopBarProps {
  onMenuClick: () => void;
  isDemoMode: boolean;
  onDemoModeToggle: () => void;
}

export function TopBar({
  onMenuClick,
  isDemoMode,
  onDemoModeToggle,
}: TopBarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isVoiceActive, setIsVoiceActive] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center gap-4 px-6">
        {/* Menu button for mobile */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onMenuClick}
          aria-label="Toggle menu"
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* AI Advisory Badge */}
        <Badge
          variant="outline"
          className="hidden sm:flex gap-1 border-amber-300 bg-amber-50 text-amber-800"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
          </span>
          AI Advisory
        </Badge>

        {/* Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search cases, patients, accession numbers..."
              className="pl-9 w-full"
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              aria-label="Search"
            />
          </div>
        </div>

        {/* Voice Command Button */}
        <Button
          variant={isVoiceActive ? "default" : "outline"}
          size="icon"
          onClick={() => setIsVoiceActive(!isVoiceActive)}
          aria-label={
            isVoiceActive ? "Stop voice command" : "Start voice command"
          }
          aria-pressed={isVoiceActive}
        >
          {isVoiceActive ? (
            <Mic className="h-4 w-4 animate-pulse" />
          ) : (
            <MicOff className="h-4 w-4" />
          )}
        </Button>

        {/* Demo Mode Toggle */}
        <Button
          variant={isDemoMode ? "default" : "outline"}
          size="sm"
          onClick={onDemoModeToggle}
          className="hidden md:flex"
        >
          {isDemoMode ? "Demo Mode" : "Live Mode"}
        </Button>

        {/* User info */}
        <div className="hidden sm:block text-right">
          <p className="text-sm font-medium">Dr. Sarah Chen</p>
          <p className="text-xs text-muted-foreground">Radiologist</p>
        </div>
      </div>
    </header>
  );
}
