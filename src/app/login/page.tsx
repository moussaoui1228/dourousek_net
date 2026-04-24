'use client';

import { useState, useEffect, Suspense } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { BookOpen, User, Lock, Mail, ChevronRight } from 'lucide-react';
import Link from 'next/link';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole = searchParams.get('role') === 'professor' ? 'professor' : 'student';

  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState<'student' | 'professor'>(initialRole);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (searchParams.get('role')) {
      setRole(searchParams.get('role') === 'professor' ? 'professor' : 'student');
    }
  }, [searchParams]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.push(`/${role}`);
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              role: role,
            },
          },
        });
        if (error) throw error;
        router.push(`/${role}`);
      }
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', background: 'rgba(37, 99, 235, 0.1)', padding: '0.5rem', borderRadius: '12px' }}>
        <button
          type="button"
          onClick={() => setRole('student')}
          style={{
            flex: 1, padding: '0.75rem', borderRadius: '8px', fontWeight: 600,
            background: role === 'student' ? 'var(--primary)' : 'transparent',
            color: role === 'student' ? 'white' : 'var(--text-muted)',
            transition: 'all 0.3s'
          }}
        >
          Élève
        </button>
        <button
          type="button"
          onClick={() => setRole('professor')}
          style={{
            flex: 1, padding: '0.75rem', borderRadius: '8px', fontWeight: 600,
            background: role === 'professor' ? 'var(--primary)' : 'transparent',
            color: role === 'professor' ? 'white' : 'var(--text-muted)',
            transition: 'all 0.3s'
          }}
        >
          Professeur
        </button>
      </div>

      <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {!isLogin && (
          <div className="input-group">
            <label className="input-label">Nom complet</label>
            <div style={{ position: 'relative' }}>
              <User size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                required
                className="input-field"
                style={{ width: '100%', paddingLeft: '3rem' }}
                placeholder="Votre nom"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
          </div>
        )}

        <div className="input-group">
          <label className="input-label">Adresse Email</label>
          <div style={{ position: 'relative' }}>
            <Mail size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="email"
              required
              className="input-field"
              style={{ width: '100%', paddingLeft: '3rem' }}
              placeholder="vous@exemple.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div className="input-group">
          <label className="input-label">Mot de passe</label>
          <div style={{ position: 'relative' }}>
            <Lock size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="password"
              required
              className="input-field"
              style={{ width: '100%', paddingLeft: '3rem' }}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        {error && (
          <div style={{ padding: '0.75rem', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', fontSize: '0.875rem', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
            {error}
          </div>
        )}

        <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1rem', marginTop: '0.5rem' }} disabled={loading}>
          {loading ? 'Chargement...' : (isLogin ? 'Se connecter' : 'Créer mon compte')}
        </button>
      </form>

      <div style={{ marginTop: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        {isLogin ? "Pas encore de compte ? " : "Déjà un compte ? "}
        <button type="button" onClick={() => setIsLogin(!isLogin)} style={{ color: 'var(--primary)', fontWeight: 600, background: 'none' }}>
          {isLogin ? "S'inscrire" : "Se connecter"}
        </button>
      </div>
    </div>
  );
}

export default function Login() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <Link href="/" style={{ position: 'absolute', top: '2rem', left: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
        <BookOpen size={24} color="#2563eb" /> Dourous<span style={{ color: 'var(--primary)' }}>Net</span>
      </Link>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="glass-panel" 
        style={{ width: '100%', maxWidth: '450px', padding: '3rem 2rem' }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>Bienvenue</h1>
          <p style={{ color: 'var(--text-muted)' }}>Connectez-vous pour continuer</p>
        </div>
        
        <Suspense fallback={<div>Chargement...</div>}>
          <LoginForm />
        </Suspense>
      </motion.div>
    </div>
  );
}
