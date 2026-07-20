import { makeLinkedInCompliant } from '../engines/BooleanEngine';

export interface DetailedTemplate {
  id: string;
  name: string;
  description: string;
  targetPlatform: string;
  booleanQuery: string;
  queries: {
    linkedin: string;
    googleXray: string;
    raw: string;
  };
  supportedOperators: string[];
  skills: string[];
  synonyms: string[];
  jobTitles: string[];
  locations: string[];
  companies: string[];
  exclusions: string[];
  recommendedUsage: string;
  estimatedResults: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  category: 'Engineering' | 'Operations' | 'Healthcare' | 'Business';
  seniority: 'Junior' | 'Mid' | 'Senior' | 'Lead' | 'Architect' | 'Principal';
  technology: string[];
  industry: string[];
  popularity: number;
  lastUpdated: string;
  usedCount: number;
  isNew: boolean;
  isArchived?: boolean;
}

// 128 base roles from the prompt instructions
export const BASE_ROLES = [
  // SOFTWARE DEVELOPMENT
  { name: 'Java Developer', category: 'Software Development', skills: ['Java', 'Spring Boot', 'Hibernate', 'Microservices', 'REST API'], synonyms: ['Java Developer', 'Java Software Engineer', 'Java Backend Developer'], tech: ['Java 17', 'Docker', 'AWS', 'PostgreSQL'], ind: ['Technology', 'Finance', 'E-commerce'] },
  { name: 'Spring Boot', category: 'Backend', skills: ['Spring Boot', 'Spring Cloud', 'Spring Security', 'JPA', 'Microservices'], synonyms: ['Spring Boot Developer', 'Spring Framework Engineer', 'Java Spring Developer'], tech: ['Java', 'Maven', 'Redis', 'Docker'], ind: ['Technology', 'Banking'] },
  { name: 'J2EE', category: 'Backend', skills: ['J2EE', 'EJB', 'JSP', 'Servlets', 'WebLogic', 'WAS'], synonyms: ['J2EE Developer', 'Java Enterprise Developer', 'Java EE Programmer'], tech: ['Oracle', 'WebSphere', 'Struts', 'JMS'], ind: ['Enterprise', 'Insurance'] },
  { name: 'Python', category: 'Backend', skills: ['Python', 'Data Structures', 'RESTful APIs', 'Algorithms', 'SQL'], synonyms: ['Python Developer', 'Python Programmer', 'Python Software Engineer'], tech: ['Python 3.x', 'PostgreSQL', 'Docker', 'Celery'], ind: ['Technology', 'Automotive', 'Finance'] },
  { name: 'Django', category: 'Backend', skills: ['Django', 'Django REST Framework', 'ORM', 'Python', 'PostgreSQL'], synonyms: ['Django Developer', 'Python Django Engineer', 'Django Web Developer'], tech: ['Django DRF', 'Celery', 'Redis', 'Gunicorn'], ind: ['Technology', 'E-commerce', 'Media'] },
  { name: 'Flask', category: 'Backend', skills: ['Flask', 'Python', 'Werkzeug', 'SQLAlchemy', 'REST APIs'], synonyms: ['Flask Developer', 'Flask Backend Engineer', 'Python Flask Programmer'], tech: ['Flask-RESTful', 'Redis', 'PostgreSQL', 'Docker'], ind: ['Technology', 'Startups'] },
  { name: 'FastAPI', category: 'Backend', skills: ['FastAPI', 'Pydantic', 'Asyncio', 'Python', 'Uvicorn'], synonyms: ['FastAPI Developer', 'FastAPI Engineer', 'Python Web API Builder'], tech: ['FastAPI', 'PostgreSQL', 'Docker', 'Redis'], ind: ['Technology', 'AI Startups'] },
  { name: 'Node.js', category: 'Backend', skills: ['Node.js', 'Express', 'JavaScript', 'TypeScript', 'Asynchronous Programming'], synonyms: ['NodeJS Developer', 'Node.js Software Engineer', 'Node Backend Programmer'], tech: ['Node.js', 'Express', 'MongoDB', 'Redis'], ind: ['Technology', 'SaaS', 'Media'] },
  { name: 'Express', category: 'Backend', skills: ['Express', 'Node.js', 'REST APIs', 'Middleware', 'JavaScript'], synonyms: ['ExpressJS Developer', 'Express Backend Engineer', 'Node Express Developer'], tech: ['Express', 'Node.js', 'MongoDB', 'PostgreSQL'], ind: ['SaaS', 'E-commerce'] },
  { name: 'React', category: 'Frontend', skills: ['React', 'Redux', 'JSX', 'React Hooks', 'CSS Modules'], synonyms: ['React Developer', 'React.js Engineer', 'React Frontend Specialist'], tech: ['React', 'JavaScript', 'Tailwind CSS', 'HTML5'], ind: ['Technology', 'SaaS', 'Advertising'] },
  { name: 'Angular', category: 'Frontend', skills: ['Angular', 'TypeScript', 'RxJS', 'NgRx', 'Component Architecture'], synonyms: ['Angular Developer', 'AngularJS Engineer', 'Frontend Angular Specialist'], tech: ['Angular 15+', 'TypeScript', 'SASS', 'Karma'], ind: ['Banking', 'Insurance', 'Enterprise'] },
  { name: 'Vue', category: 'Frontend', skills: ['Vue', 'Vuex', 'Vue Router', 'Pinia', 'Composition API'], synonyms: ['Vue Developer', 'VueJS Engineer', 'Vue Frontend Developer'], tech: ['Vue 3', 'Nuxt.js', 'JavaScript', 'Tailwind CSS'], ind: ['Technology', 'E-commerce', 'Agencies'] },
  { name: 'Next.js', category: 'Frontend', skills: ['Next.js', 'React', 'SSR', 'SSG', 'Vercel'], synonyms: ['Next.js Developer', 'React Next Engineer', 'Frontend Next Developer'], tech: ['Next.js', 'TypeScript', 'Tailwind CSS', 'GraphQL'], ind: ['SaaS', 'E-commerce', 'Media'] },
  { name: 'Nuxt', category: 'Frontend', skills: ['Nuxt', 'Vue.js', 'SSR', 'Vue Router', 'Vuex'], synonyms: ['Nuxt Developer', 'Nuxt.js Engineer', 'Vue Nuxt Developer'], tech: ['Nuxt 3', 'Vue 3', 'TypeScript', 'Tailwind CSS'], ind: ['Technology', 'E-commerce'] },
  { name: 'PHP', category: 'Backend', skills: ['PHP', 'MySQL', 'OOP PHP', 'MVC Architecture', 'REST APIs'], synonyms: ['PHP Developer', 'PHP Programmer', 'PHP Software Engineer'], tech: ['PHP 8.x', 'MySQL', 'Composer', 'Docker'], ind: ['Technology', 'E-commerce', 'Hosting'] },
  { name: 'Laravel', category: 'Backend', skills: ['Laravel', 'Eloquent ORM', 'Blade', 'Artisan', 'PHP'], synonyms: ['Laravel Developer', 'PHP Laravel Engineer', 'Laravel Web Developer'], tech: ['Laravel 10', 'PHP 8', 'MySQL', 'Redis'], ind: ['SaaS', 'Startups', 'Real Estate'] },
  { name: 'Symfony', category: 'Backend', skills: ['Symfony', 'Doctrine ORM', 'Twig', 'PHP', 'Composer'], synonyms: ['Symfony Developer', 'PHP Symfony Engineer', 'Symfony Backend Developer'], tech: ['Symfony 6', 'PostgreSQL', 'Docker', 'Nginx'], ind: ['Enterprise', 'Automotive', 'Finance'] },
  { name: 'CodeIgniter', category: 'Backend', skills: ['CodeIgniter', 'PHP', 'MVC', 'SQL', 'Active Record'], synonyms: ['CodeIgniter Developer', 'PHP CodeIgniter Engineer', 'Web Developer (CodeIgniter)'], tech: ['CodeIgniter 4', 'MySQL', 'jQuery', 'Bootstrap'], ind: ['E-commerce', 'Education'] },
  { name: 'WordPress', category: 'Non-Tech', skills: ['WordPress', 'PHP', 'WooCommerce', 'Theme Customization', 'Plugin Development'], synonyms: ['WordPress Developer', 'WordPress Engineer', 'WP CMS Developer'], tech: ['WordPress', 'Elementor', 'MySQL', 'JS / CSS'], ind: ['Media', 'Publishing', 'Retail'] },
  { name: 'Drupal', category: 'Non-Tech', skills: ['Drupal', 'PHP', 'Twig', 'Drupal Modules', 'Drush'], synonyms: ['Drupal Developer', 'Drupal CMS Engineer', 'Drupal Web Specialist'], tech: ['Drupal 10', 'MySQL', 'Composer', 'Linux'], ind: ['Government', 'Education', 'Non-profit'] },
  { name: 'Magento', category: 'Non-Tech', skills: ['Magento', 'PHP', 'Magento Commerce', 'E-commerce Checkout', 'XML'], synonyms: ['Magento Developer', 'Adobe Commerce Developer', 'Magento E-commerce Engineer'], tech: ['Magento 2', 'MySQL', 'Elasticsearch', 'Redis'], ind: ['Retail', 'E-commerce', 'Logistics'] },
  { name: 'Shopify', category: 'Non-Tech', skills: ['Shopify', 'Liquid', 'Shopify Plus', 'Shopify Theme Customization', 'JS APIs'], synonyms: ['Shopify Developer', 'Shopify Plus Engineer', 'E-commerce Shopify Developer'], tech: ['Shopify Liquid', 'HTML5', 'SASS', 'GraphQL'], ind: ['Retail', 'E-commerce', 'Apparel'] },
  { name: 'Ruby', category: 'Backend', skills: ['Ruby', 'OOP', 'SQL', 'Algorithms', 'API integrations'], synonyms: ['Ruby Developer', 'Ruby Programmer', 'Ruby Backend Engineer'], tech: ['Ruby', 'PostgreSQL', 'Git', 'Redis'], ind: ['SaaS', 'Startups', 'Sourcing'] },
  { name: 'Rails', category: 'Backend', skills: ['Ruby on Rails', 'ActiveRecord', 'MVC', 'RSpec', 'Ruby'], synonyms: ['Ruby on Rails Developer', 'Rails Engineer', 'RoR Software Developer'], tech: ['Rails 7', 'PostgreSQL', 'Sidekiq', 'Redis'], ind: ['SaaS', 'Fintech', 'Real Estate'] },
  { name: 'Go', category: 'Backend', skills: ['Go', 'Golang', 'Concurrency', 'Goroutines', 'REST APIs'], synonyms: ['Golang Developer', 'Go Software Engineer', 'Go Backend Engineer'], tech: ['Golang', 'Docker', 'Kubernetes', 'gRPC'], ind: ['Fintech', 'SaaS', 'Telecom'] },
  { name: 'Rust', category: 'Backend', skills: ['Rust', 'Cargo', 'Systems Programming', 'Memory Safety', 'Concurrency'], synonyms: ['Rust Developer', 'Rust Systems Engineer', 'Rust Software Programmer'], tech: ['Rust', 'WebAssembly', 'Tokio', 'Linux'], ind: ['Blockchain', 'Embedded', 'Gaming'] },
  { name: 'C', category: 'Backend', skills: ['C Language', 'Pointer Management', 'Memory Allocation', 'Embedded Systems', 'Data Structures'], synonyms: ['C Programmer', 'C Software Engineer', 'C Developer'], tech: ['C', 'Linux Kernel', 'Makefile', 'GCC'], ind: ['Hardware', 'Telecom', 'Defense'] },
  { name: 'C++', category: 'Backend', skills: ['C++', 'STL', 'OOP', 'Memory Management', 'Multithreading'], synonyms: ['C++ Developer', 'C++ Software Engineer', 'C++ Systems Programmer'], tech: ['C++17/20', 'CMake', 'Qt', 'Visual Studio'], ind: ['Gaming', 'Finance', 'Aerospace'] },
  { name: 'C#', category: 'Backend', skills: ['C#', '.NET', 'OOP', 'LINQ', 'Entity Framework'], synonyms: ['C# Developer', 'C# Software Engineer', 'C# Programmer'], tech: ['C# 11', 'SQL Server', 'Git', 'Visual Studio'], ind: ['Finance', 'Enterprise', 'Healthcare'] },
  { name: '.NET', category: 'Backend', skills: ['.NET Core', 'ASP.NET', 'C#', 'Web API', 'SQL Server'], synonyms: ['.NET Developer', '.NET Software Engineer', 'DotNet Engineer'], tech: ['.NET Core 6/8', 'SQL Server', 'Azure', 'IIS'], ind: ['Finance', 'Insurance', 'Government'] },
  { name: 'ASP.NET', category: 'Backend', skills: ['ASP.NET MVC', 'ASP.NET Web API', 'C#', 'Entity Framework', 'IIS'], synonyms: ['ASP.NET Developer', 'ASP.NET Core Engineer', 'ASP.NET Programmer'], tech: ['ASP.NET Core', 'C#', 'SQL Server', 'Docker'], ind: ['Banking', 'Logistics', 'Retail'] },
  { name: 'Unity', category: 'Backend', skills: ['Unity 3D', 'C#', 'Game Physics', 'Shaders', 'Mobile Optimization'], synonyms: ['Unity Developer', 'Unity Game Engineer', 'Unity3D Programmer'], tech: ['Unity', 'C#', 'Git', 'Blender'], ind: ['Gaming', 'AR/VR', 'Education'] },
  { name: 'Unreal', category: 'Backend', skills: ['Unreal Engine', 'C++', 'Blueprints', 'Game Physics', 'Rendering Pipelines'], synonyms: ['Unreal Developer', 'Unreal Game Engineer', 'UE4 / UE5 Specialist'], tech: ['Unreal Engine 5', 'C++', 'Git', 'Shaders'], ind: ['Gaming', 'VFX', 'Simulation'] },
  { name: 'Android', category: 'Backend', skills: ['Android SDK', 'Kotlin', 'Java', 'XML', 'Gradle'], synonyms: ['Android Developer', 'Android Mobile Engineer', 'Android App Developer'], tech: ['Android SDK', 'Kotlin', 'Retrofit', 'Jetpack Compose'], ind: ['Technology', 'E-commerce', 'Banking'] },
  { name: 'Kotlin', category: 'Backend', skills: ['Kotlin', 'Android Jetpack', 'Coroutines', 'Android SDK', 'Java'], synonyms: ['Kotlin Developer', 'Kotlin Android Engineer', 'Kotlin Mobile Developer'], tech: ['Kotlin', 'Coroutines', 'Dagger Hilt', 'Retrofit'], ind: ['Technology', 'Finance'] },
  { name: 'Java Android', category: 'Backend', skills: ['Android SDK', 'Java', 'Android NDK', 'SQLite', 'Git'], synonyms: ['Java Android Developer', 'Android Developer (Java)', 'Java Mobile Engineer'], tech: ['Java', 'Android SDK', 'Android Studio', 'Gradle'], ind: ['Enterprise', 'Telecom'] },
  { name: 'iOS', category: 'Backend', skills: ['iOS SDK', 'Swift', 'Objective-C', 'Xcode', 'App Store Guidelines'], synonyms: ['iOS Developer', 'iOS Mobile Engineer', 'iOS App Developer'], tech: ['Swift', 'SwiftUI', 'UIKit', 'Cocoapods'], ind: ['Finance', 'E-commerce', 'Social Media'] },
  { name: 'Swift', category: 'Backend', skills: ['Swift', 'SwiftUI', 'Combine', 'UIKit', 'Xcode'], synonyms: ['Swift Developer', 'Swift iOS Engineer', 'Swift Programmer'], tech: ['Swift 5', 'SwiftUI', 'CoreData', 'TestFlight'], ind: ['Technology', 'Lifestyle'] },
  { name: 'Flutter', category: 'Backend', skills: ['Flutter', 'Dart', 'State Management', 'Widget Trees', 'Cross-Platform App Dev'], synonyms: ['Flutter Developer', 'Flutter Engineer', 'Dart Mobile Programmer'], tech: ['Flutter', 'Dart', 'Bloc', 'Firebase'], ind: ['Startups', 'Logistics', 'Finance'] },
  { name: 'React Native', category: 'Backend', skills: ['React Native', 'JavaScript', 'TypeScript', 'Redux', 'Mobile Bridge'], synonyms: ['React Native Developer', 'React Native Mobile Engineer', 'RN Developer'], tech: ['React Native', 'TypeScript', 'Expo', 'iOS / Android SDK'], ind: ['Retail', 'SaaS', 'Media'] },
  { name: 'Xamarin', category: 'Backend', skills: ['Xamarin.Forms', 'C#', '.NET', 'Xamarin.Android', 'Xamarin.iOS'], synonyms: ['Xamarin Developer', 'Xamarin Mobile Engineer', 'C# Mobile Developer'], tech: ['Xamarin', 'C#', '.NET Core', 'Visual Studio'], ind: ['Enterprise', 'HealthTech', 'Supply Chain'] },

  // DATA SCIENCE & AI
  { name: 'Data Scientist', category: 'Data Science', skills: ['Data Science', 'Machine Learning', 'Python', 'R', 'SQL', 'Predictive Modeling'], synonyms: ['Data Scientist', 'Statistical Data Analyst', 'Applied Scientist'], tech: ['Pandas', 'Scikit-Learn', 'TensorFlow', 'PostgreSQL'], ind: ['Finance', 'Healthcare', 'E-commerce'] },
  { name: 'Data Analyst', category: 'Data Science', skills: ['Data Analysis', 'SQL', 'Excel', 'Data Visualization', 'Reporting'], synonyms: ['Data Analyst', 'Business Data Analyst', 'BI Analyst'], tech: ['SQL', 'Tableau', 'Power BI', 'Excel'], ind: ['Retail', 'SaaS', 'Insurance'] },
  { name: 'Data Engineer', category: 'Data Science', skills: ['Data Pipelines', 'ETL', 'SQL', 'Big Data', 'Data Warehousing'], synonyms: ['Data Engineer', 'Data Infrastructure Engineer', 'ETL Developer'], tech: ['Spark', 'Hadoop', 'Airflow', 'Snowflake'], ind: ['Technology', 'Finance', 'Telecom'] },
  { name: 'ML Engineer', category: 'Machine Learning', skills: ['Machine Learning', 'Deep Learning', 'Python', 'ML Pipelines', 'TensorFlow'], synonyms: ['Machine Learning Engineer', 'ML Engineer', 'MLE'], tech: ['PyTorch', 'TensorFlow', 'Scikit-Learn', 'MLflow'], ind: ['AI Startups', 'Automotive', 'Healthcare'] },
  { name: 'AI Engineer', category: 'Artificial Intelligence', skills: ['Artificial Intelligence', 'NLP', 'Computer Vision', 'Deep Learning', 'Python'], synonyms: ['AI Engineer', 'Artificial Intelligence Developer', 'AI Specialist'], tech: ['TensorFlow', 'PyTorch', 'Keras', 'Hugging Face'], ind: ['Tech', 'Robotics', 'Fintech'] },
  { name: 'Prompt Engineer', category: 'Artificial Intelligence', skills: ['Prompt Engineering', 'Generative AI', 'LLM', 'In-Context Learning', 'Few-Shot Prompting'], synonyms: ['Prompt Engineer', 'Prompt Designer', 'AI Instructions Writer'], tech: ['GPT-4', 'Claude', 'LangChain', 'Prompting Tricks'], ind: ['SaaS', 'Marketing', 'Education'] },
  { name: 'LLM Engineer', category: 'Artificial Intelligence', skills: ['LLM', 'Large Language Models', 'Fine-Tuning', 'Retrieval Augmented Generation', 'Vector Databases'], synonyms: ['LLM Engineer', 'LLM Developer', 'Generative AI Engineer'], tech: ['LangChain', 'LlamaIndex', 'Pinecone', 'HuggingFace'], ind: ['Tech', 'LegalTech', 'SaaS'] },
  { name: 'NLP Engineer', category: 'Artificial Intelligence', skills: ['NLP', 'Natural Language Processing', 'Text Mining', 'NER', 'Word Embeddings'], synonyms: ['NLP Engineer', 'Natural Language Processing Specialist', 'NLP Developer'], tech: ['NLTK', 'SpaCy', 'BERT', 'Transformers'], ind: ['Tech', 'Healthcare', 'Research'] },
  { name: 'Computer Vision', category: 'Artificial Intelligence', skills: ['Computer Vision', 'Image Processing', 'OpenCV', 'CNN', 'Object Detection'], synonyms: ['Computer Vision Engineer', 'CV Engineer', 'Computer Vision Specialist'], tech: ['OpenCV', 'YOLO', 'PyTorch', 'CUDA'], ind: ['Automotive', 'Security', 'Robotics'] },
  { name: 'MLOps', category: 'Machine Learning', skills: ['MLOps', 'Machine Learning Pipelines', 'Model Deployment', 'Kubeflow', 'MLflow'], synonyms: ['MLOps Engineer', 'ML Operations Specialist', 'Model SRE'], tech: ['Kubeflow', 'MLflow', 'Docker', 'Kubernetes'], ind: ['Tech', 'Automotive', 'Finance'] },

  // DEVOPS & INFRASTRUCTURE
  { name: 'DevOps', category: 'DevOps', skills: ['DevOps', 'CI/CD', 'Docker', 'Kubernetes', 'Cloud Computing', 'Automation'], synonyms: ['DevOps Engineer', 'DevOps Specialist', 'Automation Engineer'], tech: ['Jenkins', 'Terraform', 'AWS', 'Linux'], ind: ['SaaS', 'Finance', 'Telecom'] },
  { name: 'Platform Engineer', category: 'Infrastructure', skills: ['Platform Engineering', 'Kubernetes', 'Cloud Native', 'Internal Developer Platform', 'Infrastructure as Code'], synonyms: ['Platform Engineer', 'Internal Platform Developer', 'Cloud Platform Specialist'], tech: ['Kubernetes', 'Backstage', 'Terraform', 'Helm'], ind: ['SaaS', 'Enterprise'] },
  { name: 'Cloud Engineer', category: 'Cloud', skills: ['Cloud Computing', 'Cloud Security', 'Virtualization', 'Networking', 'SysOps'], synonyms: ['Cloud Engineer', 'Cloud Systems Specialist', 'Cloud Administrator'], tech: ['AWS', 'Azure', 'GCP', 'Linux'], ind: ['Technology', 'Consulting', 'Retail'] },
  { name: 'AWS', category: 'AWS', skills: ['AWS', 'Amazon Web Services', 'IAM', 'VPC', 'EC2', 'S3'], synonyms: ['AWS Cloud Engineer', 'AWS Solutions Architect', 'AWS Developer'], tech: ['AWS CloudFormation', 'Terraform', 'Lambda', 'ECS'], ind: ['Technology', 'E-commerce', 'Fintech'] },
  { name: 'Azure', category: 'Azure', skills: ['Azure', 'Microsoft Azure', 'Active Directory', 'Azure DevOps', 'ARM Templates'], synonyms: ['Azure Cloud Engineer', 'Azure Architect', 'Azure Administrator'], tech: ['ARM Templates', 'Azure DevOps', 'Terraform', 'Bicep'], ind: ['Enterprise', 'Banking', 'Healthcare'] },
  { name: 'GCP', category: 'Google Cloud', skills: ['GCP', 'Google Cloud Platform', 'BigQuery', 'GKE', 'Compute Engine'], synonyms: ['GCP Cloud Engineer', 'Google Cloud Architect', 'GCP Specialist'], tech: ['GKE', 'BigQuery', 'Terraform', 'Cloud Run'], ind: ['Tech Startups', 'Media', 'Gaming'] },
  { name: 'Terraform', category: 'Infrastructure', skills: ['Terraform', 'Infrastructure as Code', 'HCL', 'State Management', 'Terraform Cloud'], synonyms: ['Terraform Specialist', 'IaC Engineer (Terraform)', 'Cloud Automation Engineer'], tech: ['Terraform', 'AWS', 'Azure', 'Git'], ind: ['SaaS', 'Finance'] },
  { name: 'Ansible', category: 'Infrastructure', skills: ['Ansible', 'Configuration Management', 'Playbooks', 'YAML', 'SysAdmin Automation'], synonyms: ['Ansible Automation Engineer', 'Configuration Management Specialist', 'Ansible Developer'], tech: ['Ansible', 'Linux', 'YAML', 'Bash'], ind: ['Telecom', 'Web Hosting', 'Enterprise'] },
  { name: 'Docker', category: 'Infrastructure', skills: ['Docker', 'Containerization', 'Dockerfile', 'Docker Compose', 'Multi-stage Builds'], synonyms: ['Docker Specialist', 'Containerization Engineer', 'Docker Developer'], tech: ['Docker', 'Linux', 'Bash', 'Docker Registry'], ind: ['SaaS', 'E-commerce', 'AdTech'] },
  { name: 'Kubernetes', category: 'Infrastructure', skills: ['Kubernetes', 'K8s', 'Container Orchestration', 'Helm', 'kubectl'], synonyms: ['Kubernetes Engineer', 'Orchestration Specialist', 'K8s Architect'], tech: ['Kubernetes', 'Helm', 'YAML', 'Prometheus'], ind: ['SaaS', 'Finance', 'Telecom'] },
  { name: 'OpenShift', category: 'Infrastructure', skills: ['OpenShift', 'RedHat', 'Kubernetes', 'Enterprise Kubernetes', 'OC CLI'], synonyms: ['OpenShift Specialist', 'RedHat OpenShift Engineer', 'Enterprise K8s Admin'], tech: ['OpenShift', 'RedHat Linux', 'Docker', 'Ansible'], ind: ['Banking', 'Insurance', 'Government'] },
  { name: 'Jenkins', category: 'Automation', skills: ['Jenkins', 'CI/CD Pipelines', 'Groovy', 'Jenkinsfiles', 'Build Automation'], synonyms: ['Jenkins Engineer', 'Build and Release Engineer', 'CI Developer'], tech: ['Jenkins', 'Groovy', 'Git', 'Linux'], ind: ['Automotive', 'Software Houses'] },
  { name: 'GitHub Actions', category: 'Automation', skills: ['GitHub Actions', 'CI/CD Workflow', 'YAML Pipelines', 'GitHub API', 'Runner Management'], synonyms: ['GitHub Actions Engineer', 'CI Specialist (GitHub)', 'Workflow Automation Engineer'], tech: ['GitHub Actions', 'YAML', 'Git', 'npm / PyPI'], ind: ['Startups', 'SaaS', 'Web Agencies'] },
  { name: 'GitLab CI', category: 'Automation', skills: ['GitLab CI', 'GitLab Runners', 'CI/CD YAML', 'DevSecOps', 'Merge Request Pipelines'], synonyms: ['GitLab CI Engineer', 'GitLab Specialist', 'CI Developer (GitLab)'], tech: ['GitLab', 'YAML', 'Docker', 'Bash'], ind: ['Technology', 'Fintech', 'Military'] },
  { name: 'ArgoCD', category: 'Infrastructure', skills: ['ArgoCD', 'GitOps', 'Kubernetes', 'Helm Charts', 'Declarative CD'], synonyms: ['ArgoCD Engineer', 'GitOps Specialist', 'Kubernetes Delivery Engineer'], tech: ['ArgoCD', 'Kubernetes', 'Helm', 'Kustomize'], ind: ['Fintech', 'SaaS', 'Big Tech'] },
  { name: 'Linux', category: 'Infrastructure', skills: ['Linux Administration', 'Shell Scripting', 'System Troubleshooting', 'System Security', 'User Administration'], synonyms: ['Linux System Administrator', 'Linux SysAdmin', 'Linux Engineer'], tech: ['Ubuntu', 'CentOS', 'RedHat', 'Bash Scripting'], ind: ['Hosting', 'ISP', 'Enterprise'] },
  { name: 'Windows', category: 'Infrastructure', skills: ['Windows Server', 'Active Directory', 'Group Policy', 'PowerShell', 'IIS'], synonyms: ['Windows System Administrator', 'Windows SysAdmin', 'Windows Engineer'], tech: ['Windows Server 2022', 'PowerShell', 'Hyper-V', 'SCCM'], ind: ['Healthcare', 'Corporate Offices', 'Retail'] },
  { name: 'VMware', category: 'Infrastructure', skills: ['VMware vSphere', 'ESXi', 'vCenter', 'Virtualization', 'San Storage'], synonyms: ['VMware Administrator', 'Virtualization Engineer', 'VMware Specialist'], tech: ['VMware vSphere 8', 'SAN / NAS', 'NSX', 'PowerCLI'], ind: ['Banking', 'Cloud Providers', 'Datacenters'] },
  { name: 'Citrix', category: 'Infrastructure', skills: ['Citrix Virtual Apps', 'Citrix Desktops', 'NetScaler', 'VDI', 'XenServer'], synonyms: ['Citrix Administrator', 'VDI Engineer', 'Citrix Specialist'], tech: ['Citrix DaaS', 'StoreFront', 'Active Directory', 'NetScaler'], ind: ['Healthcare', 'Banking', 'Large Enterprise'] },

  // ERP & ENTERPRISE
  { name: 'SAP ABAP', category: 'SAP', skills: ['SAP ABAP', 'OO-ABAP', 'HANA CDS Views', 'BAPI / BADI', 'Fiori'], synonyms: ['SAP ABAP Consultant', 'ABAP Developer', 'SAP Technical Consultant'], tech: ['ABAP', 'SAP S/4HANA', 'Eclipse', 'Fiori'], ind: ['Manufacturing', 'Automotive', 'Logistics'] },
  { name: 'SAP FICO', category: 'SAP', skills: ['SAP FICO', 'Financial Accounting', 'Controlling', 'S/4HANA Finance', 'General Ledger'], synonyms: ['SAP FICO Consultant', 'SAP Finance Specialist', 'SAP FI-CO Advisor'], tech: ['SAP S/4HANA Finance', 'SAP ERP', 'Excel'], ind: ['Consumer Goods', 'Chemicals', 'Banking'] },
  { name: 'SAP MM', category: 'SAP', skills: ['SAP MM', 'Materials Management', 'Procurement', 'Inventory Management', 'Sourcing'], synonyms: ['SAP MM Consultant', 'SAP Inventory Specialist', 'SAP MM Architect'], tech: ['SAP ERP', 'S/4HANA MM', 'SAP WM'], ind: ['Logistics', 'Retail', 'Mining'] },
  { name: 'SAP SD', category: 'SAP', skills: ['SAP SD', 'Sales and Distribution', 'Billing', 'Order to Cash', 'Shipping'], synonyms: ['SAP SD Consultant', 'SAP Sales Specialist', 'SAP SD Analyst'], tech: ['SAP ERP', 'S/4HANA SD', 'EDI'], ind: ['Wholesale', 'Logistics', 'Manufacturing'] },
  { name: 'SAP HCM', category: 'SAP', skills: ['SAP HCM', 'Human Capital Management', 'Payroll Config', 'Personnel Administration', 'Time Management'], synonyms: ['SAP HCM Consultant', 'SAP HR Specialist', 'SAP SuccessFactors HCM'], tech: ['SAP HCM ERP', 'SuccessFactors', 'Payroll Engine'], ind: ['Energy', 'Retail', 'Public Sector'] },
  { name: 'SAP Basis', category: 'SAP', skills: ['SAP Basis', 'SAP Administration', 'HANA Database Admin', 'NetWeaver', 'Transports'], synonyms: ['SAP Basis Consultant', 'SAP System Administrator', 'SAP Basis Engineer'], tech: ['SAP S/4HANA Basis', 'HANA DB', 'Linux', 'Solution Manager'], ind: ['Consulting', 'Steel', 'Utility'] },
  { name: 'SAP SuccessFactors', category: 'SAP', skills: ['SAP SuccessFactors', 'Employee Central', 'LMS', 'Recruiting Management', 'Performance & Goals'], synonyms: ['SAP SuccessFactors Consultant', 'SuccessFactors Lead', 'SF Functional Advisor'], tech: ['Employee Central', 'XML', 'API Integrations', 'SF OData'], ind: ['Pharmaceuticals', 'Logistics', 'Banking'] },
  { name: 'Workday HCM', category: 'Workday', skills: ['Workday HCM', 'Core HR', 'Compensation Config', 'Security Groups', 'EIB Integrations'], synonyms: ['Workday HCM Consultant', 'Workday HR Specialist', 'Workday Functional Lead'], tech: ['Workday Tenant', 'EIB', 'Calculated Fields', 'Report Writer'], ind: ['Finance', 'Tech Companies', 'Media'] },
  { name: 'Workday Financials', category: 'Workday', skills: ['Workday Financials', 'General Ledger', 'Revenue Management', 'Accounts Payable', 'Business Processes'], synonyms: ['Workday Financials Consultant', 'Workday Finance Specialist', 'Workday FIN Lead'], tech: ['Workday FINS', 'EIB Studio', 'XML / XSLT'], ind: ['Professional Services', 'Finance', 'SaaS'] },
  { name: 'Salesforce Admin', category: 'Salesforce', skills: ['Salesforce Administration', 'User Management', 'Flows', 'Validation Rules', 'Reports & Dashboards'], synonyms: ['Salesforce Administrator', 'SFDC Admin', 'Salesforce Specialist'], tech: ['Sales Cloud', 'Service Cloud', 'Flow Builder', 'Data Loader'], ind: ['SaaS', 'Finance', 'E-commerce'] },
  { name: 'Salesforce Developer', category: 'Salesforce', skills: ['Salesforce Development', 'Apex', 'Lightning Web Components', 'LWC', 'SOQL', 'Triggers'], synonyms: ['Salesforce Developer', 'SFDC Developer', 'Apex Specialist'], tech: ['Salesforce Developer Console', 'LWC', 'VS Code', 'Copado'], ind: ['SaaS', 'Banking', 'Healthcare'] },
  { name: 'ServiceNow', category: 'Salesforce', skills: ['ServiceNow Development', 'ITSM', 'GlideRecord', 'Business Rules', 'Service Portal'], synonyms: ['ServiceNow Developer', 'ServiceNow Consultant', 'ServiceNow Architect'], tech: ['ServiceNow Utah / Vancouver', 'JavaScript', 'REST API', 'CMDB'], ind: ['Enterprise IT', 'Consulting', 'Telecom'] },

  // DATABASE & BUSINESS INTELLIGENCE
  { name: 'Oracle DBA', category: 'Oracle', skills: ['Oracle DBA', 'Oracle Database', 'RMAN Backups', 'Performance Tuning', 'PL/SQL'], synonyms: ['Oracle Database Administrator', 'Oracle DBA Engineer', 'Lead Oracle DBA'], tech: ['Oracle 19c', 'Linux', 'PL/SQL', 'Exadata'], ind: ['Banking', 'Government', 'Telecom'] },
  { name: 'SQL Developer', category: 'Database', skills: ['SQL Development', 'PL/SQL', 'T-SQL', 'Stored Procedures', 'Database Triggers'], synonyms: ['SQL Developer', 'Database Developer', 'SQL Programmer'], tech: ['SQL Server', 'Oracle SQL Developer', 'PostgreSQL'], ind: ['SaaS', 'Retail', 'Education'] },
  { name: 'MongoDB', category: 'Database', skills: ['MongoDB', 'NoSQL', 'Document Databases', 'Aggregation Pipeline', 'Mongoose'], synonyms: ['MongoDB Developer', 'NoSQL Database Specialist', 'MongoDB Administrator'], tech: ['MongoDB Atlas', 'Node.js', 'JSON', 'Redis'], ind: ['SaaS', 'Gaming', 'Fintech'] },
  { name: 'PostgreSQL', category: 'Database', skills: ['PostgreSQL', 'Relational Databases', 'SQL Optimization', 'Database Replication', 'pgSQL'], synonyms: ['PostgreSQL Developer', 'PostgreSQL DBA', 'Postgres Specialist'], tech: ['PostgreSQL 15', 'Linux', 'SQL', 'Docker'], ind: ['Fintech', 'SaaS', 'Logistics'] },
  { name: 'Redis', category: 'Database', skills: ['Redis', 'Caching', 'In-Memory Database', 'Pub/Sub', 'Key-Value Store'], synonyms: ['Redis Specialist', 'In-Memory DB Developer', 'Redis Administrator'], tech: ['Redis Cluster', 'Node.js', 'Python', 'Go'], ind: ['High-Traffic SaaS', 'AdTech', 'Gaming'] },
  { name: 'Elasticsearch', category: 'Database', skills: ['Elasticsearch', 'Search Engine', 'ELK Stack', 'Kibana', 'Logstash', 'Index Design'], synonyms: ['Elasticsearch Engineer', 'ELK Stack Specialist', 'Search Developer'], tech: ['Elasticsearch', 'Kibana', 'Logstash', 'JSON APIs'], ind: ['E-commerce', 'Cybersecurity', 'SaaS'] },
  { name: 'Power BI', category: 'Microsoft', skills: ['Power BI', 'DAX', 'Data Modeling', 'Power Query', 'Power BI Service'], synonyms: ['Power BI Developer', 'Power BI Analyst', 'BI Specialist (Power BI)'], tech: ['Power BI Desktop', 'DAX', 'SQL', 'Excel'], ind: ['Manufacturing', 'Finance', 'Retail'] },
  { name: 'Tableau', category: 'Database', skills: ['Tableau', 'Tableau Desktop', 'Data Visualizations', 'Tableau Server', 'Calculated Fields'], synonyms: ['Tableau Developer', 'Tableau Analyst', 'BI Specialist (Tableau)'], tech: ['Tableau', 'SQL', 'Alteryx', 'Excel'], ind: ['Healthcare', 'Banking', 'Marketing'] },
  { name: 'Looker', category: 'Database', skills: ['Looker', 'LookML', 'Data Modeling', 'Looker Dashboards', 'SQL'], synonyms: ['Looker Developer', 'Looker BI Analyst', 'LookML Specialist'], tech: ['Looker', 'LookML', 'BigQuery', 'SQL'], ind: ['Tech SaaS', 'E-commerce', 'Startups'] },
  { name: 'Qlik', category: 'Database', skills: ['QlikView', 'Qlik Sense', 'Qlik Scripting', 'Data Modeling', 'Set Analysis'], synonyms: ['Qlik Developer', 'Qlik Analyst', 'BI Developer (Qlik)'], tech: ['Qlik Sense', 'SQL', 'Excel', 'Data Warehouse'], ind: ['Supply Chain', 'Retail', 'Finance'] },

  // MANAGEMENT & PRODUCT
  { name: 'Business Analyst', category: 'Business Analysis', skills: ['Business Analysis', 'Requirement Gathering', 'BRD', 'UML', 'User Stories'], synonyms: ['Business Analyst', 'Systems Analyst', 'Business Systems Analyst'], tech: ['Jira', 'Confluence', 'Visio', 'Excel'], ind: ['Banking', 'SaaS', 'Consulting'] },
  { name: 'Project Manager', category: 'Project Management', skills: ['Project Management', 'Agile', 'Scrum', 'Budgeting', 'Risk Management', 'Stakeholder Management'], synonyms: ['Project Manager', 'Technical Project Manager', 'PM'], tech: ['MS Project', 'Jira', 'Asana', 'Excel'], ind: ['Construction', 'Enterprise IT', 'Healthcare'] },
  { name: 'Scrum Master', category: 'Project Management', skills: ['Scrum Master', 'Agile Facilitation', 'Sprint Planning', 'Kanban', 'Jira Boards'], synonyms: ['Scrum Master', 'Agile Coach', 'Agile Facilitator'], tech: ['Jira', 'Confluence', 'Miro', 'Trello'], ind: ['Software Startups', 'Fintech', 'SaaS'] },
  { name: 'Product Manager', category: 'Product', skills: ['Product Management', 'Product Roadmap', 'User Stories', 'Market Research', 'KPIs'], synonyms: ['Product Manager', 'Technical Product Manager', 'Product Owner'], tech: ['Figma', 'Jira', 'Mixpanel', 'Google Analytics'], ind: ['Consumer Tech', 'SaaS', 'B2B'] },

  // HR & RECRUITING
  { name: 'Technical Recruiter', category: 'Recruitment', skills: ['Technical Recruiting', 'Sourcing', 'Boolean Search', 'LinkedIn Recruiter', 'ATS'], synonyms: ['Technical Recruiter', 'IT Recruiter', 'Tech Talent Acquisition'], tech: ['LinkedIn Recruiter', 'Lever', 'Greenhouse', 'Workday'], ind: ['Tech Agencies', 'Corporate IT'] },
  { name: 'Talent Acquisition', category: 'Recruitment', skills: ['Talent Acquisition', 'Employer Branding', 'Candidate Experience', 'Sourcing Strategy', 'Hiring Manager Consultations'], synonyms: ['Talent Acquisition Specialist', 'TA Partner', 'Recruiting Lead'], tech: ['ATS systems', 'LinkedIn Recruiter', 'Indeed'], ind: ['Enterprise Companies', 'Consulting'] },
  { name: 'HR Manager', category: 'HR', skills: ['HR Management', 'Employee Relations', 'HR Compliance', 'Onboarding', 'Performance Management'], synonyms: ['HR Manager', 'Human Resources Manager', 'HR Generalist'], tech: ['Workday', 'BambooHR', 'Gusto', 'Excel'], ind: ['Corporate Offices', 'Service Sectors'] },

  // ACCOUNTING & FINANCE
  { name: 'Finance Manager', category: 'Finance', skills: ['Finance Management', 'Corporate Finance', 'Budget Forecasting', 'Financial Modeling', 'Cost Control'], synonyms: ['Finance Manager', 'Financial Controller', 'Finance Lead'], tech: ['SAP FI', 'Hyperion', 'Excel Macros', 'ERP systems'], ind: ['Manufacturing', 'Aviation', 'E-commerce'] },
  { name: 'Chartered Accountant', category: 'Accounting', skills: ['Chartered Accounting', 'Taxation', 'Auditing', 'GAAP', 'IFRS', 'Financial Reporting'], synonyms: ['Chartered Accountant', 'CPA', 'Public Accountant'], tech: ['Tally', 'QuickBooks', 'SAP FI', 'Excel'], ind: ['Accounting Firms', 'Banking', 'Corporate'] },

  // MARKETING & DESIGN
  { name: 'Digital Marketing', category: 'Digital Marketing', skills: ['Digital Marketing', 'Social Media Marketing', 'PPC Campaigns', 'Content Strategy', 'Email Marketing'], synonyms: ['Digital Marketer', 'Growth Marketer', 'Digital Marketing Specialist'], tech: ['Google Analytics', 'Meta Ads', 'HubSpot', 'Mailchimp'], ind: ['Advertising', 'E-commerce', 'Agencies'] },
  { name: 'SEO Specialist', category: 'SEO', skills: ['SEO', 'On-page SEO', 'Off-page SEO', 'Keyword Research', 'Technical SEO', 'Backlink Building'], synonyms: ['SEO Specialist', 'SEO Analyst', 'Search Engine Optimization Specialist'], tech: ['SEMrush', 'Ahrefs', 'Google Search Console', 'Screaming Frog'], ind: ['Agencies', 'SaaS', 'Publishing'] },
  { name: 'SEM Specialist', category: 'SEM', skills: ['SEM', 'PPC Advertising', 'Google Ads', 'Bing Ads', 'ROAS Optimization', 'Keyword Bidding'], synonyms: ['SEM Specialist', 'PPC Analyst', 'Paid Search Specialist'], tech: ['Google Ads Editor', 'Google Analytics', 'Excel', 'Meta Ads'], ind: ['E-commerce', 'Agencies', 'Retail'] },
  { name: 'Content Writer', category: 'Content', skills: ['Content Writing', 'Copywriting', 'SEO Content', 'Blog Writing', 'Creative Writing'], synonyms: ['Content Writer', 'Copywriter', 'Content Creator'], tech: ['WordPress', 'Grammarly', 'Google Docs', 'SurferSEO'], ind: ['Media', 'SaaS', 'Marketing Agencies'] },
  { name: 'Graphic Designer', category: 'Graphic Design', skills: ['Graphic Design', 'Visual Brand Identity', 'Vector Illustration', 'Typography', 'Print Layout'], synonyms: ['Graphic Designer', 'Visual Designer', 'Brand Illustrator'], tech: ['Adobe Illustrator', 'Photoshop', 'InDesign', 'Figma'], ind: ['Agencies', 'Publishing', 'Consumer Goods'] },
  { name: 'UI Designer', category: 'UI UX', skills: ['UI Design', 'User Interface Design', 'Visual Design', 'Design Systems', 'Mockups'], synonyms: ['UI Designer', 'User Interface Designer', 'UI/UX Visual Designer'], tech: ['Figma', 'Adobe XD', 'Sketch', 'Zeplin'], ind: ['SaaS', 'Agencies', 'Tech Startups'] },
  { name: 'UX Designer', category: 'UI UX', skills: ['UX Design', 'User Experience Design', 'User Research', 'Wireframing', 'Information Architecture'], synonyms: ['UX Designer', 'User Experience Specialist', 'UX Researcher'], tech: ['Figma', 'Miro', 'Hotjar', 'InVision'], ind: ['Fintech', 'Enterprise SaaS', 'HealthTech'] },

  // ENGINEERING (HARDWARE / HEAVY)
  { name: 'Mechanical Engineer', category: 'Mechanical', skills: ['Mechanical Engineering', 'CAD Design', 'SolidWorks', 'FEA Analysis', 'Thermodynamics'], synonyms: ['Mechanical Engineer', 'Mechanical Design Engineer', 'CAD Designer'], tech: ['SolidWorks', 'AutoCAD', 'Ansys', 'CATIA'], ind: ['Automotive', 'Aerospace', 'Manufacturing'] },
  { name: 'Civil Engineer', category: 'Civil', skills: ['Civil Engineering', 'Structural Design', 'Site Inspection', 'Project Estimating', 'Concrete Structures'], synonyms: ['Civil Engineer', 'Structural Engineer', 'Site Construction Engineer'], tech: ['AutoCAD Civil 3D', 'STAAD Pro', 'BIM', 'Revit'], ind: ['Construction', 'Public Infrastructure', 'Energy'] },
  { name: 'Electrical Engineer', category: 'Electrical', skills: ['Electrical Engineering', 'Power Systems', 'Circuit Design', 'PLC Programming', 'High Voltage Engineering'], synonyms: ['Electrical Engineer', 'Power Grid Engineer', 'Electrical Systems Specialist'], tech: ['MATLAB', 'AutoCAD Electrical', 'ETAP', 'Siemens PLC'], ind: ['Power & Energy', 'Construction', 'Automobile'] },
  { name: 'Automobile Engineer', category: 'Automobile', skills: ['Automotive Engineering', 'Vehicle Dynamics', 'Power Train', 'Automotive Testing', 'CAD Modeling'], synonyms: ['Automobile Engineer', 'Automotive Systems Designer', 'Vehicle Safety Engineer'], tech: ['CATIA', 'MATLAB Simulink', 'SolidWorks', 'Ansys'], ind: ['Automobile', 'Manufacturing', 'Logistics'] },
  { name: 'Embedded Engineer', category: 'Infrastructure', skills: ['Embedded Systems', 'Firmware Development', 'C/C++', 'RTOS', 'Microcontrollers'], synonyms: ['Embedded Software Engineer', 'Firmware Developer', 'Embedded Systems Programmer'], tech: ['C / C++', 'FreeRTOS', 'I2C / SPI', 'Oscilloscopes'], ind: ['Hardware Manufacturers', 'IoT Startups', 'Defense'] },
  { name: 'IoT Engineer', category: 'Infrastructure', skills: ['Internet of Things', 'Sensor Integration', 'Wireless Protocols', 'MQTT', 'Embedded Programming'], synonyms: ['IoT Engineer', 'IoT Systems Architect', 'Smart Devices Developer'], tech: ['Raspberry Pi', 'Arduino', 'MQTT', 'Bluetooth LE', 'Node-RED'], ind: ['Home Automation', 'Smart Grids', 'Agriculture'] },

  // SECURITY
  { name: 'Cyber Security', category: 'Cyber Security', skills: ['Cyber Security', 'Information Security', 'Vulnerability Management', 'Security Audits', 'Firewalls'], synonyms: ['Cyber Security Specialist', 'InfoSec Analyst', 'Security Engineer'], tech: ['Wireshark', 'Kali Linux', 'SIEM', 'Nmap'], ind: ['Finance', 'Government', 'Corporate Security'] },
  { name: 'SOC Analyst', category: 'Cyber Security', skills: ['SOC Operations', 'Security Operations Center', 'SIEM Triage', 'Incident Response', 'Log Analysis'], synonyms: ['SOC Analyst', 'Security Operations Specialist', 'SIEM Analyst'], tech: ['Splunk ES', 'QRadar', 'Wireshark', 'AlienVault'], ind: ['Managed Security (MSSP)', 'Banking'] },
  { name: 'Penetration Tester', category: 'Cyber Security', skills: ['Penetration Testing', 'Ethical Hacking', 'Vulnerability Assessment', 'OWASP Top 10', 'Exploitation'], synonyms: ['Penetration Tester', 'Pentester', 'AppSec Auditor'], tech: ['Metasploit', 'Burp Suite', 'Kali Linux', 'OWASP ZAP'], ind: ['Cybersecurity Consulting', 'Tech SaaS'] },
  { name: 'Ethical Hacker', category: 'Cyber Security', skills: ['Ethical Hacking', 'Vulnerability Discovery', 'Red Teaming', 'Network Penetration', 'CEH Cert'], synonyms: ['Ethical Hacker', 'White Hat Hacker', 'Vulnerability Researcher'], tech: ['Metasploit', 'Nmap', 'Burp Suite', 'Ghidra'], ind: ['Military & Defense', 'Tech Giants', 'Banking'] },
  { name: 'Network Engineer', category: 'Networking', skills: ['Network Engineering', 'Cisco Routing & Switching', 'BGP & OSPF', 'VPN configuration', 'Firewall Rules'], synonyms: ['Network Engineer', 'Network Administrator', 'Network Infrastructure Architect'], tech: ['Cisco iOS', 'Juniper Junos', 'Fortinet', 'Wireshark'], ind: ['Telecom', 'Cloud Datacenters', 'Enterprise Networks'] },
  { name: 'System Administrator', category: 'Infrastructure', skills: ['System Administration', 'Server Maintenance', 'Backup Restoration', 'Access Control', 'Virtualization Admin'], synonyms: ['System Administrator', 'SysAdmin', 'Systems Engineer'], tech: ['Linux (Ubuntu/RHEL)', 'Windows Server', 'Active Directory', 'Proxmox'], ind: ['Schools', 'Corporate Offices', 'SaaS'] },
  { name: 'Helpdesk Engineer', category: 'Customer Support', skills: ['Technical Support', 'IT Helpdesk', 'Troubleshooting Tickets', 'Desktop Deployment', 'Customer Relations'], synonyms: ['Helpdesk Technician', 'IT Support Specialist', 'Desktop Analyst'], tech: ['Jira Service Desk', 'Zendesk', 'Active Directory', 'Windows 11'], ind: ['Corporate IT', 'Schools', 'Outsourcing'] },
  { name: 'Desktop Support', category: 'Customer Support', skills: ['Desktop Support', 'Hardware Troubleshooting', 'OS Reinstallation', 'Peripheral configuration', 'Local Networking'], synonyms: ['Desktop Support Engineer', 'IT Field Technician', 'Workstation Technician'], tech: ['Windows Server', 'macOS', 'SCCM', 'Active Directory'], ind: ['Offices', 'Manufacturing Plants', 'Retail'] },
  { name: 'Technical Support', category: 'Customer Support', skills: ['Technical Support', 'Product Troubleshooting', 'Log Analysis', 'API Testing', 'Ticket escalation'], synonyms: ['Technical Support Engineer', 'L2/L3 Support Specialist', 'Application Support Engineer'], tech: ['SQL', 'Kibana', 'Postman', 'Zendesk'], ind: ['SaaS Companies', 'Hardware Providers'] },
  { name: 'Customer Success', category: 'Customer Support', skills: ['Customer Success', 'Account Management', 'Client Onboarding', 'Churn Reduction', 'Upsell Strategy'], synonyms: ['Customer Success Manager', 'CSM', 'Client Relationship Lead'], tech: ['Gainsight', 'Salesforce', 'HubSpot', 'ChurnZero'], ind: ['SaaS', 'Cloud Services', 'B2B'] },

  // HEALTHCARE
  { name: 'Healthcare Recruiter', category: 'Recruitment', skills: ['Healthcare Recruiting', 'Medical Sourcing', 'Credentialing Verification', 'RN recruitment', 'Physician headhunting'], synonyms: ['Healthcare Recruiter', 'Clinical Sourcing Recruiter', 'Nurse Recruiter'], tech: ['LinkedIn Recruiter', 'NPI Registry', 'Bullhorn'], ind: ['Hospitals', 'Medical Placement Agencies'] },
  { name: 'Doctor', category: 'Doctors', skills: ['Clinical Diagnosis', 'Patient Consultation', 'EHR Charting', 'Prescription Management', 'Board Certified Medicine'], synonyms: ['Medical Doctor', 'MD', 'Physician', 'Clinical Lead'], tech: ['Epic Systems', 'Cerner', 'Clinical Guides'], ind: ['Hospitals', 'Private Clinics'] },
  { name: 'Nurse', category: 'Nurses', skills: ['Patient Care', 'Medication Administration', 'Triage Protocol', 'Vital Sign Monitoring', 'IV Therapy'], synonyms: ['Registered Nurse', 'RN', 'Clinical Nurse', 'Staff Nurse'], tech: ['Epic Systems', 'Electronic Health Records', 'ACLS/BLS'], ind: ['Hospitals', 'Home Care', 'Military Medicine'] },
  { name: 'Pharmacist', category: 'Pharmacists', skills: ['Dispensing Medication', 'Drug Interaction Review', 'Patient Counseling', 'Inventory Control', 'State Licensed Pharmacy'], synonyms: ['Pharmacist', 'Clinical Pharmacist', 'Staff Pharmacist'], tech: ['PioneerRx', 'Lexicomp', 'Pharmacy Management Systems'], ind: ['Retail Pharmacy', 'Hospitals', 'Pharma Research'] }
];

