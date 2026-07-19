'use client';
import { Card } from "@/components/ui/card";
import Link from "next/link";

export function MetricGrid({
  metrics,
}: {
  metrics: { label: string; value: string; delta: string; href?: string }[];
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric, index) => {
        const CardContent = (
          <Card
            className="animated-sheen p-5 h-full"
            style={{ transitionDelay: `${index * 35}ms` }}
          >
            <p className="text-sm text-muted-foreground">{metric.label}</p>
            <p className="mt-2 text-3xl font-semibold tracking-tight">
              {metric.value}
            </p>
            <p className="mt-2 text-xs text-primary">{metric.delta}</p>
          </Card>
        );

        return metric.href ? (
          <Link href={metric.href} key={metric.label} className="block h-full hover:opacity-90 transition-opacity">
            {CardContent}
          </Link>
        ) : (
          <div key={metric.label}>{CardContent}</div>
        );
      })}
    </div>
  );
}
