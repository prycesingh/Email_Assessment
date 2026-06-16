"use client";

import Link from "next/link";
import { useDeferredValue, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type AdminSessionRow = {
  sessionIdentifier: string;
  displayId: string;
  displayName: string;
  candidateEmail: string;
  statusLabel: string;
  startedAt: string;
  lastSubmittedAt: string | null;
  submittedScenarios: number;
  totalScenarios: number;
  aiWeightedTotal: number | null;
  aiGrade: string | null;
  manualWeightedTotal: number | null;
  manualGrade: string | null;
};

export function AdminSessionDashboard({ sessions }: { sessions: AdminSessionRow[] }) {
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);
  const filteredSessions = sessions.filter((session) => {
    const haystack = [
      session.displayId,
      session.displayName,
      session.candidateEmail,
      session.statusLabel
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(deferredSearch.trim().toLowerCase());
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Session dashboard</CardTitle>
        <CardDescription>
          Search and review session-level results, weighted totals, and response status.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          placeholder="Filter by session ID, email, or status"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <div className="overflow-x-auto rounded-2xl border">
          <table className="min-w-full border-collapse text-sm">
            <thead className="bg-muted/40 text-left text-xs uppercase tracking-[0.18em] text-muted-foreground">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Candidate</th>
                <th className="px-4 py-3">AI score</th>
                <th className="px-4 py-3">Manual score</th>
                <th className="px-4 py-3">Progress</th>
                <th className="px-4 py-3">Started</th>
                <th className="px-4 py-3">Submitted</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSessions.map((session) => (
                <tr key={session.sessionIdentifier} className="border-t align-top">
                  <td className="px-4 py-4 font-medium">{session.displayId}</td>
                  <td className="px-4 py-4 text-muted-foreground">{session.displayName}</td>
                  <td className="px-4 py-4">{session.candidateEmail}</td>
                  <td className="px-4 py-4">
                    {session.aiWeightedTotal != null
                      ? `${session.aiWeightedTotal.toFixed(2)} / 10${session.aiGrade ? ` · ${session.aiGrade}` : ""}`
                      : "Pending"}
                  </td>
                  <td className="px-4 py-4">
                    {session.manualWeightedTotal != null
                      ? `${session.manualWeightedTotal.toFixed(2)} / 10${session.manualGrade ? ` · ${session.manualGrade}` : ""}`
                      : "Pending"}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-col gap-2">
                      <Badge className="w-fit">{session.statusLabel}</Badge>
                      <span className="text-muted-foreground">
                        {session.submittedScenarios}/{session.totalScenarios} submitted
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-muted-foreground">{session.startedAt}</td>
                  <td className="px-4 py-4 text-muted-foreground">
                    {session.lastSubmittedAt ?? "--"}
                  </td>
                  <td className="px-4 py-4">
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/admin/sessions/${session.sessionIdentifier}`}>View session</Link>
                    </Button>
                  </td>
                </tr>
              ))}
              {filteredSessions.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-muted-foreground">
                    No sessions matched the current filter.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
