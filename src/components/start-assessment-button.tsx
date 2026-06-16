"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

const SESSION_KEY = "candidate-assessment-session";

type SessionData = { sessionId: string; currentIndex: number; totalScenarios: number };

function readSession(): SessionData | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;

    return JSON.parse(raw) as SessionData;
  } catch {
    return null;
  }
}

function writeSession(data: SessionData) {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(data));
}

function clearSession() {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(SESSION_KEY);
}

export function StartAssessmentButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [existingSession, setExistingSession] = useState<SessionData | null>(null);

  useEffect(() => {
    setExistingSession(readSession());
  }, []);

  async function startAssessment() {
    setLoading(true);

    const body: Record<string, unknown> = {};
    if (existingSession) {
      body.sessionId = existingSession.sessionId;
    }

    const response = await fetch("/api/assessments/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    const result = await response.json().catch(() => null);
    setLoading(false);

    if (!response.ok) {
      console.error("/api/assessments/start failed", response.status, result);
      if (result?.nextEligibleAt) {
        toast.error(`Retake available after ${new Date(result.nextEligibleAt).toLocaleString()}.`);
      } else {
        toast.error(result?.error ?? `Unable to start assessment (${response.status}).`);
      }
      return;
    }

    if (!result?.reused) {
      const session = {
        sessionId: result.sessionId,
        currentIndex: result.sessionIndex,
        totalScenarios: result.totalScenarios
      };

      writeSession(session);
      setExistingSession(session);
    }

    router.push(`/candidate/assessment/${result.assessmentId}?sessionId=${result.sessionId}`);
  }

  function startNewSession() {
    clearSession();
    setExistingSession(null);
    router.refresh();
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button size="lg" onClick={startAssessment} disabled={loading}>
        {loading ? "Preparing scenarios..." : existingSession ? "Continue session" : "Start assessment"}
      </Button>
      {existingSession && (
        <Button size="lg" variant="outline" onClick={startNewSession}>
          Start new session
        </Button>
      )}
    </div>
  );
}
