# EduConnect - Multi-School Parent-Teacher Platform

A unified SaaS platform that enables parents to manage multiple children across different schools with a single login. Centralized communication and academic tracking for the modern education ecosystem.

## 🚀 Features (Stage 1 MVP)

### Core USP
- **Multi-School Access**: One parent account for children in different schools
- **Unified Dashboard**: Single view for all children's academic activities
- **Real-Time Communication**: Instant messaging and notifications
- **Attendance Tracking**: Automatic absence alerts
- **Homework Management**: Assignments and deadlines in one place
- **Fee Tracking**: View pending fees across all schools

### Tech Stack
- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **UI**: Tailwind CSS + shadcn/ui components
- **Backend**: Next.js API Routes (serverless)
- **Database**: PostgreSQL via Supabase
- **Authentication**: Supabase Auth (Email + OTP)
- **Hosting**: Vercel

## 📋 Prerequisites

- Node.js 18+ and npm
- A Supabase account (free tier works)
- Git

## 🛠️ Setup Instructions

### 1. Clone the Repository (if applicable)

```bash
git clone <your-repo-url>
cd school
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the database to be ready
3. Go to **Project Settings** → **API**
4. Copy your `URL` and `anon/public key`

### 4. Configure Environment Variables

Create a `.env.local` file in the root directory:

``bash
cp .env.example .env.local
```

Edit `.env.local` and add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5. Set Up the Database

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Run the SQL migration files from `supabase/migrations/` in order
4. Enable Row-Level Security (RLS) policies

**Quick setup option**: Use the provided `database_schema.md` file which contains all SQL statements.

### 6. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
school/
├── app/
│   ├── (auth)/           # Authentication routes
│   │   ├── login/        # Login page
│   │   └── signup/       # Signup page
│   ├── (parent)/         # Parent dashboard (future)
│   ├── (teacher)/        # Teacher portal (future)
│   ├── (admin)/          # Admin dashboard (future)
│   ├── api/              # API routes
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Landing page
├── components/
│   └── ui/               # shadcn/ui components
├── lib/
│   ├── supabase/         # Supabase clients
│   ├── validations/      # Zod schemas
│   └── utils/            # Utility functions
├── types/
│   └── database.types.ts # Database type definitions
├── supabase/
│   └── migrations/       # Database migrations
└── middleware.ts         # Auth middleware
```

## 🎯 Current Progress

### ✅ Completed (Phase 1 & 2)
- [x] Next.js 14 project setup with TypeScript
- [x] Supabase integration (client/server)
- [x] Authentication middleware
- [x] Database schema design
- [x] Landing page with hero & features
- [x] Login page with OTP
- [x] Signup page with OTP verification
- [x] Role-based authentication (Parent/Teacher/Admin)
- [x] Form validation with Zod
- [x] UI components (shadcn/ui)
- [x] Toast notifications

### 🔨 In Progress (Phase 3)
- [ ] Parent dashboard (multi-school view)
- [ ] Add child functionality
- [ ] Unified notification center

### 📅 Upcoming (Phase 4-8)
- Communication hub (messaging & announcements)
- Attendance tracking
- Homework & assignments module
- Fee tracking
- School admin dashboard

## 🧪 Testing the Application

### Test Parent Signup Flow:
1. Navigate to http://localhost:3000/signup
2. Fill in the form with your details
3. Check your email for the OTP (6-digit code)
4. Enter the OTP to create your account
5. You'll be redirected to the parent dashboard

### Test Login Flow:
1. Navigate to http://localhost:3000/login
2. Enter your email and select "Parent"
3. Check your email for the OTP
4. Enter the OTP to log in

## 📊 Database Schema

The platform uses a multi-tenant architecture with the following core tables:

- `schools` - School information
- `users` - Authentication (Supabase Auth)
- `user_roles` - Role assignments
- `parent_profiles` - Parent details
- `teacher_profiles` - Teacher details
- `students` - Student records
- `parent_student_mapping` - Links parents to students across schools
- `notifications` - Unified notification system

See `database_schema.md` for complete schema documentation.

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variables from `.env.local`
5. Deploy!

### Environment Variables for Production

Make sure to add these in Vercel:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_APP_URL` (your production URL)

## 🤝 Contributing

This is currently in MVP development. Contributions welcome after initial launch.

## 📝 License

Proprietary - All rights reserved.

## 🆘 Support

For issues or questions:
1. Check the `implementation_plan.md` for architecture details
2. Review the `database_schema.md` for database questions
3. See the `task.md` for development roadmap

---

**Built with ❤️ for modern education**
