-- Fix missing columns in existing tables
-- Run this BEFORE running create_demo_accounts.sql

-- Add missing columns to announcements table
ALTER TABLE announcements 
ADD COLUMN IF NOT EXISTS is_published boolean DEFAULT true;

ALTER TABLE announcements 
ADD COLUMN IF NOT EXISTS priority text DEFAULT 'normal';

ALTER TABLE announcements 
ADD COLUMN IF NOT EXISTS target_audience text[] DEFAULT ARRAY['all'];

-- Add missing columns to homework_assignments table
ALTER TABLE homework_assignments 
ADD COLUMN IF NOT EXISTS is_published boolean DEFAULT false;

ALTER TABLE homework_assignments 
ADD COLUMN IF NOT EXISTS status text DEFAULT 'draft';

-- Add missing columns to timetable_slots table (if not exists)
ALTER TABLE timetable_slots 
ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true;

-- Add missing columns to fee_records table
ALTER TABLE fee_records 
ADD COLUMN IF NOT EXISTS fee_structure_id uuid;

-- Success message
DO $$
BEGIN
    RAISE NOTICE '============================================';
    RAISE NOTICE 'Missing columns added successfully!';
    RAISE NOTICE '============================================';
END $$;
