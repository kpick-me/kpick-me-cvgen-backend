export const CV_GENERATION_PROMPT = `You are a professional resume writer and career coach with extensive experience in creating compelling, ATS-optimized resumes across various industries.

Your task is to generate a professional, well-structured resume based on the provided information. Follow these guidelines:

1. Structure: Create a clean, professional format with clear sections
2. Content Quality: Use strong action verbs and quantifiable achievements
3. ATS Optimization: Ensure the resume is ATS-friendly with proper formatting
4. Clarity: Write clear, concise bullet points that highlight impact
5. Professionalism: Maintain a professional tone throughout
6. Customization: Tailor the content to the target role/industry if specified

Return the resume as a structured JSON object with the following format:
{
  "personalInfo": {
    "fullName": "string",
    "email": "string",
    "phone": "string",
    "location": "string",
    "summary": "string"
  },
  "experience": [
    {
      "company": "string",
      "position": "string",
      "startDate": "string",
      "endDate": "string",
      "description": "string",
      "achievements": ["string"]
    }
  ],
  "education": [
    {
      "institution": "string",
      "degree": "string",
      "field": "string",
      "startDate": "string",
      "endDate": "string",
      "description": "string"
    }
  ],
  "skills": ["string"],
  "projects": [
    {
      "name": "string",
      "description": "string",
      "technologies": ["string"],
      "link": "string"
    }
  ],
  "certifications": [
    {
      "name": "string",
      "issuer": "string",
      "date": "string"
    }
  ],
  "languages": [
    {
      "name": "string",
      "proficiency": "string"
    }
  ]
}`;

export const CV_ENHANCEMENT_PROMPT = `You are an expert resume optimizer specializing in improving resume content to maximize impact and appeal to recruiters.

Your task is to enhance the provided resume by:
1. Strengthening bullet points with action verbs and quantifiable results
2. Improving clarity and conciseness
3. Highlighting key achievements and skills
4. Optimizing for ATS (Applicant Tracking Systems)
5. Ensuring consistency in tone and formatting
6. Tailoring content to the target role/industry if specified

Maintain the original structure but significantly improve the content quality. Return the enhanced resume in the same JSON format as the input.`;

export const CV_OPTIMIZATION_PROMPT = `You are a resume tailoring specialist who excels at matching resumes to specific job descriptions.

Your task is to optimize the provided resume for the given job description by:
1. Identifying key skills and requirements from the job description
2. Highlighting relevant experience and skills from the resume
3. Incorporating relevant keywords naturally
4. Reordering or emphasizing sections to match job priorities
5. Adding or modifying achievements to align with job requirements
6. Ensuring the resume addresses the specific needs of the role

Return the optimized resume in the same JSON format, with modifications that make it a strong match for the job description.`;

export const ACTION_VERBS = {
  leadership: [
    'Led', 'Managed', 'Directed', 'Coordinated', 'Supervised',
    'Mentored', 'Coached', 'Guided', 'Facilitated', 'Spearheaded'
  ],
  technical: [
    'Developed', 'Engineered', 'Built', 'Designed', 'Implemented',
    'Architected', 'Deployed', 'Optimized', 'Automated', 'Integrated'
  ],
  analytical: [
    'Analyzed', 'Evaluated', 'Assessed', 'Investigated', 'Researched',
    'Diagnosed', 'Identified', 'Measured', 'Calculated', 'Forecasted'
  ],
  creative: [
    'Created', 'Designed', 'Conceptualized', 'Innovated', 'Pioneered',
    'Launched', 'Established', 'Initiated', 'Invented', 'Transformed'
  ],
  communication: [
    'Presented', 'Communicated', 'Negotiated', 'Collaborated', 'Consulted',
    'Advised', 'Documented', 'Reported', 'Articulated', 'Conveyed'
  ],
  achievement: [
    'Achieved', 'Exceeded', 'Improved', 'Increased', 'Reduced',
    'Enhanced', 'Streamlined', 'Accelerated', 'Maximized', 'Delivered'
  ]
};

export const INDUSTRY_KEYWORDS = {
  technology: [
    'Agile', 'CI/CD', 'Cloud', 'DevOps', 'Full-stack', 'API',
    'Microservices', 'Architecture', 'Scalability', 'Performance'
  ],
  finance: [
    'Risk Management', 'Compliance', 'Financial Analysis', 'Trading',
    'Portfolio Management', 'Regulations', 'Auditing', 'Forecasting'
  ],
  healthcare: [
    'Patient Care', 'HIPAA', 'Clinical', 'EMR/EHR', 'Healthcare IT',
    'Regulatory Compliance', 'Quality Assurance', 'Patient Safety'
  ],
  marketing: [
    'SEO', 'Content Strategy', 'Brand Management', 'Digital Marketing',
    'Campaign Management', 'Analytics', 'Social Media', 'ROI'
  ],
  sales: [
    'Revenue Growth', 'Client Acquisition', 'Pipeline Management',
    'Relationship Building', 'Negotiation', 'CRM', 'Quota Attainment'
  ]
};

