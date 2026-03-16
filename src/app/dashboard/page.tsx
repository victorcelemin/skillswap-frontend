'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { sessionsApi, offersApi } from '@/lib/api';
import { useAuthStore } from '@/lib/store';

type Tab = 'sessions-student' | 'sessions-teacher' | 'my-offers';

const STATUS_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  PENDING:   { bg: 'rgba(234,179,8,0.1)',   color: '#FACC15', label: 'Pendiente' },
  CONFIRMED: { bg: 'rgba(6,182,212,0.1)',   color: '#06B6D4', label: 'Confirmada' },
  COMPLETED: { bg: 'rgba(16,185,129,0.1)',  color: '#34D399', label: 'Completada' },
  CANCELLED: { bg: 'rgba(239,68,68,0.1)',   color: '#F87171', label: 'Cancelada' },
  REJECTED:  { bg: 'rgba(239,68,68,0.1)',   color: '#F87171', label: 'Rechazada' },
};

export default function DashboardPage() {
  const { user, token } = useAuthStore();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('sessions-student');
  const [studentSessions, setStudentSessions] = useState<any[]>([]);
  const [teacherSessions, setTeacherSessions] = useState<any[]>([]);
  const [myOffers, setMyOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [toast, setToast] = useState('');

  useEffect(() => {
    if (!token) { router.push('/login'); return; }
    loadData();
  }, [token]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [ss, ts, mo] = await Promise.all([
        sessionsApi.getAsStudent(),
        sessionsApi.getAsTeacher(),
        offersApi.getMine(),
      ]);
      setStudentSessions(ss.data.data?.content || []);
      setTeacherSessions(ts.data.data?.content || []);
      setMyOffers(mo.data.data?.content || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const doAction = async (action: () => Promise<any>, msg: string, sessionId: number) => {
    setActionLoading(sessionId);
    try { await action(); showToast(msg); loadData(); }
    catch (e: any) { showToast(e.response?.data?.message || 'Error'); }
    finally { setActionLoading(null); }
  };

  if (!token) return null;

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: 'sessions-student', label: '📚 Aprendiendo', count: studentSessions.length },
    { key: 'sessions-teacher', label: '🎓 Enseñando', count: teacherSessions.length },
    { key: 'my-offers', label: '📋 Mis ofertas', count: myOffers.length },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar />
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '2rem 1.5rem' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '0.25rem' }}>
              Hola, <span className="gradient-text">{user?.username}</span> 👋
            </h1>
            <p style={{ color: 'var(--text-muted)' }}>Tu espacio en SkillSwap</p>
          </div>
          <Link href="/offers" className="btn-primary">Explorar ofertas →</Link>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          {[
            { icon: '✦', label: 'Créditos', value: user?.creditsBalance ?? 0, color: '#A78BFA' },
            { icon: '📚', label: 'Aprendidas', value: studentSessions.filter(s => s.status === 'COMPLETED').length, color: '#34D399' },
            { icon: '🎓', label: 'Enseñadas', value: teacherSessions.filter(s => s.status === 'COMPLETED').length, color: '#06B6D4' },
            { icon: '⭐', label: 'Rating', value: user?.averageRating ? user.averageRating.toFixed(1) : '—', color: '#FACC15' },
          ].map(({ icon, label, value, color }) => (
            <div key={label} className="card" style={{ padding: '1.25rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.35rem' }}>{icon}</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color }}>{value}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', background: 'var(--bg-card)', padding: '0.35rem', borderRadius: '0.875rem', border: '1px solid var(--border)', width: 'fit-content' }}>
          {tabs.map(({ key, label, count }) => (
            <button key={key} onClick={() => setTab(key)} style={{
              background: tab === key ? 'linear-gradient(135deg, #7C3AED, #EC4899)' : 'transparent',
              border: 'none', borderRadius: '0.6rem',
              padding: '0.5rem 1rem', cursor: 'pointer',
              color: tab === key ? '#fff' : 'var(--text-muted)',
              fontWeight: 600, fontSize: '0.88rem', transition: 'all 0.2s',
              display: 'flex', alignItems: 'center', gap: '0.4rem'
            }}>
              {label}
              <span style={{ background: tab === key ? 'rgba(255,255,255,0.2)' : 'var(--bg-card2)', borderRadius: '1rem', padding: '0 0.4rem', fontSize: '0.75rem' }}>{count}</span>
            </button>
          ))}
        </div>

        {/* Contenido */}
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {Array(3).fill(0).map((_, i) => <div key={i} className="skeleton" style={{ height: 80 }} />)}
          </div>
        ) : tab === 'sessions-student' ? (
          <SessionList sessions={studentSessions} role="student" onAction={doAction} loadingId={actionLoading} />
        ) : tab === 'sessions-teacher' ? (
          <SessionList sessions={teacherSessions} role="teacher" onAction={doAction} loadingId={actionLoading} />
        ) : (
          <MyOffers offers={myOffers} onAction={doAction} loadingId={actionLoading} />
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div className="toast">
          <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{toast}</div>
        </div>
      )}
    </div>
  );
}

