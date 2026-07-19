import { type ResumeData } from "./validation";
import { ResumeEngine, type EngineOptions } from "./engine";

export interface TemplateDefinition {
  id: string;
  name: string;
  description: string;
  stylePreset: EngineOptions;
}

export const ENTERPRISE_TEMPLATES: TemplateDefinition[] = [
  {
    id: "modern",
    name: "Modern Executive",
    description: "Sleek sans-serif fonts with modern border highlights. Recruiter favorite.",
    stylePreset: {
      fontFamily: "sans",
      fontSize: "md",
      themeColor: "#2563eb",
      lineHeight: "normal"
    }
  },
  {
    id: "classic",
    name: "Classic Serif",
    description: "Traditional times/serif spacing for lawyers, investment bankers, and managers.",
    stylePreset: {
      fontFamily: "serif",
      fontSize: "md",
      themeColor: "#0f172a",
      lineHeight: "relaxed"
    }
  },
  {
    id: "executive",
    name: "Executive Leadership",
    description: "Wide margins, elegant layout accentuating years of leadership experience.",
    stylePreset: {
      fontFamily: "serif",
      fontSize: "lg",
      themeColor: "#1e3a8a",
      lineHeight: "normal"
    }
  },
  {
    id: "minimal",
    name: "Minimalist Grid",
    description: "Ultra-clean structure with compact borders and high information density.",
    stylePreset: {
      fontFamily: "sans",
      fontSize: "sm",
      themeColor: "#334155",
      lineHeight: "compact"
    }
  },
  {
    id: "creative",
    name: "Creative Modernist",
    description: "Vibrant accent tones and visual structures for designers, copywriters, and marketers.",
    stylePreset: {
      fontFamily: "sans",
      fontSize: "md",
      themeColor: "#ec4899",
      lineHeight: "relaxed"
    }
  },
  {
    id: "tech",
    name: "Technical/Developer",
    description: "Side-by-side technical skill grid showcasing tech stack components side-by-side.",
    stylePreset: {
      fontFamily: "mono",
      fontSize: "sm",
      themeColor: "#06b6d4",
      lineHeight: "compact"
    }
  },
  {
    id: "consultant",
    name: "Consultant Portfolio",
    description: "Impact-oriented project summaries and client delivery highlights.",
    stylePreset: {
      fontFamily: "sans",
      fontSize: "md",
      themeColor: "#047857",
      lineHeight: "normal"
    }
  },
  {
    id: "management",
    name: "Product Management",
    description: "Product velocity KPIs, metrics, and roadmap delivery tables.",
    stylePreset: {
      fontFamily: "sans",
      fontSize: "md",
      themeColor: "#7c3aed",
      lineHeight: "normal"
    }
  },
  {
    id: "academic",
    name: "Academic CV",
    description: "Optimized for publication records, patent dates, and academic degrees.",
    stylePreset: {
      fontFamily: "serif",
      fontSize: "md",
      themeColor: "#000000",
      lineHeight: "relaxed"
    }
  },
  {
    id: "fresh_graduate",
    name: "Fresh Graduate",
    description: "Puts education and academic project history above work experience.",
    stylePreset: {
      fontFamily: "sans",
      fontSize: "md",
      themeColor: "#0ea5e9",
      lineHeight: "normal",
      sectionOrder: ["education", "projects", "skills", "experience", "certifications"]
    }
  }
];

export class EnterpriseTemplatesEngine {
  private engine = new ResumeEngine();

  /**
   * Compiles HTML content using a specific template preset
   */
  compileTemplate(data: ResumeData, templateId: string, customOptions?: EngineOptions): string {
    const template = ENTERPRISE_TEMPLATES.find(t => t.id === templateId) || ENTERPRISE_TEMPLATES[0];
    const options = {
      ...template.stylePreset,
      ...customOptions
    };
    return this.engine.generateHtml(data, templateId, options);
  }
}
