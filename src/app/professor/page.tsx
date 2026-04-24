'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { LogOut, Book, Calendar as CalendarIcon, CheckCircle, XCircle, Clock, User as UserIcon, Upload, Save } from 'lucide-react';

export default function ProfessorDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'sessions' | 'profile'>('sessions');
  const [profile, setProfile] = useState({ full_name: '', subject: '', bio: '', avatar_url: '' });
  const [updating, setUpdating] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        router.push('/login');
        return;
      }
      setUser(user);
      fetchData(user);
    };
    fetchUser();
  }, [router]);

  async function fetchData(currentUser: any) {
    setLoading(true);

    // Ensure professor profile exists
    const { error: insertError } = await supabase.from('professors').upsert({
      id: currentUser.id,
      full_name: currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0],
      email: currentUser.email,
      subject: 'À définir'
    }, { onConflict: 'id', ignoreDuplicates: true });
    
    if (insertError) {
      console.error("Insert Prof Error:", insertError);
    }

    const { data: sessionData, error: sessionError } = await supabase
      .from('sessions')
      .select('*, students(full_name)')
      .eq('professor_id', currentUser.id)
      .order('scheduled_at', { ascending: true });
    
    if (sessionError) {
      console.error("Session fetch error:", sessionError);
      setFetchError(prev => (prev ? prev + ' | ' : '') + 'Session Error: ' + sessionError.message);
    }
    if (sessionData) setSessions(sessionData);

    const { data: profData, error: profError } = await supabase
      .from('professors')
      .select('*')
      .eq('id', currentUser.id)
      .maybeSingle();
    
    if (profError) {
      console.error("Prof fetch error:", profError);
      setFetchError(prev => (prev ? prev + ' | ' : '') + 'Prof Error: ' + profError.message);
    }
    
    if (profData) {
      setProfile({
        full_name: profData.full_name || '',
        subject: profData.subject || '',
        bio: profData.bio || '',
        avatar_url: profData.avatar_url || ''
      });
    }

    setLoading(false);
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const updateSessionStatus = async (sessionId: string, newStatus: 'confirmed' | 'cancelled') => {
    try {
      const { error } = await supabase
        .from('sessions')
        .update({ status: newStatus })
        .eq('id', sessionId);

      if (error) throw error;
      
      // Update local state
      setSessions(sessions.map(s => s.id === sessionId ? { ...s, status: newStatus } : s));
    } catch (error: any) {
      alert(error.message);
    }
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Chargement...</div>;

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setUpdating(true);
    try {
      const { error } = await supabase.from('professors').update({
        full_name: profile.full_name,
        subject: profile.subject,
        bio: profile.bio,
        avatar_url: profile.avatar_url
      }).eq('id', user.id);

      if (error) throw error;
      alert('Profil mis à jour avec succès !');
    } catch (error: any) {
      alert("Erreur lors de la mise à jour: " + error.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleUploadAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}-${Math.random()}.${fileExt}`;

    try {
      // Tente d'abord le bucket 'avatars', sinon 'session-files'
      let bucket = 'avatars';
      let uploadResult = await supabase.storage.from(bucket).upload(fileName, file);
      
      if (uploadResult.error) {
        bucket = 'session-files';
        uploadResult = await supabase.storage.from(bucket).upload(fileName, file);
        if (uploadResult.error) throw uploadResult.error;
      }

      const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
      setProfile({ ...profile, avatar_url: data.publicUrl });
    } catch (error: any) {
      alert("Erreur d'upload de l'image: " + error.message);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', padding: '1rem', background: 'var(--glass-bg)', borderRadius: '16px', border: 'var(--glass-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <UserIcon color="white" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Espace Professeur</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{user?.email}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="btn btn-outline" style={{ gap: '0.5rem' }}>
          <LogOut size={18} /> Déconnexion
        </button>
      </header>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <button 
          className={`btn ${activeTab === 'sessions' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('sessions')}
        >
          Vos Séances
        </button>
        <button 
          className={`btn ${activeTab === 'profile' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('profile')}
        >
          Mon Profil
        </button>
      </div>

      {fetchError && (
        <div style={{ padding: '1rem', background: '#fee2e2', color: '#991b1b', borderRadius: '8px', marginBottom: '1rem' }}>
          <strong>Erreur de chargement:</strong> {fetchError}
        </div>
      )}

      {activeTab === 'sessions' && (
        <>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1.5rem' }}>Vos Séances</h2>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="sessions-grid">
            {sessions.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>Aucune séance prévue pour le moment.</p>
            ) : (
              sessions.map((session) => (
                <div key={session.id} className="glass-panel" style={{ position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: session.status === 'confirmed' ? 'var(--accent)' : session.status === 'cancelled' ? 'var(--danger)' : '#fbbf24' }} />
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <h3 style={{ fontWeight: 600, fontSize: '1.125rem' }}>{session.title}</h3>
                    <span className={`status-badge status-${session.status}`}>
                      {session.status}
                    </span>
                  </div>
                  
                  <p style={{ color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <UserIcon size={16} /> Élève: {session.students?.full_name}
                  </p>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CalendarIcon size={16} /> {new Date(session.scheduled_at).toLocaleString()}
                  </p>
                  
                  {session.file_url && (
                    <a href={session.file_url} target="_blank" rel="noreferrer" className="btn btn-outline" style={{ width: '100%', fontSize: '0.875rem', marginBottom: '1rem' }}>
                      <Book size={16} /> Voir le devoir de l&apos;élève (PDF)
                    </a>
                  )}

                  {session.status === 'pending' && (
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                      <button 
                        className="btn btn-accent" 
                        style={{ flex: 1, padding: '0.5rem', fontSize: '0.875rem' }}
                        onClick={() => updateSessionStatus(session.id, 'confirmed')}
                      >
                        <CheckCircle size={16} /> Confirmer
                      </button>
                      <button 
                        className="btn btn-danger" 
                        style={{ flex: 1, padding: '0.5rem', fontSize: '0.875rem' }}
                        onClick={() => updateSessionStatus(session.id, 'cancelled')}
                      >
                        <XCircle size={16} /> Annuler
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </motion.div>
        </>
      )}

      {activeTab === 'profile' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-panel" style={{ maxWidth: '600px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1.5rem' }}>Modifier mon profil</h2>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt="Avatar" style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--primary)' }} />
            ) : (
              <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <UserIcon color="white" size={40} />
              </div>
            )}
            <div>
              <label className="btn btn-outline" style={{ cursor: 'pointer' }}>
                <Upload size={18} /> Changer la photo
                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleUploadAvatar} />
              </label>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.5rem' }}>PNG, JPG jusqu&apos;à 2MB</p>
            </div>
          </div>

          <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label className="input-label">Nom complet</label>
              <input type="text" className="input-field" value={profile.full_name} onChange={e => setProfile({...profile, full_name: e.target.value})} required />
            </div>
            
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label className="input-label">Matière enseignée</label>
              <input type="text" className="input-field" placeholder="Ex: Mathématiques, Physique..." value={profile.subject} onChange={e => setProfile({...profile, subject: e.target.value})} required />
            </div>
            
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label className="input-label">URL de l&apos;image (Optionnel)</label>
              <input type="text" className="input-field" placeholder="https://..." value={profile.avatar_url} onChange={e => setProfile({...profile, avatar_url: e.target.value})} />
            </div>

            <div className="input-group" style={{ marginBottom: 0 }}>
              <label className="input-label">Biographie</label>
              <textarea className="input-field" rows={4} placeholder="Parlez de votre expérience..." value={profile.bio} onChange={e => setProfile({...profile, bio: e.target.value})}></textarea>
            </div>

            <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }} disabled={updating}>
              <Save size={18} /> {updating ? 'Enregistrement...' : 'Enregistrer les modifications'}
            </button>
          </form>
        </motion.div>
      )}
    </div>
  );
}
