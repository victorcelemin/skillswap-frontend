'use client';
/**
 * Página de detalle de oferta — /offers/[id]
 *
 * ACCESIBILIDAD (WCAG 2.1 AA):
 * - Todos los <input> y <textarea> tienen id + name + autoComplete
 * - Todos los <label> tienen htmlFor apuntando al id del campo
 * - Errores con role="alert" para lectores de pantalla
 * - Listas semánticas con <dl> para los detalles
 * - Navegación con <nav aria-label> y breadcrumb con aria-current
 */
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { offersApi, sessionsApi, reviewsApi } from '@/lib/api';
import { useAuthStore } from '@/lib/store';

const CAT_COLORS: Record<string, string> = {
  TECHNOLOGY: '#3B82F6', MUSIC: '#A855F7', LANGUAGES: '#EF4444',
  ART_AND_DESIGN: '#EC4899', BUSINESS: '#EAB308', SCIENCE: '#10B981',
  SPORTS_AND_FITNESS: '#F97316', COOKING: '#84CC16',
  PERSONAL_DEVELOPMENT: '#06B6D4', OTHER: '#94A3B8',
};

/* ─── Label reutilizable ─────────────────────────────────── */
function FieldLabel({
  htmlFor,
  required,
  children,
}: {
  htmlFor: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label
      htmlFor={htmlFor}
      style={{
        display: 'block', fontSize: '0.82rem', fontWeight: 600,
        marginBottom: '0.4rem', color: 'var(--text-muted)',
      }}
    >
      {children}
      {required && (
        <span aria-label="obligatorio" style={{ color: '#EC4899', marginLeft: '0.2rem' }}>
          *
        </span>
      )}
    </label>
  );
}

