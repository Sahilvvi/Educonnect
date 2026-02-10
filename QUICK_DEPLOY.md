# 🚀 Quick Deploy to Vercel

**Follow these commands in order:**

---

## Step 1: Push to GitHub

```powershell
# Run these commands in PowerShell from your project folder

# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Deploy School Management System to Vercel"

# FIRST: Create a new repository on GitHub
# Go to: https://github.com/new
# Name: school-management-system
# Do NOT initialize with README
# Click "Create repository"

# THEN: Run these commands (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/school-management-system.git
git branch -M main
git push -u origin main
```

---

## Step 2: Deploy on Vercel

### Web Interface (Recommended)

1. Go to: **https://vercel.com**
2. Click **"Sign Up"** with GitHub
3. Click **"Add New..."** → **"Project"**
4. Select **"school-management-system"** repository
5. Click **"Import"**

6. **Add Environment Variables:**

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Get these from:**
- Supabase Dashboard → Your Project → Settings → API
- Copy "Project URL" and "anon public" key

7. Click **"Deploy"**

⏳ Wait 2-3 minutes...

---

## Step 3: Database Setup

**Important**: Your app is deployed, but you need database tables!

1. **Supabase Dashboard** → **SQL Editor**

2. **Run Migration** (Creates tables):
```sql
-- Copy contents of fix_critical_schema.sql
-- Paste in SQL Editor
-- Click Run
```

3. **Create Demo Accounts**:
   - Follow `DEMO_ACCOUNTS_GUIDE.md`
   - Create 5 users in Supabase Auth
   - Update and run `create_demo_accounts.sql`

---

## ✅ Verification

Visit your Vercel URL: `https://your-app.vercel.app`

Test:
- [ ] Homepage loads
- [ ] Can access `/login`
- [ ] Can login with demo accounts
- [ ] Dashboards work for each role

---

## 🔄 Future Updates

After initial deploy, to push updates:

```powershell
git add .
git commit -m "Description of changes"
git push origin main
```

Vercel automatically re-deploys! 🎉

---

## 📞 Need Help?

- **Vercel Issues**: Check `VERCEL_DEPLOYMENT_GUIDE.md`
- **Database Setup**: See `SQL_MIGRATION_GUIDE.md`
- **Demo Accounts**: Read `DEMO_ACCOUNTS_GUIDE.md`
- **Testing**: Use `TESTING_CHECKLIST.md`

---

**Ready?** Start with Step 1 above! 🚀
