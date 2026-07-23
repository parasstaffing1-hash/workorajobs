export type Job = {
  id: string;
  title: string;
  company: string;
  location: string;
  type: "Full-time" | "Contract" | "Remote" | "Internship";
  workMode: "Remote" | "Hybrid" | "On-site";
  department: string;
  salary: string;
  posted: string;
  datePostedIso?: string;
  validThroughIso?: string;
  isClosed?: boolean;
  tags: string[];
  requiredSkills: string[];
  preferredSkills: string[];
  experience: string;
  education: string;
  description: string;
  responsibilities: string[];
  keywords: string[];
  isFeaturedInternship?: boolean;
};

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getJobSlug(job: { id: string; title: string; company: string }): string {
  const titleSlug = slugify(job.title);
  const companySlug = slugify(job.company);
  const idClean = slugify(job.id);
  return `${titleSlug}-${companySlug}-${idClean}`;
}

export function findJobBySlug(slug: string): Job | undefined {
  const clean = slug.toLowerCase().trim();
  const directMatch = jobs.find((j) => getJobSlug(j) === clean);
  if (directMatch) return directMatch;

  const parts = clean.split("-");
  const lastPart = parts[parts.length - 1];
  
  return jobs.find((j) => {
    const jId = j.id.toLowerCase();
    return jId === lastPart || jId.endsWith(lastPart);
  });
}

