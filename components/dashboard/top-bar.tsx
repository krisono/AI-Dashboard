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
          className="hidden sm:flex gap-1.5 border-muted-foreground/20 bg-muted/30 text-muted-foreground text-xs"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-40"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary"></span>
          </span>
          AI Advisory
        </Badge>

        {/* Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search cases..."
              className="pl-8 h-9 text-sm bg-muted/30 border-muted-foreground/20"
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSearchQuery(e.target.value)
              }
              aria-label="Search"
            />
          </div>
        </div>

        {/* Voice Command Button */}
        <Button
          variant={isVoiceActive ? "default" : "ghost"}
          size="sm"
          onClick={() => setIsVoiceActive(!isVoiceActive)}
          aria-label={
            isVoiceActive ? "Stop voice command" : "Start voice command"
          }
          aria-pressed={isVoiceActive}
          className="gap-2"
        >
          {isVoiceActive ? (
            <>
              <Mic className="h-3.5 w-3.5 animate-pulse" />
              <span className="hidden md:inline text-xs">Listening</span>
            </>
          ) : (
            <>
              <MicOff className="h-3.5 w-3.5" />
              <span className="hidden md:inline text-xs">Voice</span>
            </>
          )}
        </Button>

        {/* Demo Mode Toggle */}
        <div className="hidden md:flex items-center gap-2 pl-2 border-l">
          <span className="text-xs text-muted-foreground">
            {isDemoMode ? "Demo" : "Live"}
          </span>
        </div>

        {/* User info */}
        <div className="hidden sm:block text-right">
          <p className="text-sm font-medium">Dr. Sarah Chen</p>
          <p className="text-xs text-muted-foreground">Radiologist</p>
        </div>
      </div>
    </header>
  );
}
