"use client";

import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button, type ButtonProps } from "@/components/ui/button";
import { slugify } from "@/lib/slugs";

type AiToolLaunchButtonProps = Pick<
  ButtonProps,
  "className" | "size" | "variant"
> & {
  targetPath: string;
  toolName: string;
};

export const aiToolSelectEvent = "workora:ai-tool-select";

export function AiToolLaunchButton({
  className,
  size = "sm",
  targetPath,
  toolName,
  variant = "outline",
}: AiToolLaunchButtonProps) {
  const router = useRouter();

  function launchTool() {
    const href = `${targetPath}?tool=${slugify(toolName)}#ai-workbench`;
    window.open(href, "_blank");
  }

  return (
    <Button
      className={className}
      data-ai-tool={slugify(toolName)}
      onClick={launchTool}
      size={size}
      type="button"
      variant={variant}
    >
      Try locally
      <ArrowRight aria-hidden="true" className="h-4 w-4" />
    </Button>
  );
}
