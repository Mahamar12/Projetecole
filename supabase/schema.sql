-- ==========================================
-- EDUGESTION AFRICA - SCHÉMA SUPABASE SQL
-- Multi-Tenant & Franc CFA (XOF / XAF)
-- ==========================================

-- Active l'extension UUID si pas déjà activée
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. TABLES SAAS GLOBALE & ÉTABLISSEMENTS
CREATE TABLE IF NOT EXISTS public.schools (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    logo TEXT,
    slogan TEXT,
    address TEXT NOT NULL,
    city VARCHAR(100) DEFAULT 'Dakar',
    country VARCHAR(100) DEFAULT 'Sénégal',
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    website VARCHAR(255),
    academic_levels TEXT[] DEFAULT ARRAY['Prescolaire', 'Elementaire', 'Moyen', 'Secondaire'],
    currency VARCHAR(10) DEFAULT 'FCFA',
    timezone VARCHAR(50) DEFAULT 'Africa/Dakar',
    is_verified BOOLEAN DEFAULT TRUE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.school_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID UNIQUE REFERENCES public.schools(id) ON DELETE CASCADE,
    bulletin_template VARCHAR(50) DEFAULT 'CLASSIC_FRANCOPHONE',
    allow_parent_portal BOOLEAN DEFAULT TRUE,
    allow_online_payment BOOLEAN DEFAULT TRUE,
    wave_enabled BOOLEAN DEFAULT TRUE,
    orange_money_enabled BOOLEAN DEFAULT TRUE,
    free_money_enabled BOOLEAN DEFAULT FALSE,
    bank_transfer_enabled BOOLEAN DEFAULT TRUE,
    cash_enabled BOOLEAN DEFAULT TRUE,
    sms_sender_name VARCHAR(50) DEFAULT 'EduGestion',
    auto_sms_overdue BOOLEAN DEFAULT FALSE,
    auto_whatsapp_overdue BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. UTILISATEURS & RÔLES
CREATE TYPE user_role AS ENUM (
    'SUPER_ADMIN',
    'SCHOOL_ADMIN',
    'SECRETARY',
    'ACCOUNTANT',
    'TEACHER',
    'PARENT',
    'STUDENT'
);

CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE,
    email VARCHAR(255),
    phone VARCHAR(50),
    name VARCHAR(255) NOT NULL,
    role user_role DEFAULT 'PARENT',
    avatar TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. ENSEIGNANTS, PARENTS, ÉLÈVES
CREATE TABLE IF NOT EXISTS public.teachers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE,
    user_id UUID UNIQUE REFERENCES public.profiles(id) ON DELETE SET NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    gender VARCHAR(20) DEFAULT 'MALE',
    photo TEXT,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(100),
    specialty VARCHAR(100),
    contract_type VARCHAR(50) DEFAULT 'CDI',
    hire_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.parents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE,
    user_id UUID UNIQUE REFERENCES public.profiles(id) ON DELETE SET NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    whatsapp VARCHAR(50),
    email VARCHAR(100),
    profession VARCHAR(100),
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.classrooms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    level VARCHAR(50) NOT NULL,
    cycle VARCHAR(50) DEFAULT 'COLLEGE',
    capacity INT DEFAULT 35,
    room_number VARCHAR(50),
    main_teacher_id UUID REFERENCES public.teachers(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE,
    user_id UUID UNIQUE REFERENCES public.profiles(id) ON DELETE SET NULL,
    matricule VARCHAR(100) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    gender VARCHAR(20) NOT NULL,
    birth_date DATE NOT NULL,
    birth_place VARCHAR(100) NOT NULL,
    nationality VARCHAR(100) DEFAULT 'Sénégalaise',
    photo TEXT,
    address TEXT,
    current_class_id UUID REFERENCES public.classrooms(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.student_parents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES public.parents(id) ON DELETE CASCADE,
    relationship VARCHAR(50) DEFAULT 'Père',
    is_primary BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, parent_id)
);

-- 4. MATIÈRES & STRUCTURE PÉDAGOGIQUE
CREATE TABLE IF NOT EXISTS public.subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(50) NOT NULL,
    default_coeff NUMERIC(3,1) DEFAULT 2.0,
    color_code VARCHAR(20) DEFAULT '#3B82F6',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. FINANCES, FRAIS ET PAIEMENTS
CREATE TABLE IF NOT EXISTS public.fee_structures (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    fee_type VARCHAR(50) DEFAULT 'SCOLARITE',
    amount NUMERIC(12,2) NOT NULL,
    cycle VARCHAR(50),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE,
    receipt_number VARCHAR(100) UNIQUE NOT NULL,
    transaction_ref VARCHAR(100),
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES public.parents(id) ON DELETE SET NULL,
    amount NUMERIC(12,2) NOT NULL,
    method VARCHAR(50) DEFAULT 'CASH', -- WAVE, ORANGE_MONEY, CASH, etc.
    status VARCHAR(50) DEFAULT 'COMPLETED',
    paid_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. NOTES & ABSENCES
CREATE TABLE IF NOT EXISTS public.grades (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    score NUMERIC(4,2) NOT NULL, -- Note sur 20
    max_score NUMERIC(4,2) DEFAULT 20.0,
    coefficient NUMERIC(3,1) DEFAULT 1.0,
    term VARCHAR(50) DEFAULT 'TRIMESTRE_1',
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.attendances (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE,
    classroom_id UUID REFERENCES public.classrooms(id) ON DELETE CASCADE,
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
    date DATE DEFAULT CURRENT_DATE,
    status VARCHAR(20) DEFAULT 'PRESENT', -- PRESENT, ABSENT, RETARD, JUSTIFIE
    reason TEXT,
    late_minutes INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendances ENABLE ROW LEVEL SECURITY;

-- Exemples de stratégies RLS permissives pour la démo / dev
CREATE POLICY "Accès public en lecture pour les écoles" ON public.schools FOR SELECT USING (true);
CREATE POLICY "Accès profiles pour utilisateurs authentifiés" ON public.profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "Accès étudiants" ON public.students FOR ALL USING (true);
CREATE POLICY "Accès parents" ON public.parents FOR ALL USING (true);
CREATE POLICY "Accès enseignants" ON public.teachers FOR ALL USING (true);
CREATE POLICY "Accès paiements" ON public.payments FOR ALL USING (true);
CREATE POLICY "Accès notes" ON public.grades FOR ALL USING (true);
CREATE POLICY "Accès absences" ON public.attendances FOR ALL USING (true);
