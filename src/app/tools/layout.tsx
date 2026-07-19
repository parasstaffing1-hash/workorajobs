import React, { ReactNode } from "react";
import { createMetadata } from "@/lib/site";

export const metadata = createMetadata({
  title: "Recruiter Tools Library | Workora Jobs",
  description: "160+ Free Recruiting, Resume, Parsing, HR and Productivity Tools.",
  path: "/tools",
});

export default function ToolsLayout({ children }: { children: ReactNode }) {
  return <div id="main-content">{children}</div>;
}
