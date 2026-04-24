'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { LogOut, Book, Calendar as CalendarIcon, Upload, CheckCircle, XCircle, Clock, User as UserIcon } from 'lucide-react';

export default function StudentDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [professors, setProfessors] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'sessions' | 'professors'>('sessions');
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Booking state
  const [bookingProf, setBookingProf] = useState<any>(null);
  const [sessionTitle, setSessionTitle] = useState('');
  const [sessionDate, setSessionDate] = useState('');
  const [sessionFile, setSessionFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

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
    // Ensure student profile exists
    const { error: insertError } = await supabase.from('students').upsert({
      id: currentUser.id,
      full_name: currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0],
      email: currentUser.email
    }, { onConflict: 'id', ignoreDuplicates: true });
    
    if (insertError) {
      console.error("Insert Student Error:", insertError);
    }

    // Fetch sessions
    const { data: sessionData, error: sessionError } = await supabase
      .from('sessions')
      .select('*, professors(full_name, subject)')
      .eq('student_id', currentUser.id)
      .order('scheduled_at', { ascending: true });
    
    if (sessionError) {
      console.error("Session fetch error:", sessionError);
      setFetchError(prev => (prev ? prev + ' | ' : '') + 'Session Error: ' + sessionError.message);
    }
    if (sessionData) setSessions(sessionData);

    // Fetch professors
    const { data: profData, error: profError } = await supabase
      .from('professors')
      .select('*');
    
    if (profError) {
      console.error("Prof fetch error:", profError);
      setFetchError(prev => (prev ? prev + ' | ' : '') + 'Prof Error: ' + profError.message);
    }
    if (profData) setProfessors(profData);
    
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const handleBookSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingProf || !user) return;
    setUploading(true);

    try {
      let file_url = null;
      if (sessionFile) {
        const fileExt = sessionFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('session-files')
          .upload(filePath, sessionFile);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from('session-files').getPublicUrl(filePath);
        file_url = data.publicUrl;
      }

      const { error } = await supabase.from('sessions').insert({
        student_id: user.id,
        professor_id: bookingProf.id,
        title: sessionTitle,
        scheduled_at: new Date(sessionDate).toISOString(),
        file_url: file_url,
      });

      if (error) throw error;

      setBookingProf(null);
      setSessionTitle('');
      setSessionDate('');
      setSessionFile(null);
      fetchData(user);
      setActiveTab('sessions');
    } catch (error: any) {
      alert(error.message);
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Chargement...</div>;

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', padding: '1rem', background: 'var(--glass-bg)', borderRadius: '16px', border: 'var(--glass-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <UserIcon color="white" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Espace Élève</h1>
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
          Mes Séances
        </button>
        <button 
          className={`btn ${activeTab === 'professors' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('professors')}
        >
          Trouver un Professeur
        </button>
      </div>

      {fetchError && (
        <div style={{ padding: '1rem', background: '#fee2e2', color: '#991b1b', borderRadius: '8px', marginBottom: '1rem' }}>
          <strong>Erreur de chargement:</strong> {fetchError}
        </div>
      )}

      {activeTab === 'sessions' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="sessions-grid">
          {sessions.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>Aucune séance pour le moment.</p>
          ) : (
            sessions.map((session) => (
              <div key={session.id} className="glass-panel" style={{ position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: session.status === 'confirmed' ? 'var(--accent)' : session.status === 'cancelled' ? 'var(--danger)' : '#fbbf24' }} />
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <h3 style={{ fontWeight: 600, fontSize: '1.125rem' }}>{session.title}</h3>
                  <span className={`status-badge status-${session.status}`}>
                    {session.status === 'confirmed' ? <CheckCircle size={14} style={{display:'inline', marginRight:'4px'}}/> : 
                     session.status === 'cancelled' ? <XCircle size={14} style={{display:'inline', marginRight:'4px'}}/> : 
                     <Clock size={14} style={{display:'inline', marginRight:'4px'}}/>}
                    {session.status}
                  </span>
                </div>
                
                <p style={{ color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <UserIcon size={16} /> Prof. {session.professors?.full_name} ({session.professors?.subject})
                </p>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CalendarIcon size={16} /> {new Date(session.scheduled_at).toLocaleString()}
                </p>
                
                {session.file_url && (
                  <a href={session.file_url} target="_blank" rel="noreferrer" className="btn btn-outline" style={{ width: '100%', fontSize: '0.875rem' }}>
                    <Book size={16} /> Voir le devoir (PDF)
                  </a>
                )}
              </div>
            ))
          )}
        </motion.div>
      )}

      {activeTab === 'professors' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="sessions-grid">
          {professors.map((prof) => (
            <div key={prof.id} className="glass-panel" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              {prof.avatar_url ? (
                <img src={prof.avatar_url} alt={prof.full_name} style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', marginBottom: '1rem', border: '2px solid var(--primary)' }} />
              ) : (
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                  <UserIcon color="white" size={32} />
                </div>
              )}
              <h3 style={{ fontWeight: 600, fontSize: '1.25rem', marginBottom: '0.25rem' }}>{prof.full_name}</h3>
              <p style={{ color: 'var(--primary)', fontWeight: 500, marginBottom: '0.5rem' }}>{prof.subject}</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem', flex: 1 }}>{prof.bio}</p>
              
              <button 
                className="btn btn-primary" 
                style={{ marginTop: 'auto', width: '100%' }}
                onClick={() => setBookingProf(prof)}
              >
                Réserver une séance
              </button>
            </div>
          ))}
        </motion.div>
      )}

      {/* Booking Modal */}
      {bookingProf && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            className="glass-panel" 
            style={{ width: '100%', maxWidth: '500px', position: 'relative' }}
          >
            <button 
              onClick={() => setBookingProf(null)} 
              style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', color: 'var(--text-muted)' }}
            >
              <XCircle size={24} />
            </button>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1.5rem' }}>Réserver avec {bookingProf.full_name}</h2>
            
            <form onSubmit={handleBookSession}>
              <div className="input-group">
                <label className="input-label">Titre de la séance (ex: Aide en Algèbre)</label>
                <input required type="text" className="input-field" value={sessionTitle} onChange={e => setSessionTitle(e.target.value)} />
              </div>
              <div className="input-group">
                <label className="input-label">Date et Heure</label>
                <input required type="datetime-local" className="input-field" value={sessionDate} onChange={e => setSessionDate(e.target.value)} />
              </div>
              <div className="input-group">
                <label className="input-label">Devoir (PDF optionnel)</label>
                <input type="file" accept=".pdf" onChange={e => setSessionFile(e.target.files?.[0] || null)} className="input-field" style={{ padding: '0.5rem' }} />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={uploading}>
                {uploading ? 'Réservation en cours...' : 'Confirmer la réservation'}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
