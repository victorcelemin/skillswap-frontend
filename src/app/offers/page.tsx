'use client';
import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { offersApi, skillsApi } from '@/lib/api';

const CAT_LABELS: Record<string, string> = {
  TECHNOLOGY: '💻 Tecnología', MUSIC: '🎵 Música', LANGUAGES: '🌍 Idiomas',
  ART_AND_DESIGN: '🎨 Arte & Diseño', BUSINESS: '💼 Negocios', SCIENCE: '🔬 Ciencias',
  SPORTS_AND_FITNESS: '🏃 Deportes', COOKING: '🍳 Cocina',
  PERSONAL_DEVELOPMENT: '🧠 Desarrollo', OTHER: '✨ Otros',
};
const CAT_COLORS: Record<string, string> = {
  TECHNOLOGY: '#3B82F6', MUSIC: '#A855F7', LANGUAGES: '#EF4444',
  ART_AND_DESIGN: '#EC4899', BUSINESS: '#EAB308', SCIENCE: '#10B981',
  SPORTS_AND_FITNESS: '#F97316', COOKING: '#84CC16', PERSONAL_DEVELOPMENT: '#06B6D4', OTHER: '#94A3B8',
};

function OffersContent() {
  const searchParams = useSearchParams();
  const [offers, setOffers]       = useState<any[]>([]);
  const [total, setTotal]         = useState(0);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState(searchParams.get('q') || '');
  const [category, setCategory]   = useState(searchParams.get('category') || '');
  const [page, setPage]           = useState(0);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    skillsApi.getCategories()
      .then(r => setCategories(r.data.data || []))
      .catch(console.error);
  }, []);

  useEffect(() => {
    setLoading(true);
    const params: Record<string, any> = { page, size: 12 };
    if (search)   params.q        = search;
    if (category) params.category = category;
    offersApi.getAll(params)
      .then(r => {
        setOffers(r.data.data?.content || []);
        setTotal(r.data.data?.totalElements || 0);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [search, category, page]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(0);
  };

  const toggleCategory = (cat: string) => {
    setCategory(cat === category ? '' : cat);
    setPage(0);
  };

  const totalPages = Math.ceil(total / 12);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar />
      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem 1.5rem' }}>

        {/* Cabecera */}
        <div style={{ marginBottom: '1.75rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '0.35rem' }}>Explorar ofertas</h1>
          <p style={{ color: 'var(--text-muted)' }}>
            {loading ? 'Cargando...' : `${total} oferta${total !== 1 ? 's' : ''} disponible${total !== 1 ? 's' : ''}`}
          </p>
        </div>

        {/* Buscador — input correctamente etiquetado */}
        <form
          onSubmit={handleSearch}
          role="search"
          aria-label="Buscar ofertas"
          style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem' }}
        >
          <label htmlFor="offers-search" className="sr-only" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap' }}>
            Buscar por habilidad, título o tags
          </label>
          <input
            id="offers-search"
            name="q"
            type="search"
            autoComplete="off"
            placeholder="Buscar habilidad, título, tags..."
            className="input"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ flex: 1 }}
            aria-label="Buscar ofertas"
          />
          <button type="submit" className="btn-primary" aria-label="Buscar">Buscar</button>
        </form>

        {/* Filtros de categoría */}
        <div role="group" aria-label="Filtrar por categoría" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '2rem' }}>
          <button
            onClick={() => toggleCategory('')}
            aria-pressed={!category}
            style={{
              background: !category ? 'rgba(124,58,237,0.2)' : 'transparent',
              border: `1px solid ${!category ? 'rgba(124,58,237,0.5)' : 'var(--border)'}`,
              borderRadius: '2rem', padding: '0.4rem 1rem',
              color: !category ? '#A78BFA' : 'var(--text-muted)',
              cursor: 'pointer', fontSize: '0.83rem', fontWeight: 600, transition: 'all 0.15s',
            }}
          >
            Todas
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => toggleCategory(cat)}
              aria-pressed={category === cat}
              style={{
                background: category === cat ? `${CAT_COLORS[cat]}22` : 'transparent',
                border: `1px solid ${category === cat ? CAT_COLORS[cat] + '70' : 'var(--border)'}`,
                borderRadius: '2rem', padding: '0.4rem 1rem',
                color: category === cat ? CAT_COLORS[cat] : 'var(--text-muted)',
                cursor: 'pointer', fontSize: '0.83rem', fontWeight: 600, transition: 'all 0.15s',
              }}
            >
              {CAT_LABELS[cat] || cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }} aria-label="Cargando ofertas" aria-busy="true">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="card" style={{ padding: '1.25rem', minHeight: 200 }} aria-hidden="true">
                <div className="skeleton" style={{ height: 20, width: '60%', marginBottom: '0.75rem' }} />
                <div className="skeleton" style={{ height: 16, width: '90%', marginBottom: '0.5rem' }} />
                <div className="skeleton" style={{ height: 16, width: '75%', marginBottom: '1rem' }} />
                <div className="skeleton" style={{ height: 40, width: '40%', marginTop: 'auto' }} />
              </div>
            ))}
          </div>
        ) : offers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem 2rem' }}>
            <p style={{ fontSize: '3rem', marginBottom: '1rem' }} aria-hidden="true">🔍</p>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.5rem' }}>Sin resultados</h2>
            <p style={{ color: 'var(--text-muted)' }}>Intenta con otro término o categoría</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
            {offers.map((offer: any) => <OfferCard key={offer.id} offer={offer} />)}
          </div>
        )}

        {/* Paginación */}
        {total > 12 && (
          <nav aria-label="Paginación" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem', marginTop: '2.5rem' }}>
            <button
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
              className="btn-ghost"
              style={{ padding: '0.5rem 1.25rem', fontSize: '0.88rem' }}
              aria-label="Página anterior"
            >
              ← Anterior
            </button>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }} aria-live="polite">
              Página {page + 1} de {totalPages}
            </span>
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={page + 1 >= totalPages}
              className="btn-ghost"
              style={{ padding: '0.5rem 1.25rem', fontSize: '0.88rem' }}
              aria-label="Página siguiente"
            >
              Siguiente →
            </button>
          </nav>
        )}
      </main>
    </div>
  );
}

