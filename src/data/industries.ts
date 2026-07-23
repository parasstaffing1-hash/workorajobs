export type IndustrySector = {
  id: string;
  slug: string;
  name: string;
  category: string;
  iconName: string;
  tagline: string;
  shortDescription: string;
  overview: string;
  keySkills: string[];
  topCompanies: string[];
  openJobsCount: number;
  averageSalaryRange: string;
  growthRate: string;
  hiringHotspots: string[];
  faqs: { question: string; answer: string }[];
};

export function slugifyIndustry(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export const industriesData: IndustrySector[] = [
  {
    id: "ind-it",
    slug: "information-technology",
    name: "Information Technology",
    category: "Technology & Software",
    iconName: "Code2",
    tagline: "Building scalable cloud systems, AI LLMs, and enterprise software.",
    shortDescription: "Software engineering, cloud infrastructure, AI platforms, and enterprise digital transformations.",
    overview: "The Information Technology sector drives global enterprise innovation through cloud computing, artificial intelligence, cybersecurity, and full-stack software development. Companies in this sector offer competitive compensation, remote flexibility, and high-impact engineering careers.",
    keySkills: ["Python", "Java", "TypeScript", "React", "AWS", "Azure", "CUDA", "C++", "Kubernetes", "Docker"],
    topCompanies: ["Apple Inc.", "Microsoft Corporation", "NVIDIA Corporation", "Alphabet Inc.", "Meta Platforms Inc.", "Oracle", "Salesforce", "Adobe", "IBM"],
    openJobsCount: 1420,
    averageSalaryRange: "$120,000 - $220,000 / yr (₹14 - ₹35 LPA)",
    growthRate: "+18.4% YoY",
    hiringHotspots: ["Cupertino, CA", "Redmond, WA", "Santa Clara, CA", "Bengaluru, India", "Hyderabad, India", "London, UK"],
    faqs: [
      {
        question: "What are the most in-demand roles in Information Technology?",
        answer: "Cloud Architects, AI/ML Engineers, Senior Full-Stack Developers, DevOps Engineers, and Cybersecurity Specialists are in highest demand."
      },
      {
        question: "Does the IT sector support remote and hybrid work?",
        answer: "Yes, over 75% of Information Technology roles offer flexible hybrid or 100% remote work arrangements."
      }
    ]
  },
  {
    id: "ind-banking",
    slug: "banking-finance",
    name: "Banking & Financial Services",
    category: "Finance & Fintech",
    iconName: "CircleDollarSign",
    tagline: "Powering digital payments, UPI infrastructure, and wealth management.",
    shortDescription: "Retail banking, digital payments, wealth management, fintech UPI gateways, and investment banking.",
    overview: "Banking and Financial Services represent the bedrock of global capital allocation and payment technologies. High-scale microservices, real-time fraud detection, and mobile UPI payment systems drive rapid fintech innovation.",
    keySkills: ["Java", "Spring Boot", "Oracle", "Python", "Kafka", "Fintech API Security", "SQL", "Microservices"],
    topCompanies: ["JPMorgan Chase & Co.", "Bank of America", "Goldman Sachs", "Morgan Stanley", "Visa Inc.", "Mastercard Incorporated", "Citigroup", "American Express"],
    openJobsCount: 890,
    averageSalaryRange: "$110,000 - $210,000 / yr (₹15 - ₹32 LPA)",
    growthRate: "+14.2% YoY",
    hiringHotspots: ["New York, NY", "San Francisco, CA", "London, UK", "Mumbai, India", "Bengaluru, India"],
    faqs: [
      {
        question: "What technology stack is used in modern banking software?",
        answer: "Enterprise banking systems rely heavily on Java Spring Boot microservices, Kafka event streaming, Oracle/PostgreSQL databases, and high-security OAuth2 gateways."
      }
    ]
  },
  {
    id: "ind-healthcare",
    slug: "healthcare-pharmaceuticals",
    name: "Healthcare & Pharmaceuticals",
    category: "Life Sciences & Biotech",
    iconName: "HeartPulse",
    tagline: "Pioneering life-saving biotech research, clinical trials, and specialty medicines.",
    shortDescription: "Biotechnology research, clinical trial analytics, specialty generics, and digital health devices.",
    overview: "Healthcare and Pharmaceuticals combine medical discovery with digital telemetry, bioinformatics data science, and global manufacturing. The industry focuses on long-term wellness, oncology, and metabolic disease research.",
    keySkills: ["Bioinformatics", "Python", "R", "SAP", "Clinical Data Analytics", "AWS", "SQL", "MedTech"],
    topCompanies: ["Pfizer", "Johnson & Johnson", "Roche", "Novartis", "AstraZeneca", "Merck", "Moderna", "Abbott", "Medtronic", "Siemens Healthineers"],
    openJobsCount: 750,
    averageSalaryRange: "$105,000 - $195,000 / yr (₹12 - ₹28 LPA)",
    growthRate: "+12.8% YoY",
    hiringHotspots: ["New York, NY", "New Brunswick, NJ", "Basel, Switzerland", "London, UK", "Hyderabad, India"],
    faqs: [
      {
        question: "How is technology transforming healthcare careers?",
        answer: "AI drug discovery models, genomic sequencing data analytics, and cloud EHR health systems are rapidly expanding tech roles in pharmaceuticals."
      }
    ]
  },
  {
    id: "ind-fmcg",
    slug: "fmcg-consumer-goods",
    name: "FMCG & Consumer Goods",
    category: "Retail & Consumer",
    iconName: "Building2",
    tagline: "Connecting global supply chains and consumer brand innovation.",
    shortDescription: "Retail supply chains, consumer packaged goods, lifestyle brands, and e-commerce distribution networks.",
    overview: "Fast-Moving Consumer Goods (FMCG) and retail giants manage hyper-scaled global supply chains, e-commerce platforms, and direct-to-consumer digital channels.",
    keySkills: ["SAP HANA", "Python", "PowerBI", "React", "Node.js", "Azure", "Supply Chain Analytics"],
    topCompanies: ["Coca-Cola", "PepsiCo", "Nestlé", "Unilever", "Procter & Gamble", "Mondelez International", "Nike", "Adidas", "Puma", "Zara", "H&M"],
    openJobsCount: 620,
    averageSalaryRange: "$95,000 - $175,000 / yr (₹10 - ₹25 LPA)",
    growthRate: "+10.5% YoY",
    hiringHotspots: ["Atlanta, GA", "Cincinnati, OH", "Vevey, Switzerland", "London, UK", "Mumbai, India"],
    faqs: [
      {
        question: "What key technical skillsets are needed in FMCG enterprises?",
        answer: "SAP ERP systems, predictive supply chain analytics with Python/PowerBI, and scalable e-commerce frontend engineering."
      }
    ]
  },
  {
    id: "ind-automotive",
    slug: "automotive-clean-energy",
    name: "Automotive & Mobility",
    category: "Mobility & EV Tech",
    iconName: "HardHat",
    tagline: "Accelerating electric vehicles, autonomous AI, and sustainable energy.",
    shortDescription: "Electric vehicles, autonomous driving AI, battery energy storage, and commercial mobility.",
    overview: "Automotive engineering is undergoing an electric revolution, combining embedded microcontrollers, autonomous vision neural networks, and battery management platforms.",
    keySkills: ["C++", "Python", "AUTOSAR", "Embedded Linux", "PyTorch", "MATLAB", "CUDA"],
    topCompanies: ["Tesla", "Toyota", "Volkswagen", "BMW", "Mercedes-Benz", "Ford", "General Motors", "Honda", "Hyundai", "Volvo", "Porsche", "Ferrari", "BYD"],
    openJobsCount: 810,
    averageSalaryRange: "$115,000 - $225,000 / yr (₹14 - ₹30 LPA)",
    growthRate: "+22.1% YoY",
    hiringHotspots: ["Austin, TX", "Stuttgart, Germany", "Munich, Germany", "Tokyo, Japan", "Detroit, MI"],
    faqs: [
      {
        question: "What software languages power electric vehicle development?",
        answer: "C++ and Embedded C drive low-level ECU firmware, while Python and PyTorch power autonomous neural networks."
      }
    ]
  },
  {
    id: "ind-telecom",
    slug: "telecommunications",
    name: "Telecommunications & Media",
    category: "Connectivity & Media",
    iconName: "Network",
    tagline: "Scaling 5G network slicing, optical fiber, and streaming media.",
    shortDescription: "5G network slicing, mobile broadband, optical fiber infrastructure, and streaming media distribution.",
    overview: "Telecommunications companies operate high-throughput broadband backbones, standalone 5G core networks, and media streaming platforms reaching hundreds of millions of concurrent users.",
    keySkills: ["5G Stack", "Java", "Go", "Python", "Kafka", "AWS", "gRPC", "React"],
    topCompanies: ["Cisco", "Cloudflare", "Netflix", "Spotify", "Zoom"],
    openJobsCount: 510,
    averageSalaryRange: "$110,000 - $200,000 / yr (₹12 - ₹28 LPA)",
    growthRate: "+15.0% YoY",
    hiringHotspots: ["San Jose, CA", "San Francisco, CA", "Los Gatos, CA", "Stockholm, Sweden", "London, UK"],
    faqs: [
      {
        question: "What technologies drive 5G telecom innovation?",
        answer: "Cloud-native Kubernetes microservices, OpenRAN architectures, low-latency gRPC APIs, and automated network slicing."
      }
    ]
  },
  {
    id: "ind-semiconductors",
    slug: "semiconductors-hardware",
    name: "Semiconductors & Hardware",
    category: "Hardware & Chips",
    iconName: "Cpu",
    tagline: "Designing next-gen silicon chips, GPU accelerators, and microprocessors.",
    shortDescription: "Microchip architecture, GPU silicon design, semiconductor fabrication, and high-performance hardware computing.",
    overview: "The Semiconductors & Hardware industry forms the physical foundation of modern computing, powering AI datacenters, smartphones, and autonomous vehicles with ultra-dense microchip nodes.",
    keySkills: ["Verilog", "VHDL", "C++", "SystemVerilog", "Python", "CUDA", "ASIC Design", "FPGA"],
    topCompanies: ["NVIDIA", "Intel", "AMD", "Qualcomm", "Broadcom", "TSMC", "ASML"],
    openJobsCount: 940,
    averageSalaryRange: "$130,000 - $240,000 / yr (₹18 - ₹42 LPA)",
    growthRate: "+24.5% YoY",
    hiringHotspots: ["Santa Clara, CA", "Austin, TX", "Hsinchu, Taiwan", "Munich, Germany", "Bengaluru, India"],
    faqs: [
      {
        question: "What skills are essential for semiconductor software engineers?",
        answer: "Low-level C/C++, Verilog/SystemVerilog hardware description languages, CUDA GPU optimization, and System-on-Chip (SoC) architecture."
      }
    ]
  },
  {
    id: "ind-ecommerce",
    slug: "e-commerce-retail",
    name: "E-Commerce & Digital Commerce",
    category: "Retail & Cloud",
    iconName: "ShoppingBag",
    tagline: "Powering global storefronts, microservices, and instant delivery logistics.",
    shortDescription: "Online marketplaces, omnichannel retail, payment checkout gateways, and automated fulfillment networks.",
    overview: "E-Commerce and Digital Retail power global online transactions, processing millions of concurrent checkout requests, personalized AI recommendations, and last-mile logistics.",
    keySkills: ["React", "Next.js", "Node.js", "GraphQL", "Python", "PostgreSQL", "AWS", "Redis", "Kafka"],
    topCompanies: ["Amazon", "Walmart", "Shopify", "eBay", "Alibaba", "Costco", "Target", "IKEA", "Best Buy", "Home Depot"],
    openJobsCount: 1120,
    averageSalaryRange: "$115,000 - $210,000 / yr (₹14 - ₹32 LPA)",
    growthRate: "+16.8% YoY",
    hiringHotspots: ["Seattle, WA", "Bentonville, AR", "Ottawa, Canada", "San Francisco, CA", "Bengaluru, India"],
    faqs: [
      {
        question: "What makes E-Commerce engineering unique?",
        answer: "E-Commerce systems demand zero-downtime microservice availability, real-time inventory locking, high-concurrency database reads, and ultra-fast global CDN performance."
      }
    ]
  },
  {
    id: "ind-aerospace",
    slug: "aerospace-defense",
    name: "Aerospace & Defense",
    category: "Aviation & Space Tech",
    iconName: "Plane",
    tagline: "Engineering commercial aircraft, satellite communications, and space systems.",
    shortDescription: "Aeronautical engineering, satellite telemetry, flight control avionics, and defense defense hardware.",
    overview: "Aerospace & Defense designs commercial jetliners, space exploration vehicles, satellite constellations, and mission-critical flight safety systems adhering to rigorous aerospace compliance standards.",
    keySkills: ["C++", "Ada", "Python", "DO-178C", "MATLAB", "Embedded Linux", "RTOS", "Avionics"],
    topCompanies: ["Boeing", "Airbus", "Lockheed Martin", "Northrop Grumman", "Raytheon Technologies", "SpaceX"],
    openJobsCount: 480,
    averageSalaryRange: "$110,000 - $205,000 / yr (₹14 - ₹30 LPA)",
    growthRate: "+11.4% YoY",
    hiringHotspots: ["Chicago, IL", "Toulouse, France", "Seattle, WA", "Los Angeles, CA", "Washington, D.C."],
    faqs: [
      {
        question: "What compliance standards govern aerospace software?",
        answer: "Aerospace flight systems require strict adherence to DO-178C safety-critical software standards and Real-Time Operating Systems (RTOS)."
      }
    ]
  },
  {
    id: "ind-media",
    slug: "media-entertainment",
    name: "Media & Entertainment Tech",
    category: "Entertainment & Gaming",
    iconName: "Gamepad2",
    tagline: "Pioneering real-time 3D graphics, game engines, and streaming platforms.",
    shortDescription: "Game engine development, interactive 3D graphics, media streaming codecs, and digital content distribution.",
    overview: "Media & Entertainment combines high-throughput streaming video infrastructure with real-time 3D game physics engines, spatial audio, and creator distribution platforms.",
    keySkills: ["C++", "Unreal Engine", "Unity", "Python", "WebGL", "Rust", "HLS Streaming", "WebRTC"],
    topCompanies: ["Sony", "Netflix", "Spotify", "Disney", "Epic Games", "Electronic Arts", "Roblox"],
    openJobsCount: 560,
    averageSalaryRange: "$115,000 - $215,000 / yr (₹14 - ₹32 LPA)",
    growthRate: "+13.6% YoY",
    hiringHotspots: ["Los Angeles, CA", "Tokyo, Japan", "Los Gatos, CA", "Stockholm, Sweden", "London, UK"],
    faqs: [
      {
        question: "What technologies power modern cloud gaming and streaming?",
        answer: "Ultra-low-latency WebRTC/HLS video streaming, C++ graphics optimization with Vulkan/DirectX, and distributed CDN caching."
      }
    ]
  },
  {
    id: "ind-cybersecurity",
    slug: "cybersecurity-cloud",
    name: "Cybersecurity & Cloud Systems",
    category: "Security & Infrastructure",
    iconName: "ShieldCheck",
    tagline: "Protecting enterprise data, zero-trust networks, and cloud workloads.",
    shortDescription: "Zero-trust network architecture, SIEM threat detection, cloud posture management, and penetration testing.",
    overview: "Cybersecurity & Cloud Systems safeguard enterprise assets against sophisticated threat vectors, implementing zero-trust security perimeter controls, automated threat intelligence, and cloud posture governance.",
    keySkills: ["Python", "Go", "Rust", "Kubernetes", "AWS Security", "Terraform", "Wireshark", "SIEM", "OAuth2"],
    topCompanies: ["Cloudflare", "Palo Alto Networks", "CrowdStrike", "Zscaler", "Fortinet", "Okta"],
    openJobsCount: 780,
    averageSalaryRange: "$125,000 - $230,000 / yr (₹16 - ₹38 LPA)",
    growthRate: "+21.2% YoY",
    hiringHotspots: ["San Francisco, CA", "Austin, TX", "Tel Aviv, Israel", "London, UK", "Bengaluru, India"],
    faqs: [
      {
        question: "Why is cybersecurity one of the fastest growing tech careers?",
        answer: "Accelerated cloud migration and escalating threat complexity drive continuous enterprise investment in zero-trust architectures and automated SIEM threat response."
      }
    ]
  },
  {
    id: "ind-cleanenergy",
    slug: "clean-energy-utilities",
    name: "Clean Energy & Utilities",
    category: "Sustainability & Grid",
    iconName: "Zap",
    tagline: "Building smart electric grids, solar power, and renewable storage.",
    shortDescription: "Smart grid IoT telemetry, solar & wind energy platforms, battery storage analytics, and utility automation.",
    overview: "Clean Energy & Utilities drive the global transition toward sustainable power through smart grid telemetry, battery storage software management, and utility-scale renewable integration.",
    keySkills: ["Python", "C++", "SCADA", "IoT Telemetry", "AWS", "SQL", "Data Science", "Rust"],
    topCompanies: ["Tesla", "NextEra Energy", "Siemens", "Schneider Electric", "General Electric", "Enphase Energy"],
    openJobsCount: 420,
    averageSalaryRange: "$105,000 - $190,000 / yr (₹12 - ₹26 LPA)",
    growthRate: "+19.5% YoY",
    hiringHotspots: ["Austin, TX", "Juno Beach, FL", "Erlangen, Germany", "Paris, France", "Bengaluru, India"],
    faqs: [
      {
        question: "What software skills are needed in clean energy tech?",
        answer: "IoT sensor telemetry ingestion, SCADA utility protocols, Python data modeling for renewable yield prediction, and cloud data pipelines."
      }
    ]
  }
];

export function findIndustryBySlug(slug: string): IndustrySector | undefined {
  const clean = slug.toLowerCase().trim();
  return industriesData.find(
    (ind) => ind.slug === clean || ind.id === clean || slugifyIndustry(ind.name) === clean
  );
}
