'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import Navbar from '@/components/Navbar';

export default function RegisterPage() {
  const [form, setForm] = useState({
    username: '', email: '', password: '', fullName: '', bio: '',
  });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuthStore();
  const router = useRouter();

  const setField = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
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

  /* Estilos compartidos para labels */
  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: '0.85rem', fontWeight: 600,
    marginBottom: '0.4rem', color: 'var(--text-muted)',
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar />

      <div aria-hidden="true" style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '15%', right: '15%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%)' }} />
        <div style={{ position: 'absolute', bottom: '5%', left: '5%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(236,72,153,0.08) 0%, transparent 70%)' }} />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 64px)', padding: '2rem 1.5rem', position: 'relative', zIndex: 1 }}>
        <div style={{ width: '100%', maxWidth: 460 }}>
          <div className="card animate-slide-up" style={{ padding: '2.5rem' }}>

            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div aria-hidden="true" style={{ width: 52, height: 52, borderRadius: '0.9rem', background: 'linear-gradient(135deg, #7C3AED, #EC4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', fontWeight: 900, color: '#fff', margin: '0 auto 1rem' }}>S</div>
              <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.4rem' }}>Únete a SkillSwap</h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Regístrate y recibe{' '}
                <span style={{ color: '#A78BFA', fontWeight: 700 }}>50 créditos gratis</span>
              </p>
            </div>

            {/* Formulario completamente accesible */}
            <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label htmlFor="reg-username" style={labelStyle}>
                    Username <span aria-label="obligatorio" style={{ color: '#EC4899' }}>*</span>
                  </label>
                  <input
                    id="reg-username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    placeholder="john_dev"
                    className="input"
                    value={form.username}
                    onChange={setField('username')}
                    required
                    minLength={3}
                    maxLength={50}
                    pattern="^[a-zA-Z0-9_]+"
                    title="Solo letras, números y guión bajo"
                  />
                </div>
                <div>
                  <label htmlFor="reg-fullname" style={labelStyle}>
                    Nombre <span aria-label="obligatorio" style={{ color: '#EC4899' }}>*</span>
                  </label>
                  <input
                    id="reg-fullname"
                    name="fullName"
                    type="text"
                    autoComplete="name"
                    placeholder="John Doe"
                    className="input"
                    value={form.fullName}
                    onChange={setField('fullName')}
                    required
                    minLength={2}
                    maxLength={100}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="reg-email" style={labelStyle}>
                  Email <span aria-label="obligatorio" style={{ color: '#EC4899' }}>*</span>
                </label>
                <input
                  id="reg-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="tu@email.com"
                  className="input"
                  value={form.email}
                  onChange={setField('email')}
                  required
                />
              </div>

              <div>
                <label htmlFor="reg-password" style={labelStyle}>
                  Contraseña <span aria-label="obligatorio" style={{ color: '#EC4899' }}>*</span>
                </label>
                <input
                  id="reg-password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Mín. 8 chars, 1 mayúscula, 1 número"
                  className="input"
                  value={form.password}
                  onChange={setField('password')}
                  required
                  minLength={8}
                  maxLength={100}
                />
                <p style={{ marginTop: '0.3rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Al menos 8 caracteres, una mayúscula y un número
                </p>
              </div>

              <div>
                <label htmlFor="reg-bio" style={labelStyle}>Bio <span style={{ fontWeight: 400 }}>(opcional)</span></label>
                <input
                  id="reg-bio"
                  name="bio"
                  type="text"
                  autoComplete="off"
                  placeholder="¿Qué puedes enseñar o qué quieres aprender?"
                  className="input"
                  value={form.bio}
                  onChange={setField('bio')}
                  maxLength={500}
                />
              </div>

              {error && (
                <p role="alert" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '0.6rem', padding: '0.7rem 0.9rem', color: '#F87171', fontSize: '0.85rem', margin: 0, lineHeight: 1.5 }}>
                  {error}
                </p>
              )}

              <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '0.25rem' }} disabled={loading} aria-busy={loading}>
                {loading ? 'Creando cuenta...' : '🎁 Crear cuenta — 50 créditos gratis'}
              </button>
            </form>

            <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
              ¿Ya tienes cuenta?{' '}
              <Link href="/login" style={{ color: '#A78BFA', fontWeight: 600, textDecoration: 'none' }}>Entrar →</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
