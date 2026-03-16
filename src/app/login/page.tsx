'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import Navbar from '@/components/Navbar';

export default function LoginPage() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await authApi.login({ identifier, password });
      const { accessToken, user } = res.data.data;
      setAuth(accessToken, user);
      router.push('/offers');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Credenciales incorrectas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 64px)', padding: '2rem 1.5rem' }}>
        {/* Fondo */}
        <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
          <div style={{ position: 'absolute', top: '20%', left: '10%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%)' }} />
          <div style={{ position: 'absolute', bottom: '10%', right: '10%', width: 350, height: 350, borderRadius: '50%', background: 'radial-gradient(circle, rgba(236,72,153,0.08) 0%, transparent 70%)' }} />
        </div>
        <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 420 }}>
          <div className="card animate-slide-up" style={{ padding: '2.5rem' }}>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{ width: 52, height: 52, borderRadius: '0.9rem', background: 'linear-gradient(135deg, #7C3AED, #EC4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', fontWeight: 900, color: '#fff', margin: '0 auto 1rem' }}>S</div>
              <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.4rem' }}>Bienvenido de vuelta</h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Accede a tu cuenta de SkillSwap</p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-muted)' }}>Email o username</label>
                <input className="input" type="text" placeholder="tu@email.com" value={identifier} onChange={e => setIdentifier(e.target.value)} required />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-muted)' }}>Contraseña</label>
                <input className="input" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
              </div>

              {error && (
                <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '0.6rem', padding: '0.7rem 0.9rem', color: '#F87171', fontSize: '0.87rem' }}>
                  {error}
                </div>
              )}

              <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }} disabled={loading}>
                {loading ? 'Entrando...' : 'Entrar'}
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>¿No tienes cuenta? </span>
              <Link href="/register" style={{ color: '#A78BFA', fontWeight: 600, textDecoration: 'none', fontSize: '0.88rem' }}>Regístrate gratis →</Link>
            </div>

            <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(124,58,237,0.08)', borderRadius: '0.75rem', border: '1px solid rgba(124,58,237,0.15)' }}>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.4rem', fontWeight: 600 }}>🧪 Usuario de prueba</p>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Email: demo@skillswap.app</p>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Password: SecurePass1</p>
              <button onClick={() => { setIdentifier('demo@skillswap.app'); setPassword('SecurePass1'); }} style={{ marginTop: '0.5rem', background: 'none', border: '1px solid rgba(124,58,237,0.3)', borderRadius: '0.5rem', padding: '0.3rem 0.75rem', color: '#A78BFA', cursor: 'pointer', fontSize: '0.78rem' }}>
                Usar demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
