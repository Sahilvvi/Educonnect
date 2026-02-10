# 🚀 Deploy to Vercel Guide

**Deploy your School Management System to production in 10 minutes**

---

## 📋 Prerequisites

- ✅ GitHub account
- ✅ Vercel account (free tier works)
- ✅ Supabase project already created
- ✅ Code is in current directory: `c:\Users\autiy\OneDrive\Desktop\school`

---

## 🎯 Quick Deploy (4 Steps)

### Step 1: Push Code to GitHub (3 minutes)

#### Option A: Using Git (Recommended)

Open a new terminal in your project folder and run:

```bash
# Initialize git repository (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - School Management System"

# Create a new repo on GitHub (go to github.com/new)
# Name it: school-management-system
# Then run these commands:

git remote add origin https://github.com/YOUR_USERNAME/school-management-system.git
git branch -M main
git push -u origin main
```

**Replace `YOUR_USERNAME`** with your GitHub username.

#### Option B: Using GitHub Desktop

1. Open GitHub Desktop
2. Click "Add" → "Add Existing Repository"
3. Browse to: `c:\Users\autiy\OneDrive\Desktop\school`
4. Click "Create Repository"
5. Click "Publish Repository"
6. Uncheck "Keep this code private" (or keep it private if you prefer)
7. Click "Publish Repository"

---

### Step 2: Deploy on Vercel (2 minutes)

1. **Go to**: https://vercel.com
2. Click **"Sign Up"** or **"Login"** (use GitHub account)
3. Click **"Add New..."** → **"Project"**
4. **Import** your GitHub repository: `school-management-system`
5. Configure:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: `next build` (auto-filled)
   - **Output Directory**: `.next` (auto-filled)

6. **Environment Variables** - Click "Add" and enter these:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Where to find these values:**
- Go to: https://supabase.com/dashboard
- Select your project
- Click **Settings** → **API**
- Copy:
  - **Project URL** → Use for `NEXT_PUBLIC_SUPABASE_URL`
  - **anon public** key → Use for `NEXT_PUBLIC_SUPABASE_ANON_KEY`

7. Click **"Deploy"**

⏳ Wait 2-3 minutes for deployment...

---

### Step 3: Verify Deployment (1 minute)

Once deployed, Vercel will show:
- ✅ **Production URL**: `https://school-management-system-xxx.vercel.app`
- Click the URL to open your deployed app

**Expected Result:**
- Homepage loads ✅
- You can navigate to `/login` ✅
- Login won't work yet (database not set up) ⚠️

---

### Step 4: Set Up Database (5 minutes)

Now that your app is deployed, set up the database (works for both local and production):

#### 4.1. Run Schema Migration

1. Go to **Supabase Dashboard** → **SQL Editor**
2. Open file: `fix_critical_schema.sql`
3. Copy entire contents
4. Paste in SQL Editor
5. Click **"Run"**
6. Verify success: Should show "7 tables created"

#### 4.2. Create Demo Accounts

Follow **DEMO_ACCOUNTS_GUIDE.md**:
1. Create 5 users in Supabase Authentication
2. Copy User IDs
3. Update `create_demo_accounts.sql`
4. Run in SQL Editor

---

## 🎉 You're Live!

Your app is now:
- ✅ **Deployed on Vercel**: `https://your-app.vercel.app`
- ✅ **Database configured**: Both local and production work
- ✅ **Demo accounts ready**: Can login on production URL

---

## 📝 Important Notes

### About Environment Variables
- **Local**: Uses `.env.local` (already configured)
- **Production**: Uses Vercel environment variables (you just set them)
- **Same Supabase**: Both local and production use the SAME Supabase project

### Database Setup
- **One-time only**: Run migration scripts once in Supabase
- **Works everywhere**: Local and production both connect to same database
- **Demo data**: Create once, works on both local and production

### Automatic Deployments
- Every time you push to GitHub `main` branch, Vercel auto-deploys
- Preview deployments for other branches
- Instant rollback if needed

---

## 🔧 Post-Deployment Checklist

After deployment, verify these work on **production URL**:

### Basic Tests
- [ ] Homepage loads
- [ ] `/login` page displays
- [ ] Can create account (signup)
- [ ] Can login with demo accounts
- [ ] Dashboard loads after login

### Role-Based Tests
Visit: `https://your-app.vercel.app/login`

