# Usage Examples for AI Resume Generation

## Table of Contents
1. [Authentication](#authentication)
2. [Generate New Resume](#generate-new-resume)
3. [Enhance Existing Resume](#enhance-existing-resume)
4. [Optimize for Job](#optimize-for-job)
5. [Complete Workflow](#complete-workflow)

## Authentication

All endpoints require JWT authentication. First, authenticate with Google OAuth:

```bash
curl -X GET "http://localhost:3000/auth/google"
```

### Deployment notes (OAuth redirect)

When deployed, ensure your backend and frontend environment variables and Google OAuth settings are configured so the flow redirects back to the frontend correctly:

- Backend env vars (e.g. Railway):
  - `BACKEND_URL` = https://kpick-me-back.up.railway.app (used to compute OAuth callback when `GOOGLE_CALLBACK_URL` not set)
  - `FRONTEND_URL` = https://kpick-me-cvgen-frontend.vercel.app (optional but recommended; if set the backend will always redirect to this origin after successful OAuth)
  - `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
  - (optional) `GOOGLE_CALLBACK_URL` = https://kpick-me-back.up.railway.app/auth/google/callback — if present this overrides the `BACKEND_URL`-derived callback URL

- Google Cloud Console (Credentials) settings:
  - Authorized redirect URI: `https://kpick-me-back.up.railway.app/auth/google/callback`
  - Authorized origin (if used): `https://kpick-me-cvgen-frontend.vercel.app`

The backend will attempt to derive the frontend origin from `FRONTEND_URL` first. If `FRONTEND_URL` is not set the backend will try to use `X-Forwarded-Proto` and `X-Forwarded-Host` headers (useful when behind proxies such as Railway / Vercel), then `Origin`, and finally `req.protocol` + `req.get('host')` as a fallback. The frontend expects the redirect to land at `/auth/success?token=JWT_TOKEN` where it will persist the token.


After successful authentication, use the JWT token in all subsequent requests:

```bash
Authorization: Bearer <your_jwt_token>
```

## Generate New Resume

### Basic Generation

```bash
curl -X POST "http://localhost:3000/ai/generate-cv" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe",
    "email": "john.doe@example.com",
    "phone": "+1-555-0123",
    "location": "San Francisco, CA",
    "summary": "Passionate software engineer with 5 years of experience in full-stack development",
    "experience": [
      {
        "company": "Tech Innovations Inc",
        "position": "Senior Software Engineer",
        "startDate": "2020-03",
        "endDate": "2023-12",
        "description": "Led development of cloud-based microservices",
        "achievements": [
          "Reduced API response time by 60%",
          "Mentored team of 4 junior developers",
          "Implemented CI/CD pipeline reducing deployment time by 75%"
        ]
      },
      {
        "company": "StartupXYZ",
        "position": "Full Stack Developer",
        "startDate": "2018-06",
        "endDate": "2020-02",
        "description": "Developed web applications using React and Node.js",
        "achievements": [
          "Built customer dashboard serving 10K+ users",
          "Improved application performance by 40%"
        ]
      }
    ],
    "education": [
      {
        "institution": "University of California",
        "degree": "Bachelor of Science",
        "field": "Computer Science",
        "startDate": "2014-09",
        "endDate": "2018-05",
        "description": "GPA: 3.8/4.0, Dean'\''s List"
      }
    ],
    "skills": [
      "JavaScript", "TypeScript", "React", "Node.js",
      "Python", "AWS", "Docker", "Kubernetes",
      "PostgreSQL", "MongoDB", "Redis"
    ],
    "projects": [
      {
        "name": "E-Commerce Platform",
        "description": "Full-featured e-commerce solution with payment integration",
        "technologies": ["React", "Node.js", "Stripe", "AWS"],
        "link": "https://github.com/johndoe/ecommerce"
      }
    ],
    "certifications": [
      {
        "name": "AWS Certified Solutions Architect",
        "issuer": "Amazon Web Services",
        "date": "2022-08"
      }
    ],
    "languages": [
      {
        "name": "English",
        "proficiency": "Native"
      },
      {
        "name": "Spanish",
        "proficiency": "Intermediate"
      }
    ],
    "targetRole": "Senior Full Stack Engineer",
    "targetIndustry": "Technology"
  }'
```

### Generate and Save to Database

```bash
curl -X POST "http://localhost:3000/cv/generate-with-ai" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Jane Smith",
    "email": "jane.smith@example.com",
    "experience": [...],
    "education": [...],
    "skills": [...],
    "targetRole": "Frontend Architect"
  }'
```

## Enhance Existing Resume

### Enhance CV from AI Service

```bash
curl -X POST "http://localhost:3000/ai/enhance-cv" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "cvData": {
      "personalInfo": {
        "fullName": "John Doe",
        "email": "john@example.com",
        "summary": "Software engineer with experience"
      },
      "experience": [
        {
          "company": "Tech Corp",
          "position": "Developer",
          "startDate": "2020-01",
          "endDate": "2023-12",
          "description": "Worked on various projects",
          "achievements": ["Built features", "Fixed bugs"]
        }
      ],
      "skills": ["JavaScript", "React"]
    },
    "targetRole": "Engineering Manager",
    "targetIndustry": "SaaS",
    "focusAreas": ["leadership", "architecture", "mentoring"]
  }'
```

### Enhance Existing CV in Database

```bash
curl -X POST "http://localhost:3000/cv/cv_id_here/enhance-with-ai" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "targetRole": "Tech Lead",
    "targetIndustry": "FinTech",
    "focusAreas": ["team leadership", "system architecture", "security"]
  }'
```

## Optimize for Job

### Optimize CV from AI Service

```bash
curl -X POST "http://localhost:3000/ai/optimize-cv" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "cvData": {
      "personalInfo": {...},
      "experience": [...],
      "education": [...],
      "skills": [...]
    },
    "jobDescription": "We are seeking a Senior Full Stack Engineer with 5+ years of experience in React, Node.js, and cloud technologies. The ideal candidate will have:\n\n- Strong proficiency in JavaScript/TypeScript\n- Experience with AWS or Azure\n- Expertise in building scalable microservices\n- Leadership experience mentoring junior developers\n- Excellent communication skills\n\nResponsibilities:\n- Lead development of new features\n- Architect scalable solutions\n- Mentor team members\n- Collaborate with product team"
  }'
```

### Optimize Existing CV in Database

```bash
curl -X POST "http://localhost:3000/cv/cv_id_here/optimize-for-job" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "jobDescription": "Senior Backend Engineer position requiring expertise in Python, Django, PostgreSQL, and AWS. Must have experience with microservices architecture and RESTful APIs..."
  }'
```

## Complete Workflow

### 1. Generate Resume

```javascript
const generateResponse = await fetch('http://localhost:3000/cv/generate-with-ai', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    fullName: "Alice Johnson",
    email: "alice@example.com",
    experience: [{
      company: "TechCorp",
      position: "Software Engineer",
      startDate: "2019-01",
      endDate: "2023-12",
      description: "Developed web applications",
      achievements: ["Increased performance by 50%"]
    }],
    education: [{
      institution: "MIT",
      degree: "BS",
      field: "Computer Science",
      startDate: "2015-09",
      endDate: "2019-05"
    }],
    skills: ["Python", "Django", "PostgreSQL"],
    targetRole: "Backend Engineer"
  })
});

const generatedCV = await generateResponse.json();
console.log('Generated CV ID:', generatedCV.id);
```

### 2. Enhance the Resume

```javascript
const enhanceResponse = await fetch(`http://localhost:3000/cv/${generatedCV.id}/enhance-with-ai`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    targetRole: "Senior Backend Engineer",
    focusAreas: ["scalability", "performance", "API design"]
  })
});

const enhancedCV = await enhanceResponse.json();
```

### 3. Optimize for Specific Job

```javascript
const jobDescription = `
Senior Backend Engineer
We're looking for an experienced backend engineer...
Requirements:
- 5+ years Python experience
- Django/Flask expertise
- PostgreSQL optimization
- AWS deployment
- Microservices architecture
`;

const optimizeResponse = await fetch(`http://localhost:3000/cv/${generatedCV.id}/optimize-for-job`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    jobDescription
  })
});

