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

          {/* Stats */}
          <div className="stats-grid">
            <div className="stat-card" style={{ '--stat-bg': 'var(--slate-bg)', '--stat-color': 'var(--slate)' }}>
              <div className="stat-card-header"><div className="stat-card-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></div></div>
              <div className="stat-card-value">{subscribers.length}</div><p className="stat-card-label">Total</p>
            </div>
            <div className="stat-card" style={{ '--stat-bg': 'var(--success-bg)', '--stat-color': 'var(--success)' }}>
              <div className="stat-card-header"><div className="stat-card-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></div></div>
              <div className="stat-card-value">{activeCount}</div><p className="stat-card-label">Active</p>
            </div>
            <div className="stat-card" style={{ '--stat-bg': 'var(--danger-bg)', '--stat-color': 'var(--danger)' }}>
              <div className="stat-card-header"><div className="stat-card-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg></div></div>
              <div className="stat-card-value">{unsubscribedCount}</div><p className="stat-card-label">Unsubscribed</p>
            </div>
          </div>

          <div className="content-grid">
            {/* Compose */}
            <div className="stripe-card">
              <div className="stripe-card-header">
                <h3 className="stripe-card-title">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  Compose Campaign
                </h3>
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
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 16, borderTop: '1px solid var(--border)' }}>
                  <span style={{ fontSize: 13, color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                    Sending to <strong style={{ color: 'var(--text-primary)' }}>{activeCount}</strong> subscribers
                  </span>
                  <button className="btn btn-primary" onClick={handleBroadcast} disabled={sending || activeCount === 0}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                    {sending ? 'Sending...' : 'Send Campaign'}
                  </button>
                </div>
              </div>
            </div>

            {/* Subscribers List */}
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
              <div className="card-body no-padding" style={{ maxHeight: '520px', overflowY: 'auto' }}>
                {filtered.length > 0 ? (
                  <div className="list">
                    {filtered.map(s => (
                      <div key={s.id} className="list-item">
                        <div className="list-item-avatar" style={{ background: s.status === 'ACTIVE' ? 'var(--text-primary)' : 'var(--text-tertiary)' }}>
                          {s.email.charAt(0).toUpperCase()}
                        </div>
                        <div className="list-item-content">
                          <div className="list-item-header">
                            <span className="list-item-name" style={{ fontSize: 13, fontFamily: 'monospace' }}>{s.email}</span>
                            <Badge variant={s.status === 'ACTIVE' ? 'success' : 'neutral'}>{s.status}</Badge>
                          </div>
                          <p className="list-item-preview">{formatDate(s.subscribedAt)}</p>
                        </div>
                        <button className="btn-icon danger" onClick={() => handleRemove(s.id)} title="Remove">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                        </button>
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
      </AdminLayout>
    </>
  );
}

function Badge({ variant, children }) { return <span className={`badge badge-${variant}`}>{children}</span>; }
function EmptyState({ icon, title, description }) { return (<div className="empty-state">{icon}<h4 className="empty-state-title">{title}</h4><p className="empty-state-desc">{description}</p></div>); }
function formatDate(d) { const date = new Date(d); return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); }

export async function getServerSideProps(ctx) {
  const { getServerSession } = await import("next-auth/next");
  const { authOptions } = await import("@/lib/auth");
  const session = await getServerSession(ctx.req, ctx.res, authOptions);
  if (!session) return { redirect: { destination: '/admin/login', permanent: false } };
  return { props: {} };
}
