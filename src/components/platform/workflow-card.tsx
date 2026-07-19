import type { ReactNode } from "react";

import { Card } from "@/components/ui/card";

export function WorkflowCard({
  title,
  children,
  action,
}: {
  title: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <Card className="p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
        {action}
      </div>
      <div className="mt-5">{children}</div>
    </Card>
  );
}
