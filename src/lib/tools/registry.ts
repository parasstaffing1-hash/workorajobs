// ============================================================
// WorkoraJobs Tool Registry — Master catalog of all tools
// ============================================================

export type ToolCategory =
  | "recruiter"
  | "salary"
  | "date"
  | "seo"
  | "text"
  | "developer"
  | "validation"
  | "file"
  | "color"
  | "search"
  | "misc";

export interface ToolMeta {
  slug: string;
  name: string;
  description: string;
  category: ToolCategory;
  keywords: string[];
}

export interface CategoryMeta {
  slug: ToolCategory;
  name: string;
  description: string;
  icon: string; // lucide icon name
}

export const categories: CategoryMeta[] = [
  { slug: "text", name: "Text Tools", description: "Word counts, case conversion, diff checking, and text manipulation.", icon: "Type" },
  { slug: "developer", name: "Developer Tools", description: "JSON/XML formatters, encoders, hash generators, and code utilities.", icon: "Code" },
  { slug: "seo", name: "SEO Tools", description: "Meta builders, schema generators, keyword extractors, and sitemap tools.", icon: "Search" },
  { slug: "recruiter", name: "Recruiter Tools", description: "Boolean search builders, resume parsers, JD formatters, and hiring utilities.", icon: "Users" },
  { slug: "salary", name: "Salary & HR", description: "CTC calculators, tax estimators, PF/ESI, and payroll breakdowns.", icon: "IndianRupee" },
  { slug: "date", name: "Date & Time", description: "Age calculators, working days, timestamps, and timezone converters.", icon: "Calendar" },
  { slug: "validation", name: "Validation Tools", description: "Email, phone, URL, PAN, GST, Aadhaar, and credit card validators.", icon: "ShieldCheck" },
  { slug: "file", name: "File Tools", description: "Filename sanitizers, MIME checkers, hash calculators, and file comparators.", icon: "FileText" },
  { slug: "color", name: "Color & Design", description: "Color converters, gradient builders, CSS generators, and design utilities.", icon: "Palette" },
  { slug: "search", name: "Search & Lookup", description: "Fuzzy search, skill lookup, country data, and unit converters.", icon: "SearchCode" },
  { slug: "misc", name: "Miscellaneous", description: "BMI, EMI, loan calculators, random generators, and everyday utilities.", icon: "Wrench" },
];

