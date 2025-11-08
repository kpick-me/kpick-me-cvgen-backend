# KPick-Me CV Generator Backend

AI-powered job search platform helping students find employment through CV generation, interview simulation, and skills training.

## Technologies

- NestJS + TypeScript
- PostgreSQL (Railway) + Prisma ORM
- Claude Sonnet 4 AI
- Redis (optional caching)
- Google OAuth
- JWT authentication

## Quick Start

```bash
npm install
npx prisma generate
npm run start:dev
```

Server runs at `http://localhost:3000`

## Environment Variables

Create `.env` file:

```env
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key-min-32-chars
ANTHROPIC_API_KEY=sk-ant-...
FRONTEND_URL=http://localhost:5173
REDIS_URL=redis://localhost:6379
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

## Demo Login

1. Visit `/auth/google`
2. Login with Google account
3. Access dashboard at `/dashboard`

## Features

### Dashboard (`/dashboard`)
- User statistics and progress
- Quick actions
- Recent activity

### CV Builder (`/cv`)
- Wizard with validation (`POST /cv/wizard`)
- 3 templates: Modern, Classic, Creative
- AI generation (`POST /cv/generate-with-ai`)
- Preview (`GET /cv/:id/preview?template=modern`)
- Export: PDF, DOCX, JSON

### Interview Simulator (`/interviews`)
- 8 interview questions
- Timer tracking per question
- Scoring and feedback
- Summary report

### Training (`/training`)
- 3 quizzes: JavaScript, TypeScript, React
- Progress tracking
- Score calculation
- Completion status

### User Profile (`/users`)
- Profile view (`GET /users/me`)
- Data export (`GET /users/me/export`)
- Account deletion (`DELETE /users/me`)

## API Endpoints

**Auth:**
- `GET /auth/google` - OAuth login
- `GET /auth/google/callback` - OAuth callback
- `GET /auth/me` - Current user

**Dashboard:**
- `GET /dashboard` - User dashboard
- `GET /dashboard/stats` - Statistics

**CV:**
- `POST /cv/wizard` - Create via wizard
- `GET /cv/templates` - Available templates
- `GET /cv/:id/preview` - Preview with template
- `POST /cv/generate-with-ai` - AI generation
- `POST /cv/:id/enhance-with-ai` - AI enhancement
- `GET /cv/:id/export/pdf` - Export PDF
- `GET /cv/:id/export/docx` - Export DOCX

**Interview:**
- `POST /interviews/start` - Start interview
- `POST /interviews/:id/answer` - Submit answer
- `GET /interviews/:id` - Get results

**Training:**
- `GET /training/challenges` - List quizzes
- `POST /training/submit` - Submit quiz
- `GET /training/progress` - User progress

**User:**
- `GET /users/me/export` - Export all data
- `DELETE /users/me` - Delete account

## Data Storage

All data stored in PostgreSQL:
- `user` - User profiles (email, name, Google ID)
- `cv` - Generated CVs (content, template, metadata)
- `interview` - Interview sessions (questions, answers, scores)
- `training_progress` - Quiz results (scores, attempts)

### Data Privacy

- No plain passwords (Google OAuth only)
- User can export all data (GDPR compliance)
- User can delete account and all data
- No analytics by default
- All endpoints require authentication

### Data Deletion

```bash
curl -X DELETE http://localhost:3000/users/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Example Flows

### Create CV with Wizard

```bash
curl -X POST http://localhost:3001/cv/wizard \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "location": "New York, USA",
    "summary": "Full-stack developer with 5 years of experience",
    "skills": ["JavaScript", "React", "Node.js", "TypeScript", "PostgreSQL"],
    "experience": [
      {
        "position": "Senior Developer",
        "company": "Tech Corp",
        "startDate": "2020-01",
        "endDate": "Present",
        "description": "Led frontend development team"
      }
    ],
    "education": [
      {
        "degree": "Bachelor of Science",
        "field": "Computer Science",
        "institution": "University",
        "startDate": "2015",
        "endDate": "2019"
      }
    ],
    "template": "modern"
  }'
```

Response:
```json
{
  "id": "clxxx123",
  "userId": "user123",
  "template": "modern",
  "content": {
    "title": "John Doe - Resume",
    "body": {
      "personalInfo": {...},
      "experience": [...],
      "education": [...],
      "skills": [...]
    }
  },
  "createdAt": "2025-11-07T10:00:00.000Z"
}
```

### Generate CV with AI

```bash
curl -X POST http://localhost:3001/cv/generate-with-ai \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Jane Smith",
    "email": "jane@example.com",
    "targetRole": "Frontend Developer",
    "targetIndustry": "E-commerce",
    "skills": ["React", "TypeScript", "Redux"],
    "experience": [
      {
        "position": "Frontend Developer",
        "company": "StartupXYZ",
        "startDate": "2021-01",
        "endDate": "2024-01",
        "description": "Built responsive web applications"
      }
    ]
  }'
```

### Export CV to PDF

```bash
curl -X GET "http://localhost:3001/cv/clxxx123/export/pdf" \
  -H "Authorization: Bearer TOKEN" \
  --output resume.pdf
```

### Start Interview

```bash
curl -X POST http://localhost:3001/interviews/start \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"role": "Frontend Developer", "cvId": "clxxx123"}'
```

Response:
```json
{
  "id": "interview123",
  "role": "Frontend Developer",
  "questions": [
    {
      "question": "Tell me about yourself and your background",
      "answer": "",
      "feedback": "",
      "score": 0,
      "timeSpent": 0
    },
    ...
  ],
  "overallScore": 0,
  "summary": "",
  "createdAt": "2025-11-07T10:05:00.000Z"
}
```

