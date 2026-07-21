import { jobs, type Job } from "@/data/jobs";

export type SeoPageData = {
  title: string;
  h1: string;
  description: string;
  contentMarkdown: string;
  jobs: Job[];
  salaryInsights: {
    median: string;
    low: string;
    high: string;
    currency: string;
  };
  requiredSkills: string[];
  similarJobs: Array<{ label: string; href: string }>;
  relatedSearches: Array<{ label: string; href: string }>;
  breadcrumbs: Array<{ label: string; href: string }>;
  faqs: Array<{ question: string; answer: string }>;
  canonicalUrl: string;
  noindex: boolean;
};

// Clean slug strings into title case words
export function deSlugify(slug: string): string {
  return slug
    .split("-")
    .map((word) => {
      if (word.toLowerCase() === "in") return "in";
      if (word.toLowerCase() === "and") return "and";
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

export function parseProgrammaticSeo(pathType: "jobs" | "company" | "skills" | "remote" | "freshers" | "internships", slug: string): SeoPageData {
  const cleanSlug = slug.toLowerCase().trim();

  let pageTitle = "";
  let h1 = "";
  let description = "";
  let contentMarkdown = "";
  let filteredJobs: Job[] = [];
  let salaryInsights = { median: "$95k", low: "$70k", high: "$130k", currency: "USD" };
  let requiredSkills: string[] = ["JavaScript", "TypeScript", "Python", "SQL", "Git"];
  let similarJobs: Array<{ label: string; href: string }> = [];
  let relatedSearches: Array<{ label: string; href: string }> = [];
  const breadcrumbs: Array<{ label: string; href: string }> = [
    { label: "Home", href: "/" },
    { label: "Jobs", href: "/jobs" },
  ];
  let faqs: Array<{ question: string; answer: string }> = [];
  let noindex = false;

  if (pathType === "jobs") {
    // Expected patterns:
    // 1. "python-developer-in-bangalore"
    // 2. "data-engineer-in-delhi"
    // 3. "software-engineer-jobs"
    const hasIn = cleanSlug.includes("-in-");
    let jobTitle = "";
    let location = "";

    if (hasIn) {
      const parts = cleanSlug.split("-in-");
      jobTitle = deSlugify(parts[0]);
      location = deSlugify(parts[1]);
    } else {
      jobTitle = deSlugify(cleanSlug.replace("-jobs", ""));
    }

    // Filter jobs
    filteredJobs = jobs.filter((job) => {
      const matchesTitle = job.title.toLowerCase().includes(jobTitle.toLowerCase()) ||
                           job.tags.some(t => t.toLowerCase() === jobTitle.toLowerCase());
      const matchesLocation = location ? job.location.toLowerCase().includes(location.toLowerCase()) : true;
      return matchesTitle && matchesLocation;
    });

    const locText = location ? ` in ${location}` : "";
    h1 = `${jobTitle} Jobs${locText}`;
    pageTitle = `${jobTitle} Jobs${locText} | Search & Apply Online | WorkoraJobs`;
    description = `Browse active ${jobTitle} opportunities${locText}. Apply to premium roles, check salary ranges, required tech stacks, and interview pipelines.`;

    contentMarkdown = `Looking for your next career move as a ${jobTitle}${locText}? The demand for skilled developers and professional practitioners continues to grow as companies build modern digital infrastructure.

In today's competitive landscape, hiring managers are searching for professionals who can demonstrate not only core technical proficiency but also strong communication, stakeholder management, and agile workflow delivery.

### Key Responsibilities in this Role:
- Design, scale, and maintain high-availability systems or operations workflows.
- Partner with product, business, and tech teams to deploy robust features and solutions.
- Optimize application performance, trace latency spikes, and document architecture decisions.

### Sourcing Strategy and Recommendations:
Ensure your resume highlights measurable business impact (e.g., % improvement in server load, $ cost savings, or reduction in task completion times) rather than just listing technologies.`;

    salaryInsights = {
      median: location ? "$115,000" : "$120,000",
      low: "$85,000",
      high: "$165,000",
      currency: "USD"
    };

    requiredSkills = [jobTitle, "TypeScript", "Node.js", "System Design", "PostgreSQL", "Cloud Computing"];
    
    similarJobs = [
      { label: `Senior ${jobTitle} Roles`, href: `/jobs/senior-${cleanSlug}` },
      { label: `Staff ${jobTitle} Vacancies`, href: `/jobs/staff-${cleanSlug}` },
    ];
    relatedSearches = [
      { label: `${jobTitle} roles near me`, href: `/jobs/${cleanSlug}` },
      { label: `Remote ${jobTitle} positions`, href: "/remote-jobs" },
    ];

    breadcrumbs.push({ label: jobTitle, href: `/jobs/${cleanSlug}` });

    faqs = [
      {
        question: `What is the average salary for a ${jobTitle}${locText}?`,
        answer: `The average salary range starts from $85,000 up to $165,000 depending on seniority, certifications, and target company size.`,
      },
      {
        question: `What skills are most critical for a ${jobTitle}?`,
        answer: `Key requirements include experience with modern software engineering practices, cloud infrastructure (AWS/GCP), database scaling, and agile methodologies.`,
      },
    ];
  } else if (pathType === "company") {
    const companyName = deSlugify(cleanSlug.replace("-jobs", ""));

    filteredJobs = jobs.filter((job) => job.company.toLowerCase().includes(companyName.toLowerCase()));

    h1 = `${companyName} Career Opportunities`;
    pageTitle = `Explore ${companyName} Careers & Open Positions | WorkoraJobs`;
    description = `Explore active roles at ${companyName}. View required skills, company tech stack, employee benefits, and apply directly to open positions.`;

    contentMarkdown = `Join ${companyName} and build the future of global enterprise workflows. ${companyName} is recognized as a leader in technical innovation, product design excellence, and collaborative team cultures.

Candidates applying to ${companyName} should prepare to undergo a rigorous structured interviewing process evaluating both domain depth and systemic problem-solving skills.

### Why Work at ${companyName}:
- Competitive compensation packages with strong equity and bonus components.
- Work on high-impact products serving millions of active users daily.
- Access to premium learning resources, expert mentorship networks, and career pathways.`;

    salaryInsights = { median: "$145,000", low: "$110,000", high: "$195,000", currency: "USD" };
    requiredSkills = ["System Design", "Cloud Infrastructure", "API Integration", "Security", "Agile"];
    similarJobs = [
      { label: `Engineering Jobs at ${companyName}`, href: `/company/${cleanSlug}` },
      { label: `Product Roles at ${companyName}`, href: `/company/${cleanSlug}` },
    ];
    relatedSearches = [
      { label: `${companyName} recruitment process`, href: `/company/${cleanSlug}` },
      { label: `${companyName} salary guide`, href: `/company/${cleanSlug}` },
    ];

    breadcrumbs.push({ label: companyName, href: `/company/${cleanSlug}` });

    faqs = [
      {
        question: `How do I prepare for an interview at ${companyName}?`,
        answer: `Focus on technical fundamentals, system design principles, and situational behavioral questions structured around the STAR method.`,
      },
      {
        question: `Does ${companyName} support remote work?`,
        answer: `Many teams support hybrid or fully remote arrangements. Check the specific job posting descriptions for location parameters.`,
      },
    ];
  } else if (pathType === "skills") {
    const skillName = deSlugify(cleanSlug.replace("-jobs", ""));

    filteredJobs = jobs.filter((job) =>
      job.tags.some(t => t.toLowerCase() === skillName.toLowerCase()) ||
      job.requiredSkills.some(s => s.toLowerCase() === skillName.toLowerCase())
    );

    h1 = `${skillName} Developer Jobs`;
    pageTitle = `Active ${skillName} Developer Jobs & Sourcing Guide | WorkoraJobs`;
    description = `Find jobs requiring ${skillName} expertise. Apply to active roles, check median salaries, and grow your technical career.`;

    contentMarkdown = `Expand your engineering career by applying for roles demanding high proficiency in ${skillName}. As software systems become more complex, companies value developers who can leverage ${skillName} to solve scaling challenges.

### Core competencies required:
- Writing clean, maintainable, and type-safe codebase architectures.
- Writing unit tests and integration tests to ensure system stability.
- Integrating databases, third-party APIs, and caching layers.`;

    salaryInsights = { median: "$125,000", low: "$95,000", high: "$175,000", currency: "USD" };
    requiredSkills = [skillName, "Git", "REST APIs", "SQL", "Docker"];
    similarJobs = [
      { label: `Senior ${skillName} Jobs`, href: `/skills/${cleanSlug}` },
      { label: `Full Stack Developer Roles`, href: "/jobs/full-stack-engineer-jobs" },
    ];
    relatedSearches = [
      { label: `Remote ${skillName} contracts`, href: "/remote-jobs" },
      { label: `Junior ${skillName} opportunities`, href: "/freshers-jobs" },
    ];

    breadcrumbs.push({ label: `${skillName} Jobs`, href: `/skills/${cleanSlug}` });

    faqs = [
      {
        question: `What types of companies hire for ${skillName} skills?`,
        answer: `From early-stage venture startups to large scale cloud enterprises, ${skillName} is widely used across all tech sectors.`,
      },
    ];
  } else if (pathType === "remote") {
    filteredJobs = jobs.filter((job) => job.workMode === "Remote" || job.type === "Remote");

    h1 = "Remote Sourcing & Career Jobs";
    pageTitle = "Remote Jobs in India | Work From Home Careers | WorkoraJobs";
    description = "Find active, fully remote career opportunities. Work from home or anywhere, check salary benchmarks, and apply online today.";

    contentMarkdown = `Remote work is redefining how talent connects with global organizations. Working remotely offers unmatched flexibility, saves commute times, and opens up global job markets.

### Success factors in Remote Roles:
- Exceptional written and asynchronous communication skills.
- High degree of self-discipline, time management, and accountability.
- High-speed internet connection and structured home-office parameters.`;

    salaryInsights = { median: "$110,000", low: "$80,000", high: "$150,000", currency: "USD" };
    requiredSkills = ["Asynchronous Communication", "Self-Motivation", "Git", "Slack/Zoom", "Agile"];
    similarJobs = [
      { label: "Remote React Developer Roles", href: "/skills/react-jobs" },
      { label: "Remote Design Positions", href: "/jobs/product-designer-jobs" },
    ];
    relatedSearches = [
      { label: "Work from home software developer", href: "/remote-jobs" },
      { label: "Global remote companies hiring", href: "/companies" },
    ];

    breadcrumbs.push({ label: "Remote Jobs", href: "/remote-jobs" });

    faqs = [
      {
        question: "Does remote work pay the same as on-site work?",
        answer: "Yes, many forward-thinking tech employers pay location-agnostic or standardized salaries based on competitive markets.",
      },
    ];
  } else if (pathType === "freshers") {
    filteredJobs = jobs.filter((job) =>
      job.type === "Internship" ||
      job.experience.toLowerCase().includes("student") ||
      job.experience.toLowerCase().includes("grad") ||
      job.experience.toLowerCase().includes("0-2")
    );

    h1 = "Freshers & Early Career Jobs";
    pageTitle = "Freshers Jobs | Entry-Level Roles & Internships | WorkoraJobs";
    description = "Find entry-level developer jobs, student internships, and early career roles. Start your professional path with Workora Jobs.";

    contentMarkdown = `Kickstart your professional career with entry-level opportunities and student internships. Early career programs are the best way to gain real-world project context.

### Tips for Freshers to get hired:
- Build a strong personal portfolio website showing off functional products.
- Contribute to open source repositories and participate in local hackathons.
- Write clean, well-documented code with solid git histories.`;

    salaryInsights = { median: "$65,000", low: "$45,000", high: "$85,000", currency: "USD" };
    requiredSkills = ["Problem Solving", "Basic Programming", "Git", "Teamwork", "Eagerness to Learn"];
    similarJobs = [
      { label: "Frontend Internships", href: "/jobs" },
      { label: "Junior Software Engineering Positions", href: "/jobs/software-engineer-jobs" },
    ];
    relatedSearches = [
      { label: "Summer 2026 tech internships", href: "/jobs" },
      { label: "Entry-level developer roles near me", href: "/freshers-jobs" },
    ];

    breadcrumbs.push({ label: "Freshers Jobs", href: "/freshers-jobs" });

    faqs = [
      {
        question: "Can I apply for internships as a recent graduate?",
        answer: "Yes, many employers offer structured post-grad internships and junior entry programs.",
      },
    ];
  } else if (pathType === "internships") {
    filteredJobs = jobs.filter((job) => job.type === "Internship" || job.isFeaturedInternship);

    h1 = "Student & Early Career Internships";
    pageTitle = "Internship Jobs | Student & Graduate Roles | WorkoraJobs";
    description = "Find tech, design, marketing, and business internships. Apply to active internship roles with housing stipends and mentorship on Workora Jobs.";

    contentMarkdown = `Start your professional journey with structured internships. Internships offer student and early-career candidates the ideal environment to learn, build, and deliver impact under expert mentorship.

### Key benefits of Internships:
- Gain hands-on experience working on production-ready systems or campaigns.
- Receive direct guidance, structured reviews, and career coaching.
- Build a network of professional references and potential full-time return offers.`;

    salaryInsights = { median: "$45/hr", low: "$35/hr", high: "$65/hr", currency: "USD" };
    requiredSkills = ["Problem Solving", "Collaborative Work", "Git", "Eagerness to Learn", "Core Fundamentals"];
    similarJobs = [
      { label: "Freshers Developer Roles", href: "/freshers-jobs" },
      { label: "Remote Frontend Internships", href: "/remote-jobs" },
    ];
    relatedSearches = [
      { label: "Summer 2026 internships", href: "/jobs" },
      { label: "Paid software engineering intern roles", href: "/jobs" },
    ];

    breadcrumbs.push({ label: "Internships", href: "/internship-jobs" });

    faqs = [
      {
        question: "Do internships on Workora Jobs offer return offers?",
        answer: "Many enterprise partners use internships as a primary pipeline for their junior full-time engineering and design roles.",
      },
    ];
  }

  // Prevent duplicate index if there are no active jobs
  if (filteredJobs.length === 0) {
    noindex = true;
  }

  const canonicalUrl = `https://workorajobs.com/${pathType === "internships" ? "internship-jobs" : `${pathType}/${slug}`}`;

  return {
    title: pageTitle,
    h1,
    description,
    contentMarkdown,
    jobs: filteredJobs,
    salaryInsights,
    requiredSkills,
    similarJobs,
    relatedSearches,
    breadcrumbs,
    faqs,
    canonicalUrl,
    noindex,
  };
}