/* ─── Formulario de reserva ──────────────────────────────── */
function BookingForm({
  cost,
  offerId,
  onSuccess,
  onCancel,
}: {
  cost: number;
  offerId: number;
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const router = useRouter();
  const { token } = useAuthStore();
  const [date, setDate]   = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  /* Mínimo: 1 hora en el futuro */
  const minDate = new Date(Date.now() + 60 * 60 * 1000)
    .toISOString()
    .slice(0, 16);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token) { router.push('/login'); return; }
    setLoading(true);
    setError('');
    try {
      await sessionsApi.book({
        offerId,
        scheduledAt: new Date(date).toISOString().slice(0, 19),
        studentNotes: notes,
      });
      onSuccess();
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
        'Error al reservar. Por favor intenta de nuevo.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      id="booking-form"
      onSubmit={handleSubmit}
      noValidate
      aria-label="Formulario de reserva de sesión"
      style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}
    >
      {/* Campo: fecha y hora */}
      <div>
        <FieldLabel htmlFor="booking-date" required>
          Fecha y hora
        </FieldLabel>
        <input
          id="booking-date"
          name="scheduledAt"
          type="datetime-local"
          autoComplete="off"
          className="input"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          min={minDate}
          aria-describedby="booking-date-hint"
          style={{ fontSize: '0.9rem' }}
        />
        <p
          id="booking-date-hint"
          style={{ marginTop: '0.25rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}
        >
          Mínimo 1 hora de antelación
        </p>
      </div>

      {/* Campo: notas */}
      <div>
        <FieldLabel htmlFor="booking-notes">
          Notas para el teacher <span style={{ fontWeight: 400 }}>(opcional)</span>
        </FieldLabel>
        <textarea
          id="booking-notes"
          name="studentNotes"
          autoComplete="off"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Cuéntale tu nivel actual y qué esperas de la sesión..."
          maxLength={500}
          rows={3}
          aria-describedby="booking-notes-hint"
          style={{
            width: '100%', background: 'var(--bg-card2)',
            border: '1px solid var(--border)', borderRadius: '0.75rem',
            padding: '0.65rem 0.9rem', color: 'var(--text)',
            fontSize: '0.9rem', resize: 'vertical', outline: 'none',
            fontFamily: 'inherit', transition: 'border-color 0.2s',
            boxSizing: 'border-box',
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--purple)')}
          onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(124,58,237,0.2)')}
        />
        <p
          id="booking-notes-hint"
          style={{ marginTop: '0.2rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}
        >
          {notes.length}/500 caracteres
        </p>
      </div>

      {/* Error */}
      {error && (
        <p
          role="alert"
          aria-live="assertive"
          style={{
            background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)',
            borderRadius: '0.6rem', padding: '0.6rem 0.8rem',
            color: '#F87171', fontSize: '0.85rem', margin: 0,
          }}
        >
          {error}
        </p>
      )}

      {/* Acciones */}
      <button
        type="submit"
        form="booking-form"
        className="btn-primary"
        style={{ width: '100%', justifyContent: 'center' }}
        disabled={loading || !date}
        aria-busy={loading}
      >
        {loading ? 'Reservando...' : `Confirmar — ✦ ${cost} créditos`}
      </button>

      <button
        type="button"
        onClick={onCancel}
        className="btn-ghost"
        style={{ width: '100%', justifyContent: 'center', fontSize: '0.88rem' }}
      >
        Cancelar
      </button>
    </form>
  );
}

/* ─── Página principal ───────────────────────────────────── */
export default function OfferDetailPage() {
  const { id }          = useParams();
  const router          = useRouter();
  const { user, token } = useAuthStore();

  const [offer, setOffer]     = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [showBooking, setShowBooking]       = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      offersApi.getById(Number(id)),
      reviewsApi.getForTeacher(Number(id)),
    ])
      .then(([offerRes, revRes]) => {
        setOffer(offerRes.data.data);
        setReviews(revRes.data.data?.content || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  /* ── Loading ── */
  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
        <Navbar />
        <div
          style={{
            maxWidth: 1000, margin: '3rem auto', padding: '0 1.5rem',
            display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem',
          }}
        >
          <div>
            <div className="skeleton" style={{ height: 28, width: '70%', marginBottom: '1rem', borderRadius: '0.5rem' }} />
            <div className="skeleton" style={{ height: 180, borderRadius: '0.75rem' }} />
          </div>
          <div className="skeleton" style={{ height: 320, borderRadius: '0.75rem' }} />
        </div>
      </div>
    );
  }

  if (!offer) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
        <Navbar />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 64px)' }}>
          <p style={{ color: 'var(--text-muted)' }}>Oferta no encontrada.</p>
        </div>
      </div>
    );
  }

  const catColor   = CAT_COLORS[offer.skill?.category] || '#7C3AED';
  const cost       = Math.ceil(offer.creditsCostPerHour * offer.durationMinutes / 60);
  const canAfford  = (user?.creditsBalance ?? 0) >= cost;
  const isOwnOffer = user?.id === offer.teacher?.id;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar />
      <main style={{ maxWidth: 1000, margin: '0 auto', padding: '2.5rem 1.5rem' }}>

        {/* Breadcrumb */}
        <nav aria-label="Ubicación" style={{ marginBottom: '1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          <Link href="/offers" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>
            Ofertas
          </Link>
          <span aria-hidden="true" style={{ margin: '0 0.4rem' }}>›</span>
          <span aria-current="page">{offer.title}</span>
        </nav>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2.5rem', alignItems: 'start' }}>

          {/* ── Columna principal ── */}
          <div>
            {/* Badges */}
            <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '1.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ background: `${catColor}18`, border: `1px solid ${catColor}40`, borderRadius: '1rem', padding: '0.3rem 0.9rem', fontSize: '0.82rem', fontWeight: 700, color: catColor }}>
                {offer.skill?.name}
              </span>
              <span style={{ background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.3)', borderRadius: '1rem', padding: '0.3rem 0.9rem', fontSize: '0.82rem', color: '#06B6D4', fontWeight: 600 }}>
                {offer.modality === 'ONLINE' ? '🌐 Online' : offer.modality === 'IN_PERSON' ? '📍 Presencial' : '🔀 Híbrido'}
              </span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }} aria-label={`${offer.viewsCount} vistas`}>
                👁 {offer.viewsCount}
              </span>
            </div>

            <h1 style={{ fontSize: 'clamp(1.4rem, 3vw, 1.85rem)', fontWeight: 900, lineHeight: 1.3, marginBottom: '1.5rem' }}>
              {offer.title}
            </h1>

            {/* Teacher */}
            <div className="card" style={{ padding: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div aria-hidden="true" style={{ width: 52, height: 52, borderRadius: '50%', background: 'linear-gradient(135deg, #7C3AED, #EC4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', fontWeight: 700, color: '#fff', flexShrink: 0 }}>
                {offer.teacher?.username?.[0]?.toUpperCase()}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 700, margin: 0 }}>{offer.teacher?.fullName || offer.teacher?.username}</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>@{offer.teacher?.username}</p>
              </div>
              {offer.teacher?.averageRating > 0 && (
                <div style={{ textAlign: 'right' }}>
                  <p style={{ color: '#FACC15', fontWeight: 700, margin: 0 }} aria-label={`Valoración: ${offer.teacher.averageRating.toFixed(1)} de 5`}>
                    ★ {offer.teacher.averageRating.toFixed(1)}
                  </p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: 0 }}>
                    {offer.teacher.totalSessionsTaught} sesiones
                  </p>
                </div>
              )}
            </div>

            {/* Descripción */}
            <section aria-labelledby="offer-desc-heading" style={{ marginBottom: '1.5rem' }}>
              <h2 id="offer-desc-heading" style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem' }}>
                Descripción
              </h2>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.85, fontSize: '0.95rem', whiteSpace: 'pre-wrap', margin: 0 }}>
                {offer.description}
              </p>
            </section>

            {/* Tags */}
            {offer.tags?.length > 0 && (
              <ul
                aria-label="Etiquetas"
                style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.75rem', listStyle: 'none', padding: 0 }}
              >
                {offer.tags.map((tag: string) => (
                  <li key={tag} style={{ background: 'var(--bg-card2)', border: '1px solid var(--border)', borderRadius: '1rem', padding: '0.25rem 0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    #{tag.trim()}
                  </li>
                ))}
              </ul>
            )}

            {/* Reviews */}
            {reviews.length > 0 && (
              <section aria-labelledby="offer-reviews-heading">
                <h2 id="offer-reviews-heading" style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>
                  Valoraciones ({reviews.length})
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {reviews.slice(0, 5).map((rev: any) => (
                    <article key={rev.id} className="card" style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                        <div aria-hidden="true" style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg, #7C3AED, #EC4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color: '#fff' }}>
                          {rev.reviewer?.username?.[0]?.toUpperCase()}
                        </div>
                        <span style={{ fontWeight: 600, fontSize: '0.88rem' }}>{rev.reviewer?.username}</span>
                        <div aria-label={`${rev.rating} de 5 estrellas`} style={{ display: 'flex', gap: '0.1rem' }}>
                          {Array(5).fill(0).map((_, i) => (
                            <span key={i} aria-hidden="true" style={{ color: i < rev.rating ? '#FACC15' : '#334155', fontSize: '0.85rem' }}>★</span>
                          ))}
                        </div>
                      </div>
                      {rev.comment && (
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.6, margin: 0 }}>{rev.comment}</p>
                      )}
                    </article>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* ── Sidebar de reserva ── */}
          <aside aria-label="Reservar sesión" style={{ position: 'sticky', top: 80 }}>
            <div className="card" style={{ padding: '1.5rem' }}>

              {/* Precio */}
              <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
                <p style={{ fontSize: '2.2rem', fontWeight: 900, color: '#A78BFA', margin: 0 }} aria-label={`${cost} créditos por sesión`}>
                  ✦ {cost}
                </p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '0.2rem 0 0' }}>
                  créditos · sesión de {offer.durationMinutes} min
                </p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', margin: '0.15rem 0 0' }}>
                  ({offer.creditsCostPerHour} cr/hora)
                </p>
              </div>

              {/* Detalles */}
              <dl style={{ marginBottom: '1.25rem', fontSize: '0.88rem' }}>
                {([
                  ['Duración',             `${offer.durationMinutes} minutos`],
                  ['Modalidad',            offer.modality],
                  ['Máx. estudiantes',     String(offer.maxStudentsPerSession)],
                  ['Sesiones completadas', String(offer.totalSessionsCompleted)],
                ] as [string, string][]).map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border)' }}>
                    <dt style={{ color: 'var(--text-muted)' }}>{k}</dt>
                    <dd style={{ fontWeight: 600, margin: 0 }}>{v}</dd>
                  </div>
                ))}
              </dl>

              {/* Contenido condicional */}
              {bookingSuccess ? (
                /* Éxito */
                <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '0.75rem', padding: '1.25rem', textAlign: 'center' }}>
                  <p style={{ fontSize: '1.5rem', marginBottom: '0.4rem' }}>🎉</p>
                  <p style={{ fontWeight: 700, color: '#34D399', margin: '0 0 0.3rem' }}>¡Sesión reservada!</p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', margin: '0 0 0.75rem' }}>
                    Revisa tu dashboard para gestionarla
                  </p>
                  <Link
                    href="/dashboard"
                    className="btn-primary"
                    style={{ width: '100%', justifyContent: 'center', fontSize: '0.88rem' }}
                  >
                    Ver mis sesiones →
                  </Link>
                </div>

              ) : isOwnOffer ? (
                /* Propia oferta */
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.88rem', padding: '0.75rem', background: 'var(--bg-card2)', borderRadius: '0.75rem', margin: 0 }}>
                  Esta es tu propia oferta
                </p>

              ) : !token ? (
                /* Sin sesión */
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <Link href="/login" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                    Iniciar sesión para reservar
                  </Link>
                  <Link href="/register" className="btn-ghost" style={{ width: '100%', justifyContent: 'center' }}>
                    Crear cuenta gratis
                  </Link>
                </div>

              ) : !showBooking ? (
                /* Botón inicial */
                <>
                  {!canAfford && (
                    <p role="alert" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '0.6rem', padding: '0.6rem 0.8rem', fontSize: '0.82rem', color: '#F87171', marginBottom: '0.75rem' }}>
                      Créditos insuficientes — tienes {user?.creditsBalance ?? 0}, necesitas {cost}.
                    </p>
                  )}
                  <button
                    type="button"
                    onClick={() => setShowBooking(true)}
                    className="btn-primary"
                    style={{ width: '100%', justifyContent: 'center' }}
                    disabled={!canAfford}
                    aria-disabled={!canAfford}
                  >
                    {canAfford ? `Reservar — ✦ ${cost} créditos` : 'Sin créditos suficientes'}
                  </button>
                </>

              ) : (
                /* Formulario de reserva — completamente accesible */
                <BookingForm
                  cost={cost}
                  offerId={offer.id}
                  onSuccess={() => setBookingSuccess(true)}
                  onCancel={() => setShowBooking(false)}
                />
              )}
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
