-- ========================================================
-- ANDISLAB WORKSPACE V3 - SUPABASE DATABASE SCHEMA SETUP
-- Copy & Paste script ini di Supabase SQL Editor
-- ========================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Tasks Table (Kanban)
CREATE TABLE IF NOT EXISTS public.tasks (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    title TEXT NOT NULL,
    assignee TEXT NOT NULL,
    assignee_id TEXT,
    assignee_name TEXT,
    deadline DATE,
    priority TEXT NOT NULL DEFAULT 'Sedang',
    status TEXT NOT NULL DEFAULT 'Backlog',
    lead_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Leads Table (CRM Prospek)
CREATE TABLE IF NOT EXISTS public.leads (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    company_name TEXT NOT NULL,
    contact_name TEXT NOT NULL,
    contact_phone TEXT NOT NULL,
    segment TEXT NOT NULL DEFAULT 'Industri/Manufaktur',
    status TEXT NOT NULL DEFAULT 'New',
    order_type TEXT NOT NULL DEFAULT 'Ready Stock',
    next_follow_up DATE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Daily Routines Table (Brief Pagi & Review Atasan)
CREATE TABLE IF NOT EXISTS public.daily_routines (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    user_id TEXT NOT NULL,
    user_name TEXT NOT NULL,
    date DATE NOT NULL,
    morning_tasks JSONB DEFAULT '[]'::jsonb,
    afternoon_review TEXT DEFAULT '',
    evening_eval TEXT DEFAULT '',
    rating INTEGER DEFAULT 0,
    reviewed_by TEXT,
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Contact Logs Table (Log WA / Visit)
CREATE TABLE IF NOT EXISTS public.contact_logs (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    lead_id TEXT NOT NULL,
    method TEXT NOT NULL,
    note TEXT NOT NULL,
    outcome TEXT NOT NULL,
    created_by TEXT NOT NULL,
    created_by_name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Quotations Table (Penawaran Resmi)
CREATE TABLE IF NOT EXISTS public.quotations (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    quotation_number TEXT NOT NULL UNIQUE,
    lead_id TEXT NOT NULL,
    estimated_value NUMERIC NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'Draft',
    notes TEXT,
    valid_until DATE,
    items JSONB DEFAULT '[]'::jsonb,
    created_by TEXT NOT NULL,
    created_by_name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Comments Table (Komentar Task & Lead)
CREATE TABLE IF NOT EXISTS public.comments (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    target_id TEXT NOT NULL,
    target_type TEXT NOT NULL,
    user_id TEXT NOT NULL,
    user_name TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Shared Notes Table (Wiki SOP & Catatan Bersama)
CREATE TABLE IF NOT EXISTS public.shared_notes (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    created_by TEXT NOT NULL,
    created_by_name TEXT NOT NULL,
    last_edited_by_name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Activity Log Table (Riwayat Jejak Aktivitas Tim)
CREATE TABLE IF NOT EXISTS public.activity_log (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    action TEXT NOT NULL,
    detail TEXT NOT NULL,
    user_id TEXT NOT NULL,
    user_name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Enable Row Level Security (RLS) & Allow Anonymous Full Access for Team
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_routines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shared_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public full access on tasks" ON public.tasks FOR ALL USING (true);
CREATE POLICY "Allow public full access on leads" ON public.leads FOR ALL USING (true);
CREATE POLICY "Allow public full access on daily_routines" ON public.daily_routines FOR ALL USING (true);
CREATE POLICY "Allow public full access on contact_logs" ON public.contact_logs FOR ALL USING (true);
CREATE POLICY "Allow public full access on quotations" ON public.quotations FOR ALL USING (true);
CREATE POLICY "Allow public full access on comments" ON public.comments FOR ALL USING (true);
CREATE POLICY "Allow public full access on shared_notes" ON public.shared_notes FOR ALL USING (true);
CREATE POLICY "Allow public full access on activity_log" ON public.activity_log FOR ALL USING (true);

-- 11. Enable Realtime Replication for Instant Cross-Device Sync
ALTER PUBLICATION supabase_realtime ADD TABLE public.tasks;
ALTER PUBLICATION supabase_realtime ADD TABLE public.leads;
ALTER PUBLICATION supabase_realtime ADD TABLE public.daily_routines;
ALTER PUBLICATION supabase_realtime ADD TABLE public.quotations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.comments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.shared_notes;
ALTER PUBLICATION supabase_realtime ADD TABLE public.activity_log;
