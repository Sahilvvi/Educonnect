-- =====================================================
-- COMPLETE DATABASE SETUP - ALL IN ONE
-- Run this ONCE to set up everything
-- =====================================================

-- First, ensure announcements table has all columns
ALTER TABLE announcements 
ADD COLUMN IF NOT EXISTS is_published boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS priority text DEFAULT 'normal',
ADD COLUMN IF NOT EXISTS target_audience text[] DEFAULT ARRAY['all'];

-- Fix homework_assignments
ALTER TABLE homework_assignments 
ADD COLUMN IF NOT EXISTS is_published boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS status text DEFAULT 'draft';

-- Fix timetable_slots
ALTER TABLE timetable_slots 
ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true;

-- Fix fee_records
ALTER TABLE fee_records 
ADD COLUMN IF NOT EXISTS fee_structure_id uuid;

-- Make sure user_roles table exists with proper columns
CREATE TABLE IF NOT EXISTS user_roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    role text NOT NULL,
    school_id uuid,
    status text DEFAULT 'active',
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    UNIQUE(user_id, role, school_id)
);

-- Success message
DO $$
BEGIN
    RAISE NOTICE '============================================';
    RAISE NOTICE 'Database setup completed!';
    RAISE NOTICE 'Your app should work now.';
    RAISE NOTICE '============================================';
END $$;
