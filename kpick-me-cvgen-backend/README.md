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

### Create CV

```bash
curl -X POST http://localhost:3000/cv/wizard \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "skills": ["JavaScript", "React", "Node.js"],
    "template": "modern"
  }'
```

### Start Interview

```bash
curl -X POST http://localhost:3000/interviews/start \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"role": "Frontend Developer", "cvId": "cv_id"}'
```

### Take Quiz

```bash
curl -X POST http://localhost:3000/training/submit \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"challengeId": "1", "solution": [0, 1, 1]}'
```

## Bonus Features Implemented

- TypeScript (+1.5 points)
- Multiple export formats: PDF, DOCX, JSON (+3 points)
- Multiple CV templates (+implicit)
- AI integration beyond mandatory (+5 points)
- User data export/deletion (GDPR)

## Build & Deploy

```bash
npm run build
npm run start:prod
```

## License

MIT
