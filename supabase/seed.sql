DO $$
DECLARE
    prof1_id UUID := gen_random_uuid();
    prof2_id UUID := gen_random_uuid();
    prof3_id UUID := gen_random_uuid();
    prof4_id UUID := gen_random_uuid();
BEGIN
    -- 1. On crée les comptes dans auth.users
    INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, raw_user_meta_data, created_at, updated_at)
    VALUES
    (prof1_id, 'authenticated', 'authenticated', 'ahmed_final@dourous.net', crypt('password123', gen_salt('bf')), now(), '{"role": "professor", "full_name": "Ahmed Benali"}', now(), now()),
    (prof2_id, 'authenticated', 'authenticated', 'sarah_final@dourous.net', crypt('password123', gen_salt('bf')), now(), '{"role": "professor", "full_name": "Sarah Mansouri"}', now(), now()),
    (prof3_id, 'authenticated', 'authenticated', 'karim_final@dourous.net', crypt('password123', gen_salt('bf')), now(), '{"role": "professor", "full_name": "Karim Ziani"}', now(), now()),
    (prof4_id, 'authenticated', 'authenticated', 'lila_final@dourous.net', crypt('password123', gen_salt('bf')), now(), '{"role": "professor", "full_name": "Lila Haddad"}', now(), now());

    -- 2. On FORCE l'insertion dans la table professors (pour ignorer les problèmes de triggers)
    INSERT INTO public.professors (id, full_name, email, subject, bio, avatar_url)
    VALUES
    (prof1_id, 'Ahmed Benali', 'ahmed_final@dourous.net', 'Mathématiques', 'Professeur agrégé avec 15 ans d''expérience.', 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=200'),
    (prof2_id, 'Sarah Mansouri', 'sarah_final@dourous.net', 'Physique-Chimie', 'Passionnée par les sciences expérimentales.', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200'),
    (prof3_id, 'Karim Ziani', 'karim_final@dourous.net', 'Informatique (Python/JS)', 'Expert en développement web.', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200'),
    (prof4_id, 'Lila Haddad', 'lila_final@dourous.net', 'Français / Philosophie', 'Aide les élèves à structurer leur pensée.', 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=200')
    ON CONFLICT (id) DO UPDATE SET 
        full_name = EXCLUDED.full_name,
        subject = EXCLUDED.subject, 
        bio = EXCLUDED.bio, 
        avatar_url = EXCLUDED.avatar_url;

END $$;
