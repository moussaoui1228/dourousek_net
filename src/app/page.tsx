'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { BookOpen, Calendar, Video, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <main>
      <nav className="glass-nav" style={{ padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold', fontSize: '1.5rem' }}>
          <BookOpen className="text-primary" size={32} color="#3b82f6" />
          <span>Dourous<span style={{ color: 'var(--primary)' }}>Net</span></span>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link href="/login?role=student" className="btn btn-outline">Espace Élève</Link>
          <Link href="/login?role=professor" className="btn btn-primary">Espace Professeur</Link>
        </div>
      </nav>

      <div className="page-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 80px)', textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ maxWidth: '800px' }}
        >
          <div style={{ display: 'inline-block', padding: '0.5rem 1rem', background: 'rgba(37, 99, 235, 0.1)', border: '1px solid rgba(37, 99, 235, 0.2)', borderRadius: '999px', color: '#2563eb', marginBottom: '1.5rem', fontWeight: 500 }}>
            L'éducation réinventée, en ligne.
          </div>
          <h1 className="hero-title">Trouvez le professeur idéal, réservez votre succès.</h1>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', marginBottom: '2.5rem', lineHeight: 1.6 }}>
            DourousNet connecte les étudiants ambitieux avec les meilleurs professeurs. Gérez vos séances, partagez des devoirs et progressez ensemble.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/login?role=student" className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.125rem' }}>
              Commencer en tant qu'élève <ArrowRight size={20} />
            </Link>
            <Link href="/login?role=professor" className="btn btn-outline" style={{ padding: '1rem 2rem', fontSize: '1.125rem' }}>
              Devenir Professeur
            </Link>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', width: '100%', marginTop: '5rem' }}
        >
          {[
            { icon: <BookOpen size={32} color="#2563eb" />, title: 'Soutien Personnalisé', desc: 'Des professeurs qualifiés dans toutes les matières pour un accompagnement sur-mesure.' },
            { icon: <Calendar size={32} color="#0284c7" />, title: 'Gestion Simplifiée', desc: 'Planifiez, confirmez ou annulez vos séances de cours en quelques clics.' },
            { icon: <Video size={32} color="#0369a1" />, title: 'Ressources Centralisées', desc: 'Partagez vos devoirs et corrigés au format PDF directement sur la plateforme.' }
          ].map((feature, idx) => (
            <div key={idx} className="glass-panel" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1rem' }}>
              <div style={{ padding: '1rem', background: 'rgba(37, 99, 235, 0.1)', borderRadius: '50%' }}>
                {feature.icon}
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{feature.title}</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.5 }}>{feature.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </main>
  );
}
