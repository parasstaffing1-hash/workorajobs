"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

type AccordionItem = {
  question: string;
  answer: string;
};

export function Accordion({ items }: { items: AccordionItem[] }) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="glass-panel overflow-hidden rounded-lg border border-border/70 shadow-premium">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        const panelId = `faq-panel-${index}`;
        const buttonId = `faq-button-${index}`;

        return (
          <div
            className="border-b border-border/60 last:border-b-0"
            key={item.question}
          >
            <h3>
              <button
                aria-controls={panelId}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-medium transition-[background-color,color] duration-300 hover:bg-secondary/70 hover:text-primary focus-visible:bg-secondary"
                id={buttonId}
                onClick={() => setOpenIndex(isOpen ? -1 : index)}
                type="button"
              >
                <span>{item.question}</span>
                <ChevronDown
                  aria-hidden="true"
                  className={cn(
                    "h-5 w-5 shrink-0 text-primary transition-transform duration-300",
                    isOpen && "rotate-180",
                  )}
                />
              </button>
            </h3>
            <div
              aria-labelledby={buttonId}
              className={cn(
                "grid transition-[grid-template-rows] duration-300 ease-out",
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              )}
              id={panelId}
              role="region"
            >
              <div className="overflow-hidden">
                <p className="px-5 pb-5 text-sm leading-7 text-muted-foreground">
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
