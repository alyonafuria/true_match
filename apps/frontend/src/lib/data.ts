import type { Job, Application, UserProfile, Payment, VerificationClaim, FAQItem } from '@/types';

export const sampleJobs: Job[] = [
  {
    id: '1',
    title: 'Senior Frontend Developer',
    company: 'Innovatech Solutions',
    location: 'Remote',
    description: 'Join our dynamic team to build cutting-edge web applications using modern frontend technologies. You will be responsible for developing and maintaining user interfaces, collaborating with backend developers, and ensuring high performance and responsiveness.',
    requiredSkills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS'],
    postedDate: '2024-07-15',
    status: 'open',
    fitPercentage: 85, // Example for job seeker
    applicantsCount: 25, // Example for employer
    responsibilities: [
      "Develop new user-facing features using React.js",
      "Build reusable components and front-end libraries for future use",
      "Translate designs and wireframes into high-quality code",
      "Optimize components for maximum performance across a vast array of web-capable devices and browsers"
    ],
    qualifications: [
      "Strong proficiency in JavaScript, including DOM manipulation and the JavaScript object model",
      "Thorough understanding of React.js and its core principles",
      "Experience with popular React.js workflows (such as Flux or Redux)",
      "Familiarity with newer specifications of EcmaScript",
      "Experience with data structure libraries (e.g., Immutable.js)",
      "Knowledge of modern authorization mechanisms, such as JSON Web Token",
      "Familiarity with modern front-end build pipelines and tools",
      "Experience with common front-end development tools such as Babel, Webpack, NPM, etc.",
      "Ability to understand business requirements and translate them into technical requirements",
      "A knack for benchmarking and optimization"
    ],
    salaryRange: "$120,000 - $150,000 Annually"
  },
  {
    id: '2',
    title: 'Product Manager',
    company: 'Synergy Corp',
    location: 'New York, NY',
    description: 'We are seeking an experienced Product Manager to lead the development of our new SaaS platform. You will define product vision, strategy, and roadmap, working closely with engineering, design, and marketing teams.',
    requiredSkills: ['Product Strategy', 'Agile', 'Market Research', 'JIRA'],
    postedDate: '2024-07-10',
    status: 'open',
    fitPercentage: 70,
    applicantsCount: 42,
  },
  {
    id: '3',
    title: 'UX/UI Designer',
    company: 'Creative Visions',
    location: 'San Francisco, CA (Hybrid)',
    description: 'Design intuitive and engaging user experiences for mobile and web applications. Create wireframes, prototypes, and high-fidelity mockups, and conduct user research to validate design decisions.',
    requiredSkills: ['Figma', 'User Research', 'Prototyping', 'Adobe XD'],
    postedDate: '2024-07-20',
    status: 'open',
    fitPercentage: 92,
    applicantsCount: 18,
  },
];

export const sampleUserApplications: Application[] = [
  {
    id: 'app1',
    job: sampleJobs[0],
    appliedDate: '2024-07-18',
    status: 'Interviewing',
    fitPercentage: 85,
  },
  {
    id: 'app2',
    job: sampleJobs[1],
    appliedDate: '2024-07-12',
    status: 'Applied',
    fitPercentage: 70,
  },
];

export const sampleUserProfile: UserProfile = {
  id: 'user1',
  name: 'Alex Johnson',
  email: 'alex.johnson@example.com',
  headline: 'Full Stack Developer | Cloud Enthusiast',
  summary: 'Experienced Full Stack Developer with a passion for creating scalable and efficient web applications. Proficient in JavaScript, Python, and cloud technologies like AWS and Docker.',
  cvUrl: '/path/to/alex_johnson_cv.pdf',
  parsedInfo: {
    contact: 'alex.johnson@example.com | (555) 123-4567',
    experience: [
      { title: 'Software Engineer', company: 'Tech Solutions Inc.', dates: '2021-Present', description: 'Developed and maintained key features for a flagship SaaS product.', verified: true },
      { title: 'Junior Developer', company: 'Web Wizards LLC', dates: '2019-2021', description: 'Assisted in developing client websites and internal tools.', verified: true },
    ],
    education: [
      { degree: 'B.S. Computer Science', institution: 'State University', dates: '2015-2019', verified: true },
    ],
  },
  skills: [
    { name: 'JavaScript', verified: true },
    { name: 'React', verified: true },
    { name: 'Node.js', verified: true },
    { name: 'Python', verified: false },
    { name: 'AWS', verified: true },
  ],
  verificationStatus: 'Verified',
};

export const sampleEmployerPayments: Payment[] = [
  { id: 'pay1', jobPostId: 'job123', jobTitle: 'Senior Backend Engineer', amount: 99.00, date: '2024-07-01', status: 'Paid', method: 'Cardano' },
  { id: 'pay2', jobPostId: 'job456', jobTitle: 'Marketing Manager', amount: 49.00, date: '2024-07-15', status: 'Pending', method: 'Card' },
];

export const sampleVerificationQueue: VerificationClaim[] = [
  { id: 'claim1', candidateName: 'Jane Doe', candidateId: 'user2', claimType: 'Experience', details: 'Product Manager at Alpha Corp, 2018-2022', company: 'Alpha Corp', title: 'Product Manager', dates: '2018-2022', status: 'Pending', submittedDate: '2024-07-20' },
  { id: 'claim2', candidateName: 'John Smith', candidateId: 'user3', claimType: 'Education', details: 'M.Sc. Data Science from Tech Institute', status: 'Pending', submittedDate: '2024-07-21' },
  { id: 'claim3', candidateName: 'Alice Brown', candidateId: 'user4', claimType: 'Skill', details: 'Certified Kubernetes Administrator', status: 'Approved', submittedDate: '2024-07-19' },
];

export const sampleEmployerJobs: Job[] = [
  { ...sampleJobs[0], id: 'empJob1', applicantsCount: 25 },
  { ...sampleJobs[1], id: 'empJob2', applicantsCount: 10, status: 'closed' },
];

export const faqData: FAQItem[] = [
  {
    question: "How does TrueMatch work?",
    answer: "TrueMatch uses advanced algorithms and verifiable credentials to match job seekers with the best job opportunities. We analyze skills, experience, and preferences to provide accurate fit percentages."
  },
  {
    question: "What is verification and why is it important?",
    answer: "Verification confirms the authenticity of claims made on a CV, such as work experience, education, and skills. This builds trust and helps employers make more informed hiring decisions."
  },
  {
    question: "How is the fit percentage calculated?",
    answer: "The fit percentage is calculated by comparing a candidate's verified skills and experience against the requirements of a job posting. Our AI models consider various factors to provide a comprehensive match score."
  },
  {
    question: "How is my privacy protected?",
    answer: "We take privacy seriously. Your personal data is encrypted and handled with the utmost care. You have control over what information is shared and with whom. Please refer to our Privacy Policy for more details."
  },
  {
    question: "What payment methods are accepted for employers?",
    answer: "Employers can pay for job postings using major credit cards or Cardano (ADA). We are continuously working to expand our payment options."
  }
];

// Placeholder for applicants for a specific job
export const sampleApplicants = [
  { id: 'applicant1', name: 'Bob Williams', fitPercentage: 90, cvUrl: '#', status: 'Shortlisted' },
  { id: 'applicant2', name: 'Charlie Davis', fitPercentage: 82, cvUrl: '#', status: 'Applied' },
  { id: 'applicant3', name: 'Diana Miller', fitPercentage: 75, cvUrl: '#', status: 'Contacted' },
];
