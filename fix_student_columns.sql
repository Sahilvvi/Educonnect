-- Fix missing columns in students table
-- This adds 'name', 'full_name', 'dob', 'date_of_birth' to ensure compatibility.

DO $$ 
BEGIN 
  -- Add 'name' if missing
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'students' AND column_name = 'name') THEN
    ALTER TABLE public.students ADD COLUMN name TEXT;
  END IF;

  -- Add 'full_name' if missing
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'students' AND column_name = 'full_name') THEN
    ALTER TABLE public.students ADD COLUMN full_name TEXT;
  END IF;

  -- Add 'dob' if missing
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'students' AND column_name = 'dob') THEN
    ALTER TABLE public.students ADD COLUMN dob DATE;
  END IF;

  -- Add 'date_of_birth' if missing
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'students' AND column_name = 'date_of_birth') THEN
    ALTER TABLE public.students ADD COLUMN date_of_birth DATE;
  END IF;

  -- Add 'admission_date' if missing
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'students' AND column_name = 'admission_date') THEN
    ALTER TABLE public.students ADD COLUMN admission_date DATE DEFAULT CURRENT_DATE;
  END IF;
  
   -- Add 'student_id' if missing
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'students' AND column_name = 'student_id') THEN
    ALTER TABLE public.students ADD COLUMN student_id TEXT;
  END IF;

END $$;
