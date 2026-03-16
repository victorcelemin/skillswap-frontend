'use client';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { useEffect, useState } from 'react';
import { skillsApi, offersApi } from '@/lib/api';

const CATEGORY_COLORS: Record<string, string> = {
  TECHNOLOGY: '#3B82F6', MUSIC: '#A855F7', LANGUAGES: '#EF4444',
  ART_AND_DESIGN: '#EC4899', BUSINESS: '#EAB308', SCIENCE: '#10B981',
  SPORTS_AND_FITNESS: '#F97316', COOKING: '#84CC16', PERSONAL_DEVELOPMENT: '#06B6D4', OTHER: '#94A3B8',
};
const CATEGORY_LABELS: Record<string, string> = {
  TECHNOLOGY: '💻 Tecnología', MUSIC: '🎵 Música', LANGUAGES: '🌍 Idiomas',
  ART_AND_DESIGN: '🎨 Arte & Diseño', BUSINESS: '💼 Negocios', SCIENCE: '🔬 Ciencias',
  SPORTS_AND_FITNESS: '🏃 Deportes', COOKING: '🍳 Cocina', PERSONAL_DEVELOPMENT: '🧠 Desarrollo personal', OTHER: '✨ Otros',
};

export default function Home() {
  const [categories, setCategories] = useState<string[]>([]);
  const [recentOffers, setRecentOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([skillsApi.getCategories(), offersApi.getAll({ size: 6 })])
      .then(([catRes, offRes]) => {
        setCategories(catRes.data.data || []);
        setRecentOffers(offRes.data.data?.content || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar />

      {/* Fondo animado */}
      <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '-20%', left: '-10%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)', animation: 'float 8s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', bottom: '-10%', right: '-5%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(236,72,153,0.1) 0%, transparent 70%)', animation: 'float 6s ease-in-out infinite reverse' }} />
        <div style={{ position: 'absolute', top: '40%', left: '60%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 70%)', animation: 'float 10s ease-in-out infinite' }} />
      </div>

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* HERO */}
        <section style={{ maxWidth: 1100, margin: '0 auto', padding: '5rem 1.5rem 4rem', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.3)', borderRadius: '2rem', padding: '0.35rem 1rem', fontSize: '0.85rem', color: '#A78BFA', marginBottom: '2rem' }}>
            ✦ La plataforma donde el conocimiento es la moneda
          </div>

          <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 900, lineHeight: 1.1, marginBottom: '1.5rem', letterSpacing: '-0.03em' }}>
            Enseña lo que sabes.<br />
            <span className="gradient-text">Aprende lo que quieres.</span>
          </h1>

          <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: 560, margin: '0 auto 2.5rem', lineHeight: 1.7 }}>
            Intercambia habilidades con personas reales usando créditos,<br />no dinero. Sin barreras, sin intermediarios.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/register" className="btn-primary" style={{ fontSize: '1rem', padding: '0.8rem 2rem' }}>
              Empezar gratis — 50 créditos
            </Link>
            <Link href="/offers" className="btn-ghost" style={{ fontSize: '1rem', padding: '0.8rem 2rem' }}>
              Explorar ofertas →
            </Link>
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', marginTop: '3.5rem', flexWrap: 'wrap' }}>
            {[['37+', 'Habilidades'], ['∞', 'Posibilidades'], ['50', 'Créditos gratis'], ['0€', 'Sin dinero']].map(([val, label]) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, background: 'linear-gradient(135deg, #A78BFA, #EC4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{val}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* COMO FUNCIONA */}
        <section style={{ maxWidth: 1100, margin: '0 auto', padding: '3rem 1.5rem' }}>
          <h2 style={{ textAlign: 'center', fontSize: '2rem', fontWeight: 800, marginBottom: '2.5rem' }}>
            ¿Cómo funciona?
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
            {[
              { n: '01', icon: '🎁', title: 'Regístrate', desc: 'Crea tu cuenta y recibe 50 créditos de bienvenida, gratis.' },
              { n: '02', icon: '🔍', title: 'Explora', desc: 'Descubre cientos de ofertas en tecnología, música, idiomas y más.' },
              { n: '03', icon: '📅', title: 'Reserva', desc: 'Elige una sesión, gasta créditos y aprende desde donde estés.' },
              { n: '04', icon: '🏆', title: 'Enseña y gana', desc: 'Publica tu habilidad, enseña y gana créditos para seguir aprendiendo.' },
            ].map(({ n, icon, title, desc }) => (
              <div key={n} className="card" style={{ padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '1rem', right: '1rem', fontSize: '2.5rem', fontWeight: 900, color: 'rgba(124,58,237,0.08)', lineHeight: 1 }}>{n}</div>
                <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{icon}</div>
                <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.5rem' }}>{title}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.6 }}>{desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* CATEGORIAS */}
        <section style={{ maxWidth: 1100, margin: '0 auto', padding: '3rem 1.5rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>Explora por categoría</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>{categories.length} categorías disponibles</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            {categories.map((cat) => (
              <Link key={cat} href={`/offers?category=${cat}`} style={{
                textDecoration: 'none',
                background: `${CATEGORY_COLORS[cat]}18`,
                border: `1px solid ${CATEGORY_COLORS[cat]}40`,
                borderRadius: '2rem',
                padding: '0.5rem 1.2rem',
                color: CATEGORY_COLORS[cat] || '#94A3B8',
                fontWeight: 600,
                fontSize: '0.88rem',
                transition: 'all 0.2s',
                display: 'inline-block',
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = `0 6px 20px ${CATEGORY_COLORS[cat]}30`; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'none'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
              >
                {CATEGORY_LABELS[cat] || cat}
              </Link>
            ))}
          </div>
        </section>

        {/* OFERTAS RECIENTES */}
        {recentOffers.length > 0 && (
          <section style={{ maxWidth: 1100, margin: '0 auto', padding: '3rem 1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Ofertas recientes</h2>
              <Link href="/offers" className="btn-ghost" style={{ padding: '0.5rem 1rem', fontSize: '0.88rem' }}>Ver todas →</Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
              {recentOffers.map((offer: any) => <OfferCard key={offer.id} offer={offer} />)}
            </div>
          </section>
        )}

        {/* CTA FINAL */}
        <section style={{ maxWidth: 1100, margin: '3rem auto', padding: '0 1.5rem 5rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(236,72,153,0.1))',
            border: '1px solid rgba(124,58,237,0.25)',
            borderRadius: '1.5rem',
            padding: '3.5rem 2rem',
            textAlign: 'center',
          }}>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 900, marginBottom: '1rem' }}>
              ¿Listo para intercambiar?
            </h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '1.05rem' }}>
              Únete a la comunidad. Tu primer intercambio está a un clic.
            </p>
            <Link href="/register" className="btn-primary" style={{ fontSize: '1.05rem', padding: '0.85rem 2.5rem' }}>
              Crear cuenta gratis →
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

function OfferCard({ offer }: { offer: any }) {
  const catColor = CATEGORY_COLORS[offer.skill?.category] || '#7C3AED';
  return (
    <Link href={`/offers/${offer.id}`} style={{ textDecoration: 'none' }}>
      <div className="card" style={{ padding: '1.25rem', height: '100%', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <span style={{ background: `${catColor}18`, border: `1px solid ${catColor}40`, borderRadius: '1rem', padding: '0.2rem 0.7rem', fontSize: '0.75rem', fontWeight: 600, color: catColor }}>
            {offer.skill?.name || 'Skill'}
          </span>
          <span style={{ fontWeight: 800, color: '#A78BFA', fontSize: '0.9rem' }}>✦ {offer.creditsCostPerHour}/h</span>
        </div>
        <div style={{ fontWeight: 700, fontSize: '0.95rem', lineHeight: 1.4, flex: 1 }}>{offer.title}</div>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {offer.description}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.5rem', borderTop: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'linear-gradient(135deg, #7C3AED, #EC4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700 }}>
              {offer.teacher?.username?.[0]?.toUpperCase()}
            </div>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{offer.teacher?.username}</span>
          </div>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>⏱ {offer.durationMinutes} min</span>
        </div>
      </div>
    </Link>
  );
}
