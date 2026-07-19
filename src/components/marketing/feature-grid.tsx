import type { LucideIcon } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

type Feature = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export function FeatureGrid({ features }: { features: Feature[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {features.map((feature, index) => {
        const Icon = feature.icon;

        return (
          <Reveal delay={index * 0.05} key={feature.title}>
            <Card className="h-full transition-colors hover:border-primary">
              <CardHeader>
                <div className="animated-sheen grid h-11 w-11 place-items-center rounded-lg border border-primary/20 bg-primary/10 text-primary shadow-sm">
                  <Icon aria-hidden="true" className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold tracking-tight">
                  {feature.title}
                </h3>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-6 text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          </Reveal>
        );
      })}
    </div>
  );
}
