const domains = [
  {
    name: 'Web Development',
    slug: 'web-development',
    shortDescription: 'Build modern, responsive websites and full-stack web applications.',
    icon: '🌐',
    color: '#6366f1',
    difficultyLevel: 'beginner',
    estimatedDuration: '4-6 months',
    prerequisites: ['Basic computer skills', 'Logical thinking'],
    careerRoles: ['Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'UI Developer'],
    order: 1,
    finalProject: { title: 'Full-Stack Web Application', description: 'Build a complete MERN stack web app' },
    suggestedNextDomain: 'DevOps Engineering',
    freeBenefits: [
      { title: 'GitHub Student Developer Pack', link: 'https://education.github.com/pack', platform: 'GitHub' },
      { title: 'Vercel Free Hosting', link: 'https://vercel.com/', platform: 'Vercel' },
      { title: 'Netlify Free Tier', link: 'https://www.netlify.com/', platform: 'Netlify' }
    ]
  },
  {
    name: 'Data Science',
    slug: 'data-science',
    shortDescription: 'Extract insights from data using Python, statistics, and machine learning.',
    icon: '📊',
    color: '#10b981',
    difficultyLevel: 'intermediate',
    estimatedDuration: '5-7 months',
    prerequisites: ['Basic Python', 'Mathematics basics'],
    careerRoles: ['Data Scientist', 'ML Engineer', 'Research Analyst', 'AI Engineer'],
    order: 2,
    finalProject: { title: 'End-to-End Data Science Project', description: 'Complete ML pipeline from data to deployment' },
    suggestedNextDomain: 'AI/ML Engineering',
    freeBenefits: [
      { title: 'Google Cloud Free Program', link: 'https://cloud.google.com/free', platform: 'Google Cloud' },
      { title: 'MongoDB Atlas Free Tier', link: 'https://www.mongodb.com/cloud/atlas/register', platform: 'MongoDB' }
    ]
  },
  {
    name: 'Data Analytics',
    slug: 'data-analytics',
    shortDescription: 'Analyze business data and create dashboards to drive decisions.',
    icon: '📈',
    color: '#f59e0b',
    difficultyLevel: 'beginner',
    estimatedDuration: '3-5 months',
    prerequisites: ['Basic Excel', 'Logical thinking'],
    careerRoles: ['Data Analyst', 'Business Analyst', 'BI Developer', 'Report Analyst'],
    order: 3,
    finalProject: { title: 'Business Analytics Dashboard', description: 'Interactive dashboard with real-world dataset' },
    suggestedNextDomain: 'Data Science',
    freeBenefits: [
      { title: 'Google Cloud Skills Boost', link: 'https://www.cloudskillsboost.google/', platform: 'Google Cloud' }
    ]
  },
  {
    name: 'DevOps Engineering',
    slug: 'devops-engineering',
    shortDescription: 'Automate, deploy, and scale software with CI/CD, Docker, and Kubernetes.',
    icon: '⚙️',
    color: '#ef4444',
    difficultyLevel: 'intermediate',
    estimatedDuration: '5-7 months',
    prerequisites: ['Linux basics', 'Any programming language'],
    careerRoles: ['DevOps Engineer', 'SRE', 'Platform Engineer', 'Cloud Engineer'],
    order: 4,
    finalProject: { title: 'Full DevOps Pipeline', description: 'CI/CD pipeline with Docker, K8s and monitoring' },
    suggestedNextDomain: 'Cloud Computing',
    freeBenefits: [
      { title: 'AWS Free Tier', link: 'https://aws.amazon.com/free/', platform: 'AWS' },
      { title: 'Render Free Tier', link: 'https://render.com/', platform: 'Render' }
    ]
  },
  {
    name: 'Cloud Computing',
    slug: 'cloud-computing',
    shortDescription: 'Master AWS, Azure, GCP and build scalable cloud architectures.',
    icon: '☁️',
    color: '#3b82f6',
    difficultyLevel: 'intermediate',
    estimatedDuration: '5-8 months',
    prerequisites: ['Networking basics', 'Linux basics'],
    careerRoles: ['Cloud Architect', 'Cloud Engineer', 'Solutions Architect', 'Cloud Consultant'],
    order: 5,
    finalProject: { title: 'Multi-Cloud Deployment Project', description: 'Deploy scalable app across cloud providers' },
    suggestedNextDomain: 'DevOps Engineering',
    freeBenefits: [
      { title: 'AWS Free Tier', link: 'https://aws.amazon.com/free/', platform: 'AWS' },
      { title: 'Azure for Students', link: 'https://azure.microsoft.com/free/students', platform: 'Azure' },
      { title: 'Google Cloud Free', link: 'https://cloud.google.com/free', platform: 'GCP' },
      { title: 'Oracle Cloud Free Tier', link: 'https://www.oracle.com/cloud/free/', platform: 'Oracle' }
    ]
  },
  {
    name: 'Cybersecurity',
    slug: 'cybersecurity',
    shortDescription: 'Protect systems and networks through ethical hacking and security practices.',
    icon: '🔒',
    color: '#8b5cf6',
    difficultyLevel: 'intermediate',
    estimatedDuration: '5-7 months',
    prerequisites: ['Networking basics', 'Linux basics'],
    careerRoles: ['Security Analyst', 'Ethical Hacker', 'Penetration Tester', 'SOC Analyst'],
    order: 6,
    finalProject: { title: 'Security Audit Project', description: 'Full vulnerability assessment of a test application' },
    suggestedNextDomain: 'Cloud Computing',
    freeBenefits: [
      { title: 'GitHub Student Developer Pack', link: 'https://education.github.com/pack', platform: 'GitHub' }
    ]
  },
  {
    name: 'App Development',
    slug: 'app-development',
    shortDescription: 'Build cross-platform mobile apps with Flutter or native Android/iOS.',
    icon: '📱',
    color: '#06b6d4',
    difficultyLevel: 'beginner',
    estimatedDuration: '4-6 months',
    prerequisites: ['Basic programming', 'OOP concepts'],
    careerRoles: ['Android Developer', 'iOS Developer', 'Flutter Developer', 'Mobile Engineer'],
    order: 7,
    finalProject: { title: 'Full Mobile Application', description: 'Cross-platform app with backend integration' },
    suggestedNextDomain: 'Web Development',
    freeBenefits: [
      { title: 'Firebase Free Tier', link: 'https://firebase.google.com/', platform: 'Firebase' }
    ]
  },
  {
    name: 'AI/ML Engineering',
    slug: 'ai-ml-engineering',
    shortDescription: 'Design, train, and deploy AI and machine learning models at scale.',
    icon: '🤖',
    color: '#ec4899',
    difficultyLevel: 'advanced',
    estimatedDuration: '6-9 months',
    prerequisites: ['Python', 'Statistics', 'Linear Algebra'],
    careerRoles: ['ML Engineer', 'AI Researcher', 'Deep Learning Engineer', 'NLP Engineer'],
    order: 8,
    finalProject: { title: 'End-to-End AI/ML Project', description: 'Train and deploy a production ML model' },
    suggestedNextDomain: 'Data Science',
    freeBenefits: [
      { title: 'Google Cloud Free Program', link: 'https://cloud.google.com/free', platform: 'GCP' },
      { title: 'Google Cloud Skills Boost', link: 'https://www.cloudskillsboost.google/', platform: 'GCP' }
    ]
  },
  {
    name: 'Blockchain Development',
    slug: 'blockchain-development',
    shortDescription: 'Build decentralized apps, smart contracts, and Web3 solutions.',
    icon: '⛓️',
    color: '#f97316',
    difficultyLevel: 'advanced',
    estimatedDuration: '5-7 months',
    prerequisites: ['JavaScript', 'Basic cryptography', 'OOP'],
    careerRoles: ['Blockchain Developer', 'Smart Contract Engineer', 'Web3 Developer', 'DApp Developer'],
    order: 9,
    finalProject: { title: 'Decentralized Application (DApp)', description: 'Full DApp with Solidity smart contracts' },
    suggestedNextDomain: 'Web Development',
    freeBenefits: [
      { title: 'Alchemy Free Tier', link: 'https://www.alchemy.com/', platform: 'Alchemy' }
    ]
  },
  {
    name: 'UI/UX Design',
    slug: 'ui-ux-design',
    shortDescription: 'Design beautiful, user-centered digital experiences and interfaces.',
    icon: '🎨',
    color: '#a855f7',
    difficultyLevel: 'beginner',
    estimatedDuration: '3-5 months',
    prerequisites: ['Creativity', 'Basic computer skills'],
    careerRoles: ['UI Designer', 'UX Designer', 'Product Designer', 'Interaction Designer'],
    order: 10,
    finalProject: { title: 'Design Portfolio Project', description: 'Complete UI/UX case study with Figma prototype' },
    suggestedNextDomain: 'Web Development',
    freeBenefits: [
      { title: 'Figma Education Plan', link: 'https://www.figma.com/education/', platform: 'Figma' }
    ]
  },
  {
    name: 'Database Administration',
    slug: 'database-administration',
    shortDescription: 'Manage, optimize, and secure databases for enterprise applications.',
    icon: '🗄️',
    color: '#14b8a6',
    difficultyLevel: 'intermediate',
    estimatedDuration: '4-6 months',
    prerequisites: ['Basic SQL', 'Computer fundamentals'],
    careerRoles: ['Database Administrator', 'DB Developer', 'Data Engineer', 'DB Architect'],
    order: 11,
    finalProject: { title: 'Enterprise Database Project', description: 'Design and optimize a production-grade database' },
    suggestedNextDomain: 'Data Science',
    freeBenefits: [
      { title: 'MongoDB Atlas Free Tier', link: 'https://www.mongodb.com/cloud/atlas/register', platform: 'MongoDB' }
    ]
  },
  {
    name: 'Software Testing / QA',
    slug: 'software-testing-qa',
    shortDescription: 'Ensure software quality through manual testing, automation, and QA processes.',
    icon: '🧪',
    color: '#84cc16',
    difficultyLevel: 'beginner',
    estimatedDuration: '3-5 months',
    prerequisites: ['Basic computer knowledge', 'Attention to detail'],
    careerRoles: ['QA Engineer', 'Test Analyst', 'Automation Engineer', 'SDET'],
    order: 12,
    finalProject: { title: 'Full QA Project', description: 'Complete test suite with manual and automated tests' },
    suggestedNextDomain: 'DevOps Engineering',
    freeBenefits: [
      { title: 'GitHub Student Developer Pack', link: 'https://education.github.com/pack', platform: 'GitHub' }
    ]
  },
  {
    name: 'Competitive Programming / DSA',
    slug: 'competitive-programming-dsa',
    shortDescription: 'Master data structures, algorithms, and competitive coding for top tech interviews.',
    icon: '🏆',
    color: '#eab308',
    difficultyLevel: 'intermediate',
    estimatedDuration: '4-6 months',
    prerequisites: ['Any programming language basics'],
    careerRoles: ['Software Engineer', 'Algorithm Developer', 'Backend Developer', 'Product Engineer'],
    order: 13,
    finalProject: { title: 'DSA Challenge Competition', description: 'Compete in HackerRank/LeetCode contest' },
    suggestedNextDomain: 'Web Development',
    freeBenefits: [
      { title: 'GitHub Student Developer Pack', link: 'https://education.github.com/pack', platform: 'GitHub' }
    ]
  },
  {
    name: 'Open Source Contribution',
    slug: 'open-source-contribution',
    shortDescription: 'Contribute to real-world projects, build your portfolio, and join the open source community.',
    icon: '🌱',
    color: '#22c55e',
    difficultyLevel: 'beginner',
    estimatedDuration: '2-4 months',
    prerequisites: ['Git basics', 'Any programming language'],
    careerRoles: ['Open Source Developer', 'Software Engineer', 'Community Contributor'],
    order: 14,
    finalProject: { title: 'Open Source Portfolio', description: 'Merged PRs across 3+ popular repositories' },
    suggestedNextDomain: 'Web Development',
    freeBenefits: [
      { title: 'GitHub Student Developer Pack', link: 'https://education.github.com/pack', platform: 'GitHub' }
    ]
  }
];

module.exports = domains;
