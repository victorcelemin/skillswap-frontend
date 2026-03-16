'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import Navbar from '@/components/Navbar';

export default function LoginPage() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword]     = useState('');
  const [error, setError]           = useState('');
  const [loading, setLoading]       = useState(false);
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

  const fillDemo = () => {
    setIdentifier('demo@skillswap.app');
    setPassword('SecurePass1');
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar />

      {/* Fondos decorativos */}
      <div aria-hidden="true" style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '20%', left: '10%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%)' }} />
        <div style={{ position: 'absolute', bottom: '10%', right: '10%', width: 350, height: 350, borderRadius: '50%', background: 'radial-gradient(circle, rgba(236,72,153,0.08) 0%, transparent 70%)' }} />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 64px)', padding: '2rem 1.5rem', position: 'relative', zIndex: 1 }}>
        <div style={{ width: '100%', maxWidth: 420 }}>
          <div className="card animate-slide-up" style={{ padding: '2.5rem' }}>

            {/* Cabecera */}
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div aria-hidden="true" style={{ width: 52, height: 52, borderRadius: '0.9rem', background: 'linear-gradient(135deg, #7C3AED, #EC4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', fontWeight: 900, color: '#fff', margin: '0 auto 1rem' }}>S</div>
              <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.4rem' }}>Bienvenido de vuelta</h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Accede a tu cuenta de SkillSwap</p>
            </div>

            {/* Formulario — todos los inputs tienen id + name + label for */}
            <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>

              <div>
                <label htmlFor="login-identifier" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-muted)' }}>
                  Email o username
                </label>
                <input
                  id="login-identifier"
                  name="identifier"
                  type="text"
                  autoComplete="email username"
                  placeholder="tu@email.com"
                  className="input"
                  value={identifier}
                  onChange={e => setIdentifier(e.target.value)}
                  required
                />
              </div>

              <div>
                <label htmlFor="login-password" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-muted)' }}>
                  Contraseña
                </label>
                <input
                  id="login-password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="input"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
              </div>

              {error && (
                <p role="alert" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '0.6rem', padding: '0.7rem 0.9rem', color: '#F87171', fontSize: '0.87rem', margin: 0 }}>
                  {error}
                </p>
              )}

              <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '0.25rem' }} disabled={loading} aria-busy={loading}>
                {loading ? 'Entrando...' : 'Entrar →'}
              </button>
            </form>

            <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
              ¿No tienes cuenta?{' '}
              <Link href="/register" style={{ color: '#A78BFA', fontWeight: 600, textDecoration: 'none' }}>Regístrate gratis →</Link>
            </p>

            {/* Bloque demo */}
            <div style={{ marginTop: '1.5rem', padding: '1rem 1.1rem', background: 'rgba(124,58,237,0.08)', borderRadius: '0.75rem', border: '1px solid rgba(124,58,237,0.2)' }}>
              <p style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>🧪 Cuenta de prueba</p>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Email: <code style={{ color: '#A78BFA' }}>demo@skillswap.app</code></p>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Pass: <code style={{ color: '#A78BFA' }}>SecurePass1</code></p>
              <button
                type="button"
                onClick={fillDemo}
                style={{ marginTop: '0.6rem', background: 'none', border: '1px solid rgba(124,58,237,0.35)', borderRadius: '0.5rem', padding: '0.3rem 0.85rem', color: '#A78BFA', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>
                Usar demo →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