- [ ] Login as super admin → Redirects to `/super-admin/dashboard`
- [ ] Login as admin → Redirects to `/admin/dashboard`
- [ ] Login as teacher → Redirects to `/teacher/dashboard`
- [ ] Login as parent → Redirects to `/parent/dashboard`
- [ ] Login as student → Redirects to `/student/dashboard`

### Feature Tests
- [ ] Admin can view students list
- [ ] Teacher can create homework
- [ ] Parent sees child cards with real data
- [ ] Student sees timetable and next class
- [ ] All charts load (dashboard analytics)

---

## 🐛 Troubleshooting

### Issue 1: "Application error" on Vercel
**Cause**: Build failed  
**Solution**:
1. Check Vercel build logs
2. Common fix: Ensure `package.json` has all dependencies
3. Re-deploy from Vercel dashboard

### Issue 2: Database connection error
**Cause**: Environment variables not set  
**Solution**:
1. Vercel Dashboard → Your Project → Settings → Environment Variables
2. Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Redeploy: Deployments → ... → Redeploy

### Issue 3: Login redirects to wrong page
**Cause**: User roles not set  
**Solution**:
1. Run `create_demo_accounts.sql` in Supabase
2. Verify `user_roles` table has entries
3. Check role matches user_id

### Issue 4: "Table doesn't exist" errors
**Cause**: Migration not run  
**Solution**:
1. Run `fix_critical_schema.sql` in Supabase SQL Editor
2. Verify all tables exist
3. Refresh app

---

## 🔄 Update Workflow (After Initial Deploy)

### Making Changes

```bash
# 1. Make changes to your code locally
# 2. Test locally: npm run dev

# 3. Commit changes
git add .
git commit -m "Description of changes"

# 4. Push to GitHub
git push origin main

# 5. Vercel auto-deploys (wait 1-2 minutes)
# 6. Check production URL
```

### Rollback if Needed

1. Vercel Dashboard → Deployments
2. Find previous working deployment
3. Click "..." → "Promote to Production"

---

## 📊 Deployment Summary

| Item | Local | Production |
|------|-------|------------|
| **App URL** | localhost:3000 | your-app.vercel.app |
| **Environment** | .env.local | Vercel env vars |
| **Database** | Supabase (cloud) | Supabase (cloud) |
| **Same DB?** | ✅ Yes - Same Supabase project | ✅ |
| **Demo Accounts** | Works | Works |

---

## 🎯 Next Steps After Deployment

### 1. Custom Domain (Optional)
1. Vercel Dashboard → Your Project → Settings → Domains
2. Add your domain: `schoolapp.com`
3. Follow DNS configuration instructions

### 2. Production Optimization
- [ ] Set up Supabase RLS (Row Level Security) policies
- [ ] Enable Vercel Analytics
- [ ] Set up monitoring
- [ ] Configure email notifications

### 3. Security Hardening
- [ ] Review Supabase RLS policies
- [ ] Enable rate limiting
- [ ] Set up CORS properly
- [ ] Review environment variables

---

## 📞 Quick Commands Reference

```bash
# Local development
npm run dev

# Build for production (test before deploy)
npm run build

# Push to GitHub (triggers auto-deploy)
git add .
git commit -m "Your changes"
git push origin main

# Check deployment status
# → Visit vercel.com/dashboard
```

---

## 🎉 Success Indicators

Your deployment is successful when:

✅ **Vercel shows**: "Deployment completed"  
✅ **Production URL loads**: Homepage appears  
✅ **Login works**: Can login with demo accounts  
✅ **Dashboards load**: Each role sees their dashboard  
✅ **Data appears**: Students, teachers, etc. show up  
✅ **Timetable works**: Students see schedule  
✅ **Forms work**: Can create homework, mark attendance  

---

## 🚀 You're Ready!

Once deployed:
- **Local development**: Continue using `npm run dev`
- **Production**: Lives at your Vercel URL
- **Database**: Shared between both (Supabase cloud)
- **Updates**: Push to GitHub → Auto-deploys

**Start deployment**: Follow Step 1 above! 🎊

---

## 📋 Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Vercel project created
- [ ] Environment variables set
- [ ] Deployment successful
- [ ] Production URL loads
- [ ] Database migration run (`fix_critical_schema.sql`)
- [ ] Demo accounts created
- [ ] Can login on production
- [ ] All dashboards accessible
- [ ] Features work (homework, timetable, etc.)

**All checked?** → You're LIVE! 🎉
