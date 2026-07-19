"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

type RecordItem = {
  title: string;
  meta: string;
  value?: string;
  details?: string;
};

export function RecordList({ items }: { items: RecordItem[] }) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  return (
    <div className="grid gap-3">
      {items.map((item, index) => (
        <div
          className="interactive-border grid gap-2 rounded-md border border-border/70 bg-card/70 p-4 shadow-sm backdrop-blur-xl transition-[border-color,box-shadow,transform] duration-300 hover:border-primary/20 hover:shadow-premium"
          key={`${item.title}-${item.meta}`}
        >
          <div
            className="flex cursor-pointer justify-between items-center"
            onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
          >
            <div>
              <h2 className="font-semibold">{item.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{item.meta}</p>
            </div>
            {item.value ? (
              <span className="text-sm font-medium text-primary">
                {item.value}
              </span>
            ) : null}
          </div>
          {expandedIndex === index && (
            <div className="mt-3 p-3 bg-secondary/50 rounded-md text-sm text-muted-foreground">
              {item.details || "No additional details available."}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
