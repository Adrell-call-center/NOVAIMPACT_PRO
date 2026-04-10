import { useState, useEffect } from 'react';
import Head from 'next/head';
import AdminLayout from '@/components/admin/AdminLayout';
import Pagination from '@/components/admin/Pagination';

const ITEMS_PER_PAGE = 10;

export default function AdminContacts() {
  const [contacts, setContacts] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState('all'); // all, unread, read
  const [searchQuery, setSearchQuery] = useState('');
  const [showDetail, setShowDetail] = useState(false);

  useEffect(() => { fetchContacts(); }, []);

  const fetchContacts = async () => {
    const res = await fetch('/api/admin/contacts');
    const data = await res.json();
    setContacts(data.contacts || []);
    setLoading(false);
  };

  const markRead = async (id) => {
    await fetch(`/api/admin/contacts/${id}`, { 
      method: 'PUT', 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify({ isRead: true }) 
    });
    fetchContacts();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this message permanently?')) return;
    await fetch(`/api/admin/contacts/${id}`, { method: 'DELETE' });
    if (selected?.id === id) { setSelected(null); setShowDetail(false); }
    fetchContacts();
  };

  const handleMarkAsRead = async (id) => {
    await fetch(`/api/admin/contacts/${id}`, { 
      method: 'PUT', 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify({ isRead: true }) 
    });
    fetchContacts();
  };

  const handleMarkAsUnread = async (id) => {
    await fetch(`/api/admin/contacts/${id}`, { 
      method: 'PUT', 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify({ isRead: false }) 
    });
    fetchContacts();
  };

  const unreadCount = contacts.filter(c => !c.isRead).length;
  const readCount = contacts.filter(c => c.isRead).length;

  // Filter contacts
  const filteredContacts = contacts.filter(c => {
    if (filter === 'unread' && c.isRead) return false;
    if (filter === 'read' && !c.isRead) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.message.toLowerCase().includes(q) ||
        (c.subject && c.subject.toLowerCase().includes(q))
      );
    }
    return true;
  });

  // Pagination
  const totalPages = Math.ceil(filteredContacts.length / ITEMS_PER_PAGE);
  const paginatedContacts = filteredContacts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now - d;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      const hours = Math.floor(diff / (1000 * 60 * 60));
      if (hours === 0) {
        const mins = Math.floor(diff / (1000 * 60));
        return mins < 1 ? 'Just now' : `${mins}m ago`;
      }
      return `${hours}h ago`;
    }
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days}d ago`;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: d.getFullYear() !== now.getFullYear() ? 'numeric' : undefined });
  };

  return (
    <>
      <Head><title>Contact Messages — Nova Impact Admin</title></Head>
      <AdminLayout title="Contact Messages">
        <div className="pro-contacts-page">
          {/* Stats Cards */}
          <div className="pro-stats-grid">
            <div className="pro-stat-card">
              <div className="pro-stat-icon">
                <i className="fa-solid fa-inbox"></i>
              </div>
              <div className="pro-stat-info">
                <span className="pro-stat-value">{contacts.length}</span>
                <span className="pro-stat-label">Total Messages</span>
              </div>
            </div>
            <div className="pro-stat-card unread">
              <div className="pro-stat-icon">
                <i className="fa-solid fa-envelope"></i>
              </div>
              <div className="pro-stat-info">
                <span className="pro-stat-value">{unreadCount}</span>
                <span className="pro-stat-label">Unread</span>
              </div>
            </div>
            <div className="pro-stat-card read">
              <div className="pro-stat-icon">
                <i className="fa-solid fa-circle-check"></i>
              </div>
              <div className="pro-stat-info">
                <span className="pro-stat-value">{readCount}</span>
                <span className="pro-stat-label">Read</span>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="pro-loading">
              <div className="pro-spinner"></div>
              <p>Loading messages...</p>
            </div>
          ) : (
            <div className="pro-contacts-layout">
              {/* Left Panel - List */}
              <div className="pro-list-panel">
                {/* Search & Filter Bar */}
                <div className="pro-list-header">
                  <div className="pro-search-box">
                    <i className="fa-solid fa-magnifying-glass"></i>
                    <input 
                      type="text" 
                      placeholder="Search messages..." 
                      value={searchQuery}
                      onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                    />
                  </div>
                  <div className="pro-filter-tabs">
                    <button 
                      className={`pro-filter-tab ${filter === 'all' ? 'active' : ''}`}
                      onClick={() => { setFilter('all'); setCurrentPage(1); }}
                    >
                      All
                    </button>
                    <button 
                      className={`pro-filter-tab ${filter === 'unread' ? 'active' : ''}`}
                      onClick={() => { setFilter('unread'); setCurrentPage(1); }}
                    >
                      Unread {unreadCount > 0 && <span className="pro-filter-badge">{unreadCount}</span>}
                    </button>
                    <button 
                      className={`pro-filter-tab ${filter === 'read' ? 'active' : ''}`}
                      onClick={() => { setFilter('read'); setCurrentPage(1); }}
                    >
                      Read
                    </button>
                  </div>
                </div>

                {/* Contacts List */}
                <div className="pro-contacts-list">
                  {paginatedContacts.map(c => (
                    <div 
                      key={c.id} 
                      className={`pro-contact-item ${!c.isRead ? 'unread' : ''} ${selected?.id === c.id ? 'active' : ''}`}
                      onClick={() => { setSelected(c); setShowDetail(true); if (!c.isRead) markRead(c.id); }}
                    >
                      <div className="pro-contact-avatar">
                        <span>{getInitials(c.name)}</span>
                        {!c.isRead && <span className="pro-unread-dot"></span>}
                      </div>
                      <div className="pro-contact-content">
                        <div className="pro-contact-top">
                          <div className="pro-contact-name">{c.name}</div>
                          <div className="pro-contact-time">{formatDate(c.createdAt)}</div>
                        </div>
                        <div className="pro-contact-email">{c.email}</div>
                        <div className="pro-contact-preview">{c.message.substring(0, 90)}...</div>
                      </div>
                    </div>
                  ))}
                  {filteredContacts.length === 0 && (
                    <div className="pro-empty-state">
                      <i className="fa-solid fa-inbox"></i>
                      <h3>No messages found</h3>
                      <p>Try adjusting your search or filter criteria</p>
                    </div>
                  )}
                </div>

                {totalPages > 1 && (
                  <div className="pro-pagination">
                    <Pagination 
                      currentPage={currentPage} 
                      totalPages={totalPages} 
                      onPageChange={setCurrentPage} 
                      itemsPerPage={ITEMS_PER_PAGE} 
                      totalItems={filteredContacts.length} 
                    />
                  </div>
                )}
              </div>

              {/* Right Panel - Detail */}
              <div className="pro-detail-panel">
                {showDetail && selected ? (
                  <div className="pro-contact-detail">
                    {/* Detail Header */}
                    <div className="pro-detail-header">
                      <button className="pro-back-btn" onClick={() => { setShowDetail(false); setSelected(null); }}>
                        <i className="fa-solid fa-arrow-left"></i>
                      </button>
                      <div className="pro-detail-sender">
                        <div className="pro-detail-avatar">
                          <span>{getInitials(selected.name)}</span>
                        </div>
                        <div className="pro-detail-sender-info">
                          <h3>{selected.name}</h3>
                          <p>{selected.email}</p>
                        </div>
                      </div>
                      <div className="pro-detail-actions">
                        {selected.isRead ? (
                          <button className="pro-action-btn" onClick={() => handleMarkAsUnread(selected.id)} title="Mark as unread">
                            <i className="fa-solid fa-envelope"></i>
                          </button>
                        ) : (
                          <button className="pro-action-btn" onClick={() => handleMarkAsRead(selected.id)} title="Mark as read">
                            <i className="fa-solid fa-envelope-open"></i>
                          </button>
                        )}
                        <a href={`mailto:${selected.email}`} className="pro-action-btn" title="Reply">
                          <i className="fa-solid fa-reply"></i>
                        </a>
                        <button className="pro-action-btn danger" onClick={() => handleDelete(selected.id)} title="Delete">
                          <i className="fa-solid fa-trash"></i>
                        </button>
                      </div>
                    </div>

                    {/* Detail Meta */}
                    <div className="pro-detail-meta">
                      <div className="pro-meta-item">
                        <i className="fa-solid fa-calendar"></i>
                        <span>{new Date(selected.createdAt).toLocaleString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      {selected.phone && (
                        <div className="pro-meta-item">
                          <i className="fa-solid fa-phone"></i>
                          <a href={`tel:${selected.phone}`}>{selected.phone}</a>
                        </div>
                      )}
                    </div>

                    {/* Message */}
                    <div className="pro-detail-message">
                      <div className="pro-message-bubble">
                        <p style={{ whiteSpace: 'pre-wrap' }}>{selected.message}</p>
                      </div>
                    </div>

                    {/* Quick Reply */}
                    <div className="pro-detail-footer">
                      <a href={`mailto:${selected.email}`} className="pro-reply-btn">
                        <i className="fa-solid fa-paper-plane"></i>
                        Reply via Email
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="pro-empty-detail">
                    <i className="fa-solid fa-comments"></i>
                    <h3>Select a message</h3>
                    <p>Choose a conversation from the list to view details</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <style jsx global>{`
          .pro-contacts-page {
            max-width: 1400px;
            margin: 0 auto;
          }

          /* Stats Grid */
          .pro-stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
            gap: 20px;
            margin-bottom: 32px;
          }

          .pro-stat-card {
            background: linear-gradient(135deg, #ffffff 0%, #fafafa 100%);
            border: 1px solid #e8e8e8;
            border-radius: 16px;
            padding: 24px;
            display: flex;
            align-items: center;
            gap: 16px;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
          }

          .pro-stat-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 4px;
            height: 100%;
            background: #1a1a1a;
            opacity: 0;
            transition: opacity 0.3s ease;
          }

          .pro-stat-card:hover {
            box-shadow: 0 8px 30px rgba(0,0,0,0.08);
            transform: translateY(-2px);
          }

          .pro-stat-card:hover::before {
            opacity: 1;
          }

          .pro-stat-card.unread {
            background: linear-gradient(135deg, #fff9e6 0%, #ffffff 100%);
            border-color: #1a1a1a;
          }

          .pro-stat-card.unread::before {
            opacity: 1;
          }

          .pro-stat-card.read {
            background: linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%);
            border-color: #10b981;
          }

          .pro-stat-icon {
            width: 56px;
            height: 56px;
            border-radius: 14px;
            background: rgba(255, 200, 26, 0.1);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            color: #1a1a1a;
          }

          .pro-stat-card.unread .pro-stat-icon {
            background: rgba(255, 200, 26, 0.2);
          }

          .pro-stat-card.read .pro-stat-icon {
            background: rgba(16, 185, 129, 0.1);
            color: #10b981;
          }

          .pro-stat-info {
            flex: 1;
          }

          .pro-stat-value {
            display: block;
            font-size: 28px;
            font-weight: 700;
            color: #1a1a1a;
            line-height: 1;
            margin-bottom: 4px;
          }

          .pro-stat-label {
            font-size: 13px;
            color: #6c757d;
            font-weight: 500;
          }

          /* Loading */
          .pro-loading {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 400px;
            gap: 16px;
          }

          .pro-spinner {
            width: 40px;
            height: 40px;
            border: 3px solid #f0f0f0;
            border-top-color: #1a1a1a;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
          }

          @keyframes spin {
            to { transform: rotate(360deg); }
          }

          /* Layout */
          .pro-contacts-layout {
            display: grid;
            grid-template-columns: 420px 1fr;
            gap: 24px;
            min-height: 700px;
          }

          /* List Panel */
          .pro-list-panel {
            background: #ffffff;
            border-radius: 20px;
            border: 1px solid #e8e8e8;
            overflow: hidden;
            display: flex;
            flex-direction: column;
          }

          .pro-list-header {
            padding: 20px;
            border-bottom: 1px solid #f0f0f0;
          }

          .pro-search-box {
            position: relative;
            margin-bottom: 16px;
          }

          .pro-search-box i {
            position: absolute;
            left: 16px;
            top: 50%;
            transform: translateY(-50%);
            color: #9ca3af;
            font-size: 14px;
          }

          .pro-search-box input {
            width: 100%;
            padding: 12px 16px 12px 44px;
            border: 1px solid #e8e8e8;
            border-radius: 12px;
            font-size: 14px;
            transition: all 0.2s;
          }

          .pro-search-box input:focus {
            outline: none;
            border-color: #1a1a1a;
            box-shadow: 0 0 0 3px rgba(255,200,26,0.1);
          }

          .pro-filter-tabs {
            display: flex;
            gap: 8px;
          }

          .pro-filter-tab {
            flex: 1;
            padding: 8px 16px;
            background: #f8f9fa;
            border: 1px solid transparent;
            border-radius: 8px;
            font-size: 13px;
            font-weight: 500;
            color: #6c757d;
            cursor: pointer;
            transition: all 0.2s;
            position: relative;
          }

          .pro-filter-tab:hover {
            background: #f0f0f0;
          }

          .pro-filter-tab.active {
            background: rgba(255, 200, 26, 0.1);
            color: #1a1a1a;
            border-color: #1a1a1a;
          }

          .pro-filter-badge {
            background: #1a1a1a;
            color: #1a1a1a;
            padding: 2px 6px;
            border-radius: 10px;
            font-size: 11px;
            font-weight: 600;
            margin-left: 4px;
          }

          /* Contacts List */
          .pro-contacts-list {
            flex: 1;
            overflow-y: auto;
            max-height: 600px;
          }

          .pro-contact-item {
            display: flex;
            gap: 14px;
            padding: 16px 20px;
            border-bottom: 1px solid #f5f5f5;
            cursor: pointer;
            transition: all 0.2s;
            position: relative;
          }

          .pro-contact-item:hover {
            background: #fafafa;
          }

          .pro-contact-item.active {
            background: rgba(255, 200, 26, 0.06);
          }

          .pro-contact-item.active::before {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            width: 3px;
            background: #1a1a1a;
          }

          .pro-contact-avatar {
            position: relative;
            flex-shrink: 0;
          }

          .pro-contact-avatar span {
            width: 48px;
            height: 48px;
            border-radius: 14px;
            background: linear-gradient(135deg, #1a1a1a, #333333);
            color: #1a1a1a;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 600;
            font-size: 16px;
          }

          .pro-unread-dot {
            position: absolute;
            top: -2px;
            right: -2px;
            width: 12px;
            height: 12px;
            background: #1a1a1a;
            border: 2px solid #ffffff;
            border-radius: 50%;
          }

          .pro-contact-content {
            flex: 1;
            min-width: 0;
          }

          .pro-contact-top {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 4px;
          }

          .pro-contact-name {
            font-weight: 600;
            font-size: 14px;
            color: #1a1a1a;
          }

          .pro-contact-item.unread .pro-contact-name {
            font-weight: 700;
          }

          .pro-contact-time {
            font-size: 12px;
            color: #9ca3af;
          }

          .pro-contact-email {
            font-size: 13px;
            color: #6c757d;
            margin-bottom: 4px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .pro-contact-preview {
            font-size: 13px;
            color: #495057;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          /* Pagination */
          .pro-pagination {
            padding: 16px;
            border-top: 1px solid #f0f0f0;
          }

          /* Detail Panel */
          .pro-detail-panel {
            background: #ffffff;
            border-radius: 20px;
            border: 1px solid #e8e8e8;
            overflow: hidden;
          }

          .pro-contact-detail {
            display: flex;
            flex-direction: column;
            height: 100%;
          }

          .pro-detail-header {
            display: flex;
            align-items: center;
            gap: 16px;
            padding: 24px;
            border-bottom: 1px solid #f0f0f0;
          }

          .pro-back-btn {
            width: 40px;
            height: 40px;
            border: 1px solid #e8e8e8;
            background: #ffffff;
            border-radius: 10px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;
          }

          .pro-back-btn:hover {
            background: #f8f9fa;
            border-color: #1a1a1a;
          }

          .pro-detail-sender {
            flex: 1;
            display: flex;
            align-items: center;
            gap: 14px;
          }

          .pro-detail-avatar {
            width: 52px;
            height: 52px;
            border-radius: 14px;
            background: linear-gradient(135deg, #1a1a1a, #333333);
            color: #1a1a1a;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 600;
            font-size: 18px;
            flex-shrink: 0;
          }

          .pro-detail-sender-info h3 {
            margin: 0;
            font-size: 16px;
            font-weight: 600;
            color: #1a1a1a;
          }

          .pro-detail-sender-info p {
            margin: 2px 0 0;
            font-size: 13px;
            color: #6c757d;
          }

          .pro-detail-actions {
            display: flex;
            gap: 8px;
          }

          .pro-action-btn {
            width: 40px;
            height: 40px;
            border: 1px solid #e8e8e8;
            background: #ffffff;
            border-radius: 10px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #6c757d;
            transition: all 0.2s;
            text-decoration: none;
          }

          .pro-action-btn:hover {
            background: #f8f9fa;
            border-color: #1a1a1a;
            color: #1a1a1a;
          }

          .pro-action-btn.danger:hover {
            background: #dc3545;
            border-color: #dc3545;
            color: #ffffff;
          }

          /* Meta */
          .pro-detail-meta {
            padding: 16px 24px;
            display: flex;
            gap: 20px;
            flex-wrap: wrap;
            border-bottom: 1px solid #f5f5f5;
          }

          .pro-meta-item {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 13px;
            color: #6c757d;
          }

          .pro-meta-item i {
            color: #1a1a1a;
          }

          .pro-meta-item a {
            color: #1a1a1a;
            text-decoration: none;
          }

          .pro-meta-item a:hover {
            text-decoration: underline;
          }

          /* Message */
          .pro-detail-message {
            flex: 1;
            padding: 24px;
            overflow-y: auto;
          }

          .pro-message-bubble {
            background: #f8f9fa;
            border-left: 3px solid #1a1a1a;
            padding: 20px;
            border-radius: 12px;
            font-size: 15px;
            line-height: 1.7;
            color: #495057;
          }

          /* Footer */
          .pro-detail-footer {
            padding: 20px 24px;
            border-top: 1px solid #f0f0f0;
          }

          .pro-reply-btn {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: #1a1a1a;
            color: #1a1a1a;
            padding: 12px 24px;
            border-radius: 10px;
            font-weight: 600;
            text-decoration: none;
            transition: all 0.2s;
          }

          .pro-reply-btn:hover {
            background: #333333;
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(255, 200, 26, 0.3);
          }

          /* Empty States */
          .pro-empty-state, .pro-empty-detail {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 60px 40px;
            text-align: center;
            height: 100%;
          }

          .pro-empty-state i, .pro-empty-detail i {
            font-size: 64px;
            color: #e8e8e8;
            margin-bottom: 20px;
          }

          .pro-empty-state h3, .pro-empty-detail h3 {
            margin: 0 0 8px;
            font-size: 20px;
            color: #1a1a1a;
          }

          .pro-empty-state p, .pro-empty-detail p {
            margin: 0;
            font-size: 14px;
            color: #6c757d;
          }

          /* Responsive */
          @media (max-width: 1200px) {
            .pro-contacts-layout {
              grid-template-columns: 1fr;
            }

            .pro-detail-panel {
              display: none;
            }

            .pro-list-panel .pro-contact-item.active .pro-detail-panel-mobile {
              display: block;
            }
          }

          @media (max-width: 768px) {
            .pro-stats-grid {
              grid-template-columns: 1fr;
            }
          }
        `}</style>
      </AdminLayout>
    </>
  );
}

export async function getServerSideProps(ctx) {
  const { getServerSession } = await import("next-auth/next");
  const { authOptions } = await import("@/lib/auth");
  const session = await getServerSession(ctx.req, ctx.res, authOptions);

  if (!session) {
    return { redirect: { destination: '/admin/login', permanent: false } };
  }
  return { props: {} };
}
