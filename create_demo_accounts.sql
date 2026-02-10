-- =====================================================
-- DEMO ACCOUNTS SETUP SCRIPT
-- School Management System
-- Creates demo accounts for all user types
-- =====================================================

-- IMPORTANT: Run this script AFTER creating auth users in Supabase Dashboard
-- See DEMO_ACCOUNTS_GUIDE.md for step-by-step instructions

-- =====================================================
-- 1. CREATE DEMO SCHOOL
-- =====================================================

INSERT INTO schools (id, name, address, city, state, country, postal_code, phone, email, website, logo_url, theme_color, status, academic_year)
VALUES (
    '00000000-0000-0000-0000-000000000001'::uuid,
    'Demo High School',
    '123 Education Street',
    'Demo City',
    'Demo State',
    'Demo Country',
    '12345',
    '+1234567890',
    'demo@school.edu',
    'https://demoschool.edu',
    null,
    '#3B82F6',
    'active',
    '2025-2026'
) ON CONFLICT (id) DO UPDATE SET 
    name = EXCLUDED.name,
    updated_at = now();

-- =====================================================
-- 2. CREATE DEMO CLASSES
-- =====================================================

INSERT INTO classes (id, school_id, name, grade_level, capacity, status)
VALUES 
    ('11111111-1111-1111-1111-111111111111'::uuid, '00000000-0000-0000-0000-000000000001'::uuid, 'Grade 10-A', 10, 40, 'active'),
    ('22222222-2222-2222-2222-222222222222'::uuid, '00000000-0000-0000-0000-000000000001'::uuid, 'Grade 9-B', 9, 35, 'active'),
    ('33333333-3333-3333-3333-333333333333'::uuid, '00000000-0000-0000-0000-000000000001'::uuid, 'Grade 11-A', 11, 30, 'active')
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- 3. CREATE DEMO TEACHER PROFILE
-- =====================================================
-- REPLACE 'teacher-auth-user-id' with actual auth user ID from Supabase

INSERT INTO teacher_profiles (
    id, 
    school_id, 
    user_id,
    full_name, 
    email, 
    phone, 
    designation, 
    specialization,
    date_of_joining, 
    status
)
VALUES (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid,
    '00000000-0000-0000-0000-000000000001'::uuid,
    'teacher-auth-user-id'::uuid,  -- REPLACE THIS
    'John Smith',
    'teacher@demo.school',
    '+1234567891',
    'Senior Teacher',
    'Mathematics',
    '2020-08-01',
    'active'
) ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    email = EXCLUDED.email;

-- Assign teacher to classes
INSERT INTO teacher_class_mapping (teacher_id, class_id, is_class_teacher, subject)
VALUES 
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid, '11111111-1111-1111-1111-111111111111'::uuid, true, 'Mathematics'),
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid, '22222222-2222-2222-2222-222222222222'::uuid, false, 'Mathematics')
ON CONFLICT DO NOTHING;

-- =====================================================
-- 4. CREATE DEMO STUDENTS
-- =====================================================

-- Student 1 (linked to auth user)
INSERT INTO students (
    id,
    school_id,
    class_id,
    user_id,
    student_id,
    full_name,
    name,
    email,
    phone,
    date_of_birth,
    dob,
    gender,
    admission_date,
    roll_number,
    status
)
VALUES (
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'::uuid,
    '00000000-0000-0000-0000-000000000001'::uuid,
    '11111111-1111-1111-1111-111111111111'::uuid,
    'student-auth-user-id'::uuid,  -- REPLACE THIS
    'STU001',
    'Emily Johnson',
    'Emily Johnson',
    'student@demo.school',
    '+1234567892',
    '2008-05-15',
    '2008-05-15',
    'female',
    '2023-04-01',
    101,
    'active'
) ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    email = EXCLUDED.email;

-- Student 2 (child of demo parent)
INSERT INTO students (
    id,
    school_id,
    class_id,
    student_id,
    full_name,
    name,
    email,
    phone,
    date_of_birth,
    dob,
    gender,
    admission_date,
    roll_number,
    status
)
VALUES (
    'cccccccc-cccc-cccc-cccc-cccccccccccc'::uuid,
    '00000000-0000-0000-0000-000000000001'::uuid,
    '22222222-2222-2222-2222-222222222222'::uuid,
    'STU002',
    'Michael Wilson',
    'Michael Wilson',
    'michael.wilson@demo.student',
    '+1234567893',
    '2009-08-22',
    '2009-08-22',
    'male',
    '2023-04-01',
    201,
    'active'
) ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    email = EXCLUDED.email;

-- =====================================================
-- 5. CREATE DEMO PARENT PROFILE
-- =====================================================

INSERT INTO parent_profiles (
    id,
    user_id,
    full_name,
    email,
    phone,
    occupation,
    status
)
VALUES (
    'dddddddd-dddd-dddd-dddd-dddddddddddd'::uuid,
    'parent-auth-user-id'::uuid,  -- REPLACE THIS
    'Robert Wilson',
    'parent@demo.school',
    '+1234567894',
    'Engineer',
    'active'
) ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    email = EXCLUDED.email;

