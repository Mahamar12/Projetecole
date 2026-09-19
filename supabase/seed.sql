-- ==========================================
-- EDUGESTION AFRICA - DONNÉES DÉMO DE TEST (SEED)
-- École Internationale du Sénégal (Dakar)
-- Devises en FCFA (XOF)
-- ==========================================

-- 1. INSÉRER L'ÉCOLE DÉMO
INSERT INTO public.schools (id, name, code, slug, address, city, country, phone, email, currency)
VALUES (
    'a1b2c3d4-e5f6-7890-abcd-111111111111',
    'École Internationale du Sénégal',
    'EIS-DAKAR',
    'eis-dakar',
    'Avenue Cheikh Anta Diop, Fann-Mermoz',
    'Dakar',
    'Sénégal',
    '+221 33 824 55 00',
    'contact@eis-dakar.sn',
    'FCFA'
) ON CONFLICT (code) DO NOTHING;

-- 2. PARAMÈTRES ÉCOLE (Wave & Orange Money activés)
INSERT INTO public.school_settings (school_id, wave_enabled, orange_money_enabled, free_money_enabled)
VALUES (
    'a1b2c3d4-e5f6-7890-abcd-111111111111',
    TRUE,
    TRUE,
    TRUE
) ON CONFLICT (school_id) DO NOTHING;

-- 3. CLASSES DÉMO
INSERT INTO public.classrooms (id, school_id, name, level, cycle, capacity, room_number)
VALUES
    ('c1111111-1111-1111-1111-111111111111', 'a1b2c3d4-e5f6-7890-abcd-111111111111', '6ème A', '6ème', 'COLLEGE', 35, 'Salle 102'),
    ('c2222222-2222-2222-2222-222222222222', 'a1b2c3d4-e5f6-7890-abcd-111111111111', '3ème B', '3ème', 'COLLEGE', 30, 'Salle 204'),
    ('c3333333-3333-3333-3333-333333333333', 'a1b2c3d4-e5f6-7890-abcd-111111111111', 'Terminale S2', 'Terminale', 'LYCEE', 28, 'Labo Ph-Chie')
ON CONFLICT (id) DO NOTHING;

-- 4. MATIÈRES DÉMO
INSERT INTO public.subjects (id, school_id, name, code, default_coeff, color_code)
VALUES
    ('s1111111-1111-1111-1111-111111111111', 'a1b2c3d4-e5f6-7890-abcd-111111111111', 'Mathématiques', 'MATH', 4.0, '#2563EB'),
    ('s2222222-2222-2222-2222-222222222222', 'a1b2c3d4-e5f6-7890-abcd-111111111111', 'Français', 'FR', 3.0, '#DC2626'),
    ('s3333333-3333-3333-3333-333333333333', 'a1b2c3d4-e5f6-7890-abcd-111111111111', 'Physique-Chimie', 'PC', 3.0, '#059669'),
    ('s4444444-4444-4444-4444-444444444444', 'a1b2c3d4-e5f6-7890-abcd-111111111111', 'Anglais', 'ANG', 2.0, '#7C3AED')
ON CONFLICT (id) DO NOTHING;

-- 5. ÉLÈVES DÉMO
INSERT INTO public.students (id, school_id, matricule, first_name, last_name, gender, birth_date, birth_place, current_class_id)
VALUES
    ('e1111111-1111-1111-1111-111111111111', 'a1b2c3d4-e5f6-7890-abcd-111111111111', 'MAT-2024-001', 'Moussa', 'DIOP', 'MALE', '2011-04-12', 'Dakar', 'c1111111-1111-1111-1111-111111111111'),
    ('e2222222-2222-2222-2222-222222222222', 'a1b2c3d4-e5f6-7890-abcd-111111111111', 'MAT-2024-002', 'Awa', 'SOW', 'FEMALE', '2008-09-25', 'Thiès', 'c2222222-2222-2222-2222-222222222222'),
    ('e3333333-3333-3333-3333-333333333333', 'a1b2c3d4-e5f6-7890-abcd-111111111111', 'MAT-2024-003', 'Ousmane', 'SARR', 'MALE', '2006-01-15', 'Saint-Louis', 'c3333333-3333-3333-3333-333333333333')
ON CONFLICT (matricule) DO NOTHING;

-- 6. PAIEMENTS DÉMO (WAVE & ORANGE MONEY FCFA)
INSERT INTO public.payments (school_id, receipt_number, transaction_ref, student_id, amount, method, status, note)
VALUES
    ('a1b2c3d4-e5f6-7890-abcd-111111111111', 'REC-2024-001', 'WAV-SN-98231', 'e1111111-1111-1111-1111-111111111111', 50000, 'WAVE', 'COMPLETED', 'Scolarité Octobre - Moussa DIOP'),
    ('a1b2c3d4-e5f6-7890-abcd-111111111111', 'REC-2024-002', 'OM-SN-44321', 'e2222222-2222-2222-2222-222222222222', 65000, 'ORANGE_MONEY', 'COMPLETED', 'Scolarité Octobre - Awa SOW');
