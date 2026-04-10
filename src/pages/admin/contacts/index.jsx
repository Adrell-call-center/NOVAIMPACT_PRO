import { useState, useEffect } from 'react';
import Head from 'next/head';
import AdminLayout from '@/components/admin/AdminLayout';
import '@/styles/admin-stripe.css';

export default function AdminContacts() {
  const [contacts, setContacts] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => { fetchContacts(); }, []);

  const fetchContacts = async () => {
    const res = await fetch('/api/admin/contacts');
    const data = await res.json();
    setContacts(data.contacts || []);
    setLoading(false);
  };

  const markRead = async (id) => {
    await fetch(`/api/admin/contacts/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ isRead: true }) });
    fetchContacts();
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    await fetch(`/api/admin/contacts/${confirmDelete}`, { method: 'DELETE' });
    if (selected?.id === confirmDelete) setSelected(null);
    setConfirmDelete(null);
    fetchContacts();
  };

  const unreadCount = contacts.filter(c => !c.isRead).length;

  const filteredContacts = contacts.filter(c => {
    if (filter === 'unread' && c.isRead) return false;
    if (filter === 'read' && !c.isRead) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (c.name || '').toLowerCase().includes(q) || (c.email || '').toLowerCase().includes(q) || (c.message || '').toLowerCase().includes(q);
    }
    return true;
  });

  const getInitials = (name) => name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);

  return (
    <>
      <Head><title>Messages — Nova Impact</title></Head>
      <AdminLayout title="Messages">
        <div className="stripe-page">
          {/* Header */}
          <div className="stripe-page-header">
            <div>
              <h1 className="stripe-page-title">Messages</h1>
              <p className="stripe-page-subtitle">Contact form submissions from your website</p>
            </div>
          </div>

          {/* Stats */}
          <div className="stats-grid">
            <div className="stat-card" style={{ '--stat-bg': 'var(--slate-bg)', '--stat-color': 'var(--slate)' }}>
              <div className="stat-card-header">
                <div className="stat-card-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                </div>
              </div>
              <div className="stat-card-value">{contacts.length}</div>
              <p className="stat-card-label">Total</p>
            </div>
            <div className="stat-card" style={{ '--stat-bg': 'var(--warning-bg)', '--stat-color': 'var(--warning)' }}>
              <div className="stat-card-header">
                <div className="stat-card-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                </div>
              </div>
              <div className="stat-card-value">{unreadCount}</div>
              <p className="stat-card-label">Unread</p>
            </div>
            <div className="stat-card" style={{ '--stat-bg': 'var(--success-bg)', '--stat-color': 'var(--success)' }}>
              <div className="stat-card-header">
                <div className="stat-card-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                </div>
              </div>
              <div className="stat-card-value">{contacts.length - unreadCount}</div>
              <p className="stat-card-label">Read</p>
            </div>
          </div>

          {/* Main Content */}
          <div className="content-grid">
            {/* List */}
            <div className="stripe-card">
              <div className="stripe-card-header">
                <h3 className="stripe-card-title">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  Inbox
                </h3>
                <div className="search-box">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                  <input className="form-input" style={{ width: '180px', padding: '7px 14px 7px 34px', fontSize: '13px' }} placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                </div>
              </div>
              <div className="filter-tabs" style={{ margin: '12px 20px 0' }}>
                <button className={`filter-tab ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>All</button>
                <button className={`filter-tab ${filter === 'unread' ? 'active' : ''}`} onClick={() => setFilter('unread')}>Unread {unreadCount > 0 && <span className="badge badge-warning" style={{ marginLeft: '4px', padding: '1px 6px', fontSize: '10px' }}>{unreadCount}</span>}</button>
                <button className={`filter-tab ${filter === 'read' ? 'active' : ''}`} onClick={() => setFilter('read')}>Read</button>
              </div>

              <div className="card-body no-padding" style={{ maxHeight: '560px', overflowY: 'auto' }}>
                {loading ? (
                  <div style={{ padding: '48px 24px', textAlign: 'center' }}>
                    <div className="skeleton" style={{ width: '40px', height: '40px', margin: '0 auto 16px', borderRadius: '50%' }}></div>
                    <p style={{ color: 'var(--text-tertiary)', fontSize: '13px', margin: 0 }}>Loading messages...</p>
                  </div>
                ) : filteredContacts.length > 0 ? (
                  <div className="list">
                    {filteredContacts.map(c => (
                      <div key={c.id} className={`list-item ${!c.isRead ? 'unread' : ''} ${selected?.id === c.id ? 'active' : ''}`} onClick={() => { setSelected(c); if (!c.isRead) markRead(c.id); }} style={{ cursor: 'pointer', borderLeft: selected?.id === c.id ? '3px solid var(--primary)' : '3px solid transparent' }}>
                        <div className="list-item-avatar">{getInitials(c.name)}</div>
                        <div className="list-item-content">
                          <div className="list-item-header">
                            <span className="list-item-name" style={{ fontWeight: !c.isRead ? 700 : 600 }}>{c.name}</span>
                            <span className="list-item-time">{formatDate(c.createdAt)}</span>
                          </div>
                          <p className="list-item-preview">{c.message.substring(0, 90)}...</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState icon={<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>} title="No messages" description="Contact form submissions will appear here" />
                )}
              </div>
            </div>

            {/* Detail Panel */}
            <div className="stripe-card">
              {selected ? (
                <>
                  <div className="stripe-card-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div className="list-item-avatar" style={{ width: '40px', height: '40px' }}>{getInitials(selected.name)}</div>
                      <div>
                        <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 600 }}>{selected.name}</h3>
                        <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-tertiary)' }}>{selected.email}</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <a href={`mailto:${selected.email}`} className="btn-icon" title="Reply">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 17 4 12 9 7"/><path d="M20 18v-2a4 4 0 0 0-4-4H4"/></svg>
                      </a>
                      <button className="btn-icon danger" onClick={() => setConfirmDelete(selected.id)} title="Delete">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                      </button>
                    </div>
                  </div>
                  <div className="stripe-card-body">
                    <div style={{ display: 'flex', gap: '16px', marginBottom: '20px', fontSize: '13px', color: 'var(--text-tertiary)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                        {formatDate(selected.createdAt)}
                      </span>
                      {selected.phone && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                          <a href={`tel:${selected.phone}`} style={{ color: 'var(--primary)', textDecoration: 'none' }}>{selected.phone}</a>
                        </span>
                      )}
                    </div>
                    <div style={{ background: 'var(--bg-primary)', borderLeft: '3px solid var(--primary)', padding: '20px', borderRadius: 'var(--radius)', fontSize: '14px', lineHeight: 1.7, color: 'var(--text-secondary)', whiteSpace: 'pre-wrap' }}>
                      {selected.message}
                    </div>
                    <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
                      <a href={`mailto:${selected.email}`} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                        Reply via Email
                      </a>
                    </div>
                  </div>
                </>
              ) : (
                <div className="empty-state" style={{ padding: '80px 24px' }}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" style={{ color: 'var(--text-tertiary)', opacity: 0.3, marginBottom: 16 }}>
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                  <h4 className="empty-state-title">Select a message</h4>
                  <p className="empty-state-desc">Choose a conversation from the inbox</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Delete Modal */}
        {confirmDelete && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000 }} onClick={() => setConfirmDelete(null)}>
            <div className="modal-content" onClick={e => e.stopPropagation()} style={{ background: 'white', borderRadius: 12, padding: 32, maxWidth: 400, textAlign: 'center' }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--danger-bg)', color: 'var(--danger)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
              </div>
              <h3 style={{ margin: '0 0 8px', fontSize: 18, fontWeight: 700 }}>Delete Message</h3>
              <p style={{ margin: '0 0 24px', fontSize: 14, color: 'var(--text-secondary)' }}>This cannot be undone.</p>
              <div style={{ display: 'flex', gap: 12 }}>
                <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setConfirmDelete(null)}>Cancel</button>
                <button className="btn btn-danger" style={{ flex: 1 }} onClick={handleDelete}>Delete</button>
              </div>
            </div>
          </div>
        )}

        <style jsx global>{`
          .list-item.unread { background: var(--bg-primary); }
          .list-item.unread .list-item-name { color: var(--text-primary); }
          .list-item.active { background: var(--primary-subtle); }
        `}</style>
      </AdminLayout>
    </>
  );
}

function EmptyState({ icon, title, description }) {
  return (
    <div className="empty-state">
      {icon}
      <h4 className="empty-state-title">{title}</h4>
      <p className="empty-state-desc">{description}</p>
    </div>
  );
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now - date;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) { const hours = Math.floor(diff / (1000 * 60 * 60)); return hours === 0 ? 'Just now' : `${hours}h ago`; }
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export async function getServerSideProps(ctx) {
  const { getServerSession } = await import("next-auth/next");
  const { authOptions } = await import("@/lib/auth");
  const session = await getServerSession(ctx.req, ctx.res, authOptions);
  if (!session) return { redirect: { destination: '/admin/login', permanent: false } };
  return { props: {} };
}
