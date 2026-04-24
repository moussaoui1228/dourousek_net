'use client';
import { supabase } from '@/lib/supabase';
import { useState } from 'react';

export default function Seed() {
  const [status, setStatus] = useState('Prêt à créer les professeurs');

  const seedProfessors = async () => {
    setStatus('Création en cours...');
    
    const profs = [
      { email: 'ahmed@prof.dourous.net', name: 'Ahmed Benali', subject: 'Mathématiques', bio: 'Professeur agrégé avec 15 ans d\'expérience.', img: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=200' },
      { email: 'sarah@prof.dourous.net', name: 'Sarah Mansouri', subject: 'Physique-Chimie', bio: 'Passionnée par les sciences expérimentales.', img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200' },
      { email: 'karim@prof.dourous.net', name: 'Karim Ziani', subject: 'Informatique (Python/JS)', bio: 'Expert en développement web.', img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200' },
      { email: 'lila@prof.dourous.net', name: 'Lila Haddad', subject: 'Français / Philosophie', bio: 'Aide les élèves à structurer leur pensée.', img: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=200' },
    ];

    for (const p of profs) {
      setStatus(`Création de ${p.name}...`);
      // 1. Sign up (This creates auth.users and triggers handle_new_user)
      const { data, error } = await supabase.auth.signUp({
        email: p.email,
        password: 'password123',
        options: {
          data: { role: 'professor', full_name: p.name }
        }
      });
      
      if (error) {
        if (error.message.includes('already registered')) {
            console.log(`${p.name} exists, skipping signup`);
            // We still want to update them though, but we need their ID
            // If they exist, we can sign in to get their ID
            const { data: signData } = await supabase.auth.signInWithPassword({ email: p.email, password: 'password123' });
            if (signData.user) {
                await supabase.from('professors').upsert({ id: signData.user.id, full_name: p.name, email: p.email, subject: p.subject, bio: p.bio, avatar_url: p.img });
            }
        } else {
            console.error(error);
            setStatus(`Erreur pour ${p.name}: ${error.message}`);
            return;
        }
      } else if (data.user) {
        // 2. Update their profile with specific data
        await supabase.from('professors').upsert({
          id: data.user.id,
          full_name: p.name,
          email: p.email,
          subject: p.subject,
          bio: p.bio,
          avatar_url: p.img
        });
      }
    }
    
    // Sign out at the end so the user can log in as student
    await supabase.auth.signOut();
    setStatus('✅ Terminé ! Tous les professeurs ont été créés avec succès.');
  };

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Générateur de Professeurs</h1>
      <button 
        onClick={seedProfessors}
        style={{ padding: '1rem 2rem', background: '#3b82f6', color: 'white', borderRadius: '8px', margin: '2rem 0', cursor: 'pointer', border: 'none' }}
      >
        Créer les 4 professeurs
      </button>
      <p style={{ fontSize: '1.2rem' }}>{status}</p>
    </div>
  );
}
