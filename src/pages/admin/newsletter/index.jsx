import { useState, useEffect } from 'react';
import Head from 'next/head';
import AdminLayout from '@/components/admin/AdminLayout';

export default function AdminNewsletter() {
  const [subscribers, setSubscribers] = useState([]);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => { fetchSubscribers(); }, []);

  const fetchSubscribers = async () => {
    const res = await fetch('/api/admin/newsletter');
    const data = await res.json();
    setSubscribers(data.subscribers || []);
  };

  const handleRemove = async (id) => {
    if (!confirm('Remove this subscriber?')) return;
    await fetch(`/api/admin/newsletter/${id}`, { method: 'DELETE' });
    fetchSubscribers();
  };

  const handleBroadcast = async () => {
    if (!subject || !body) { setMessage('Subject and body are required'); setMessageType('error'); return; }
    if (activeCount === 0) { setMessage('No active subscribers'); setMessageType('error'); return; }
    if (!confirm(`Send to ${activeCount} subscribers?`)) return;
    setSending(true);
    const res = await fetch('/api/admin/newsletter', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ subject, body }) });
    const data = await res.json();
    setMessage(data.message || data.error);
    setMessageType(data.message ? 'success' : 'error');
    setSending(false);
    if (data.message) { setSubject(''); setBody(''); }
  };

  const handleExport = () => {
    const csv = ['email,status,subscribedAt', ...subscribers.map(s => `${s.email},${s.status},${s.subscribedAt}`)].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `subscribers-${new Date().toISOString().split('T')[0]}.csv`; a.click();
  };

  const activeCount = subscribers.filter(s => s.status === 'ACTIVE').length;
  const unsubscribedCount = subscribers.length - activeCount;

  const filtered = subscribers.filter(s => {
    if (statusFilter === 'active' && s.status !== 'ACTIVE') return false;
    if (statusFilter === 'unsubscribed' && s.status === 'ACTIVE') return false;
    if (searchQuery) return s.email.toLowerCase().includes(searchQuery.toLowerCase());
    return true;
  });

  return (
    <>
      <Head><title>Newsletter — Nova Impact</title></Head>
      <AdminLayout title="Newsletter">
        <div className="stripe-page">
          <div className="stripe-page-header">
            <div>
              <h1 className="stripe-page-title">Newsletter</h1>
              <p className="stripe-page-subtitle">Manage subscribers and send email campaigns</p>
            </div>
            <button className="btn btn-secondary" onClick={handleExport}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Export CSV
            </button>
          </div>

          <div className="stats-grid">
            <div className="stat-card" style={{ '--stat-bg': 'var(--stripe-slate-bg)', '--stat-color': 'var(--stripe-slate)' }}>
              <div className="stat-card-header"><div className="stat-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></div></div>
              <div className="stat-value">{subscribers.length}</div><p className="stat-label">Total</p>
            </div>
            <div className="stat-card" style={{ '--stat-bg': 'var(--stripe-success-bg)', '--stat-color': 'var(--stripe-success)' }}>
              <div className="stat-card-header"><div className="stat-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></div></div>
              <div className="stat-value">{activeCount}</div><p className="stat-label">Active</p>
            </div>
            <div className="stat-card" style={{ '--stat-bg': 'var(--stripe-danger-bg)', '--stat-color': 'var(--stripe-danger)' }}>
              <div className="stat-card-header"><div className="stat-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg></div></div>
              <div className="stat-value">{unsubscribedCount}</div><p className="stat-label">Unsubscribed</p>
            </div>
          </div>

          <div className="content-grid">
            {/* Compose */}
            <div className="stripe-card">
              <div className="stripe-card-header">
                <h3 className="stripe-card-title"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>Compose Campaign</h3>
              </div>
              <div className="stripe-card-body">
                {message && (
                  <div className={`alert alert-${messageType}`}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">{messageType === 'success' ? <><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></> : <><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></>}</svg>
                    <span>{message}</span>
                  </div>
                )}
                <div className="form-group">
                  <label className="form-label">Subject</label>
                  <input className="form-input" value={subject} onChange={e => setSubject(e.target.value)} placeholder="Email subject line" maxLength={100} />
                  <p className="form-hint">{subject.length}/100 characters</p>
                </div>
                <div className="form-group">
                  <label className="form-label">Content</label>
                  <textarea className="form-textarea" rows={10} value={body} onChange={e => setBody(e.target.value)} placeholder="Write your newsletter content..." />
                  <p className="form-hint">Plain text or HTML is supported</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 16, borderTop: '1px solid var(--stripe-border)' }}>
                  <span style={{ fontSize: 13, color: 'var(--stripe-text-tertiary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                    Sending to <strong style={{ color: 'var(--stripe-text-primary)' }}>{activeCount}</strong> subscribers
                  </span>
                  <button className="btn btn-primary" onClick={handleBroadcast} disabled={sending || activeCount === 0}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                    {sending ? 'Sending...' : 'Send Campaign'}
                  </button>
                </div>
              </div>
            </div>

            {/* Subscribers */}
            <div className="stripe-card">
              <div className="stripe-card-header">
                <h3 className="stripe-card-title">Subscribers</h3>
                <div className="search-box">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                  <input className="form-input" style={{ width: '160px', padding: '7px 14px 7px 34px', fontSize: '13px' }} placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                </div>
              </div>
              <div className="filter-tabs" style={{ margin: '12px 20px 0' }}>
                <button className={`filter-tab ${statusFilter === 'all' ? 'active' : ''}`} onClick={() => setStatusFilter('all')}>All</button>
                <button className={`filter-tab ${statusFilter === 'active' ? 'active' : ''}`} onClick={() => setStatusFilter('active')}>Active</button>
                <button className={`filter-tab ${statusFilter === 'unsubscribed' ? 'active' : ''}`} onClick={() => setStatusFilter('unsubscribed')}>Unsubscribed</button>
              </div>
              <div className="stripe-card-body no-padding" style={{ maxHeight: '520px', overflowY: 'auto' }}>
                {filtered.length > 0 ? (
                  <div className="stripe-list">
                    {filtered.map(s => (
                      <div key={s.id} className="stripe-list-item">
                        <div className="stripe-list-avatar" style={{ background: s.status === 'ACTIVE' ? 'var(--stripe-text-primary)' : 'var(--stripe-text-tertiary)' }}>
                          {s.email.charAt(0).toUpperCase()}
                        </div>
                        <div className="stripe-list-content">
                          <div className="stripe-list-header">
                            <span className="stripe-list-name" style={{ fontSize: 13, fontFamily: 'monospace' }}>{s.email}</span>
                            <span className={`badge badge-${s.status === 'ACTIVE' ? 'success' : 'warning'}`}>{s.status}</span>
                          </div>
                          <p className="stripe-list-preview">{formatDate(s.subscribedAt)}</p>
                        </div>
                        <button className="btn-icon btn-icon-danger" onClick={() => handleRemove(s.id)} title="Remove"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState icon={<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>} title="No subscribers" description="People who sign up will appear here" />
                )}
              </div>
            </div>
          </div>
        </div>

        <style jsx global>{`
          .stripe-page { max-width: 1280px; }
          .stripe-page-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 32px; }
          .stripe-page-title { margin: 0 0 6px; font-size: 24px; font-weight: 700; color: var(--stripe-text-primary); letter-spacing: -0.02em; }
          .stripe-page-subtitle { margin: 0; font-size: 15px; color: var(--stripe-text-secondary); }
          .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 32px; }
          .stat-card { background: #fff; border: 1px solid var(--stripe-border); border-radius: var(--stripe-radius-lg); padding: 20px; transition: all 0.15s; }
          .stat-card:hover { box-shadow: var(--stripe-shadow-md); transform: translateY(-1px); }
          .stat-card-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
          .stat-icon { width: 36px; height: 36px; border-radius: var(--stripe-radius); display: flex; align-items: center; justify-content: center; background: var(--stat-bg); color: var(--stat-color); }
          .stat-value { font-size: 28px; font-weight: 700; color: var(--stripe-text-primary); line-height: 1; margin-bottom: 6px; letter-spacing: -0.02em; }
          .stat-label { font-size: 13px; color: var(--stripe-text-secondary); font-weight: 500; margin: 0 0 4px; }
          .content-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
          .stripe-card { background: #fff; border: 1px solid var(--stripe-border); border-radius: var(--stripe-radius-lg); overflow: hidden; }
          .stripe-card-header { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-bottom: 1px solid var(--stripe-border); }
          .stripe-card-title { margin: 0; font-size: 14px; font-weight: 600; color: var(--stripe-text-primary); display: flex; align-items: center; gap: 8px; }
          .stripe-card-title svg { width: 16px; height: 16px; color: var(--stripe-text-tertiary); }
          .stripe-card-body { padding: 20px; }
          .stripe-card-body.no-padding { padding: 0; }
          .filter-tabs { display: flex; gap: 4px; background: var(--stripe-bg); border-radius: var(--stripe-radius); padding: 4px; }
          .filter-tab { padding: 6px 14px; border: none; background: transparent; color: var(--stripe-text-secondary); border-radius: 6px; font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.1s; }
          .filter-tab:hover { color: var(--stripe-text-primary); }
          .filter-tab.active { background: #fff; color: var(--stripe-text-primary); box-shadow: var(--stripe-shadow-sm); }
          .search-box { position: relative; }
          .search-box svg { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); width: 16px; height: 16px; color: var(--stripe-text-tertiary); pointer-events: none; }
          .form-group { margin-bottom: 20px; }
          .form-label { display: block; margin-bottom: 6px; font-size: 13px; font-weight: 600; color: var(--stripe-text-secondary); }
          .form-input { width: 100%; padding: 10px 14px; background: #fff; border: 1px solid var(--stripe-border); border-radius: var(--stripe-radius); color: var(--stripe-text-primary); font-size: 14px; transition: all 0.1s; }
          .form-input:focus { outline: none; border-color: var(--stripe-primary); box-shadow: 0 0 0 3px var(--stripe-primary-subtle); }
          .form-textarea { width: 100%; padding: 10px 14px; background: #fff; border: 1px solid var(--stripe-border); border-radius: var(--stripe-radius); color: var(--stripe-text-primary); font-size: 14px; font-family: inherit; resize: vertical; line-height: 1.6; min-height: 120px; }
          .form-textarea:focus { outline: none; border-color: var(--stripe-primary); box-shadow: 0 0 0 3px var(--stripe-primary-subtle); }
          .form-hint { font-size: 12px; color: var(--stripe-text-tertiary); margin-top: 4px; }
          .alert { display: flex; align-items: flex-start; gap: 12px; padding: 14px 16px; border-radius: var(--stripe-radius); font-size: 14px; margin-bottom: 20px; }
          .alert-success { background: var(--stripe-success-bg); color: var(--stripe-success-text); border: 1px solid rgba(62, 207, 142, 0.2); }
          .alert-error { background: var(--stripe-danger-bg); color: var(--stripe-danger-text); border: 1px solid rgba(255, 79, 79, 0.2); }
          .stripe-list { display: flex; flex-direction: column; }
          .stripe-list-item { display: flex; gap: 12px; padding: 16px 20px; border-bottom: 1px solid var(--stripe-border-light); text-decoration: none; transition: background 0.1s; }
          .stripe-list-item:last-child { border-bottom: none; }
          .stripe-list-item:hover { background: var(--stripe-bg); }
          .stripe-list-avatar { width: 36px; height: 36px; border-radius: var(--stripe-radius); background: var(--stripe-text-primary); color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 14px; flex-shrink: 0; }
          .stripe-list-content { flex: 1; min-width: 0; }
          .stripe-list-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px; }
          .stripe-list-name { font-size: 14px; font-weight: 600; color: var(--stripe-text-primary); }
          .stripe-list-preview { margin: 0; font-size: 13px; color: var(--stripe-text-secondary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
          .btn { display: inline-flex; align-items: center; gap: 8px; padding: 9px 16px; border-radius: var(--stripe-radius); font-size: 14px; font-weight: 600; text-decoration: none; border: none; cursor: pointer; transition: all 0.1s; }
          .btn-primary { background: var(--stripe-primary); color: white; box-shadow: 0 1px 2px rgba(99, 91, 255, 0.2); }
          .btn-primary:hover { background: var(--stripe-primary-hover); }
          .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
          .btn-secondary { background: #fff; color: var(--stripe-text-primary); border: 1px solid var(--stripe-border); }
          .btn-secondary:hover { background: var(--stripe-bg); }
          .btn-icon { width: 32px; height: 32px; display: inline-flex; align-items: center; justify-content: center; border: 1px solid var(--stripe-border); background: #fff; border-radius: var(--stripe-radius); color: var(--stripe-text-tertiary); transition: all 0.1s; cursor: pointer; }
          .btn-icon:hover { background: var(--stripe-bg); color: var(--stripe-text-primary); }
          .btn-icon-danger:hover { background: var(--stripe-danger-bg); color: var(--stripe-danger); border-color: var(--stripe-danger); }
          .badge { display: inline-flex; align-items: center; padding: 3px 10px; border-radius: 9999px; font-size: 12px; font-weight: 600; }
          .badge-success { background: var(--stripe-success-bg); color: var(--stripe-success-text); }
          .badge-warning { background: var(--stripe-warning-bg); color: var(--stripe-warning-text); }
          .empty-state { text-align: center; padding: 48px 24px; }
          .empty-state svg { color: var(--stripe-text-tertiary); margin-bottom: 16px; opacity: 0.4; }
          .empty-state-title { margin: 0 0 6px; font-size: 14px; font-weight: 600; color: var(--stripe-text-primary); }
          .empty-state-desc { margin: 0 0 20px; font-size: 13px; color: var(--stripe-text-tertiary); }
          @media (max-width: 1023px) { .content-grid { grid-template-columns: 1fr; } }
          @media (max-width: 768px) { .stats-grid { grid-template-columns: repeat(2, 1fr); } .stripe-page-header { flex-direction: column; gap: 16px; } }
          @media (max-width: 480px) { .stats-grid { grid-template-columns: 1fr; } }
        `}</style>
      </AdminLayout>
    </>
  );
}

function EmptyState({ icon, title, description }) {
  return (<div className="empty-state">{icon}<h4 className="empty-state-title">{title}</h4><p className="empty-state-desc">{description}</p></div>);
}

function formatDate(d) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export async function getServerSideProps(ctx) {
  const { getServerSession } = await import("next-auth/next");
  const { authOptions } = await import("@/lib/auth");
  const session = await getServerSession(ctx.req, ctx.res, authOptions);
  if (!session) return { redirect: { destination: '/admin/login', permanent: false } };
  return { props: {} };
}
