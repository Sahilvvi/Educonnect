# SQL Migration Guide

## Quick Start

### Step 1: Access Supabase SQL Editor
1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Select your project
3. Navigate to **SQL Editor** in the left sidebar

### Step 2: Run the Migration
1. Click **"New Query"**
2. Open the file: `/fix_critical_schema.sql`
3. Copy the entire contents
4. Paste into the SQL Editor
5. Click **"Run"** or press `Ctrl+Enter`

### Step 3: Verify Migration
Run this verification query:
```sql
-- Check new tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
    'user_roles', 
    'timetable_slots', 
    'announcements', 
    'messages', 
    'system_settings', 
    'fee_types', 
    'report_templates'
)
ORDER BY table_name;

-- Should return 7 rows
```

Expected result: **7 tables** listed

### Step 4: Check Column Additions
```sql
-- Verify user_id added to students
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'students' 
AND column_name = 'user_id';

-- Verify user_id added to teacher_profiles
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'teacher_profiles' 
AND column_name = 'user_id';
```

Expected result: Both queries should return the `user_id` column with type `uuid`

---

## What the Migration Does

### New Tables Created:
1. **user_roles** - Maps users to schools and roles (super_admin, admin, teacher, parent, student)
2. **timetable_slots** - Class schedules and timetable management
3. **announcements** - School-wide and targeted announcements
4. **messages** - Direct messaging between users
5. **system_settings** - Configurable platform settings
6. **fee_types** - Fee categorization
7. **report_templates** - Analytics report templates

### Schema Enhancements:
- Adds `user_id` column to **students** table (for auth linking)
- Adds `user_id` column to **teacher_profiles** table (for auth linking)
- Creates indexes for performance optimization
- Adds update triggers for `updated_at` columns
- Adds foreign key constraints for data integrity

---

## Post-Migration Steps

### 1. Create Test Users (Optional)
```sql
-- This requires Supabase Auth API or dashboard
-- Use Supabase Dashboard > Authentication > Users > Invite User
```

### 2. Link Existing Data (If Applicable)
```sql
-- Example: Link existing students to auth users by email
UPDATE students s
SET user_id = au.id
FROM auth.users au
WHERE s.email = au.email
AND s.user_id IS NULL;

-- Example: Link existing teachers to auth users by email  
UPDATE teacher_profiles tp
SET user_id = au.id
FROM auth.users au
WHERE tp.email = au.email
AND tp.user_id IS NULL;
```

### 3. Create Initial User Roles
```sql
-- Example: Assign super admin role
INSERT INTO user_roles (user_id, role, school_id)
VALUES (
    'YOUR_USER_ID_HERE',  -- Get from auth.users table
    'super_admin',
    NULL  -- Super admin not tied to a school
);

-- Example: Assign admin role to a school
INSERT INTO user_roles (user_id, role, school_id)
VALUES (
    'ADMIN_USER_ID',
    'admin',
    'SCHOOL_ID_HERE'  -- From schools table
);
```

---

## Troubleshooting

### Error: Table already exists
```
ERROR: relation "user_roles" already exists
```
**Solution**: The migration uses `CREATE TABLE IF NOT EXISTS`, so this shouldn't happen. If it does, the table already exists and you can skip that part.

### Error: Column already exists
```
ERROR: column "user_id" of relation "students" already exists
```
**Solution**: The migration uses `ADD COLUMN IF NOT EXISTS`, so this is handled gracefully.

### Error: Foreign key violation
```
ERROR: insert or update on table violates foreign key constraint
```
**Solution**: Ensure referenced tables (schools, auth.users) exist and have the necessary data before inserting.

---

## Rollback (If Needed)

**WARNING**: This will delete all data in the new tables!

```sql
-- Drop new tables
DROP TABLE IF EXISTS report_templates CASCADE;
DROP TABLE IF EXISTS system_settings CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS announcements CASCADE;
DROP TABLE IF EXISTS timetable_slots CASCADE;
DROP TABLE IF EXISTS fee_types CASCADE;
DROP TABLE IF EXISTS user_roles CASCADE;

-- Remove added columns (be careful!)
ALTER TABLE students DROP COLUMN IF EXISTS user_id;
ALTER TABLE teacher_profiles DROP COLUMN IF EXISTS user_id;
```

---

## Migration Status Checklist

- [ ] Supabase SQL Editor opened
- [ ] Migration SQL copied and pasted
- [ ] Migration executed successfully
- [ ] New tables verified (7 tables)
- [ ] Column additions verified (user_id in students and teacher_profiles)
- [ ] No errors in Supabase logs
- [ ] Test user created for each role
- [ ] User roles assigned
- [ ] Application tested with new schema

---

## Next: Test the Application

1. Ensure dev server is running: `npm run dev`
2. Navigate to http://localhost:3000
3. Test authentication for different roles
4. Verify all pages load correctly
5. Test CRUD operations
6. Check that announcements, messages, and notifications work

Refer to `TESTING_CHECKLIST.md` for comprehensive testing steps.