export const jobs: Job[] = [
  {
    "id": "job-apple-01",
    "title": "Senior iOS & Swift Platform Engineer",
    "company": "Apple Inc.",
    "location": "Cupertino, CA / Remote",
    "type": "Full-time",
    "workMode": "Hybrid",
    "department": "Engineering",
    "salary": "$185,000 - $240,000 / yr",
    "posted": "1 day ago",
    "datePostedIso": "2026-07-22",
    "validThroughIso": "2026-12-31",
    "tags": [
      "Swift",
      "iOS",
      "CoreML",
      "Metal",
      "Xcode"
    ],
    "requiredSkills": [
      "Swift",
      "Objective-C",
      "iOS SDK",
      "Memory Management"
    ],
    "preferredSkills": [
      "Metal API",
      "CoreML",
      "SwiftUI",
      "System Design"
    ],
    "experience": "5+ Years",
    "education": "Bachelor's or Master's in Computer Science",
    "description": "Apple is seeking a Senior iOS Platform Engineer to join the Core Systems team in Cupertino. You will design ultra-low-latency frameworks, optimize Swift runtimes, and build features reaching over 1.5 billion active devices.",
    "responsibilities": [
      "Architect and optimize high-performance iOS frameworks using Swift and C++.",
      "Collaborate with UI/UX design teams to implement fluid micro-animations and responsive components.",
      "Analyze energy consumption, memory allocations, and latency spikes across iOS releases."
    ],
    "keywords": [
      "Apple",
      "iOS Engineer",
      "Swift Developer",
      "Cupertino Jobs"
    ]
  },
  {
    "id": "job-apple-02",
    "title": "Metal Graphics & CoreML Systems Architect",
    "company": "Apple Inc.",
    "location": "Cupertino, CA",
    "type": "Full-time",
    "workMode": "On-site",
    "department": "Engineering",
    "salary": "$210,000 - $285,000 / yr",
    "posted": "3 days ago",
    "datePostedIso": "2026-07-20",
    "validThroughIso": "2026-12-31",
    "tags": [
      "Metal API",
      "CoreML",
      "C++",
      "GPU Acceleration",
      "Machine Learning"
    ],
    "requiredSkills": [
      "C++",
      "Metal API",
      "GPU Programming",
      "Linear Algebra"
    ],
    "preferredSkills": [
      "PyTorch",
      "Compiler Design",
      "SIMD",
      "macOS"
    ],
    "experience": "7+ Years",
    "education": "Master's or Ph.D. in Computer Science or Electrical Engineering",
    "description": "Join the Apple Silicon and Metal Graphics team to build GPU acceleration layers powering Vision Pro, macOS, and iOS machine learning models.",
    "responsibilities": [
      "Develop C++ and Metal compute kernels for next-generation Apple Silicon GPUs.",
      "Optimize neural network inference speed for CoreML workloads.",
      "Work directly with hardware design teams to influence future GPU architectures."
    ],
    "keywords": [
      "Apple Metal",
      "GPU Engineer",
      "CoreML",
      "Apple Silicon"
    ]
  },
  {
    "id": "job-msft-01",
    "title": "Principal Azure Cloud Architect",
    "company": "Microsoft Corporation",
    "location": "Redmond, WA / Remote",
    "type": "Full-time",
    "workMode": "Remote",
    "department": "Engineering",
    "salary": "$190,000 - $255,000 / yr",
    "posted": "2 days ago",
    "datePostedIso": "2026-07-21",
    "validThroughIso": "2026-12-31",
    "tags": [
      "Azure",
      "C#",
      ".NET",
      "Kubernetes",
      "Microservices"
    ],
    "requiredSkills": [
      "Azure Infrastructure",
      "C#",
      ".NET Core",
      "System Design"
    ],
    "preferredSkills": [
      "Terraform",
      "Docker",
      "CosmosDB",
      "Event Grid"
    ],
    "experience": "8+ Years",
    "education": "B.S. in Computer Science",
    "description": "Microsoft is hiring a Principal Azure Cloud Architect to design multi-region enterprise cloud infrastructure serving Fortune 500 customers.",
    "responsibilities": [
      "Architect resilient, fault-tolerant Azure cloud deployments with 99.999% availability.",
      "Guide enterprise engineering teams on C# microservices migration and zero-trust security.",
      "Drive telemetry, latency reduction, and cloud infrastructure cost optimization."
    ],
    "keywords": [
      "Microsoft Azure",
      "Cloud Architect",
      "C# Developer",
      "Redmond Jobs"
    ]
  },
  {
    "id": "job-msft-02",
    "title": "Copilot Generative AI Software Engineer",
    "company": "Microsoft Corporation",
    "location": "Redmond, WA",
    "type": "Full-time",
    "workMode": "Hybrid",
    "department": "Engineering",
    "salary": "$175,000 - $235,000 / yr",
    "posted": "1 day ago",
    "datePostedIso": "2026-07-22",
    "validThroughIso": "2026-12-31",
    "tags": [
      "AI",
      "Python",
      "PyTorch",
      "TypeScript",
      "LLM"
    ],
    "requiredSkills": [
      "Python",
      "PyTorch",
      "TypeScript",
      "REST APIs"
    ],
    "preferredSkills": [
      "LangChain",
      "Vector Databases",
      "Azure OpenAI",
      "Semantic Kernel"
    ],
    "experience": "4+ Years",
    "education": "B.S. or M.S. in Computer Science",
    "description": "Join the Microsoft Copilot team to build generative AI features integrated into Microsoft 365, Windows, and Azure services.",
    "responsibilities": [
      "Implement high-throughput RAG (Retrieval-Augmented Generation) pipelines for Copilot.",
      "Optimize LLM prompt engineering, vector embeddings, and contextual search retrieval.",
      "Partner with Microsoft Research to deploy state-of-the-art AI models."
    ],
    "keywords": [
      "Microsoft AI",
      "Copilot Engineer",
      "PyTorch",
      "GenAI Jobs"
    ]
  },
  {
    "id": "job-nvda-01",
    "title": "Senior CUDA & Deep Learning Architect",
    "company": "NVIDIA Corporation",
    "location": "Santa Clara, CA / Remote",
    "type": "Full-time",
    "workMode": "Hybrid",
    "department": "Engineering",
    "salary": "$215,000 - $290,000 / yr",
    "posted": "2 days ago",
    "datePostedIso": "2026-07-21",
    "validThroughIso": "2026-12-31",
    "tags": [
      "CUDA",
      "C++",
      "PyTorch",
      "TensorRT",
      "GPU Compute"
    ],
    "requiredSkills": [
      "CUDA C++",
      "Parallel Programming",
      "GPU Acceleration",
      "Linux"
    ],
    "preferredSkills": [
      "TensorRT",
      "Triton Inference Server",
      "NCCL",
      "Deep Learning"
    ],
    "experience": "6+ Years",
    "education": "M.S. or Ph.D. in Computer Science or Electrical Engineering",
    "description": "NVIDIA is looking for a Senior CUDA Architect to design deep learning acceleration software for Blackwell H100/B200 supercomputers.",
    "responsibilities": [
      "Develop ultra-fast CUDA kernels for transformer models and LLM training.",
      "Optimize multi-GPU distributed communication using NCCL and InfiniBand.",
      "Benchmark and tune TensorRT inference performance."
    ],
    "keywords": [
      "NVIDIA CUDA",
      "Deep Learning Architect",
      "GPU Acceleration",
      "Santa Clara Jobs"
    ]
  },
  {
    "id": "job-ril-01",
    "title": "Lead 5G Network & Cloud Infrastructure Engineer",
    "company": "Reliance Industries",
    "location": "Mumbai, Maharashtra",
    "type": "Full-time",
    "workMode": "Hybrid",
    "department": "Engineering",
    "salary": "\u20b926,00,000 - \u20b938,00,000 / yr",
    "posted": "1 day ago",
    "datePostedIso": "2026-07-22",
    "validThroughIso": "2026-12-31",
    "tags": [
      "5G Stack",
      "Python",
      "Kubernetes",
      "Kafka",
      "AWS"
    ],
    "requiredSkills": [
      "5G Core Network",
      "Kubernetes",
      "Python",
      "Linux Architecture"
    ],
    "preferredSkills": [
      "OpenRAN",
      "Microservices",
      "Docker",
      "Telecommunications"
    ],
    "experience": "5+ Years",
    "education": "B.Tech/B.E. in Electronics & Communication or Computer Science",
    "description": "Jio Reliance Industries is hiring a Lead 5G Network Engineer to scale India's largest standalone 5G digital cloud infrastructure.",
    "responsibilities": [
      "Deploy and scale Jio 5G core network microservices on cloud-native Kubernetes.",
      "Monitor packet throughput, latency metrics, and automated network slicing.",
      "Lead cross-functional engineering teams across Mumbai and Bengaluru hubs."
    ],
    "keywords": [
      "Reliance Jio",
      "5G Engineer",
      "Jio Jobs",
      "Mumbai Tech Jobs"
    ]
  },
  {
    "id": "job-tcs-01",
    "title": "Enterprise Cloud & Microservices Architect",
    "company": "Tata Consultancy Services",
    "location": "Mumbai / Bengaluru",
    "type": "Full-time",
    "workMode": "Hybrid",
    "department": "Engineering",
    "salary": "\u20b918,00,000 - \u20b928,00,000 / yr",
    "posted": "2 days ago",
    "datePostedIso": "2026-07-21",
    "validThroughIso": "2026-12-31",
    "tags": [
      "Java",
      "Spring Boot",
      "AWS",
      "Azure",
      "Microservices"
    ],
    "requiredSkills": [
      "Java 17+",
      "Spring Boot",
      "AWS/Azure",
      "RESTful APIs"
    ],
    "preferredSkills": [
      "Kafka",
      "PostgreSQL",
      "Docker",
      "DevOps"
    ],
    "experience": "6+ Years",
    "education": "B.Tech/B.E. or MCA",
    "description": "TCS is seeking an Enterprise Cloud Architect to lead digital modernization programs for international financial and banking clients.",
    "responsibilities": [
      "Design cloud-native microservices architectures using Java Spring Boot and AWS.",
      "Implement CI/CD pipelines, container security, and high availability database clusters.",
      "Mentor software development engineering teams across project delivery modules."
    ],
    "keywords": [
      "TCS Jobs",
      "Java Architect",
      "Spring Boot Developer",
      "Bengaluru Jobs"
    ]
  },
  {
    "id": "job-hdfc-01",
    "title": "Lead Fintech Microservices & Security Developer",
    "company": "HDFC Bank",
    "location": "Mumbai, Maharashtra",
    "type": "Full-time",
    "workMode": "On-site",
    "department": "Engineering",
    "salary": "\u20b920,00,000 - \u20b932,00,000 / yr",
    "posted": "3 days ago",
    "datePostedIso": "2026-07-20",
    "validThroughIso": "2026-12-31",
    "tags": [
      "Fintech",
      "Java",
      "Spring Boot",
      "Oracle",
      "API Security"
    ],
    "requiredSkills": [
      "Java",
      "Spring Security",
      "Oracle DB",
      "Payment Systems"
    ],
    "preferredSkills": [
      "UPI Stack",
      "Redis",
      "Kafka",
      "Docker"
    ],
    "experience": "5+ Years",
    "education": "B.Tech/B.E. in Computer Science or IT",
    "description": "HDFC Bank is hiring a Lead Fintech Developer to design core mobile banking, UPI payment gateways, and fraud detection engines.",
    "responsibilities": [
      "Develop ultra-secure transaction endpoints handling millions of daily banking requests.",
      "Ensure compliance with RBI banking regulations and ISO payment standards.",
      "Optimize database queries and in-memory Redis caching for mobile app banking."
    ],
    "keywords": [
      "HDFC Bank",
      "Fintech Developer",
      "Java Banking Jobs",
      "Mumbai Banking"
    ]
  },
  {
    "id": "job-infy-01",
    "title": "Senior Python & AI Cloud Platform Developer",
    "company": "Infosys",
    "location": "Bengaluru, Karnataka / Hybrid",
    "type": "Full-time",
    "workMode": "Hybrid",
    "department": "Engineering",
    "salary": "\u20b916,00,000 - \u20b926,00,000 / yr",
    "posted": "1 day ago",
    "datePostedIso": "2026-07-22",
    "validThroughIso": "2026-12-31",
    "tags": [
      "Python",
      "AI",
      "AWS",
      "FastAPI",
      "PostgreSQL"
    ],
    "requiredSkills": [
      "Python",
      "FastAPI/Django",
      "AWS",
      "SQL"
    ],
    "preferredSkills": [
      "Docker",
      "Kubernetes",
      "PyTorch",
      "React"
    ],
    "experience": "4+ Years",
    "education": "B.Tech / B.E. / M.Sc Computer Science",
    "description": "Infosys is seeking a Senior Python & AI Developer to join the Infosys Topaz AI platform engineering group in Bengaluru.",
    "responsibilities": [
      "Build scalable Python microservices integrated with enterprise LLMs and generative AI APIs.",
      "Optimize database access layers and async API response times.",
      "Collaborate with global clients on enterprise digital transformation projects."
    ],
    "keywords": [
      "Infosys Jobs",
      "Python Developer",
      "AI Engineer",
      "Bengaluru Tech Jobs"
    ]
  }
];

export const featuredInternships: Job[] = [];

export const jobDepartments = [
  "All",
  "Engineering",
  "Design",
  "Data",
  "Operations",
  "Customer",
  "People",
];
