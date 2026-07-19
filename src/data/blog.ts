export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  image: string;
  content: string[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: "building-a-global-hiring-operating-model",
    title: "Building a global hiring operating model",
    excerpt:
      "How to align role planning, talent intelligence and candidate experience before scaling across borders.",
    category: "Hiring Strategy",
    date: "2026-06-12",
    readTime: "6 min read",
    image:
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=80",
    content: [
      "Global hiring works best when companies define the operating model before adding roles to the plan. That means knowing who owns each decision, which regions are in scope and how tradeoffs will be evaluated.",
      "A useful model starts with role outcomes, compensation bands, availability signals and an interview loop that can be applied consistently across markets.",
      "The teams that move fastest are usually the ones that make quality visible. They agree on what strong evidence looks like and keep candidates informed through every stage.",
    ],
  },
  {
    slug: "candidate-experience-as-a-growth-advantage",
    title: "Candidate experience as a growth advantage",
    excerpt:
      "Respectful communication, clear timelines and structured interviews can become a measurable hiring advantage.",
    category: "Candidate Experience",
    date: "2026-05-28",
    readTime: "5 min read",
    image:
      "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1200&q=80",
    content: [
      "Candidate experience is not a soft metric. It affects acceptance rates, referral quality and the reputation of every team involved in hiring.",
      "The strongest experiences are simple: candidates understand the role, know what will happen next and receive thoughtful closure when the process ends.",
      "Enterprise hiring teams should measure responsiveness, interview preparedness and decision clarity alongside traditional funnel metrics.",
    ],
  },
  {
    slug: "what-ai-should-and-should-not-do-in-recruiting",
    title: "What AI should and should not do in recruiting",
    excerpt:
      "A practical view of where AI can support hiring teams while keeping humans accountable for judgment.",
    category: "AI Recruiting",
    date: "2026-05-03",
    readTime: "7 min read",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
    content: [
      "AI can make recruiting workflows faster and more consistent, but it should not replace accountability. Human teams remain responsible for criteria, context and decisions.",
      "Useful AI assistance often appears in drafting, summarization, scheduling, market research and workflow nudges. High-stakes evaluation requires stronger governance.",
      "A responsible recruiting system keeps candidates informed, makes criteria explicit and gives teams a way to audit how recommendations were produced.",
    ],
  },
];