-- Link parent to student
INSERT INTO parent_student_mapping (parent_id, student_id, relationship)
VALUES (
    'dddddddd-dddd-dddd-dddd-dddddddddddd'::uuid,
    'cccccccc-cccc-cccc-cccc-cccccccccccc'::uuid,
    'father'
) ON CONFLICT DO NOTHING;

-- =====================================================
-- 6. CREATE USER ROLES
-- =====================================================

-- Super Admin (no school association)
INSERT INTO user_roles (user_id, role, school_id, status)
VALUES (
    'superadmin-auth-user-id'::uuid,  -- REPLACE THIS
    'super_admin',
    null,
    'active'
) ON CONFLICT (user_id, role, school_id) DO UPDATE SET status = 'active';

-- School Admin
INSERT INTO user_roles (user_id, role, school_id, status)
VALUES (
    'admin-auth-user-id'::uuid,  -- REPLACE THIS
    'admin',
    '00000000-0000-0000-0000-000000000001'::uuid,
    'active'
) ON CONFLICT (user_id, role, school_id) DO UPDATE SET status = 'active';

-- Teacher
INSERT INTO user_roles (user_id, role, school_id, status)
VALUES (
    'teacher-auth-user-id'::uuid,  -- REPLACE THIS
    'teacher',
    '00000000-0000-0000-0000-000000000001'::uuid,
    'active'
) ON CONFLICT (user_id, role, school_id) DO UPDATE SET status = 'active';

-- Parent
INSERT INTO user_roles (user_id, role, school_id, status)
VALUES (
    'parent-auth-user-id'::uuid,  -- REPLACE THIS
    'parent',
    '00000000-0000-0000-0000-000000000001'::uuid,
    'active'
) ON CONFLICT (user_id, role, school_id) DO UPDATE SET status = 'active';

-- Student
INSERT INTO user_roles (user_id, role, school_id, status)
VALUES (
    'student-auth-user-id'::uuid,  -- REPLACE THIS
    'student',
    '00000000-0000-0000-0000-000000000001'::uuid,
    'active'
) ON CONFLICT (user_id, role, school_id) DO UPDATE SET status = 'active';

-- =====================================================
-- 7. CREATE SAMPLE HOMEWORK ASSIGNMENTS
-- =====================================================

INSERT INTO homework_assignments (
    id,
    school_id,
    class_id,
    teacher_id,
    title,
    description,
    subject,
    due_date,
    max_marks,
    status,
    is_published
)
VALUES 
    (
        'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee'::uuid,
        '00000000-0000-0000-0000-000000000001'::uuid,
        '11111111-1111-1111-1111-111111111111'::uuid,
        'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid,
        'Algebra Practice Problems',
        'Complete exercises 1-20 from Chapter 5',
        'Mathematics',
        (CURRENT_DATE + INTERVAL '7 days')::date,
        100,
        'published',
        true
    ),
    (
        'ffffffff-ffff-ffff-ffff-ffffffffffff'::uuid,
        '00000000-0000-0000-0000-000000000001'::uuid,
        '22222222-2222-2222-2222-222222222222'::uuid,
        'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid,
        'Geometry Assignment',
        'Solve the geometric proofs worksheet',
        'Mathematics',
        (CURRENT_DATE + INTERVAL '5 days')::date,
        50,
        'published',
        true
    )
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- 8. CREATE SAMPLE ATTENDANCE RECORDS
-- =====================================================

-- Last 10 days of attendance for student 1
INSERT INTO attendance_records (student_id, class_id, date, status)
SELECT 
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'::uuid,
    '11111111-1111-1111-1111-111111111111'::uuid,
    (CURRENT_DATE - (n || ' days')::interval)::date,
    CASE WHEN random() < 0.9 THEN 'present' ELSE 'absent' END
FROM generate_series(1, 10) AS n
ON CONFLICT DO NOTHING;

-- Last 10 days of attendance for student 2
INSERT INTO attendance_records (student_id, class_id, date, status)
SELECT 
    'cccccccc-cccc-cccc-cccc-cccccccccccc'::uuid,
    '22222222-2222-2222-2222-222222222222'::uuid,
    (CURRENT_DATE - (n || ' days')::interval)::date,
    CASE WHEN random() < 0.85 THEN 'present' ELSE 'absent' END
FROM generate_series(1, 10) AS n
ON CONFLICT DO NOTHING;

-- =====================================================
-- 9. CREATE SAMPLE FEE RECORDS
-- =====================================================

-- Fee types
INSERT INTO fee_types (id, name, description)
VALUES 
    ('99999999-9999-9999-9999-999999999991'::uuid, 'Tuition Fee', 'Monthly tuition fee'),
    ('99999999-9999-9999-9999-999999999992'::uuid, 'Library Fee', 'Annual library fee'),
    ('99999999-9999-9999-9999-999999999993'::uuid, 'Lab Fee', 'Science lab fee')
ON CONFLICT (id) DO NOTHING;

