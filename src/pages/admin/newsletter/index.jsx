import { useState, useEffect } from 'react';
import Head from 'next/head';
import AdminLayout from '@/components/admin/AdminLayout';
import Pagination from '@/components/admin/Pagination';

const ITEMS_PER_PAGE = 10;

export default function AdminNewsletter() {
  const [subscribers, setSubscribers] = useState([]);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // success, error
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // all, active, unsubscribed

  useEffect(() => { fetchSubscribers(); }, []);

  const fetchSubscribers = async () => {
    const res = await fetch('/api/admin/newsletter');
    const data = await res.json();
    setSubscribers(data.subscribers || []);
  };

  const handleRemove = async (id) => {
    if (!confirm('Remove this subscriber permanently?')) return;
    await fetch(`/api/admin/newsletter/${id}`, { method: 'DELETE' });
    fetchSubscribers();
  };

  const handleBroadcast = async () => {
    if (!subject || !body) { 
      setMessage('Subject and body are required'); 
      setMessageType('error'); 
      return; 
    }
    if (activeCount === 0) {
      setMessage('No active subscribers to send to');
      setMessageType('error');
      return;
    }
    if (!confirm(`Send newsletter to ${activeCount} subscribers?`)) return;
    
    setSending(true);
    setMessage('');
    const res = await fetch('/api/admin/newsletter', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subject, body }),
    });
    const data = await res.json();
    setMessage(data.message || data.error);
    setMessageType(data.message ? 'success' : 'error');
    setSending(false);
    if (data.message) {
      setSubject('');
      setBody('');
    }
  };

  const handleExport = () => {
    const csv = ['email,status,subscribedAt', ...subscribers.map(s => `${s.email},${s.status},${s.subscribedAt}`)].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `subscribers-${new Date().toISOString().split('T')[0]}.csv`; a.click();
  };

  const activeCount = subscribers.filter(s => s.status === 'ACTIVE').length;
  const unsubscribedCount = subscribers.length - activeCount;

  // Filter subscribers
  const filteredSubscribers = subscribers.filter(s => {
    if (statusFilter === 'active' && s.status !== 'ACTIVE') return false;
    if (statusFilter === 'unsubscribed' && s.status === 'ACTIVE') return false;
    if (searchQuery) {
      return s.email.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  // Pagination
  const totalPages = Math.ceil(filteredSubscribers.length / ITEMS_PER_PAGE);
  const paginatedSubscribers = filteredSubscribers.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <>
      <Head><title>Newsletter — Nova Impact Admin</title></Head>
      <AdminLayout title="Newsletter">
        <div className="pro-newsletter-page">
          {/* Stats Cards */}
          <div className="pro-nl-stats">
            <div className="pro-nl-stat-card">
              <div className="pro-nl-stat-icon">
                <i className="fa-solid fa-users"></i>
              </div>
              <div className="pro-nl-stat-info">
                <span className="pro-nl-stat-value">{subscribers.length}</span>
                <span className="pro-nl-stat-label">Total Subscribers</span>
              </div>
            </div>
            <div className="pro-nl-stat-card active">
              <div className="pro-nl-stat-icon">
                <i className="fa-solid fa-circle-check"></i>
              </div>
              <div className="pro-nl-stat-info">
                <span className="pro-nl-stat-value">{activeCount}</span>
                <span className="pro-nl-stat-label">Active</span>
              </div>
            </div>
            <div className="pro-nl-stat-card unsubscribed">
              <div className="pro-nl-stat-icon">
                <i className="fa-solid fa-circle-xmark"></i>
              </div>
              <div className="pro-nl-stat-info">
                <span className="pro-nl-stat-value">{unsubscribedCount}</span>
                <span className="pro-nl-stat-label">Unsubscribed</span>
              </div>
            </div>
            <button className="pro-nl-export-btn" onClick={handleExport}>
              <i className="fa-solid fa-download"></i>
              Export CSV
            </button>
          </div>

          <div className="pro-nl-layout">
            {/* Left Panel - Compose */}
            <div className="pro-nl-compose-panel">
              <div className="pro-nl-compose-card">
                <div className="pro-nl-compose-header">
                  <div className="pro-nl-compose-icon">
                    <i className="fa-solid fa-paper-plane"></i>
                  </div>
                  <h3>Compose Newsletter</h3>
                  <p>Create and send emails to your active subscribers</p>
                </div>

                {message && (
                  <div className={`pro-nl-alert ${messageType === 'success' ? 'pro-nl-alert-success' : 'pro-nl-alert-error'}`}>
                    <i className={`fa-solid ${messageType === 'success' ? 'fa-circle-check' : 'fa-circle-xmark'}`}></i>
                    <span>{message}</span>
                  </div>
                )}

                <div className="pro-nl-form-group">
                  <label>Subject Line</label>
                  <input 
                    className="pro-nl-input" 
                    value={subject} 
                    onChange={e => setSubject(e.target.value)} 
                    placeholder="Enter email subject..."
                    maxLength={100}
                  />
                  <div className="pro-nl-char-count">{subject.length}/100</div>
                </div>

                <div className="pro-nl-form-group">
                  <label>Email Content</label>
                  <textarea 
                    className="pro-nl-textarea" 
                    rows={10} 
                    value={body} 
                    onChange={e => setBody(e.target.value)} 
                    placeholder="Write your newsletter content here..."
                  />
                  <div className="pro-nl-hint">Plain text or HTML is supported</div>
                </div>

                <div className="pro-nl-compose-footer">
                  <div className="pro-nl-recipient-info">
                    <i className="fa-solid fa-users"></i>
                    <span>Sending to <strong>{activeCount}</strong> active subscribers</span>
                  </div>
                  <button className="pro-nl-send-btn" onClick={handleBroadcast} disabled={sending || activeCount === 0}>
                    <i className="fa-solid fa-paper-plane"></i>
                    {sending ? 'Sending...' : 'Send Newsletter'}
                  </button>
                </div>
              </div>

              {/* Quick Tips */}
              <div className="pro-nl-tips-card">
                <h4><i className="fa-solid fa-lightbulb"></i> Quick Tips</h4>
                <ul>
                  <li>Keep subject lines under 60 characters for better open rates</li>
                  <li>Use clear, concise language in your content</li>
                  <li>Include a call-to-action to engage readers</li>
                  <li>Test your email by sending to yourself first</li>
                </ul>
              </div>
            </div>

            {/* Right Panel - Subscribers List */}
            <div className="pro-nl-list-panel">
              <div className="pro-nl-list-header">
                <h3>Subscribers</h3>
                <div className="pro-nl-search-filter">
                  <div className="pro-nl-search">
                    <i className="fa-solid fa-magnifying-glass"></i>
                    <input 
                      type="text" 
                      placeholder="Search emails..." 
                      value={searchQuery}
                      onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                    />
                  </div>
                  <div className="pro-nl-filter-tabs">
                    <button 
                      className={`pro-nl-filter-tab ${statusFilter === 'all' ? 'active' : ''}`}
                      onClick={() => { setStatusFilter('all'); setCurrentPage(1); }}
                    >
                      All
                    </button>
                    <button 
                      className={`pro-nl-filter-tab ${statusFilter === 'active' ? 'active' : ''}`}
                      onClick={() => { setStatusFilter('active'); setCurrentPage(1); }}
                    >
                      Active
                    </button>
                    <button 
                      className={`pro-nl-filter-tab ${statusFilter === 'unsubscribed' ? 'active' : ''}`}
                      onClick={() => { setStatusFilter('unsubscribed'); setCurrentPage(1); }}
                    >
                      Unsubscribed
                    </button>
                  </div>
                </div>
              </div>

              <div className="pro-nl-subscribers-list">
                {paginatedSubscribers.map(s => (
                  <div className="pro-nl-subscriber-item" key={s.id}>
                    <div className="pro-nl-subscriber-avatar">
                      <span>{s.email.charAt(0).toUpperCase()}</span>
                    </div>
                    <div className="pro-nl-subscriber-info">
                      <div className="pro-nl-subscriber-email">{s.email}</div>
                      <div className="pro-nl-subscriber-meta">
                        <span className={`pro-nl-status-badge ${s.status === 'ACTIVE' ? 'active' : 'inactive'}`}>
                          {s.status}
                        </span>
                        <span className="pro-nl-subscriber-date">
                          <i className="fa-solid fa-calendar"></i>
                          {new Date(s.subscribedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                    </div>
                    <button 
                      className="pro-nl-remove-btn" 
                      onClick={() => handleRemove(s.id)} 
                      title="Remove subscriber"
                    >
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </div>
                ))}
                {filteredSubscribers.length === 0 && (
                  <div className="pro-nl-empty-state">
                    <i className="fa-solid fa-users-slash"></i>
                    <h3>No subscribers found</h3>
                    <p>Try adjusting your search or filter criteria</p>
                  </div>
                )}
              </div>

              {totalPages > 1 && (
                <div className="pro-nl-pagination">
                  <Pagination 
                    currentPage={currentPage} 
                    totalPages={totalPages} 
                    onPageChange={setCurrentPage} 
                    itemsPerPage={ITEMS_PER_PAGE} 
                    totalItems={filteredSubscribers.length} 
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <style jsx global>{`
          .pro-newsletter-page {
            max-width: 1400px;
            margin: 0 auto;
          }

          /* Stats */
          .pro-nl-stats {
            display: flex;
            gap: 20px;
            margin-bottom: 32px;
            flex-wrap: wrap;
          }

          .pro-nl-stat-card {
            background: linear-gradient(135deg, #ffffff 0%, #fafafa 100%);
            border: 1px solid #e8e8e8;
            border-radius: 16px;
            padding: 24px;
            display: flex;
            align-items: center;
            gap: 16px;
            transition: all 0.3s ease;
            flex: 1;
            min-width: 220px;
          }

          .pro-nl-stat-card:hover {
            box-shadow: 0 8px 30px rgba(0,0,0,0.08);
            transform: translateY(-2px);
          }

          .pro-nl-stat-card.active {
            background: linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%);
            border-color: #10b981;
          }

          .pro-nl-stat-card.unsubscribed {
            background: linear-gradient(135deg, #fef2f2 0%, #ffffff 100%);
            border-color: #ef4444;
          }

          .pro-nl-stat-icon {
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

          .pro-nl-stat-card.active .pro-nl-stat-icon {
            background: rgba(16, 185, 129, 0.1);
            color: #10b981;
          }

          .pro-nl-stat-card.unsubscribed .pro-nl-stat-icon {
            background: rgba(239, 68, 68, 0.1);
            color: #ef4444;
          }

          .pro-nl-stat-info {
            flex: 1;
          }

          .pro-nl-stat-value {
            display: block;
            font-size: 28px;
            font-weight: 700;
            color: #1a1a1a;
            line-height: 1;
            margin-bottom: 4px;
          }

          .pro-nl-stat-label {
            font-size: 13px;
            color: #6c757d;
            font-weight: 500;
          }

          .pro-nl-export-btn {
            background: #ffffff;
            border: 1px solid #e8e8e8;
            padding: 12px 24px;
            border-radius: 12px;
            font-weight: 600;
            color: #1a1a1a;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
            transition: all 0.2s;
            height: fit-content;
          }

          .pro-nl-export-btn:hover {
            background: #f8f9fa;
            border-color: #1a1a1a;
            box-shadow: 0 4px 12px rgba(0,0,0,0.08);
          }

          /* Layout */
          .pro-nl-layout {
            display: grid;
            grid-template-columns: 450px 1fr;
            gap: 24px;
          }

          /* Compose Panel */
          .pro-nl-compose-panel {
            display: flex;
            flex-direction: column;
            gap: 20px;
          }

          .pro-nl-compose-card {
            background: #ffffff;
            border-radius: 20px;
            border: 1px solid #e8e8e8;
            padding: 32px;
          }

          .pro-nl-compose-header {
            text-align: center;
            margin-bottom: 28px;
          }

          .pro-nl-compose-icon {
            width: 64px;
            height: 64px;
            margin: 0 auto 16px;
            background: linear-gradient(135deg, #1a1a1a, #333333);
            border-radius: 18px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 28px;
            color: #1a1a1a;
          }

          .pro-nl-compose-header h3 {
            margin: 0 0 6px;
            font-size: 22px;
            font-weight: 700;
            color: #1a1a1a;
          }

          .pro-nl-compose-header p {
            margin: 0;
            font-size: 14px;
            color: #6c757d;
          }

          /* Alerts */
          .pro-nl-alert {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 14px 18px;
            border-radius: 12px;
            margin-bottom: 24px;
            font-size: 14px;
          }

          .pro-nl-alert-success {
            background: #f0fdf4;
            color: #166534;
            border: 1px solid #bbf7d0;
          }

          .pro-nl-alert-error {
            background: #fef2f2;
            color: #991b1b;
            border: 1px solid #fecaca;
          }

          /* Form */
          .pro-nl-form-group {
            margin-bottom: 24px;
          }

          .pro-nl-form-group label {
            display: block;
            margin-bottom: 8px;
            font-size: 14px;
            font-weight: 600;
            color: #1a1a1a;
          }

          .pro-nl-input, .pro-nl-textarea {
            width: 100%;
            padding: 14px 18px;
            background: #fafafa;
            border: 1px solid #e8e8e8;
            border-radius: 12px;
            color: #1a1a1a;
            font-size: 14px;
            font-family: inherit;
            transition: all 0.2s;
          }

          .pro-nl-input:focus, .pro-nl-textarea:focus {
            outline: none;
            border-color: #1a1a1a;
            background: #ffffff;
            box-shadow: 0 0 0 3px rgba(255,200,26,0.1);
          }

          .pro-nl-textarea {
            resize: vertical;
            line-height: 1.6;
          }

          .pro-nl-char-count {
            text-align: right;
            font-size: 12px;
            color: #9ca3af;
            margin-top: 6px;
          }

          .pro-nl-hint {
            font-size: 12px;
            color: #9ca3af;
            margin-top: 6px;
          }

          /* Footer */
          .pro-nl-compose-footer {
            border-top: 1px solid #f0f0f0;
            padding-top: 20px;
          }

          .pro-nl-recipient-info {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 14px;
            color: #6c757d;
            margin-bottom: 16px;
          }

          .pro-nl-recipient-info i {
            color: #1a1a1a;
          }

          .pro-nl-recipient-info strong {
            color: #1a1a1a;
          }

          .pro-nl-send-btn {
            width: 100%;
            background: linear-gradient(135deg, #1a1a1a, #333333);
            color: #1a1a1a;
            border: none;
            padding: 16px 28px;
            border-radius: 12px;
            font-size: 16px;
            font-weight: 700;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            transition: all 0.3s;
          }

          .pro-nl-send-btn:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 8px 24px rgba(255, 200, 26, 0.4);
          }

          .pro-nl-send-btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }

          /* Tips Card */
          .pro-nl-tips-card {
            background: linear-gradient(135deg, #fff9e6, #ffffff);
            border: 1px solid #1a1a1a;
            border-radius: 16px;
            padding: 24px;
          }

          .pro-nl-tips-card h4 {
            margin: 0 0 16px;
            font-size: 16px;
            color: #1a1a1a;
            display: flex;
            align-items: center;
            gap: 8px;
          }

          .pro-nl-tips-card ul {
            margin: 0;
            padding: 0;
            list-style: none;
          }

          .pro-nl-tips-card li {
            padding: 10px 0 10px 28px;
            font-size: 14px;
            color: #495057;
            position: relative;
            border-bottom: 1px solid rgba(255, 200, 26, 0.2);
          }

          .pro-nl-tips-card li:last-child {
            border-bottom: none;
          }

          .pro-nl-tips-card li::before {
            content: '✓';
            position: absolute;
            left: 0;
            color: #1a1a1a;
            font-weight: 700;
          }

          /* List Panel */
          .pro-nl-list-panel {
            background: #ffffff;
            border-radius: 20px;
            border: 1px solid #e8e8e8;
            overflow: hidden;
          }

          .pro-nl-list-header {
            padding: 24px;
            border-bottom: 1px solid #f0f0f0;
          }

          .pro-nl-list-header h3 {
            margin: 0 0 16px;
            font-size: 18px;
            font-weight: 700;
            color: #1a1a1a;
          }

          .pro-nl-search-filter {
            display: flex;
            flex-direction: column;
            gap: 12px;
          }

          .pro-nl-search {
            position: relative;
          }

          .pro-nl-search i {
            position: absolute;
            left: 16px;
            top: 50%;
            transform: translateY(-50%);
            color: #9ca3af;
            font-size: 14px;
          }

          .pro-nl-search input {
            width: 100%;
            padding: 12px 16px 12px 44px;
            border: 1px solid #e8e8e8;
            border-radius: 10px;
            font-size: 14px;
            transition: all 0.2s;
          }

          .pro-nl-search input:focus {
            outline: none;
            border-color: #1a1a1a;
            box-shadow: 0 0 0 3px rgba(255,200,26,0.1);
          }

          .pro-nl-filter-tabs {
            display: flex;
            gap: 8px;
          }

          .pro-nl-filter-tab {
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
          }

          .pro-nl-filter-tab:hover {
            background: #f0f0f0;
          }

          .pro-nl-filter-tab.active {
            background: rgba(255, 200, 26, 0.1);
            color: #1a1a1a;
            border-color: #1a1a1a;
          }

          /* Subscribers List */
          .pro-nl-subscribers-list {
            max-height: 600px;
            overflow-y: auto;
          }

          .pro-nl-subscriber-item {
            display: flex;
            align-items: center;
            gap: 14px;
            padding: 16px 24px;
            border-bottom: 1px solid #f5f5f5;
            transition: background 0.2s;
          }

          .pro-nl-subscriber-item:hover {
            background: #fafafa;
          }

          .pro-nl-subscriber-item:last-child {
            border-bottom: none;
          }

          .pro-nl-subscriber-avatar {
            flex-shrink: 0;
          }

          .pro-nl-subscriber-avatar span {
            width: 44px;
            height: 44px;
            border-radius: 12px;
            background: linear-gradient(135deg, #1a1a1a, #333333);
            color: #1a1a1a;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 600;
            font-size: 16px;
          }

          .pro-nl-subscriber-info {
            flex: 1;
            min-width: 0;
          }

          .pro-nl-subscriber-email {
            font-size: 14px;
            font-weight: 500;
            color: #1a1a1a;
            margin-bottom: 4px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .pro-nl-subscriber-meta {
            display: flex;
            align-items: center;
            gap: 12px;
          }

          .pro-nl-status-badge {
            display: inline-block;
            padding: 4px 10px;
            border-radius: 20px;
            font-size: 11px;
            font-weight: 600;
          }

          .pro-nl-status-badge.active {
            background: rgba(16, 185, 129, 0.1);
            color: #10b981;
          }

          .pro-nl-status-badge.inactive {
            background: rgba(108, 117, 125, 0.1);
            color: #6c757d;
          }

          .pro-nl-subscriber-date {
            font-size: 12px;
            color: #9ca3af;
            display: flex;
            align-items: center;
            gap: 4px;
          }

          .pro-nl-remove-btn {
            flex-shrink: 0;
            width: 36px;
            height: 36px;
            border: 1px solid #e8e8e8;
            background: #ffffff;
            border-radius: 8px;
            color: #9ca3af;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;
          }

          .pro-nl-remove-btn:hover {
            background: #ef4444;
            border-color: #ef4444;
            color: #ffffff;
          }

          /* Empty State */
          .pro-nl-empty-state {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 60px 40px;
            text-align: center;
          }

          .pro-nl-empty-state i {
            font-size: 64px;
            color: #e8e8e8;
            margin-bottom: 20px;
          }

          .pro-nl-empty-state h3 {
            margin: 0 0 8px;
            font-size: 20px;
            color: #1a1a1a;
          }

          .pro-nl-empty-state p {
            margin: 0;
            font-size: 14px;
            color: #6c757d;
          }

          /* Pagination */
          .pro-nl-pagination {
            padding: 20px 24px;
            border-top: 1px solid #f0f0f0;
          }

          /* Responsive */
          @media (max-width: 1200px) {
            .pro-nl-layout {
              grid-template-columns: 1fr;
            }
          }

          @media (max-width: 768px) {
            .pro-nl-stats {
              flex-direction: column;
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
