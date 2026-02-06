# 🚀 Quick Start Guide - EduConnect Platform

## What We've Built So Far

✅ **Phase 1 & 2 Complete!**

### Completed Features:
1. **Project Foundation**
   - Next.js 14 with TypeScript
   - Supabase integration
   - shadcn/ui components
   - Authentication middleware

2. **Authentication System**
   - Email + OTP login
   - Parent signup with profile creation
   - Role-based access (Parent/Teacher/Admin)
   - Beautiful mobile-first UI

3. **Landing Page**
   - Hero section highlighting multi-school USP
   - Features showcase
   - CTAs for signup/login

## Next Steps to Get Started

### 1. Set Up Supabase (REQUIRED)

The app won't work without a Supabase database. Here's what you need to do:

#### A. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Click **"New project"**
3. Fill in:
   - Name: `educonnect` (or any name)
   - Database Password: (create a strong one)
   - Region: Choose closest to you
4. Click **"Create new project"**
5. Wait 2-3 minutes for setup

#### B. Get Your API Keys
1. Go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (starts with https://...supabase.co)
   - **anon/public key** (long string starting with eyJ...)
   - **service_role key** (another long string)

#### C. Update Environment Variables
1. Open `.env.local` in the project root
2. Replace the placeholders:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...your_anon_key
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...your_service_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

#### D. Create Database Tables
1. In Supabase dashboard, go to **SQL Editor**
2. Click **"New query"**
3. Copy and paste this SQL (from `database_schema.md`):

```sql
-- Schools table
CREATE TABLE schools (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100),
    postal_code VARCHAR(20),
    phone VARCHAR(20),
    email VARCHAR(255),
    website VARCHAR(255),
    logo_url TEXT,
    theme_color VARCHAR(7) DEFAULT '#3B82F6',
    academic_year_start_month INTEGER DEFAULT 4,
    timezone VARCHAR(50) DEFAULT 'Asia/Kolkata',
    is_active BOOLEAN DEFAULT true,
    subscription_tier VARCHAR(50) DEFAULT 'basic',
    subscription_expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User roles (extends Supabase auth.users)
CREATE TABLE user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL CHECK (role IN ('parent', 'teacher', 'admin', 'super_admin')),
    school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, role, school_id)
);

-- Parent profiles
CREATE TABLE parent_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    alternate_phone VARCHAR(20),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    occupation VARCHAR(100),
    notification_preferences JSONB DEFAULT '{"push": true, "email": true, "sms": false}'::jsonb,
    language_preference VARCHAR(10) DEFAULT 'en',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Students
CREATE TABLE students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    class_id UUID,
    student_id VARCHAR(50),
    full_name VARCHAR(255) NOT NULL,
    date_of_birth DATE,
    gender VARCHAR(20),
    blood_group VARCHAR(10),
    email VARCHAR(255),
    phone VARCHAR(20),
    address TEXT,
    admission_date DATE,
    roll_number VARCHAR(50),
    profile_photo_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(school_id, student_id)
);

-- Parent-Student Mapping
CREATE TABLE parent_student_mapping (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_id UUID NOT NULL REFERENCES parent_profiles(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    relationship VARCHAR(50) NOT NULL CHECK (relationship IN ('mother', 'father', 'guardian', 'other')),
    is_primary_contact BOOLEAN DEFAULT false,
    verified_at TIMESTAMP WITH TIME ZONE,
    verification_code VARCHAR(10),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(parent_id, student_id)
);

-- Notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    notification_type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    action_url TEXT,
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMP WITH TIME ZONE,
    related_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_user_roles_user ON user_roles(user_id);
CREATE INDEX idx_user_roles_school ON user_roles(school_id);
CREATE INDEX idx_parent_profiles_user ON parent_profiles(user_id);
CREATE INDEX idx_students_school ON students(school_id);
CREATE INDEX idx_parent_student_parent ON parent_student_mapping(parent_id);
CREATE INDEX idx_parent_student_student ON parent_student_mapping(student_id);
CREATE INDEX idx_notifications_user ON notifications(user_id, created_at DESC);
```

4. Click **"Run"** to execute
5. You should see "Success. No rows returned"

#### E. Enable Row Level Security (RLS) - IMPORTANT!
1. Still in SQL Editor, run this:

```sql
-- Enable RLS on all tables
ALTER TABLE parent_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE parent_student_mapping ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies (we'll add more specific ones later)
-- Allow users to read their own profile
CREATE POLICY "Users can view own parent profile"
ON parent_profiles FOR SELECT
USING (auth.uid() = user_id);

-- Allow users to insert their own profile
CREATE POLICY "Users can insert own parent profile"
ON parent_profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own profile
CREATE POLICY "Users can update own parent profile"
ON parent_profiles FOR UPDATE
USING (auth.uid() = user_id);
```

2. Click **"Run"**

### 2. Test the Application

#### Restart the Dev Server
Since you've updated `.env.local`, restart the server:
1. Press `Ctrl+C` in the terminal to stop
2. Run `npm run dev` again
3. Open http://localhost:3000

#### Test Parent Signup:
1. Click **"Get Started"** or navigate to `/signup`
2. Fill in your details (use a real email you can access)
3. Click **"Continue"**
4. Check your email for the 6-digit OTP
5. Enter the OTP
6. You should be redirected to `/parent/dashboard` (we'll build this next!)

#### Test Login:
1. Navigate to `/login`
2. Enter your email
3. Select **"Parent"**
4. Click **"Send OTP"**
5. Check email and enter OTP
6. Login successful!

### 3. What's Next?

Now that authentication works, we'll build:
1. **Parent Dashboard** - unified view of all children
2. **Add Child functionality** - link children to parent account
3. **Notification Center** - real-time alerts

## Common Issues & Solutions

### Issue: "Failed to send OTP"
**Solution**: Check your Supabase credentials in `.env.local`

### Issue: "Table does not exist"
**Solution**: Make sure you ran all the SQL commands in step 1D

### Issue: "403 Forbidden" or "RLS policy error"
**Solution**: Run the RLS setup commands from step 1E

### Issue: Email not received
**Solution**: 
- Check spam folder
- In Supabase, go to Authentication → Email Templates
- Make sure email sending is enabled
- For testing, Supabase uses their SMTP (works automatically)

## Need Help?

- Check `README.md` for full documentation
- Review `implementation_plan.md` for architecture details
- See `database_schema.md` for complete database structure
- Check terminal for error messages

---

**🎉 Once setup is complete, you'll have a working authentication system with OTP!**