// Helper to map dynamic categories to the main 4 core categories
function mapCategory(originalCat: string): 'Engineering' | 'Operations' | 'Healthcare' | 'Business' {
  const cat = originalCat.toLowerCase();
  if (
    cat.includes('dev') ||
    cat.includes('software') ||
    cat.includes('backend') ||
    cat.includes('frontend') ||
    cat.includes('science') ||
    cat.includes('machine') ||
    cat.includes('artificial') ||
    cat.includes('intelligence') ||
    cat.includes('infrastructure') ||
    cat.includes('cloud') ||
    cat.includes('automation') ||
    cat.includes('database') ||
    cat.includes('cyber') ||
    cat.includes('security') ||
    cat.includes('network') ||
    cat.includes('engineer') ||
    cat.includes('mechanical') ||
    cat.includes('civil') ||
    cat.includes('electrical') ||
    cat.includes('automobile')
  ) {
    return 'Engineering';
  }
  if (
    cat.includes('sap') ||
    cat.includes('workday') ||
    cat.includes('salesforce') ||
    cat.includes('oracle') ||
    cat.includes('business') ||
    cat.includes('project') ||
    cat.includes('product')
  ) {
    return 'Business';
  }
  if (
    cat.includes('doctor') ||
    cat.includes('nurse') ||
    cat.includes('pharmacist') ||
    cat.includes('health') ||
    cat.includes('medical')
  ) {
    return 'Healthcare';
  }
  return 'Operations';
}