### Submit Interview Answer

```bash
curl -X POST http://localhost:3001/interviews/interview123/answer \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "questionIndex": 0,
    "answer": "I am a passionate developer with 5 years of experience...",
    "timeSpent": 120
  }'
```

Response:
```json
{
  "id": "interview123",
  "questions": [
    {
      "question": "Tell me about yourself and your background",
      "answer": "I am a passionate developer...",
      "feedback": "Strong answer demonstrating good understanding",
      "score": 8,
      "timeSpent": 120
    },
    ...
  ],
  "overallScore": 80,
  "summary": "1/8 questions answered"
}
```

### Take Training Quiz

```bash
curl -X POST http://localhost:3001/training/submit \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"challengeId": "1", "solution": [0, 1, 1]}'
```

Response:
```json
{
  "id": "progress123",
  "challengeId": "1",
  "challengeType": "quiz",
  "status": "completed",
  "score": 100,
  "attempts": 1,
  "submittedAt": "2025-11-07T10:10:00.000Z"
}
```

## Bonus Features Implemented

- TypeScript (+1.5 points)
- Multiple export formats: PDF, DOCX, JSON (+3 points)
- Multiple CV templates (+implicit)
- AI integration beyond mandatory (+5 points)
- User data export/deletion (GDPR)

## Demo Scenario

### 1. Register/Login
1. Navigate to `http://localhost:3001/auth/google`
2. Login with Google account
3. Get redirected to frontend with JWT token

### 2. Create CV
1. Use CV wizard to input your information
2. Choose from 3 templates: Modern, Classic, Creative
3. Preview your CV in real-time
4. Export to PDF, DOCX, or JSON

### 3. Complete Interview
1. Start interview for desired role
2. Answer 8 questions with timer
3. Receive feedback and score for each answer
4. View summary report with overall score

### 4. Practice Training
1. View available quizzes (JavaScript, TypeScript, React)
2. Submit answers to quiz questions
3. Track progress and scores in dashboard

### Example Completed CV
```json
{
  "id": "cv_abc123",
  "template": "modern",
  "content": {
    "title": "John Doe - Resume",
    "body": {
      "personalInfo": {
        "fullName": "John Doe",
        "email": "john@example.com",
        "phone": "+1234567890",
        "location": "San Francisco, CA",
        "summary": "Experienced full-stack developer specializing in React and Node.js"
      },
      "experience": [
        {
          "position": "Senior Full-Stack Developer",
          "company": "Tech Innovations Inc",
          "startDate": "2021-03",
          "endDate": "Present",
          "description": "Led development of customer-facing web applications serving 100K+ users",
          "achievements": [
            "Reduced page load time by 40%",
            "Implemented CI/CD pipeline"
          ]
        }
      ],
      "education": [
        {
          "degree": "Bachelor of Science",
          "field": "Computer Science",
          "institution": "Stanford University",
          "startDate": "2015",
          "endDate": "2019"
        }
      ],
      "skills": ["JavaScript", "TypeScript", "React", "Node.js", "PostgreSQL", "Docker"],
      "projects": [
        {
          "name": "E-commerce Platform",
          "description": "Built full-stack e-commerce solution",
          "technologies": ["React", "Node.js", "PostgreSQL"],
          "link": "https://github.com/johndoe/ecommerce"
        }
      ]
    }
  }
}
```

### Example Interview Report
```json
{
  "id": "int_xyz789",
  "role": "Frontend Developer",
  "overallScore": 85,
  "summary": "Interview completed with 85% overall score. Strong performance!",
  "questions": [
    {
      "question": "Tell me about yourself and your background",
      "answer": "I'm a frontend developer with 5 years of experience building responsive web applications using React and TypeScript...",
      "feedback": "Strong answer demonstrating good understanding",
      "score": 9,
      "timeSpent": 145
    },
    {
      "question": "Why do you want this role?",
      "answer": "I'm passionate about creating excellent user experiences and your company's mission aligns with my values...",
      "feedback": "Good response with relevant details",
      "score": 8,
      "timeSpent": 98
    }
  ],
  "createdAt": "2025-11-07T14:30:00.000Z"
}
```

## Data Privacy & Security

### What Data We Collect
- **Authentication**: Google ID, email, name (via OAuth)
- **Profile**: Full name, phone, location, professional summary
- **CV Data**: Experience, education, skills, projects
- **Interview Results**: Questions, answers, scores, timestamps
- **Training Progress**: Quiz attempts, scores, completion status

### How Data Is Used
- **Profile Data**: To populate CV templates and personalize experience
- **CV Data**: To generate, export, and optimize resumes
- **Interview Data**: To provide feedback and track progress
- **Training Data**: To track learning progress and completion

### Data Storage
- All data stored in PostgreSQL database on Railway
- Encrypted connections (SSL/TLS)
- JWT tokens for authentication (no plain passwords stored)
- Redis cache for temporary AI responses (optional)

### Data Rights
- **View**: `GET /users/me/export` - Download all your data as JSON
- **Delete**: `DELETE /users/me` - Permanently delete account and all associated data
- **Update**: Edit your profile and CVs anytime via API

### Analytics & Tracking
- No analytics or tracking by default
- No third-party analytics tools
- No cookies except authentication token

## Build & Deploy

```bash
npm run build
npm run start:prod
```

### Production Deployment
```bash
npx prisma migrate deploy
npm run build
npm run start:prod
```

## License

MIT