const optimizedCV = await optimizeResponse.json();
```

### 4. Export Resume

```javascript
const pdfResponse = await fetch(`http://localhost:3000/cv/${generatedCV.id}/export/pdf`, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const pdfBlob = await pdfResponse.blob();
```

## Testing with Postman

### Collection Setup

1. Create a new collection: "Resume AI"
2. Add environment variable: `baseUrl` = `http://localhost:3000`
3. Add environment variable: `token` = `<your_jwt_token>`

### Example Requests

**Generate CV**
- Method: POST
- URL: `{{baseUrl}}/ai/generate-cv`
- Headers: `Authorization: Bearer {{token}}`
- Body: JSON (see examples above)

**Enhance CV**
- Method: POST
- URL: `{{baseUrl}}/cv/{{cvId}}/enhance-with-ai`
- Headers: `Authorization: Bearer {{token}}`
- Body: JSON with enhancement options

**Check AI Status**
- Method: GET
- URL: `{{baseUrl}}/ai/status`
- Headers: `Authorization: Bearer {{token}}`

## Response Examples

### Generated CV Response

```json
{
  "id": "clx123abc",
  "userId": "user_123",
  "content": {
    "title": "John Doe - Resume",
    "body": {
      "personalInfo": {
        "fullName": "John Doe",
        "email": "john@example.com",
        "phone": "+1-555-0123",
        "location": "San Francisco, CA",
        "summary": "Results-driven Senior Software Engineer with 5+ years of experience..."
      },
      "experience": [...],
      "education": [...],
      "skills": [...],
      "projects": [...]
    },
    "metadata": {
      "model": "claude-sonnet-4",
      "generatedAt": "2025-11-07T10:30:00Z",
      "targetRole": "Senior Full Stack Engineer"
    }
  },
  "template": "ai-generated",
  "version": 1,
  "createdAt": "2025-11-07T10:30:00Z"
}
```

### Enhanced CV Response

```json
{
  "id": "clx123abc",
  "content": {
    "title": "Enhanced Resume",
    "body": {
      "personalInfo": {
        "summary": "Strategic Engineering Manager with proven track record of leading high-performing teams..."
      },
      "experience": [
        {
          "achievements": [
            "Spearheaded migration to microservices architecture, reducing system latency by 60%",
            "Led cross-functional team of 8 engineers, delivering 3 major product releases",
            "Established code review practices improving code quality by 45%"
          ]
        }
      ]
    },
    "metadata": {
      "model": "claude-sonnet-4",
      "enhancedAt": "2025-11-07T10:35:00Z",
      "targetRole": "Engineering Manager"
    }
  }
}
```

## Error Handling

### Invalid Request

```json
{
  "statusCode": 400,
  "message": ["fullName should not be empty"],
  "error": "Bad Request"
}
```

### Unauthorized

```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

### AI Service Error

```json
{
  "statusCode": 500,
  "message": "Failed to generate CV with AI."
}
```

## Best Practices

1. **Always provide detailed information**: More details = better AI output
2. **Use quantifiable achievements**: Include numbers, percentages, metrics
3. **Specify target role/industry**: Helps AI tailor the content
4. **Cache awareness**: Identical requests return cached results (faster)
5. **Iterate**: Generate → Enhance → Optimize for best results
6. **Test job descriptions**: Use real job postings for optimization

## Rate Limiting

Consider implementing rate limiting for production:
- Max 10 requests per minute per user
- Max 100 requests per day per user
- Cached responses don't count toward limits

