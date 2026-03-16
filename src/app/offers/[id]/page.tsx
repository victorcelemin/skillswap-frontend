'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { offersApi, sessionsApi, reviewsApi } from '@/lib/api';
import { useAuthStore } from '@/lib/store';

const CAT_COLORS: Record<string, string> = {
  TECHNOLOGY: '#3B82F6', MUSIC: '#A855F7', LANGUAGES: '#EF4444',
  ART_AND_DESIGN: '#EC4899', BUSINESS: '#EAB308', SCIENCE: '#10B981',
  SPORTS_AND_FITNESS: '#F97316', COOKING: '#84CC16', PERSONAL_DEVELOPMENT: '#06B6D4', OTHER: '#94A3B8',
};

export default function OfferDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, token } = useAuthStore();
  const [offer, setOffer] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingNotes, setBookingNotes] = useState('');
  const [booking, setBooking] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [showBooking, setShowBooking] = useState(false);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      offersApi.getById(Number(id)),
      reviewsApi.getForTeacher(Number(id))
    ]).then(([offerRes, revRes]) => {
      setOffer(offerRes.data.data);
      setReviews(revRes.data.data?.content || []);
    }).catch(console.error).finally(() => setLoading(false));
  }, [id]);

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) { router.push('/login'); return; }
    setBooking(true);
    setBookingError('');
    try {
      await sessionsApi.book({
        offerId: offer.id,
        scheduledAt: new Date(bookingDate).toISOString().slice(0, 19),
        studentNotes: bookingNotes
      });
      setBookingSuccess(true);
      setShowBooking(false);
    } catch (err: any) {
      setBookingError(err.response?.data?.message || 'Error al reservar');
    } finally {
      setBooking(false);
    }
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar />
      <div style={{ maxWidth: 900, margin: '3rem auto', padding: '0 1.5rem', display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem' }}>
        <div><div className="skeleton" style={{ height: 32, width: '70%', marginBottom: '1rem' }} /><div className="skeleton" style={{ height: 200 }} /></div>
        <div className="skeleton" style={{ height: 300 }} />
      </div>
    </div>
  );

  if (!offer) return <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><p style={{ color: 'var(--text-muted)' }}>Oferta no encontrada</p></div>;

  const catColor = CAT_COLORS[offer.skill?.category] || '#7C3AED';
  const cost = Math.ceil(offer.creditsCostPerHour * offer.durationMinutes / 60);
  const canAfford = (user?.creditsBalance || 0) >= cost;
  const isOwnOffer = user?.id === offer.teacher?.id;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar />
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '2.5rem 1.5rem' }}>

        {/* Breadcrumb */}
        <div style={{ marginBottom: '1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          <Link href="/offers" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Ofertas</Link>
          <span style={{ margin: '0 0.5rem' }}>›</span>
          <span>{offer.title}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem', alignItems: 'start' }}>
          {/* Columna principal */}
          <div>
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ background: `${catColor}18`, border: `1px solid ${catColor}40`, borderRadius: '1rem', padding: '0.3rem 0.9rem', fontSize: '0.82rem', fontWeight: 700, color: catColor }}>
                {offer.skill?.name}
              </span>
              <span style={{ background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.3)', borderRadius: '1rem', padding: '0.3rem 0.9rem', fontSize: '0.82rem', color: '#06B6D4', fontWeight: 600 }}>
                {offer.modality === 'ONLINE' ? '🌐 Online' : offer.modality === 'IN_PERSON' ? '📍 Presencial' : '🔀 Híbrido'}
              </span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>👁 {offer.viewsCount} vistas</span>
            </div>

            <h1 style={{ fontSize: '1.8rem', fontWeight: 900, lineHeight: 1.3, marginBottom: '1.5rem' }}>{offer.title}</h1>

            {/* Teacher */}
            <div className="card" style={{ padding: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'linear-gradient(135deg, #7C3AED, #EC4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', fontWeight: 700, flexShrink: 0 }}>
                {offer.teacher?.username?.[0]?.toUpperCase()}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700 }}>{offer.teacher?.fullName || offer.teacher?.username}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>@{offer.teacher?.username}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                {offer.teacher?.averageRating > 0 && (
                  <div style={{ color: '#FACC15', fontWeight: 700 }}>★ {offer.teacher.averageRating.toFixed(1)}</div>
                )}
                <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{offer.teacher?.totalSessionsTaught} sesiones</div>
              </div>
            </div>

            {/* Descripción */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem' }}>Descripción</h2>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, fontSize: '0.95rem', whiteSpace: 'pre-wrap' }}>{offer.description}</p>
            </div>

            {/* Tags */}
            {offer.tags?.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
                {offer.tags.map((tag: string) => (
                  <span key={tag} style={{ background: 'var(--bg-card2)', border: '1px solid var(--border)', borderRadius: '1rem', padding: '0.25rem 0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>#{tag.trim()}</span>
                ))}
              </div>
            )}

            {/* Reviews */}
            {reviews.length > 0 && (
              <div>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>Valoraciones ({reviews.length})</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {reviews.slice(0, 5).map((rev: any) => (
                    <div key={rev.id} className="card" style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                        <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg, #7C3AED, #EC4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700 }}>
                          {rev.reviewer?.username?.[0]?.toUpperCase()}
                        </div>
                        <span style={{ fontWeight: 600, fontSize: '0.88rem' }}>{rev.reviewer?.username}</span>
                        <div style={{ display: 'flex', gap: '0.1rem' }}>
                          {Array(5).fill(0).map((_, i) => <span key={i} style={{ color: i < rev.rating ? '#FACC15' : '#334155', fontSize: '0.85rem' }}>★</span>)}
                        </div>
                      </div>
                      {rev.comment && <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.6 }}>{rev.comment}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar de reserva */}
          <div style={{ position: 'sticky', top: 80 }}>
            <div className="card" style={{ padding: '1.5rem' }}>
              <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
                <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#A78BFA' }}>✦ {cost}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>créditos por sesión de {offer.durationMinutes} min</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '0.25rem' }}>({offer.creditsCostPerHour} cr/hora)</div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.25rem', fontSize: '0.88rem' }}>
                {[['⏱ Duración', `${offer.durationMinutes} minutos`], ['🌐 Modalidad', offer.modality], ['👥 Máx. estudiantes', offer.maxStudentsPerSession], ['✅ Sesiones completadas', offer.totalSessionsCompleted]].map(([k, v]) => (
                  <div key={String(k)} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border)' }}>
                    <span style={{ color: 'var(--text-muted)' }}>{k}</span>
                    <span style={{ fontWeight: 600 }}>{v}</span>
                  </div>
                ))}
              </div>

              {bookingSuccess ? (
                <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '0.75rem', padding: '1rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🎉</div>
                  <div style={{ fontWeight: 700, color: '#34D399' }}>¡Sesión reservada!</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: '0.25rem' }}>Revisa tu dashboard</div>
                  <Link href="/dashboard" className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '0.75rem', fontSize: '0.88rem' }}>Ver mis sesiones →</Link>
                </div>
              ) : isOwnOffer ? (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.88rem', padding: '0.75rem', background: 'var(--bg-card2)', borderRadius: '0.75rem' }}>
                  Esta es tu propia oferta
                </div>
              ) : !token ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <Link href="/login" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>Iniciar sesión para reservar</Link>
                  <Link href="/register" className="btn-ghost" style={{ width: '100%', justifyContent: 'center' }}>Crear cuenta gratis</Link>
                </div>
              ) : !showBooking ? (
                <>
                  {!canAfford && (
                    <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '0.6rem', padding: '0.6rem 0.8rem', fontSize: '0.82rem', color: '#F87171', marginBottom: '0.75rem' }}>
                      Créditos insuficientes. Tienes {user?.creditsBalance || 0}, necesitas {cost}.
                    </div>
                  )}
                  <button onClick={() => setShowBooking(true)} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={!canAfford}>
                    {canAfford ? `Reservar — ✦ ${cost} créditos` : 'Sin créditos suficientes'}
                  </button>
                </>
              ) : (
                <form onSubmit={handleBook} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.35rem', color: 'var(--text-muted)' }}>Fecha y hora *</label>
                    <input className="input" type="datetime-local" value={bookingDate} onChange={e => setBookingDate(e.target.value)} required min={new Date().toISOString().slice(0, 16)} style={{ fontSize: '0.88rem' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.35rem', color: 'var(--text-muted)' }}>Notas para el teacher</label>
                    <textarea value={bookingNotes} onChange={e => setBookingNotes(e.target.value)} placeholder="Cuéntale tu nivel y qué quieres aprender..." style={{ width: '100%', background: 'var(--bg-card2)', border: '1px solid var(--border)', borderRadius: '0.75rem', padding: '0.65rem 0.9rem', color: 'var(--text)', fontSize: '0.88rem', resize: 'vertical', minHeight: 80, outline: 'none' }} />
                  </div>
                  {bookingError && <div style={{ color: '#F87171', fontSize: '0.82rem', background: 'rgba(239,68,68,0.08)', borderRadius: '0.5rem', padding: '0.5rem 0.75rem' }}>{bookingError}</div>}
                  <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={booking}>
                    {booking ? 'Reservando...' : `Confirmar — ✦ ${cost} créditos`}
                  </button>
                  <button type="button" onClick={() => setShowBooking(false)} className="btn-ghost" style={{ width: '100%', justifyContent: 'center', fontSize: '0.88rem' }}>Cancelar</button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
