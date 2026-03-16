'use client';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

const COIN = '✦';

export default function Navbar() {
  const { user, token, logout } = useAuthStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const handleLogout = () => {
    logout();
    router.push('/');
    setMenuOpen(false);
  };

  return (
    <nav className="glass sticky top-0 z-50" style={{ borderBottom: '1px solid rgba(124,58,237,0.2)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>

        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
          <div style={{
            width: 36, height: 36, borderRadius: '0.6rem',
            background: 'linear-gradient(135deg, #7C3AED, #EC4899)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.1rem', fontWeight: 900, color: '#fff'
          }}>S</div>
          <span style={{ fontWeight: 800, fontSize: '1.15rem', color: '#F8FAFC', letterSpacing: '-0.02em' }}>
            Skill<span className="gradient-text">Swap</span>
          </span>
        </Link>

        {/* Nav links - desktop */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <NavLink href="/offers">Explorar</NavLink>
          {mounted && token && <NavLink href="/dashboard">Mi espacio</NavLink>}
        </div>

        {/* Auth - desktop */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {mounted && token && user ? (
            <>
              <div className="credits-badge">
                {COIN} {user.creditsBalance}
              </div>
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  style={{
                    background: 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(236,72,153,0.2))',
                    border: '1px solid rgba(124,58,237,0.3)',
                    borderRadius: '2rem',
                    padding: '0.4rem 0.9rem',
                    color: '#F8FAFC',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem'
                  }}
                >
                  <span style={{
                    width: 28, height: 28, borderRadius: '50%',
                    background: 'linear-gradient(135deg, #7C3AED, #EC4899)',
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.8rem', fontWeight: 700
                  }}>
                    {user.username[0].toUpperCase()}
                  </span>
                  {user.username}
                </button>
                {menuOpen && (
                  <div style={{
                    position: 'absolute', top: '110%', right: 0, minWidth: 180,
                    background: 'var(--bg-card)', border: '1px solid var(--border)',
                    borderRadius: '0.75rem', overflow: 'hidden', zIndex: 100,
                    boxShadow: '0 16px 40px rgba(0,0,0,0.4)'
                  }}>
                    <Link href="/dashboard" onClick={() => setMenuOpen(false)} style={{ display: 'block', padding: '0.75rem 1rem', color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem', transition: 'background 0.15s' }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(124,58,237,0.1)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                      Mi dashboard
                    </Link>
                    <button onClick={handleLogout} style={{ width: '100%', textAlign: 'left', padding: '0.75rem 1rem', background: 'none', border: 'none', color: '#F87171', cursor: 'pointer', fontSize: '0.9rem' }}>
                      Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : mounted ? (
            <>
              <Link href="/login" className="btn-ghost" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>Entrar</Link>
              <Link href="/register" className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>Únete gratis</Link>
            </>
          ) : null}
        </div>
      </div>
    </nav>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} style={{
      color: 'var(--text-muted)', textDecoration: 'none', padding: '0.4rem 0.75rem',
      borderRadius: '0.5rem', fontSize: '0.9rem', fontWeight: 500, transition: 'all 0.15s'
    }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#F8FAFC'; (e.currentTarget as HTMLElement).style.background = 'rgba(124,58,237,0.1)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'; (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
    >{children}</Link>
  );
}
