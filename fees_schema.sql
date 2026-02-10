CREATE TABLE IF NOT EXISTS public.fee_records (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID REFERENCES public.students(id),
    fee_structure_id UUID REFERENCES public.fee_structures(id),
    amount DECIMAL(10,2) NOT NULL,
    paid_amount DECIMAL(10,2) DEFAULT 0,
    status TEXT CHECK (status IN ('pending', 'partial', 'paid')),
    due_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.payment_records (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    fee_record_id UUID REFERENCES public.fee_records(id),
    amount DECIMAL(10,2) NOT NULL,
    payment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    payment_method TEXT,
    transaction_id TEXT,
    collected_by UUID REFERENCES auth.users(id)
);

ALTER TABLE public.fee_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable all access for authenticated users" ON public.fee_records FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Enable all access for authenticated users" ON public.payment_records FOR ALL USING (auth.role() = 'authenticated');