export const tools: ToolMeta[] = [
  // ──────────────────────────── RECRUITER TOOLS ────────────────────────────
  { slug: "boolean-search", name: "Boolean String Generator", description: "Visually build and format complex boolean search queries for recruitment.", category: "recruiter", keywords: ["boolean search", "boolean string generator", "recruiter search", "xray search"] },
  { slug: "xray-search", name: "X-Ray Search Builder", description: "Generate targeted Google X-Ray search queries for LinkedIn, GitHub, and StackOverflow.", category: "recruiter", keywords: ["xray search", "google xray", "linkedin search"] },
  { slug: "resume-parser", name: "Resume Parser (Regex)", description: "Parse contact details, links, and key skills from plain text resumes locally.", category: "recruiter", keywords: ["resume parser", "parse resume", "extract resume"] },

  // ──────────────────────────── TEXT TOOLS ────────────────────────────
  { slug: "word-counter", name: "Word Counter", description: "Count words, characters, sentences, and paragraphs with reading time.", category: "text", keywords: ["word count", "character count", "reading time"] },
  { slug: "case-converter", name: "Case Converter", description: "Convert text between UPPER, lower, Title, Sentence, camelCase, snake_case, and more.", category: "text", keywords: ["uppercase", "lowercase", "title case"] },
  { slug: "lorem-ipsum", name: "Lorem Ipsum Generator", description: "Generate placeholder text by word, sentence, or paragraph count.", category: "text", keywords: ["placeholder text", "dummy text", "lorem"] },
  { slug: "text-diff", name: "Text Diff Checker", description: "Compare two texts side-by-side and highlight additions, deletions, and changes.", category: "text", keywords: ["diff", "compare text", "text comparison"] },
  { slug: "find-replace", name: "Find & Replace", description: "Find and replace text with support for regex, case sensitivity, and whole word matching.", category: "text", keywords: ["find replace", "search replace", "regex replace"] },
  { slug: "sort-lines", name: "Sort Lines", description: "Sort lines alphabetically, numerically, by length, or in reverse order.", category: "text", keywords: ["sort text", "alphabetical sort", "line sort"] },
  { slug: "remove-duplicates", name: "Duplicate Line Remover", description: "Remove duplicate lines from text while preserving order.", category: "text", keywords: ["remove duplicates", "unique lines", "dedup"] },
  { slug: "text-cleaner", name: "Text Cleaner", description: "Remove extra spaces, empty lines, trim whitespace, and clean up messy text.", category: "text", keywords: ["clean text", "trim", "remove spaces"] },
  { slug: "reverse-text", name: "Reverse Text", description: "Reverse text by characters, words, or lines.", category: "text", keywords: ["reverse", "mirror text", "flip text"] },
  { slug: "line-numbers", name: "Line Number Generator", description: "Add or remove line numbers from text content.", category: "text", keywords: ["line numbers", "numbered lines", "add numbers"] },
  { slug: "reading-time", name: "Reading Time Calculator", description: "Estimate reading time based on word count and configurable reading speed.", category: "text", keywords: ["reading time", "read time", "minutes to read"] },
  { slug: "random-text", name: "Random Text Generator", description: "Generate random strings, words, sentences, or paragraphs.", category: "text", keywords: ["random string", "random words", "text generator"] },
  { slug: "text-splitter", name: "Text Splitter", description: "Split text by delimiter, character count, or line count.", category: "text", keywords: ["split text", "text chunker", "divide text"] },
  { slug: "text-joiner", name: "Text Joiner", description: "Join multiple lines or items with a custom separator.", category: "text", keywords: ["join text", "merge lines", "concatenate"] },

  // ──────────────────────────── DEVELOPER TOOLS ────────────────────────────
  { slug: "json-formatter", name: "JSON Formatter", description: "Format, beautify, and validate JSON with adjustable indentation.", category: "developer", keywords: ["json beautify", "json pretty print", "format json"] },
  { slug: "json-minifier", name: "JSON Minifier", description: "Minify JSON by removing all whitespace and formatting.", category: "developer", keywords: ["json minify", "compress json", "compact json"] },
  { slug: "csv-to-json", name: "CSV → JSON Converter", description: "Convert CSV data to JSON array format.", category: "developer", keywords: ["csv to json", "csv convert", "csv parser"] },
  { slug: "json-to-csv", name: "JSON → CSV Converter", description: "Convert JSON arrays to CSV format with headers.", category: "developer", keywords: ["json to csv", "json export", "csv export"] },
  { slug: "base64-encode", name: "Base64 Encoder", description: "Encode text or data to Base64 format.", category: "developer", keywords: ["base64 encode", "base64", "encode"] },
  { slug: "base64-decode", name: "Base64 Decoder", description: "Decode Base64 strings back to original text.", category: "developer", keywords: ["base64 decode", "decode base64", "base64 to text"] },
  { slug: "url-encode", name: "URL Encoder", description: "Encode text for safe use in URLs.", category: "developer", keywords: ["url encode", "percent encode", "uri encode"] },
  { slug: "url-decode", name: "URL Decoder", description: "Decode URL-encoded strings back to readable text.", category: "developer", keywords: ["url decode", "percent decode", "uri decode"] },
  { slug: "html-encode", name: "HTML Encoder", description: "Encode special characters as HTML entities.", category: "developer", keywords: ["html encode", "html entities", "escape html"] },
  { slug: "html-decode", name: "HTML Decoder", description: "Decode HTML entities back to readable characters.", category: "developer", keywords: ["html decode", "unescape html", "html entities"] },
  { slug: "html-preview", name: "HTML Preview", description: "Preview rendered HTML in a sandboxed iframe.", category: "developer", keywords: ["html preview", "html render", "html viewer"] },
  { slug: "markdown-preview", name: "Markdown Preview", description: "Live preview of Markdown content rendered as HTML.", category: "developer", keywords: ["markdown preview", "md preview", "markdown render"] },
  { slug: "regex-tester", name: "Regex Tester", description: "Test regular expressions against sample text with match highlighting.", category: "developer", keywords: ["regex test", "regular expression", "regex match"] },
  { slug: "uuid-generator", name: "UUID Generator", description: "Generate UUIDs (v4) in bulk with formatting options.", category: "developer", keywords: ["uuid", "guid", "unique id"] },
  { slug: "password-generator", name: "Password Generator", description: "Generate strong random passwords with configurable length and character sets.", category: "developer", keywords: ["password", "random password", "strong password"] },
  { slug: "password-strength", name: "Password Strength Checker", description: "Analyze password strength with entropy calculation and improvement tips.", category: "developer", keywords: ["password strength", "password check", "password security"] },
  { slug: "hash-generator", name: "Hash Generator", description: "Generate MD5, SHA-1, SHA-256, and SHA-512 hashes from text.", category: "developer", keywords: ["md5", "sha256", "hash", "checksum"] },
  { slug: "jwt-decoder", name: "JWT Decoder", description: "Decode and inspect JWT tokens — header, payload, and expiry.", category: "developer", keywords: ["jwt decode", "jwt parse", "json web token"] },
  { slug: "html-minifier", name: "HTML Minifier", description: "Minify HTML by removing comments, whitespace, and optional tags.", category: "developer", keywords: ["html minify", "compress html", "html optimize"] },
  { slug: "css-minifier", name: "CSS Minifier", description: "Minify CSS by removing whitespace, comments, and redundant selectors.", category: "developer", keywords: ["css minify", "compress css", "css optimize"] },
  { slug: "js-minifier", name: "JavaScript Minifier", description: "Minify JavaScript by removing whitespace, comments, and shortening code.", category: "developer", keywords: ["js minify", "javascript compress", "js optimize"] },
  { slug: "xml-formatter", name: "XML Formatter", description: "Format and beautify XML with proper indentation.", category: "developer", keywords: ["xml beautify", "xml format", "xml pretty print"] },

  // ──────────────────────────── SEO TOOLS ────────────────────────────
  { slug: "slug-generator", name: "Slug Generator", description: "Generate URL-friendly slugs from any text.", category: "seo", keywords: ["slug", "url slug", "permalink"] },
  { slug: "meta-title-builder", name: "Meta Title Builder", description: "Build SEO-optimized meta titles with character count and preview.", category: "seo", keywords: ["meta title", "seo title", "title tag"] },
  { slug: "meta-description-builder", name: "Meta Description Builder", description: "Craft meta descriptions with length validation and SERP preview.", category: "seo", keywords: ["meta description", "seo description", "serp"] },
  { slug: "keyword-extractor", name: "Keyword Extractor", description: "Extract keywords and key phrases from text with frequency analysis.", category: "seo", keywords: ["keyword extract", "keyword analysis", "keyword density"] },
  { slug: "keyword-density", name: "Keyword Density Checker", description: "Analyze keyword frequency and density percentage in any text.", category: "seo", keywords: ["keyword density", "keyword frequency", "seo analysis"] },
  { slug: "og-generator", name: "Open Graph Generator", description: "Generate Open Graph meta tags for Facebook, LinkedIn, and social sharing.", category: "seo", keywords: ["open graph", "og tags", "social meta"] },
  { slug: "twitter-card", name: "Twitter Card Generator", description: "Generate Twitter Card meta tags for rich tweet previews.", category: "seo", keywords: ["twitter card", "twitter meta", "tweet preview"] },
  { slug: "utm-builder", name: "UTM Builder", description: "Build UTM-tagged URLs for campaign tracking in Google Analytics.", category: "seo", keywords: ["utm", "campaign tracking", "google analytics"] },
  { slug: "robots-txt", name: "Robots.txt Generator", description: "Generate robots.txt rules to control search engine crawling.", category: "seo", keywords: ["robots.txt", "crawling", "search engine"] },
  { slug: "faq-schema", name: "FAQ Schema Generator", description: "Generate FAQ structured data in JSON-LD format for rich snippets.", category: "seo", keywords: ["faq schema", "structured data", "json-ld"] },
  { slug: "jobposting-schema", name: "JobPosting Schema Generator", description: "Generate JobPosting structured data for Google for Jobs.", category: "seo", keywords: ["job schema", "jobposting", "google for jobs"] },
  { slug: "breadcrumb-schema", name: "Breadcrumb Schema Generator", description: "Generate BreadcrumbList structured data in JSON-LD.", category: "seo", keywords: ["breadcrumb", "schema", "navigation"] },
  { slug: "canonical-url", name: "Canonical URL Generator", description: "Generate canonical URL tags to prevent duplicate content issues.", category: "seo", keywords: ["canonical", "duplicate content", "seo"] },
  { slug: "redirect-generator", name: "Redirect Generator", description: "Generate redirect rules for .htaccess, nginx, Next.js, and Vercel.", category: "seo", keywords: ["redirect", "301", "htaccess", "nginx"] },

  // ──────────────────────────── VALIDATION TOOLS ────────────────────────────
  { slug: "email-validator", name: "Email Validator", description: "Validate email format with RFC 5322 compliance check.", category: "validation", keywords: ["email validate", "email check", "email format"] },
  { slug: "url-validator", name: "URL Validator", description: "Validate URL format and extract protocol, domain, path, and query.", category: "validation", keywords: ["url validate", "url check", "url parser"] },
  { slug: "phone-formatter", name: "Phone Number Formatter", description: "Format phone numbers to international E.164, national, and display formats.", category: "validation", keywords: ["phone format", "phone number", "international phone"] },
  { slug: "pan-validator", name: "PAN Validator", description: "Validate Indian PAN card numbers against the standard format.", category: "validation", keywords: ["pan card", "pan validate", "indian pan"] },
  { slug: "gst-validator", name: "GST Validator", description: "Validate Indian GST numbers with state code and checksum verification.", category: "validation", keywords: ["gst number", "gstin", "gst validate"] },
  { slug: "aadhaar-validator", name: "Aadhaar Validator", description: "Validate Aadhaar numbers using the Verhoeff checksum algorithm.", category: "validation", keywords: ["aadhaar", "verhoeff", "aadhaar validate"] },
  { slug: "credit-card-validator", name: "Credit Card Validator", description: "Validate credit card numbers using the Luhn algorithm and detect card type.", category: "validation", keywords: ["credit card", "luhn", "card validate"] },
  { slug: "ip-validator", name: "IP Address Validator", description: "Validate IPv4 and IPv6 addresses with type detection.", category: "validation", keywords: ["ip address", "ipv4", "ipv6", "ip validate"] },

  // ──────────────────────────── SALARY & HR ────────────────────────────
  { slug: "ctc-calculator", name: "CTC Calculator", description: "Calculate Cost to Company with detailed salary component breakdown.", category: "salary", keywords: ["ctc", "cost to company", "salary calculator"] },
  { slug: "take-home-salary", name: "Take Home Salary Calculator", description: "Calculate net take-home salary after PF, tax, and deductions.", category: "salary", keywords: ["take home", "net salary", "in hand salary"] },
  { slug: "income-tax", name: "Income Tax Calculator", description: "Calculate Indian income tax under old and new regimes.", category: "salary", keywords: ["income tax", "tax calculator", "india tax"] },
  { slug: "pf-calculator", name: "PF Calculator", description: "Calculate EPF contributions (employee + employer) and maturity amount.", category: "salary", keywords: ["pf", "epf", "provident fund"] },
  { slug: "hra-calculator", name: "HRA Calculator", description: "Calculate HRA exemption under Section 10(13A) of the Income Tax Act.", category: "salary", keywords: ["hra", "hra exemption", "house rent allowance"] },
  { slug: "gratuity-calculator", name: "Gratuity Calculator", description: "Calculate gratuity amount based on years of service and last drawn salary.", category: "salary", keywords: ["gratuity", "gratuity calculator", "retirement"] },
  { slug: "emi-calculator", name: "EMI Calculator", description: "Calculate monthly EMI for loans with amortization schedule.", category: "salary", keywords: ["emi", "loan emi", "monthly installment"] },

  // ──────────────────────────── DATE & TIME ────────────────────────────
  { slug: "age-calculator", name: "Age Calculator", description: "Calculate exact age in years, months, and days from date of birth.", category: "date", keywords: ["age", "date of birth", "age calculator"] },
  { slug: "date-difference", name: "Date Difference Calculator", description: "Calculate the exact difference between two dates in multiple units.", category: "date", keywords: ["date diff", "days between", "date calculator"] },
  { slug: "working-days", name: "Working Days Calculator", description: "Calculate business/working days between two dates excluding weekends and holidays.", category: "date", keywords: ["working days", "business days", "weekdays"] },
  { slug: "unix-timestamp", name: "Unix Timestamp Converter", description: "Convert between Unix timestamps and human-readable dates.", category: "date", keywords: ["unix timestamp", "epoch", "timestamp convert"] },
  { slug: "timezone-converter", name: "Time Zone Converter", description: "Convert time between different time zones worldwide.", category: "date", keywords: ["timezone", "time zone convert", "world clock"] },

  // ──────────────────────────── COLOR & DESIGN ────────────────────────────
  { slug: "hex-rgb", name: "HEX ↔ RGB Converter", description: "Convert colors between HEX and RGB formats with live preview.", category: "color", keywords: ["hex to rgb", "rgb to hex", "color convert"] },
  { slug: "gradient-generator", name: "Gradient Generator", description: "Create CSS linear and radial gradients with live preview and code output.", category: "color", keywords: ["css gradient", "gradient maker", "color gradient"] },
  { slug: "box-shadow", name: "CSS Box Shadow Generator", description: "Generate CSS box-shadow with visual controls and live preview.", category: "color", keywords: ["box shadow", "css shadow", "shadow generator"] },

  // ──────────────────────────── MISC ────────────────────────────
  { slug: "percentage-calculator", name: "Percentage Calculator", description: "Calculate percentages, percentage change, and percentage of a number.", category: "misc", keywords: ["percentage", "percent", "calculator"] },
  { slug: "bmi-calculator", name: "BMI Calculator", description: "Calculate Body Mass Index from height and weight with health classification.", category: "misc", keywords: ["bmi", "body mass index", "health"] },
  { slug: "discount-calculator", name: "Discount Calculator", description: "Calculate discount amount, sale price, and savings from original price.", category: "misc", keywords: ["discount", "sale price", "savings"] },
  { slug: "gst-calculator", name: "GST Calculator", description: "Calculate GST amount and total price with different tax slab rates.", category: "misc", keywords: ["gst", "goods and services tax", "tax calculator"] },
];

// ── Lookup helpers ──
export function getToolBySlug(slug: string): ToolMeta | undefined {
  return tools.find((t) => t.slug === slug);
}

export function getToolsByCategory(category: ToolCategory): ToolMeta[] {
  return tools.filter((t) => t.category === category);
}

export function getCategoryBySlug(slug: string): CategoryMeta | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getAllSlugs(): string[] {
  return tools.map((t) => `${t.category}/${t.slug}`);
}

export function searchTools(query: string): ToolMeta[] {
  const q = query.toLowerCase().trim();
  if (!q) return tools;
  return tools.filter(
    (t) =>
      t.name.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.keywords.some((k) => k.includes(q))
  );
}
