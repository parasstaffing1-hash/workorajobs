import { type ResumeData } from "./validation";

export interface EngineOptions {
  fontSize?: "sm" | "md" | "lg";
  themeColor?: string;
  fontFamily?: "sans" | "serif" | "mono";
  lineHeight?: "compact" | "normal" | "relaxed";
  sectionOrder?: string[];
  sectionVisibility?: Record<string, boolean>;
}

export class ResumeEngine {
  /**
   * Formats a raw date string (e.g. "2022-01" to "January 2022")
   */
  formatDate(dateStr?: string): string {
    if (!dateStr) return "Present";
    if (dateStr.toLowerCase() === "present") return "Present";
    
    // Check if format is YYYY-MM
    const match = dateStr.match(/^(\d{4})-(\d{2})$/);
    if (match) {
      const year = match[1];
      const monthIndex = parseInt(match[2], 10) - 1;
      const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];
      if (monthIndex >= 0 && monthIndex < 12) {
        return `${monthNames[monthIndex]} ${year}`;
      }
    }
    return dateStr;
  }

  /**
   * Generates a fully contained HTML document with styling for print/screen preview
   */
  generateHtml(data: ResumeData, templateId: string, options: EngineOptions = {}): string {
    const fontSizeMap = {
      sm: "11px",
      md: "12px",
      lg: "14px"
    };

    const fontFamilyMap = {
      sans: "'Inter', system-ui, -apple-system, sans-serif",
      serif: "Georgia, 'Times New Roman', Times, serif",
      mono: "Courier, monospace"
    };

    const lineHeightMap = {
      compact: "1.25",
      normal: "1.5",
      relaxed: "1.75"
    };

    const fontSize = fontSizeMap[options.fontSize || "md"];
    const fontFamily = fontFamilyMap[options.fontFamily || "sans"];
    const lineHeight = lineHeightMap[options.lineHeight || "normal"];
    const themeColor = options.themeColor || "#3b82f6"; // default blue-500

    const order = options.sectionOrder || [
      "summary",
      "skills",
      "experience",
      "education",
      "projects",
      "certifications"
    ];

    const visibility = options.sectionVisibility || {};

    const styleBlock = `
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap');
        
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        
        body {
          font-family: ${fontFamily};
          font-size: ${fontSize};
          line-height: ${lineHeight};
          color: #1e293b;
          background-color: #ffffff;
          padding: 0.5in;
        }

        h1 {
          font-size: 2.25rem;
          font-weight: 700;
          color: #0f172a;
          text-transform: uppercase;
          letter-spacing: -0.025em;
        }

        h2 {
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: ${themeColor};
          border-bottom: 1.5px solid #e2e8f0;
          padding-bottom: 4px;
          margin-top: 20px;
          margin-bottom: 10px;
          page-break-after: avoid;
        }

        h3 {
          font-size: 0.9rem;
          font-weight: 600;
          color: #1e293b;
        }

        p, li {
          color: #475569;
        }

        ul {
          list-style-type: disc;
          padding-left: 20px;
          margin-top: 4px;
        }

        li {
          margin-bottom: 2px;
        }

        .header {
          margin-bottom: 24px;
          border-b: 2px solid ${themeColor};
          padding-bottom: 12px;
        }

        .contact-info {
          font-size: 0.75rem;
          color: #64748b;
          margin-top: 6px;
        }

        .section-item {
          margin-bottom: 12px;
          page-break-inside: avoid;
        }

        .item-header {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          flex-wrap: wrap;
        }

        .item-dates {
          font-size: 0.75rem;
          font-weight: 500;
          color: #64748b;
        }

        .item-subtitle {
          font-size: 0.8rem;
          font-weight: 500;
          color: #475569;
          margin-top: 1px;
        }

        .skills-container {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-top: 6px;
        }

        .skill-tag {
          font-size: 0.7rem;
          font-weight: 600;
          background-color: #f1f5f9;
          color: #334155;
          border: 1px solid #e2e8f0;
          padding: 2px 8px;
          border-radius: 4px;
        }

        /* Print optimization overrides */
        @media print {
          body {
            padding: 0;
            margin: 0;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          @page {
            size: letter;
            margin: 0.5in;
          }
          .section-item {
            page-break-inside: avoid;
          }
        }
      </style>
    `;

    // Render Contact Header
    const contactLine = [
      data.personalInfo.email,
      data.personalInfo.phone,
      data.personalInfo.location,
      data.personalInfo.socialLinks?.linkedin,
      data.personalInfo.socialLinks?.portfolio
    ].filter(Boolean).join("  •  ");

    const headerHtml = `
      <div class="header">
        <h1>${data.personalInfo.fullName}</h1>
        ${data.personalInfo.title ? `<p style="font-weight: 600; color: ${themeColor}; font-size: 0.95rem; margin-top: 2px;">${data.personalInfo.title}</p>` : ""}
        <div class="contact-info">${contactLine}</div>
      </div>
    `;

    // Render dynamic sections ordered
    const sectionsHtml = order.map(secId => {
      // Check visibility filter
      if (visibility[secId] === false) return "";

      if (secId === "summary" && data.summary) {
        return `
          <section class="section-item">
            <h2>Professional Summary</h2>
            <p style="margin-top: 6px;">${data.summary}</p>
          </section>
        `;
      }

      if (secId === "skills" && data.skills.length > 0) {
        const skillsTags = data.skills.map(s => `<span class="skill-tag">${s.name}${s.level ? ` (${s.level})` : ""}</span>`).join("");
        return `
          <section class="section-item">
            <h2>Core Competencies</h2>
            <div class="skills-container">${skillsTags}</div>
          </section>
        `;
      }

      if (secId === "experience" && data.workExperiences.length > 0) {
        const items = data.workExperiences.map(exp => `
          <div class="section-item">
            <div class="item-header">
              <h3>${exp.role}</h3>
              <span class="item-dates">${this.formatDate(exp.startDate)} – ${exp.isCurrent ? "Present" : this.formatDate(exp.endDate)}</span>
            </div>
            <div class="item-subtitle">${exp.company}${exp.location ? `, ${exp.location}` : ""}</div>
            ${exp.description ? `<p style="font-size: 0.8rem; margin-top: 4px;">${exp.description}</p>` : ""}
            ${exp.bullets.length > 0 ? `
              <ul>
                ${exp.bullets.map(b => `<li>${b}</li>`).join("")}
              </ul>
            ` : ""}
          </div>
        `).join("");

        return `
          <section class="section-item">
            <h2>Professional Experience</h2>
            ${items}
          </section>
        `;
      }

      if (secId === "education" && data.education.length > 0) {
        const items = data.education.map(ed => `
          <div class="section-item">
            <div class="item-header">
              <h3>${ed.degree}</h3>
              <span class="item-dates">${ed.endDate || "Graduated"}</span>
            </div>
            <div class="item-subtitle">${ed.institution}${ed.location ? `, ${ed.location}` : ""}</div>
            ${ed.details ? `<p style="font-size: 0.75rem; margin-top: 3px; font-style: italic;">${ed.details}</p>` : ""}
          </div>
        `).join("");

        return `
          <section class="section-item">
            <h2>Education</h2>
            ${items}
          </section>
        `;
      }

      if (secId === "projects" && data.projects.length > 0) {
        const items = data.projects.map(proj => `
          <div class="section-item">
            <div class="item-header">
              <h3>${proj.name} ${proj.role ? `(${proj.role})` : ""}</h3>
              ${proj.url ? `<span class="item-dates" style="color: ${themeColor};">${proj.url}</span>` : ""}
            </div>
            ${proj.techStack.length > 0 ? `<p style="font-size: 0.7rem; font-weight: 600; text-transform: uppercase; color: #64748b; margin-top: 2px;">Stack: ${proj.techStack.join(", ")}</p>` : ""}
            ${proj.description ? `<p style="font-size: 0.8rem; margin-top: 4px;">${proj.description}</p>` : ""}
            ${proj.bullets && proj.bullets.length > 0 ? `
              <ul>
                ${proj.bullets.map(b => `<li>${b}</li>`).join("")}
              </ul>
            ` : ""}
          </div>
        `).join("");

        return `
          <section class="section-item">
            <h2>Projects</h2>
            ${items}
          </section>
        `;
      }

      if (secId === "certifications" && data.certifications.length > 0) {
        const items = data.certifications.map(c => `
          <li style="font-size: 0.8rem;">
            <strong>${c.name}</strong> – ${c.issuer} ${c.issueDate ? `(${c.issueDate})` : ""}
          </li>
        `).join("");

        return `
          <section class="section-item">
            <h2>Certifications</h2>
            <ul>${items}</ul>
          </section>
        `;
      }

      return "";
    }).join("");

    return `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="utf-8">
          <title>${data.personalInfo.fullName} Resume</title>
          ${styleBlock}
        </head>
        <body>
          ${headerHtml}
          ${sectionsHtml}
        </body>
      </html>
    `;
  }
}
