"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import { differenceInSeconds } from "@/lib/date";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  assessmentId: string;
  sessionId?: string;
  dueAt: string;
  nextAssessmentId: string | null;
  currentIndex: number;
  totalScenarios: number;
  /** All remaining assessment IDs in this session (including the current one) */
  remainingAssessmentIds?: string[];
};

export function AssessmentEditor({
  assessmentId,
  sessionId,
  dueAt,
  nextAssessmentId,
  currentIndex,
  totalScenarios,
  remainingAssessmentIds = []
}: Props) {
  const router = useRouter();
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(() =>
    Math.max(0, differenceInSeconds(new Date(dueAt), new Date()))
  );
  const [ending, setEnding] = useState(false);
  const hasSubmittedRef = useRef(false);
  const words = useMemo(
    () => content.trim().split(/\s+/).filter(Boolean).length,
    [content]
  );

  // Countdown timer
  useEffect(() => {
    const timer = window.setInterval(() => {
      setSecondsLeft(Math.max(0, differenceInSeconds(new Date(dueAt), new Date())));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [dueAt]);

  // Auto-end when timer expires
  useEffect(() => {
    if (secondsLeft > 0 || hasSubmittedRef.current) return;

    hasSubmittedRef.current = true;
    const body = JSON.stringify({ assessmentId });

    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: "application/json" });
      navigator.sendBeacon("/api/assessments/end", blob);
    } else {
      fetch("/api/assessments/end", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        keepalive: true
      }).catch(() => null);
    }

    if (typeof window !== "undefined") {
      window.sessionStorage.removeItem("candidate-assessment-session");
    }
    router.push("/candidate/thank-you?reason=timeout");
    router.refresh();
  }, [assessmentId, secondsLeft, router]);

  // Handle page leave / tab close (beforeunload)
  useEffect(() => {
    function endAssessment() {
      if (hasSubmittedRef.current || ending) return;

      setEnding(true);
      const body = JSON.stringify({ assessmentId });

      if (navigator.sendBeacon) {
        const blob = new Blob([body], { type: "application/json" });
        navigator.sendBeacon("/api/assessments/end", blob);
      } else {
        fetch("/api/assessments/end", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body,
          keepalive: true
        }).catch(() => null);
      }
    }

    window.addEventListener("beforeunload", endAssessment);
    return () => {
      window.removeEventListener("beforeunload", endAssessment);
    };
  }, [assessmentId, ending]);

  // ── SECURITY: Tab-switch auto-submit ──────────────────────────────────────
  // When the user switches tabs or minimises the window, we immediately
  // submit the current draft (even if empty) and mark ALL remaining
  // assessments in the session as ended. This prevents candidates from
  // opening reference material in another tab.
  useEffect(() => {
    function handleVisibilityChange() {
      if (document.visibilityState !== "hidden") return;
      if (hasSubmittedRef.current) return;

      hasSubmittedRef.current = true;

      // Submit current assessment with whatever the candidate has typed.
      // We submit even if empty so the server records the attempt.
      const currentBody = JSON.stringify({
        assessmentId,
        subject: subject.trim() || "(no subject – auto-submitted on tab switch)",
        content: content.trim() || "(no response – auto-submitted on tab switch)"
      });

      if (navigator.sendBeacon) {
        const blob = new Blob([currentBody], { type: "application/json" });
        navigator.sendBeacon("/api/submissions", blob);
      } else {
        fetch("/api/submissions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: currentBody,
          keepalive: true
        }).catch(() => null);
      }

      // End all remaining session assessments (the ones not yet submitted)
      const idsToEnd = remainingAssessmentIds.filter((id) => id !== assessmentId);
      for (const id of idsToEnd) {
        const endBody = JSON.stringify({ assessmentId: id });
        if (navigator.sendBeacon) {
          navigator.sendBeacon("/api/assessments/end", new Blob([endBody], { type: "application/json" }));
        } else {
          fetch("/api/assessments/end", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: endBody,
            keepalive: true
          }).catch(() => null);
        }
      }

      if (typeof window !== "undefined") {
        window.sessionStorage.removeItem("candidate-assessment-session");
      }
      router.push("/candidate/thank-you?reason=tab-switch");
      router.refresh();
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [assessmentId, subject, content, remainingAssessmentIds, router]);

  // ── SECURITY: Prevent copy-paste ──────────────────────────────────────────
  function blockPaste(event: React.ClipboardEvent) {
    event.preventDefault();
    toast.warning("Copy-pasting is not allowed during the assessment.");
  }

  async function submit() {
    if (!subject.trim()) {
      toast.error("Please enter an email subject line.");
      return;
    }

    if (content.trim().length < 50) {
      toast.error("Please write at least 50 characters before submitting.");
      return;
    }

    hasSubmittedRef.current = true;
    setSubmitting(true);

    const response = await fetch("/api/submissions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ assessmentId, subject: subject.trim(), content })
    });
    const body = await response.json().catch(() => null);
    setSubmitting(false);

    if (!response.ok) {
      toast.error(body?.error ?? "Unable to submit assessment.");
      hasSubmittedRef.current = false;
      return;
    }

    toast.success("Response submitted.");

    // Navigate to next scenario or results
    if (nextAssessmentId) {
      router.push(`/candidate/assessment/${nextAssessmentId}?sessionId=${sessionId}`);
    } else {
      if (typeof window !== "undefined") {
        window.sessionStorage.removeItem("candidate-assessment-session");
      }
      router.push("/candidate/thank-you");
    }
    router.refresh();
  }

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = String(secondsLeft % 60).padStart(2, "0");

  return (
    <div className="space-y-4">
      {/* Timer & progress */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border bg-card p-4">
        <div>
          <p className="text-sm text-muted-foreground">Time remaining</p>
          <p
            className={`text-2xl font-semibold tabular-nums ${
              secondsLeft <= 30 ? "text-destructive" : ""
            }`}
          >
            {minutes}:{seconds}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Word count</p>
          <p className="text-2xl font-semibold">{words}</p>
        </div>
        {totalScenarios > 1 && (
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Progress</p>
            <p className="text-2xl font-semibold">
              {currentIndex + 1}/{totalScenarios}
            </p>
          </div>
        )}
      </div>

      {/* Security notice */}
      <div className="rounded-2xl border border-amber-300/60 bg-amber-50/60 p-3 text-sm text-amber-800 dark:border-amber-700/60 dark:bg-amber-950/40 dark:text-amber-300">
        ⚠️ <strong>Security notice:</strong> Copy-pasting is disabled. Switching tabs or leaving this
        page will automatically submit your current response and end the remaining scenarios.
      </div>

      <div className="space-y-3 rounded-2xl border bg-card p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Subject</p>
            <h3 className="text-lg font-semibold">Email subject line</h3>
          </div>
          <Badge>Required</Badge>
        </div>
        <Input
          id="subject"
          placeholder="Write the email subject here..."
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          onPaste={blockPaste}
          disabled={secondsLeft === 0 || submitting}
          maxLength={498}
          className="h-12 text-base"
        />
        <p className="text-sm text-muted-foreground">
          Add the subject before you draft the main response body.
        </p>
      </div>

      <div className="space-y-3 rounded-2xl border bg-card p-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Email body</p>
          <h3 className="text-lg font-semibold">Main response</h3>
        </div>
        <Textarea
          className="min-h-[360px] resize-y text-base leading-7"
          placeholder="Write your professional email response here..."
          value={content}
          onChange={(event) => setContent(event.target.value)}
          onPaste={blockPaste}
          disabled={secondsLeft === 0 || submitting}
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end">
        <Button onClick={submit} disabled={secondsLeft === 0 || submitting}>
          {submitting
            ? "Submitting..."
            : nextAssessmentId
              ? "Submit & continue"
              : "Submit response"}
        </Button>
      </div>
    </div>
  );
}
