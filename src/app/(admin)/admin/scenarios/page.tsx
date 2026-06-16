import { desc } from "drizzle-orm";

import { db } from "@/db";
import { scenarios } from "@/db/schema";
import { ScenarioForm } from "@/components/scenario-form";
import { ScenarioEditCard } from "@/components/scenario-edit-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { requireRole } from "@/lib/rbac";

export default async function AdminScenariosPage() {
  await requireRole(["admin"]);
  const records = await db.select().from(scenarios).orderBy(desc(scenarios.createdAt));

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <Card className="h-fit">
        <CardHeader>
          <CardTitle>Create scenario</CardTitle>
          <CardDescription>Add custom assessment prompts through the admin UI.</CardDescription>
        </CardHeader>
        <CardContent>
          <ScenarioForm />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Scenario bank</CardTitle>
          <CardDescription>{records.length} scenarios available.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {records.map((scenario) => (
            <ScenarioEditCard key={scenario.id} scenario={scenario} />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
