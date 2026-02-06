-- Seed Data for Testing EduConnect Platform
-- Run this in Supabase SQL Editor AFTER creating the schema

-- Insert sample schools
INSERT INTO schools (name, code, city, state, country, theme_color) VALUES
('Greenwood International School', 'GIS2026', 'Mumbai', 'Maharashtra', 'India', '#10B981'),
('Sunrise Public School', 'SPS2026', 'Delhi', 'Delhi', 'India', '#3B82F6'),
('St. Mary''s Academy', 'SMA2026', 'Bangalore', 'Karnataka', 'India', '#8B5CF6');

-- Insert sample students
-- First, get the school IDs (we'll use the codes to reference them)
WITH school_ids AS (
  SELECT id, code FROM schools WHERE code IN ('GIS2026', 'SPS2026', 'SMA2026')
)
INSERT INTO students (school_id, student_id, full_name, class_id, date_of_birth, gender, admission_date, is_active)
SELECT 
  s.id,
  'STU' || LPAD(row_number() OVER ()::text, 4, '0'),
  name,
  NULL,
  '2015-01-01'::date,
  'Male',
  '2020-04-01'::date,
  true
FROM school_ids s
CROSS JOIN (VALUES 
  ('Aarav Kumar'),
  ('Priya Sharma'),
  ('Rohan Patel')
) AS students(name);

-- Note: To properly test the dashboard, you'll need to:
-- 1. Sign up as a parent through the app (http://localhost:3000/signup)
-- 2. Complete the OTP verification
-- 3. Then link children using the "Add Child" button in the dashboard
-- 
-- The linking requires:
-- - School Code (e.g., GIS2026, SPS2026, SMA2026)
-- - Student ID (e.g., STU0001, STU0002, STU0003)

-- Insert sample notifications (you'll need to replace USER_ID with actual user ID after signup)
-- Run this after creating a parent account:
/*
INSERT INTO notifications (user_id, school_id, student_id, notification_type, title, body, is_read)
VALUES
(
  'YOUR_USER_ID_HERE', -- Replace with actual user ID from auth.users
  (SELECT id FROM schools WHERE code = 'GIS2026'),
  (SELECT id FROM students WHERE student_id = 'STU0001' LIMIT 1),
  'absence',
  'Student Absence Alert',
  'Aarav Kumar was marked absent today.',
  false
),
(
  'YOUR_USER_ID_HERE',
  (SELECT id FROM schools WHERE code = 'GIS2026'),
  (SELECT id FROM students WHERE student_id = 'STU0001' LIMIT 1),
  'homework',
  'New Homework Assigned',
  'Mathematics homework has been assigned. Due: Tomorrow',
  false
);
*/

-- Insert sample attendance records (Run this after users and students exist)
WITH student_ids AS (
  SELECT id FROM students WHERE student_id IN ('STU0001', 'STU0002')
),
dates AS (
  SELECT generate_series(
    CURRENT_DATE - INTERVAL '30 days',
    CURRENT_DATE,
    '1 day'::interval
  )::date AS date
)
INSERT INTO attendance_records (student_id, school_id, class_id, attendance_date, status, remarks)
SELECT 
  s.id,
  (SELECT school_id FROM students WHERE id = s.id),
  (SELECT id FROM classes LIMIT 1), -- Assuming classes exist, or we mock class_id if not strictly enforced by FK yet (might fail if classes empty)
  d.date,
  CASE 
    WHEN EXTRACT(ISODOW FROM d.date) IN (6, 7) THEN 'excused' -- Weekend
    WHEN random() < 0.1 THEN 'absent'
    WHEN random() < 0.05 THEN 'late'
    ELSE 'present'
  END,
  CASE WHEN random() < 0.1 THEN 'Not feeling well' ELSE NULL END
FROM student_ids s
CROSS JOIN dates d;
-- Note: You need to insert at least one class first for the FK constraint to work
INSERT INTO classes (school_id, name, section, grade_level, academic_year)
SELECT id, 'Class 5', 'A', 5, '2025-2026' FROM schools WHERE code = 'GIS2026'
ON CONFLICT DO NOTHING;

-- Insert mock teacher profile (needed for creating homework)
INSERT INTO auth.users (id, email) VALUES ('00000000-0000-0000-0000-000000000001', 'teacher@mock.com') ON CONFLICT DO NOTHING;
INSERT INTO teacher_profiles (id, user_id, school_id, full_name, employee_id)
SELECT 
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000001',
  id,
  'Mrs. Sarah Teacher',
  'EMP001'
FROM schools WHERE code = 'GIS2026'
ON CONFLICT DO NOTHING;

-- Insert sample homework assignments
WITH teacher AS (
  SELECT id FROM teacher_profiles WHERE full_name = 'Mrs. Sarah Teacher' LIMIT 1
),
cls AS (
  SELECT id, school_id FROM classes WHERE name = 'Class 5' LIMIT 1
)
INSERT INTO homework_assignments (school_id, class_id, created_by, subject, title, description, due_date, total_marks, is_published)
SELECT
  cls.school_id,
  cls.id,
  teacher.id,
  s.subject,
  s.title,
  s.desc,
  (CURRENT_DATE + (s.days || ' days')::interval)::date,
  10,
  true
FROM teacher, cls
CROSS JOIN (VALUES
  ('Mathematics', 'Fractions Worksheet', 'Complete exercises 1-10 on page 45. Show all working.', 2),
  ('Science', 'Plant Life Cycle', 'Draw and label the life cycle of a flowering plant.', -1), -- Overdue
  ('English', 'Essay: My Summer Vacation', 'Write a 200-word essay about your summer vacation.', 5),
  ('History', 'Ancient Civilizations', 'Read chapter 4 and answer the quiz questions.', 3)
) AS s(subject, title, desc, days);

-- Verify the data
SELECT 'Schools' as table_name, COUNT(*) as count FROM schools
UNION ALL
SELECT 'Students', COUNT(*) FROM students
UNION ALL
SELECT 'Attendance', COUNT(*) FROM attendance_records
UNION ALL
SELECT 'Homework', COUNT(*) FROM homework_assignments;
