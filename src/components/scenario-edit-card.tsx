"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const scenarioSchema = z.object({
  title: z.string().trim().min(3).max(220),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]),
  category: z.string().trim().min(2).max(120),
  prompt: z.string().trim().min(20),
  scoringNotes: z.string().trim().optional()
});

type ScenarioFormValues = z.infer<typeof scenarioSchema>;

type ScenarioEditCardProps = {
  scenario: {
    id: string;
    title: string;
    prompt: string;
    difficulty: "beginner" | "intermediate" | "advanced";
    category: string;
    scoringNotes: string | null;
    active: boolean;
  };
};

export function ScenarioEditCard({ scenario }: ScenarioEditCardProps) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [active, setActive] = useState(scenario.active);
  const form = useForm<ScenarioFormValues>({
    resolver: zodResolver(scenarioSchema),
    defaultValues: {
      title: scenario.title,
      difficulty: scenario.difficulty,
      category: scenario.category,
      prompt: scenario.prompt,
      scoringNotes: scenario.scoringNotes ?? ""
    }
  });

  async function onSubmit(values: ScenarioFormValues) {
    setSaving(true);
    const response = await fetch(`/api/admin/scenarios/${scenario.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values)
    });
    const body = await response.json().catch(() => null);
    setSaving(false);

    if (!response.ok) {
      toast.error(body?.error ?? "Unable to save scenario.");
      return;
    }

    toast.success("Scenario updated.");
    setEditing(false);
    router.refresh();
  }

  async function toggleActive() {
    setSaving(true);
    const response = await fetch(`/api/admin/scenarios/${scenario.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !active })
    });
    const body = await response.json().catch(() => null);
    setSaving(false);

    if (!response.ok) {
      toast.error(body?.error ?? "Unable to update scenario status.");
      return;
    }

    setActive(!active);
    toast.success(active ? "Scenario deactivated." : "Scenario activated.");
    router.refresh();
  }

  async function archiveScenario() {
    if (!window.confirm("Archive this scenario? This will deactivate it.")) {
      return;
    }

    setSaving(true);
    const response = await fetch(`/api/admin/scenarios/${scenario.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ archive: true })
    });
    const body = await response.json().catch(() => null);
    setSaving(false);

    if (!response.ok) {
      toast.error(body?.error ?? "Unable to archive scenario.");
      return;
    }

    toast.success("Scenario archived.");
    router.refresh();
  }

  return (
    <div className="rounded-2xl border p-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="font-semibold">{scenario.title}</h3>
          <p className="text-sm text-muted-foreground">
            {scenario.difficulty} · {scenario.category}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant={active ? "outline" : "secondary"} size="sm" onClick={toggleActive} disabled={saving}>
            {active ? "Deactivate" : "Activate"}
          </Button>
          <Button variant="outline" size="sm" onClick={() => setEditing(!editing)} disabled={saving}>
            {editing ? "Cancel" : "Edit"}
          </Button>
          <Button variant="ghost" size="sm" onClick={archiveScenario} disabled={saving}>
            Archive
          </Button>
        </div>
      </div>
      <p className="mt-3 text-sm text-muted-foreground line-clamp-3">{scenario.prompt}</p>
      {editing ? (
        <form className="mt-6 space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor={`title-${scenario.id}`}>Title</Label>
              <Input id={`title-${scenario.id}`} {...form.register("title")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`category-${scenario.id}`}>Category</Label>
              <Input id={`category-${scenario.id}`} {...form.register("category")} />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor={`difficulty-${scenario.id}`}>Difficulty</Label>
              <select
                id={`difficulty-${scenario.id}`}
                className="h-10 w-full rounded-xl border bg-background px-3 text-sm"
                {...form.register("difficulty")}
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor={`prompt-${scenario.id}`}>Prompt</Label>
            <Textarea id={`prompt-${scenario.id}`} className="min-h-28" {...form.register("prompt")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`scoringNotes-${scenario.id}`}>Scoring notes</Label>
            <Textarea id={`scoringNotes-${scenario.id}`} {...form.register("scoringNotes")} />
          </div>
          <Button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save changes"}
          </Button>
        </form>
      ) : null}
    </div>
  );
}