// Helper to expand base roles to 1000+ total templates by mixing with seniorities and platforms
export const generateTemplates = (): DetailedTemplate[] => {
  const list: DetailedTemplate[] = [];
  
  // Sourcing platforms mapped
  const platforms = ['linkedin', 'google', 'github', 'stackoverflow', 'indeed', 'dice', 'xing', 'monster', 'careerbuilder'];
  
  // Base locations to randomize/distribute
  const locations = [
    ['New York', 'Boston', 'Philadelphia'],
    ['San Francisco', 'San Jose', 'Oakland'],
    ['Chicago', 'Minneapolis', 'Detroit'],
    ['London', 'Manchester', 'Dublin'],
    ['Berlin', 'Munich', 'Frankfurt'],
    ['Austin', 'Dallas', 'Houston'],
    ['Seattle', 'Vancouver', 'Portland'],
    ['Bangalore', 'Hyderabad', 'Mumbai'],
    ['Sydney', 'Melbourne', 'Brisbane'],
    ['Singapore', 'Tokyo', 'Seoul']
  ];
  
  // Standard exclusions
  const basicExclusions = ['Manager', 'Director', 'VP', 'Recruiter', 'HR', 'Consultant', 'Agency', 'Freelance'];

  BASE_ROLES.forEach((base, baseIndex) => {
    // 8 variations per role to reach exactly 180 * 8 = 1440 templates!
    const variations = [
      { seniority: 'Junior', suffix: '' },
      { seniority: 'Junior', suffix: 'Associate' },
      { seniority: 'Mid', suffix: '' },
      { seniority: 'Mid', suffix: 'Specialist' },
      { seniority: 'Senior', suffix: '' },
      { seniority: 'Senior', suffix: 'Expert' },
      { seniority: 'Lead', suffix: '' },
      { seniority: 'Architect', suffix: '' }
    ] as const;

    variations.forEach((variant, index) => {
      const sen = variant.seniority;
      const suffix = variant.suffix;
      const displayName = suffix ? `${sen} ${base.name} (${suffix})` : `${sen} ${base.name}`;
      const id = `${base.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${sen.toLowerCase()}${suffix ? '-' + suffix.toLowerCase() : ''}`;
      
      // Select locations & exclusions
      const locList = locations[(baseIndex + index) % locations.length];
      const platform = platforms[(baseIndex + index) % platforms.length];
      
      const skillMix = [...base.skills];
      if (sen === 'Senior' || sen === 'Lead' || sen === 'Architect') {
        skillMix.unshift('Architecture', 'Team Lead', 'System Design');
      } else if (sen === 'Junior') {
        skillMix.push('Intern', 'Graduate');
      }

      // Filter out terms that appear in the job title or synonyms to prevent self-exclusion
      const cleanExclusions = basicExclusions.filter(exc => {
        const excLower = exc.toLowerCase();
        const nameLower = base.name.toLowerCase();
        const inName = nameLower.includes(excLower);
        const inSynonyms = base.synonyms.some(s => s.toLowerCase().includes(excLower));
        return !inName && !inSynonyms;
      });

      // Build precise and targeted title groups based on seniority to remain highly accurate, concise, and safe from limits
      let titleList: string[] = [];
      const cleanBaseName = base.name;
      const synonyms = base.synonyms;

      if (sen === 'Junior') {
        titleList.push(`"Junior ${cleanBaseName}"`);
        titleList.push(`"Associate ${cleanBaseName}"`);
        titleList.push(`"Entry Level ${cleanBaseName}"`);
        titleList.push(`"Graduate ${cleanBaseName}"`);
        synonyms.forEach(syn => {
          titleList.push(`"Junior ${syn}"`);
          titleList.push(`"Associate ${syn}"`);
        });
      } else if (sen === 'Senior') {
        titleList.push(`"Senior ${cleanBaseName}"`);
        titleList.push(`"Sr ${cleanBaseName}"`);
        titleList.push(`"Sr. ${cleanBaseName}"`);
        synonyms.forEach(syn => {
          titleList.push(`"Senior ${syn}"`);
          titleList.push(`"Sr ${syn}"`);
        });
      } else if (sen === 'Lead') {
        titleList.push(`"Lead ${cleanBaseName}"`);
        titleList.push(`"${cleanBaseName} Lead"`);
        titleList.push(`"Technical Lead ${cleanBaseName}"`);
        synonyms.forEach(syn => {
          titleList.push(`"Lead ${syn}"`);
        });
      } else if (sen === 'Architect') {
        titleList.push(`"${cleanBaseName} Architect"`);
        titleList.push(`"Solutions Architect ${cleanBaseName}"`);
        synonyms.forEach(syn => {
          titleList.push(`"${syn} Architect"`);
        });
      } else if (sen as string === 'Principal') {
        titleList.push(`"Principal ${cleanBaseName}"`);
        titleList.push(`"Staff ${cleanBaseName}"`);
        synonyms.forEach(syn => {
          titleList.push(`"Principal ${syn}"`);
          titleList.push(`"Staff ${syn}"`);
        });
      } else {
        // Mid / Specialist
        titleList.push(`"${cleanBaseName}"`);
        synonyms.forEach(syn => {
          titleList.push(`"${syn}"`);
        });
      }

      // Filter unique and limit to max 5 terms to prevent hitting LinkedIn's complexity/word count threshold
      const uniqueTitles = Array.from(new Set(titleList)).slice(0, 5);
      const titlesGroup = uniqueTitles.map(t => t).join(' OR ');

      // For standard LinkedIn keyword search, we must stay strictly under the 15-term limit to prevent "No results found"
      const uniqueTitlesLinkedin = Array.from(new Set(titleList)).slice(0, 2);
      const titlesGroupLinkedin = uniqueTitlesLinkedin.map(t => t).join(' OR ');
      const skillsLinkedin = base.skills.slice(0, 1).map(s => `"${s}"`).join(' AND ');
      const skillsGroup = base.skills.slice(0, 3).map(s => `"${s}"`).join(' AND ');
      
      const locGroup = locList.map(l => `"${l}"`).join(' OR ');

      // Build standard exclusions string for general engines
      const exclusionsStr = cleanExclusions.length > 0
        ? `AND NOT (${cleanExclusions.map(e => `"${e}"`).join(' OR ')})`
        : '';

      // Safe, noise-only exclusions for LinkedIn search box to prevent "0 results" because of over-excluding common words
      const safeExclusions = ['recruiter', 'agency', 'consultant', 'trainer', 'coach', 'hr', 'headhunter'];
      const cleanSafeExclusions = safeExclusions.filter(exc => {
        const excLower = exc.toLowerCase();
        const nameLower = base.name.toLowerCase();
        return !nameLower.includes(excLower) && !base.synonyms.some(s => s.toLowerCase().includes(excLower));
      });

      // LinkedIn flat and syntactically correct NOT exclusions linked with explicit "AND NOT" (never bare NOT)
      const exclusionsLinkedin = cleanSafeExclusions.slice(0, 1).map(e => `AND NOT "${e}"`).join(' ');

      // Create platforms optimized queries
      // 1. LinkedIn (Native Search) -> PURE Keyword Search, NO Locations inside keyword box, flat skills and flat explicit NOTs
      const queryLinkedin = makeLinkedInCompliant(`(${titlesGroupLinkedin}) ${skillsLinkedin ? 'AND ' + skillsLinkedin : ''} ${exclusionsLinkedin}`.trim());
      
      // 2. Google X-Ray Search -> Site restricted, needs locations
      const queryGoogleXray = `site:linkedin.com/in/ (${titlesGroup}) AND (${skillsGroup}) AND (${locGroup}) ${exclusionsStr}`;
      
      // 3. Raw Boolean Sourcing -> General search engines, includes locations
      const queryRaw = `(${titlesGroup}) AND (${skillsGroup}) AND (${locGroup}) ${exclusionsStr}`;

      let booleanQuery = '';
      if (platform === 'linkedin') {
        booleanQuery = queryLinkedin;
      } else if (platform === 'google') {
        booleanQuery = queryGoogleXray;
      } else {
        booleanQuery = queryRaw;
      }

      const diff: 'Beginner' | 'Intermediate' | 'Advanced' = 
        sen === 'Junior' ? 'Beginner' :
        (sen === 'Mid' ? 'Intermediate' : 'Advanced');

      // Unique detailed template object
      list.push({
        id,
        name: displayName,
        description: `Premium professional template designed to source ${sen.toLowerCase()}-level ${base.name.toLowerCase()} talent with specific verified skills and regional optimizations.`,
        targetPlatform: platform,
        booleanQuery,
        queries: {
          linkedin: queryLinkedin,
          googleXray: queryGoogleXray,
          raw: queryRaw
        },
        supportedOperators: ['AND', 'OR', 'NOT', '""', '()'],
        skills: skillMix,
        synonyms: base.synonyms.map(s => `${sen} ${s}`),
        jobTitles: [`${sen} ${base.name}`, ...base.synonyms.map(s => `${sen} ${s}`)],
        locations: locList,
        companies: ['Enterprise Systems', 'Tier 1 Banks', 'Global Consultancies', 'Tech Leaders'],
        exclusions: sen === 'Junior' ? ['Senior', 'Lead', 'Principal', ...cleanExclusions] : cleanExclusions,
        recommendedUsage: `Sourcing ${sen.toLowerCase()} specialists. Run this search query directly inside the target search box or search engines for highest accuracy. Modify exclusions if search results contain false-positives.`,
        estimatedResults: `${(index + 1) * 200} - ${(index + 2) * 1200} candidates`,
        difficulty: diff,
        category: mapCategory(base.category),
        seniority: sen,
        technology: base.tech,
        industry: base.ind,
        popularity: Math.floor(Math.random() * 40) + (sen === 'Senior' ? 55 : 40),
        lastUpdated: `2026-07-${10 + (baseIndex % 10)}`,
        usedCount: Math.floor(Math.random() * 200) + 15,
        isNew: baseIndex % 8 === 0
      });
    });
  });

  return list;
};
