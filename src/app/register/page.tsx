'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import Navbar from '@/components/Navbar';

export default function RegisterPage() {
  const [form, setForm] = useState({ username: '', email: '', password: '', fullName: '', bio: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuthStore();
  const router = useRouter();

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await authApi.register(form);
      const { accessToken, user } = res.data.data;
      setAuth(accessToken, user);
      router.push('/offers');
    } catch (err: any) {
      const ve = err.response?.data?.validationErrors;
      if (ve) setError(Object.values(ve).join(' · '));
      else setError(err.response?.data?.message || 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 64px)', padding: '2rem 1.5rem' }}>
        <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', top: '15%', right: '15%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%)' }} />
        </div>
        <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 440 }}>
          <div className="card animate-slide-up" style={{ padding: '2.5rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{ width: 52, height: 52, borderRadius: '0.9rem', background: 'linear-gradient(135deg, #7C3AED, #EC4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', fontWeight: 900, color: '#fff', margin: '0 auto 1rem' }}>S</div>
              <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.4rem' }}>Únete a SkillSwap</h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Regístrate y recibe <span style={{ color: '#A78BFA', fontWeight: 700 }}>50 créditos gratis</span>
              </p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-muted)' }}>Username *</label>
                  <input className="input" type="text" placeholder="john_dev" value={form.username} onChange={set('username')} required pattern="^[a-zA-Z0-9_]+" minLength={3} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-muted)' }}>Nombre *</label>
                  <input className="input" type="text" placeholder="John Doe" value={form.fullName} onChange={set('fullName')} required minLength={2} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-muted)' }}>Email *</label>
                <input className="input" type="email" placeholder="tu@email.com" value={form.email} onChange={set('email')} required />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-muted)' }}>Contraseña *</label>
                <input className="input" type="password" placeholder="Min 8 chars, 1 mayúscula, 1 número" value={form.password} onChange={set('password')} required minLength={8} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-muted)' }}>Bio (opcional)</label>
                <input className="input" type="text" placeholder="Cuéntanos qué puedes enseñar o aprender..." value={form.bio} onChange={set('bio')} />
              </div>

              {error && (
                <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '0.6rem', padding: '0.7rem 0.9rem', color: '#F87171', fontSize: '0.85rem', lineHeight: 1.5 }}>
                  {error}
                </div>
              )}

              <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }} disabled={loading}>
                {loading ? 'Creando cuenta...' : '🎁 Crear cuenta — 50 créditos gratis'}
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>¿Ya tienes cuenta? </span>
              <Link href="/login" style={{ color: '#A78BFA', fontWeight: 600, textDecoration: 'none', fontSize: '0.88rem' }}>Entrar →</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
