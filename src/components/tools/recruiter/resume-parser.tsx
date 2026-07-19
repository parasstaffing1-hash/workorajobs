"use client";

import React, { useState } from "react";
import { ToolShell } from "../tool-shell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";

const exampleResume = `John Doe
Senior Software Engineer | San Francisco, CA
john.doe@email.com | +1-555-0199 | linkedin.com/in/johndoe

Summary:
Experienced Full Stack Developer specializing in TypeScript, React, Node.js, and AWS.

Skills:
TypeScript, React, Node.js, AWS, Docker, Git, Python, SQL, REST APIs, GraphQL

Experience:
Lead Developer | Stripe (2021 - Present)
- Spearheaded the redesign of invoice checkout pages.
- Scaled payments processing backend modules.

Education:
B.S. in Computer Science | Stanford University (2012 - 2016)`;

export default function ResumeParserTool() {
  const [resumeText, setResumeText] = useState("");
  const [parsed, setParsed] = useState<any>(null);

  const parseResume = () => {
    if (!resumeText.trim()) return;

    // 1. Email extraction
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
    const emailMatch = resumeText.match(emailRegex);
    const email = emailMatch ? emailMatch[0] : "Not found";

    // 2. Phone extraction
    const phoneRegex = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
    const phoneMatch = resumeText.match(phoneRegex);
    const phone = phoneMatch ? phoneMatch[0] : "Not found";

    // 3. Name (heuristic: first non-empty line)
    const lines = resumeText.split("\n").map(l => l.trim()).filter(Boolean);
    const name = lines[0] || "Not found";

    // 4. Links
    const linkedinRegex = /linkedin\.com\/in\/[a-zA-Z0-9_-]+/;
    const githubRegex = /github\.com\/[a-zA-Z0-9_-]+/;
    const linkedinMatch = resumeText.match(linkedinRegex);
    const githubMatch = resumeText.match(githubRegex);

    // 5. Skills matching (dictionary based)
    const commonSkills = ["TypeScript", "JavaScript", "React", "Node.js", "AWS", "Docker", "Git", "Python", "SQL", "GraphQL", "Java", "C++"];
    const matchedSkills = commonSkills.filter(skill => 
      new RegExp(`\\b${skill}\\b`, "i").test(resumeText)
    );

    setParsed({
      name,
      email,
      phone,
      linkedin: linkedinMatch ? `https://${linkedinMatch[0]}` : "Not found",
      github: githubMatch ? `https://${githubMatch[0]}` : "Not found",
      skills: matchedSkills,
      linesCount: lines.length
    });
  };

  return (
    <ToolShell
      tool={{
        slug: "resume-parser",
        name: "Resume Parser (Regex)",
        description: "Instantly parse contact info, links, and key skills from resume text copy-pastes locally.",
        category: "recruiter",
        keywords: []
      }}
      exampleInput={exampleResume}
      onLoadExample={(val) => setResumeText(val)}
      onReset={() => {
        setResumeText("");
        setParsed(null);
      }}
    >
      <div className="space-y-4">
        <Textarea
          className="min-h-[220px] font-mono text-xs leading-relaxed"
          placeholder="Paste plain text version of resume here..."
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
        />

        <div className="flex justify-end">
          <Button variant="primary" onClick={parseResume} disabled={!resumeText}>
            Parse Resume Text
          </Button>
        </div>

        {parsed && (
          <div className="grid gap-4 md:grid-cols-2 mt-6">
            <Card className="p-4 space-y-2">
              <h3 className="text-xs font-bold text-muted-foreground uppercase">Contact Info</h3>
              <div className="space-y-1 text-sm">
                <div><strong>Name:</strong> {parsed.name}</div>
                <div><strong>Email:</strong> {parsed.email}</div>
                <div><strong>Phone:</strong> {parsed.phone}</div>
                <div><strong>LinkedIn:</strong> {parsed.linkedin}</div>
                <div><strong>GitHub:</strong> {parsed.github}</div>
              </div>
            </Card>

            <Card className="p-4 space-y-2">
              <h3 className="text-xs font-bold text-muted-foreground uppercase">Extracted Skills ({parsed.skills.length})</h3>
              <div className="flex flex-wrap gap-1">
                {parsed.skills.map((s: string, i: number) => (
                  <span key={i} className="bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded text-xs font-medium">
                    {s}
                  </span>
                ))}
              </div>
            </Card>
          </div>
        )}
      </div>
    </ToolShell>
  );
}