function OfferCard({ offer }: { offer: any }) {
  const catColor = CAT_COLORS[offer.skill?.category] || '#7C3AED';
  const stars    = Math.round(offer.averageRating || 0);

  return (
    <article>
      <Link href={`/offers/${offer.id}`} style={{ textDecoration: 'none' }} aria-label={`Ver oferta: ${offer.title}`}>
        <div className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
            <span style={{ background: `${catColor}18`, border: `1px solid ${catColor}40`, borderRadius: '1rem', padding: '0.2rem 0.7rem', fontSize: '0.75rem', fontWeight: 700, color: catColor, flexShrink: 0 }}>
              {CAT_LABELS[offer.skill?.category] || offer.skill?.name || 'Skill'}
            </span>
            <span className="credits-badge" aria-label={`${offer.creditsCostPerHour} créditos por hora`}>
              ✦ {offer.creditsCostPerHour}/h
            </span>
          </div>

          <h2 style={{ fontWeight: 700, fontSize: '0.95rem', lineHeight: 1.4, margin: 0 }}>{offer.title}</h2>

          <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', lineHeight: 1.55, margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {offer.description}
          </p>

          {stars > 0 && (
            <div style={{ display: 'flex', gap: '0.1rem', alignItems: 'center' }} aria-label={`Valoración: ${stars} de 5 estrellas`}>
              {Array(5).fill(0).map((_, i) => (
                <span key={i} aria-hidden="true" className={i < stars ? 'star-filled' : 'star-empty'} style={{ fontSize: '0.85rem' }}>★</span>
              ))}
              <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginLeft: '0.3rem' }}>
                ({offer.totalSessionsCompleted})
              </span>
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.5rem', borderTop: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <div aria-hidden="true" style={{ width: 26, height: 26, borderRadius: '50%', background: 'linear-gradient(135deg, #7C3AED, #EC4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700, color: '#fff', flexShrink: 0 }}>
                {offer.teacher?.username?.[0]?.toUpperCase()}
              </div>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{offer.teacher?.username}</span>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              <span aria-label={`Duración: ${offer.durationMinutes} minutos`}>⏱ {offer.durationMinutes}m</span>
              <span aria-label={`${offer.viewsCount} vistas`}>👁 {offer.viewsCount}</span>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}

export default function OffersPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>Cargando ofertas...</p>
      </div>
    }>
      <OffersContent />
    </Suspense>
  );
}
