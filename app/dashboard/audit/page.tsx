"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { mockAuditEvents } from "@/lib/mockData";
import { AuditEvent } from "@/lib/types";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Download, Search, Calendar } from "lucide-react";

export default function AuditPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [actionFilter, setActionFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");

  // Filter audit events
  const filteredEvents = useMemo(() => {
    return mockAuditEvents.filter((event) => {
      // Search filter
      if (
        searchTerm &&
        !event.caseId?.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !event.user.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !event.details.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false;
      }

      // Action filter
      if (actionFilter !== "all" && event.action !== actionFilter) {
        return false;
      }

      // Date filter
      if (dateFilter !== "all") {
        const eventDate = new Date(event.timestamp);
        const today = new Date();
        const daysDiff = Math.floor(
          (today.getTime() - eventDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (dateFilter === "today" && daysDiff > 0) return false;
        if (dateFilter === "week" && daysDiff > 7) return false;
        if (dateFilter === "month" && daysDiff > 30) return false;
      }

      return true;
    });
  }, [searchTerm, actionFilter, dateFilter]);

  // Sort by timestamp descending
  const sortedEvents = useMemo(() => {
    return [...filteredEvents].sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }, [filteredEvents]);

  // Get unique actions for filter
  const uniqueActions = useMemo(() => {
    const actions = new Set(mockAuditEvents.map((e) => e.action));
    return Array.from(actions);
  }, []);

  const exportToJson = () => {
    const dataStr = JSON.stringify(sortedEvents, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `audit-log-${new Date().toISOString().split("T")[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getActionBadgeVariant = (action: string) => {
    if (action === "decision-made") return "default";
    if (action === "viewed") return "secondary";
    if (action === "chat-query") return "outline";
    return "outline";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Audit Log</h1>
          <p className="text-muted-foreground mt-2">
            Track all user actions and decisions for compliance
          </p>
        </div>
        <Button variant="outline" onClick={exportToJson}>
          <Download className="h-4 w-4 mr-2" />
          Export JSON
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sortedEvents.length}</div>
            <p className="text-xs text-muted-foreground">Matching filters</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Decisions Made
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {sortedEvents.filter((e) => e.action === "decision-made").length}
            </div>
            <p className="text-xs text-muted-foreground">Clinical decisions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cases Viewed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {sortedEvents.filter((e) => e.action === "viewed").length}
            </div>
            <p className="text-xs text-muted-foreground">Case accesses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              AI Interactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {sortedEvents.filter((e) => e.action === "chat-query").length}
            </div>
            <p className="text-xs text-muted-foreground">Chat queries</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>
            Filter audit events by search, action, and date
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {/* Search */}
            <div>
              <label
                htmlFor="search"
                className="text-sm font-medium mb-2 block"
              >
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Case ID, user, or details..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            {/* Action Filter */}
            <div>
              <label
                htmlFor="action-filter"
                className="text-sm font-medium mb-2 block"
              >
                Action Type
              </label>
              <select
                id="action-filter"
                value={actionFilter}
                onChange={(e) => setActionFilter(e.target.value)}
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="all">All Actions</option>
                {uniqueActions.map((action) => (
                  <option key={action} value={action}>
                    {action.replace(/-/g, " ").toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Filter */}
            <div>
              <label
                htmlFor="date-filter"
                className="text-sm font-medium mb-2 block"
              >
                Date Range
              </label>
              <select
                id="date-filter"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Audit Table */}
      <Card>
        <CardHeader>
          <CardTitle>Audit Events ({sortedEvents.length})</CardTitle>
          <CardDescription>Most recent events first</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Case ID</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedEvents.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center text-muted-foreground"
                  >
                    No audit events match the current filters
                  </TableCell>
                </TableRow>
              ) : (
                sortedEvents.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell className="text-sm">
                      {new Date(event.timestamp).toLocaleString()}
                    </TableCell>
                    <TableCell className="font-medium">{event.user}</TableCell>
                    <TableCell>
                      <Badge variant={getActionBadgeVariant(event.action)}>
                        {event.action.replace(/-/g, " ")}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {event.caseId ? (
                        <Link
                          href={`/dashboard/case/${event.caseId}`}
                          className="text-blue-600 hover:underline"
                        >
                          {event.caseId}
                        </Link>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-md truncate">
                      {event.details}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Demo Disclaimer */}
      <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/20">
        <CardContent className="pt-6">
          <p className="text-sm text-amber-800 dark:text-amber-200">
            ⚠️ <strong>Demo Prototype:</strong> Audit events are simulated and
            not stored persistently. In production, this would integrate with a
            secure audit logging system.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
