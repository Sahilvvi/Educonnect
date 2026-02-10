# 🎓 Demo Accounts Setup Guide

**Complete step-by-step instructions to create demo accounts for all user types**

---

## 📋 Summary of Demo Accounts

| Role | Email | Password | Access Level |
|------|-------|----------|--------------|
| **Super Admin** | superadmin@demo.school | Demo@123 | Platform-wide access |
| **Admin** | admin@demo.school | Demo@123 | School management |
| **Teacher** | teacher@demo.school | Demo@123 | Class & homework management |
| **Parent** | parent@demo.school | Demo@123 | Child monitoring |
| **Student** | student@demo.school | Demo@123 | Homework & timetable |

---

## 🚀 Quick Setup (3 Steps)

### Step 1: Create Auth Users in Supabase (5 minutes)

1. Open your Supabase Dashboard: **https://supabase.com/dashboard**
2. Select your project
3. Navigate to **Authentication** → **Users** in the left sidebar
4. For each user, click **"Add User"** → **"Create new user"**

Create these 5 users:

#### User 1: Super Admin
- **Email**: `superadmin@demo.school`
- **Password**: `Demo@123`
- **Auto Confirm**: ✅ Yes
- Click **Create user**
- **Copy the User ID** (format: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`)

#### User 2: School Admin
- **Email**: `admin@demo.school`
- **Password**: `Demo@123`
- **Auto Confirm**: ✅ Yes
- Click **Create user**
- **Copy the User ID**

#### User 3: Teacher
- **Email**: `teacher@demo.school`
- **Password**: `Demo@123`
- **Auto Confirm**: ✅ Yes
- Click **Create user**
- **Copy the User ID**

#### User 4: Parent
- **Email**: `parent@demo.school`
- **Password**: `Demo@123`
- **Auto Confirm**: ✅ Yes
- Click **Create user**
- **Copy the User ID**

#### User 5: Student
- **Email**: `student@demo.school`
- **Password**: `Demo@123`
- **Auto Confirm**: ✅ Yes
- Click **Create user**
- **Copy the User ID**

---

### Step 2: Update SQL Script with User IDs (2 minutes)

Open `create_demo_accounts.sql` and replace these placeholders with the actual User IDs you copied:

```sql
-- Find and replace these 5 placeholders:

'superadmin-auth-user-id'::uuid  → Replace with Super Admin User ID
'admin-auth-user-id'::uuid       → Replace with Admin User ID
'teacher-auth-user-id'::uuid     → Replace with Teacher User ID
'parent-auth-user-id'::uuid      → Replace with Parent User ID
'student-auth-user-id'::uuid     → Replace with Student User ID
```

**Example:**
```sql
-- BEFORE:
'superadmin-auth-user-id'::uuid

-- AFTER (with your actual ID):
'a1b2c3d4-e5f6-7890-abcd-ef1234567890'::uuid
```

**There are 8 places to replace** (some IDs appear multiple times):
- Line ~72: teacher-auth-user-id (teacher profile)
- Line ~151: student-auth-user-id (student 1)
- Line ~219: parent-auth-user-id (parent profile)
- Line ~239: superadmin-auth-user-id (user_roles)
- Line ~247: admin-auth-user-id (user_roles)
- Line ~255: teacher-auth-user-id (user_roles)
- Line ~263: parent-auth-user-id (user_roles)
- Line ~271: student-auth-user-id (user_roles)
- Line ~390: admin-auth-user-id (announcements - appears twice)

---

### Step 3: Run SQL Script in Supabase (1 minute)

1. In Supabase Dashboard, go to **SQL Editor**
2. Click **"New Query"**
3. Copy the **entire contents** of `create_demo_accounts.sql`
4. Paste into the SQL Editor
5. Click **"Run"** or press `Ctrl+Enter`

**Expected Output:**
```
Success. No rows returned.
NOTICE: Demo data setup completed successfully!
```

✅ **Done!** All demo accounts are now ready to use.

---

## 🔐 Login and Test

### Test Each Account

Visit `http://localhost:3000/login` and try logging in with each account:

#### 1. Super Admin Login
```
Email: superadmin@demo.school
Password: Demo@123
Expected: Redirect to /super-admin/dashboard
```

**What to verify:**
- ✅ Can see all schools (Demo High School)
- ✅ Analytics page works
- ✅ Users page shows all 5 users
- ✅ Can create new schools

---

#### 2. School Admin Login
```
Email: admin@demo.school
Password: Demo@123
Expected: Redirect to /admin/dashboard
```

**What to verify:**
- ✅ Dashboard shows: Students, Teachers, Classes, Fees
- ✅ Can see students list (Emily Johnson, Michael Wilson)
- ✅ Can see teachers list (John Smith)
- ✅ Can see classes (Grade 10-A, Grade 9-B, Grade 11-A)
- ✅ Timetable page shows sample schedule
- ✅ Communication page works
- ✅ Academics page allows creating subjects

---

#### 3. Teacher Login
```
Email: teacher@demo.school
Password: Demo@123
Expected: Redirect to /teacher/dashboard
```

**What to verify:**
- ✅ Shows John Smith's profile
- ✅ Assigned classes: Grade 10-A (class teacher), Grade 9-B
- ✅ Can create homework assignments
- ✅ Can view existing homework (2 assignments)
- ✅ Can mark attendance for Grade 10-A
- ✅ Timetable shows teacher's schedule

---

#### 4. Parent Login
```
Email: parent@demo.school
Password: Demo@123
Expected: Redirect to /parent/dashboard
```

**What to verify:**
- ✅ Shows Robert Wilson's profile
- ✅ Child card shows: Michael Wilson
- ✅ Class: Grade 9-B
- ✅ Attendance percentage (calculated from 10 days)
- ✅ Pending homework: 1 assignment (Geometry)
- ✅ Pending fees: ₹5,000
- ✅ Fees page shows pending fee
- ✅ Announcements page shows 2 announcements

---

#### 5. Student Login
```
Email: student@demo.school
Password: Demo@123
Expected: Redirect to /student/dashboard
```

**What to verify:**
- ✅ Shows Emily Johnson's profile
- ✅ Class: Grade 10-A
- ✅ School: Demo High School
- ✅ Pending homework: 1 (Algebra Practice)
- ✅ Attendance rate (from 10 days of records)
- ✅ **Next Class** shows real timetable data
- ✅ Homework page lists assignments
- ✅ Attendance page shows monthly records
- ✅ Timetable page shows weekly schedule

---

## 📊 Demo Data Included

### School
- **Name**: Demo High School
- **Location**: Demo City, Demo State
- **Status**: Active

### Classes (3)
1. **Grade 10-A** - Capacity: 40 (Class Teacher: John Smith)
2. **Grade 9-B** - Capacity: 35
3. **Grade 11-A** - Capacity: 30

### Teachers (1)
- **John Smith** - Mathematics Teacher
  - Assigned to: Grade 10-A (class teacher), Grade 9-B
  - Specialization: Mathematics

### Students (2)
1. **Emily Johnson** (STU001)
   - Class: Grade 10-A
   - Roll Number: 101
   - Has auth account (can login)

2. **Michael Wilson** (STU002)
   - Class: Grade 9-B
   - Roll Number: 201
   - Child of Robert Wilson (parent)

### Parents (1)
- **Robert Wilson** - Father of Michael Wilson
  - Occupation: Engineer

### Homework Assignments (2)
1. **Algebra Practice Problems** - Due in 7 days (Grade 10-A)
2. **Geometry Assignment** - Due in 5 days (Grade 9-B)

### Attendance Records
- Last 10 days for both students
- ~90% present for Emily
- ~85% present for Michael

### Fee Records
- Pending fee for Michael: ₹5,000 (due in 15 days)

### Timetable (Grade 10-A)
- **Monday-Friday**: Mathematics 9:00-10:00 (John Smith, Room 101)
- Plus additional subjects (English, Science, History, etc.)

### Announcements (2)
1. Welcome to New Academic Year (High priority)
2. Parent-Teacher Meeting (Normal priority)

---

## 🔧 Troubleshooting

### Issue 1: "Email already exists"
**Solution:** User already created. Just copy the existing User ID.

### Issue 2: SQL Error - Invalid UUID
**Solution:** Make sure you replaced ALL 8 placeholder UUIDs with actual User IDs from Supabase.

### Issue 3: Login redirects to wrong dashboard
**Solution:** 
1. Check `user_roles` table in Supabase
2. Verify the role is assigned to correct user_id
3. Re-run the SQL script after fixing UUIDs

### Issue 4: "No rows returned" but nothing appears
**Solution:** 
1. Check if tables exist: Run `SELECT * FROM schools;`
2. If empty, re-run `fix_critical_schema.sql` first
3. Then run `create_demo_accounts.sql` again

### Issue 5: Parent sees no children
**Solution:**
1. Check `parent_student_mapping` table
2. Verify parent_id matches the actual parent_profile.id
3. Verify student_id matches actual student.id

### Issue 6: Student sees "Profile Not Found"
**Solution:**
1. Check `students` table has `email` = `student@demo.school`
2. Check `user_id` in students table matches auth user ID
3. Or login email must match student email

---

## 🎯 Quick Verification Checklist

After setup, verify these work:

### Super Admin:
- [ ] Login successful
- [ ] Can see Demo High School in schools list
- [ ] Analytics page loads
- [ ] Users page shows 5 users

### Admin:
- [ ] Login successful
- [ ] Dashboard shows stats (2 students, 1 teacher, 3 classes)
- [ ] Can view students and teachers
- [ ] Can create timetable slots

### Teacher:
- [ ] Login successful
- [ ] Shows 2 assigned classes
- [ ] Can view homework list (2 assignments)
- [ ] Can mark attendance

### Parent:
- [ ] Login successful
- [ ] Shows 1 child (Michael Wilson)
- [ ] Child card shows class, attendance, homework, fees
- [ ] Fees page shows ₹5,000 pending

### Student:
- [ ] Login successful
- [ ] Dashboard shows class and school
- [ ] Next Class shows real timetable data
- [ ] Can view homework (1 assignment)
- [ ] Can view attendance history (10 records)
- [ ] Timetable page shows weekly schedule

---

## 📝 Additional Sample Data (Optional)

Want to add more demo data? Here are quick snippets:

### Add More Students:
```sql
INSERT INTO students (school_id, class_id, student_id, full_name, name, email, date_of_birth, dob, gender, admission_date, roll_number, status)
VALUES 
    ('00000000-0000-0000-0000-000000000001'::uuid, '11111111-1111-1111-1111-111111111111'::uuid, 'STU003', 'Sarah Brown', 'Sarah Brown', 'sarah@demo.student', '2008-03-10', '2008-03-10', 'female', '2023-04-01', 102, 'active');
```

### Add More Homework:
```sql
INSERT INTO homework_assignments (school_id, class_id, teacher_id, title, description, subject, due_date, max_marks, status, is_published)
VALUES 
    ('00000000-0000-0000-0000-000000000001'::uuid, '11111111-1111-1111-1111-111111111111'::uuid, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid, 'Chapter 6 Test Prep', 'Prepare for upcoming test', 'Mathematics', (CURRENT_DATE + INTERVAL '3 days')::date, 100, 'published', true);
```

### Add More Announcements:
```sql
INSERT INTO announcements (school_id, author_id, title, content, priority, target_audience, is_published)
VALUES 
    ('00000000-0000-0000-0000-000000000001'::uuid, 'admin-auth-user-id'::uuid, 'Sports Day', 'Annual sports day next month!', 'high', ARRAY['students', 'parents'], true);
```

---

## 🎉 You're All Set!

You now have fully functional demo accounts for testing all features of the school management system!

**Remember:**
- Use these for testing and demonstrations only
- Don't use in production
- All passwords are `Demo@123` for easy testing
- Data can be reset by running the script again

**Happy Testing!** 🚀