function SessionList({ sessions, role, onAction, loadingId }: { sessions: any[]; role: string; onAction: Function; loadingId: number | null }) {
  if (sessions.length === 0) return (
    <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
      <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📭</div>
      <p>No tienes sesiones aún.</p>
      <Link href="/offers" className="btn-primary" style={{ display: 'inline-flex', marginTop: '1rem' }}>Explorar ofertas</Link>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {sessions.map(session => {
        const st = STATUS_STYLES[session.status] || { bg: 'rgba(148,163,184,0.1)', color: '#94A3B8', label: session.status };
        const isLoading = loadingId === session.id;
        return (
          <div key={session.id} className="card" style={{ padding: '1.25rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                <Link href={`/offers/${session.offer?.id}`} style={{ fontWeight: 700, textDecoration: 'none', color: 'var(--text)', fontSize: '0.95rem' }}>
                  {session.offer?.title}
                </Link>
                <span style={{ background: st.bg, color: st.color, borderRadius: '1rem', padding: '0.15rem 0.6rem', fontSize: '0.75rem', fontWeight: 600 }}>{st.label}</span>
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.83rem' }}>
                {role === 'student' ? `👨‍🏫 ${session.offer?.teacher?.username}` : `👨‍🎓 ${session.student?.username}`}
                {' · '}
                📅 {new Date(session.scheduledAt).toLocaleString('es', { dateStyle: 'medium', timeStyle: 'short' })}
                {' · '}
                ✦ {session.creditsPaid} créditos
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
              {role === 'teacher' && session.status === 'PENDING' && (
                <button onClick={() => onAction(() => sessionsApi.confirm(session.id), '✅ Sesión confirmada', session.id)}
                  className="btn-primary" style={{ padding: '0.45rem 0.9rem', fontSize: '0.82rem' }} disabled={isLoading}>
                  {isLoading ? '...' : 'Confirmar'}
                </button>
              )}
              {role === 'teacher' && session.status === 'CONFIRMED' && (
                <button onClick={() => onAction(() => sessionsApi.complete(session.id), '🎉 Sesión completada — créditos transferidos', session.id)}
                  className="btn-primary" style={{ padding: '0.45rem 0.9rem', fontSize: '0.82rem', background: 'linear-gradient(135deg, #059669, #10B981)' }} disabled={isLoading}>
                  {isLoading ? '...' : 'Completar'}
                </button>
              )}
              {['PENDING', 'CONFIRMED'].includes(session.status) && (
                <button onClick={() => onAction(() => sessionsApi.cancel(session.id), '↩️ Sesión cancelada — créditos reembolsados', session.id)}
                  style={{ padding: '0.45rem 0.9rem', fontSize: '0.82rem', background: 'transparent', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '0.6rem', color: '#F87171', cursor: 'pointer' }} disabled={isLoading}>
                  {isLoading ? '...' : 'Cancelar'}
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function MyOffers({ offers, onAction, loadingId }: { offers: any[]; onAction: Function; loadingId: number | null }) {
  if (offers.length === 0) return (
    <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
      <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📋</div>
      <p>No has publicado ofertas aún.</p>
    </div>
  );
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {offers.map(offer => (
        <div key={offer.id} className="card" style={{ padding: '1.25rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ flex: 1 }}>
            <Link href={`/offers/${offer.id}`} style={{ fontWeight: 700, textDecoration: 'none', color: 'var(--text)' }}>{offer.title}</Link>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.83rem', marginTop: '0.3rem' }}>
              ✦ {offer.creditsCostPerHour}/h · {offer.durationMinutes}min · {offer.totalSessionsCompleted} sesiones
            </div>
          </div>
          <span style={{ background: offer.status === 'ACTIVE' ? 'rgba(16,185,129,0.1)' : 'rgba(148,163,184,0.1)', color: offer.status === 'ACTIVE' ? '#34D399' : '#94A3B8', borderRadius: '1rem', padding: '0.2rem 0.7rem', fontSize: '0.78rem', fontWeight: 600 }}>
            {offer.status}
          </span>
        </div>
      ))}
    </div>
  );
}