-- Fee structures
INSERT INTO fee_structures (
    id,
    school_id,
    class_id,
    fee_type_id,
    amount,
    frequency,
    status
)
VALUES 
    (
        '88888888-8888-8888-8888-888888888881'::uuid,
        '00000000-0000-0000-0000-000000000001'::uuid,
        '11111111-1111-1111-1111-111111111111'::uuid,
        '99999999-9999-9999-9999-999999999991'::uuid,
        5000,
        'monthly',
        'active'
    )
ON CONFLICT (id) DO NOTHING;

-- Fee records for students
INSERT INTO fee_records (
    student_id,
    fee_structure_id,
    school_id,
    amount,
    due_date,
    status
)
VALUES 
    (
        'cccccccc-cccc-cccc-cccc-cccccccccccc'::uuid,
        '88888888-8888-8888-8888-888888888881'::uuid,
        '00000000-0000-0000-0000-000000000001'::uuid,
        5000,
        (CURRENT_DATE + INTERVAL '15 days')::date,
        'pending'
    )
ON CONFLICT DO NOTHING;

-- =====================================================
-- 10. CREATE SAMPLE TIMETABLE
-- =====================================================

INSERT INTO timetable_slots (
    class_id,
    school_id,
    teacher_id,
    subject,
    day_of_week,
    start_time,
    end_time,
    room_number,
    is_active
)
VALUES 
    -- Monday
    ('11111111-1111-1111-1111-111111111111'::uuid, '00000000-0000-0000-0000-000000000001'::uuid, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid, 'Mathematics', 1, '09:00', '10:00', '101', true),
    ('11111111-1111-1111-1111-111111111111'::uuid, '00000000-0000-0000-0000-000000000001'::uuid, null, 'English', 1, '10:00', '11:00', '102', true),
    ('11111111-1111-1111-1111-111111111111'::uuid, '00000000-0000-0000-0000-000000000001'::uuid, null, 'Science', 1, '11:30', '12:30', '103', true),
    -- Tuesday
    ('11111111-1111-1111-1111-111111111111'::uuid, '00000000-0000-0000-0000-000000000001'::uuid, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid, 'Mathematics', 2, '09:00', '10:00', '101', true),
    ('11111111-1111-1111-1111-111111111111'::uuid, '00000000-0000-0000-0000-000000000001'::uuid, null, 'History', 2, '10:00', '11:00', '104', true),
    -- Wednesday
    ('11111111-1111-1111-1111-111111111111'::uuid, '00000000-0000-0000-0000-000000000001'::uuid, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid, 'Mathematics', 3, '09:00', '10:00', '101', true),
    ('11111111-1111-1111-1111-111111111111'::uuid, '00000000-0000-0000-0000-000000000001'::uuid, null, 'Geography', 3, '10:00', '11:00', '105', true),
    -- Thursday
    ('11111111-1111-1111-1111-111111111111'::uuid, '00000000-0000-0000-0000-000000000001'::uuid, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid, 'Mathematics', 4, '09:00', '10:00', '101', true),
    ('11111111-1111-1111-1111-111111111111'::uuid, '00000000-0000-0000-0000-000000000001'::uuid, null, 'Physical Education', 4, '11:30', '12:30', 'Gym', true),
    -- Friday
    ('11111111-1111-1111-1111-111111111111'::uuid, '00000000-0000-0000-0000-000000000001'::uuid, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid, 'Mathematics', 5, '09:00', '10:00', '101', true),
    ('11111111-1111-1111-1111-111111111111'::uuid, '00000000-0000-0000-0000-000000000001'::uuid, null, 'Art', 5, '10:00', '11:00', '201', true)
ON CONFLICT DO NOTHING;

-- =====================================================
-- 11. CREATE SAMPLE ANNOUNCEMENTS
-- =====================================================

INSERT INTO announcements (
    school_id,
    author_id,
    title,
    content,
    priority,
    target_audience,
    is_published
)
VALUES 
    (
        '00000000-0000-0000-0000-000000000001'::uuid,
        'admin-auth-user-id'::uuid,  -- REPLACE THIS
        'Welcome to New Academic Year',
        'We are excited to welcome everyone to the 2025-2026 academic year!',
        'high',
        ARRAY['students', 'parents', 'teachers'],
        true
    ),
    (
        '00000000-0000-0000-0000-000000000001'::uuid,
        'admin-auth-user-id'::uuid,  -- REPLACE THIS
        'Parent-Teacher Meeting',
        'PTM scheduled for next Saturday at 10 AM in the school auditorium.',
        'normal',
        ARRAY['parents'],
        true
    )
ON CONFLICT DO NOTHING;

-- =====================================================
-- COMPLETION MESSAGE
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE '============================================';
    RAISE NOTICE 'Demo data setup completed successfully!';
    RAISE NOTICE '============================================';
    RAISE NOTICE 'Next Steps:';
    RAISE NOTICE '1. Create auth users in Supabase Dashboard';
    RAISE NOTICE '2. Replace auth user IDs in this script';
    RAISE NOTICE '3. Run this script again';
    RAISE NOTICE '============================================';
END $$;
