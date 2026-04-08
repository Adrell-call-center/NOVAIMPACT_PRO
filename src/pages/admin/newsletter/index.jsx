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
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => { fetchSubscribers(); }, []);

  const fetchSubscribers = async () => {
    const res = await fetch('/api/admin/newsletter');
    const data = await res.json();
    setSubscribers(data.subscribers || []);
  };

  const handleRemove = async (id) => {
    if (!confirm('Remove subscriber?')) return;
    await fetch(`/api/admin/newsletter/${id}`, { method: 'DELETE' });
    fetchSubscribers();
  };

  const handleBroadcast = async () => {
    if (!subject || !body) { setMessage('Subject and body required'); return; }
    setSending(true);
    const res = await fetch('/api/admin/newsletter', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subject, body }),
    });
    const data = await res.json();
    setMessage(data.message || data.error);
    setSending(false);
  };

  const handleExport = () => {
    const csv = ['email,status,subscribedAt', ...subscribers.map(s => `${s.email},${s.status},${s.subscribedAt}`)].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'subscribers.csv'; a.click();
  };

  const activeCount = subscribers.filter(s => s.status === 'ACTIVE').length;
  const unsubscribedCount = subscribers.length - activeCount;

  // Pagination
  const totalPages = Math.ceil(subscribers.length / ITEMS_PER_PAGE);
  const paginatedSubscribers = subscribers.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <>
      <Head><title>Newsletter — Nova Impact Admin</title></Head>
      <AdminLayout title="Newsletter">
        <div className="row g-4">
          <div className="col-lg-5">
            <div className="admin-light-card admin-newsletter-compose">
              <h3 className="admin-section-title"><i className="fa-solid fa-paper-plane me-2" style={{ color: '#FFC81A' }}></i>Compose Email</h3>
              {message && <div className={`admin-alert ${message.includes('sent') ? 'admin-alert-success' : 'admin-alert-info'}`}>{message}</div>}
              <div className="form-group">
                <label>Subject</label>
                <input className="admin-input" value={subject} onChange={e => setSubject(e.target.value)} placeholder="Email subject line" />
              </div>
              <div className="form-group">
                <label>Body</label>
                <textarea className="admin-textarea" rows={8} value={body} onChange={e => setBody(e.target.value)} placeholder="Email content..." />
              </div>
              <button className="btn-gold w-100" onClick={handleBroadcast} disabled={sending}>
                <i className="fa-solid fa-paper-plane me-2"></i>{sending ? 'Sending...' : `Send to ${activeCount} subscribers`}
              </button>
            </div>
          </div>
          <div className="col-lg-7">
            <div className="admin-stats-row">
              <div className="admin-mini-stat">
                <span className="admin-mini-value">{subscribers.length}</span>
                <span className="admin-mini-label">Total</span>
              </div>
              <div className="admin-mini-stat">
                <span className="admin-mini-value text-success">{activeCount}</span>
                <span className="admin-mini-label">Active</span>
              </div>
              <div className="admin-mini-stat">
                <span className="admin-mini-value text-warning">{unsubscribedCount}</span>
                <span className="admin-mini-label">Unsubscribed</span>
              </div>
              <button className="btn-outline" onClick={handleExport}><i className="fa-solid fa-download me-2"></i>Export CSV</button>
            </div>
            <div className="admin-light-card">
              <div className="admin-subscribers-list">
                {paginatedSubscribers.map(s => (
                  <div className="admin-subscriber-item" key={s.id}>
                    <div className="admin-subscriber-info">
                      <strong>{s.email}</strong>
                      <small>{new Date(s.subscribedAt).toLocaleDateString()}</small>
                    </div>
                    <div className="admin-subscriber-actions">
                      <span className={`admin-badge ${s.status === 'ACTIVE' ? 'admin-badge-success' : 'admin-badge-secondary'}`}>{s.status}</span>
                      <button className="admin-btn-icon admin-btn-danger" onClick={() => handleRemove(s.id)} title="Remove"><i className="fa-solid fa-trash"></i></button>
                    </div>
                  </div>
                ))}
                {subscribers.length === 0 && <p className="text-muted text-center py-4">No subscribers yet.</p>}
              </div>
            </div>
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} itemsPerPage={ITEMS_PER_PAGE} totalItems={subscribers.length} />
          </div>
        </div>
      </AdminLayout>

      <style jsx global>{`
        .admin-newsletter-compose {
          padding: 24px;
          height: 100%;
        }

        .admin-section-title {
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 20px;
          color: #1a1d21;
        }

        .admin-alert {
          padding: 12px 16px;
          border-radius: 8px;
          margin-bottom: 20px;
          font-size: 14px;
        }

        .admin-alert-success {
          background: rgba(25, 135, 84, 0.15);
          color: #198754;
          border: 1px solid rgba(25, 135, 84, 0.3);
        }

        .admin-alert-info {
          background: rgba(13, 202, 240, 0.15);
          color: #0d6efd;
          border: 1px solid rgba(13, 202, 240, 0.3);
        }

        .form-group {
          margin-bottom: 16px;
        }

        .form-group label {
          display: block;
          margin-bottom: 6px;
          font-size: 13px;
          color: #6c757d;
        }

        .admin-input {
          width: 100%;
          padding: 12px 16px;
          background: #ffffff;
          border: 1px solid #e8e8e8;
          border-radius: 8px;
          color: #1a1d21;
          font-size: 14px;
        }

        .admin-input:focus {
          outline: none;
          border-color: #FFC81A;
          box-shadow: 0 0 0 3px rgba(255,200,26,0.15);
        }

        .admin-textarea {
          width: 100%;
          padding: 12px 16px;
          background: #ffffff;
          border: 1px solid #e8e8e8;
          border-radius: 8px;
          color: #1a1d21;
          font-size: 14px;
          resize: vertical;
          font-family: inherit;
        }

        .admin-textarea:focus {
          outline: none;
          border-color: #FFC81A;
          box-shadow: 0 0 0 3px rgba(255,200,26,0.15);
        }

        .btn-gold {
          background: #FFC81A;
          color: #1a1d21;
          border: none;
          padding: 12px 24px;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.2s;
        }

        .btn-gold:hover {
          background: #e6b517;
        }

        .btn-gold:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-outline {
          background: #ffffff;
          color: #6c757d;
          border: 1px solid #e8e8e8;
          padding: 10px 20px;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s;
        }

        .btn-outline:hover {
          background: #f8f9fa;
          color: #1a1d21;
          border-color: #FFC81A;
        }

        .w-100 {
          width: 100%;
        }

        .admin-stats-row {
          display: flex;
          gap: 16px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }

        .admin-mini-stat {
          background: #ffffff;
          border-radius: 12px;
          padding: 16px 20px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.08);
          text-align: center;
          min-width: 100px;
          border: 1px solid #e8e8e8;
        }

        .admin-mini-value {
          display: block;
          font-size: 24px;
          font-weight: 700;
          color: #1a1d21;
        }

        .admin-mini-label {
          font-size: 12px;
          color: #6c757d;
        }

        .text-success {
          color: #198754 !important;
        }

        .text-warning {
          color: #fd7e14 !important;
        }

        .admin-light-card {
          background: #ffffff;
          border-radius: 16px;
          border: 1px solid #e8e8e8;
          overflow: hidden;
          transition: box-shadow 0.3s ease;
        }

        .admin-light-card:hover {
          box-shadow: 0 8px 30px rgba(0,0,0,0.08);
        }

        .admin-subscribers-list {
          max-height: 500px;
          overflow-y: auto;
        }

        .admin-subscriber-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 14px 20px;
          border-bottom: 1px solid #f0f0f0;
        }

        .admin-subscriber-item:last-child {
          border-bottom: none;
        }

        .admin-subscriber-item:hover {
          background: #fafafa;
        }

        .admin-subscriber-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .admin-subscriber-info strong {
          font-size: 14px;
          color: #1a1d21;
        }

        .admin-subscriber-info small {
          color: #6c757d;
          font-size: 12px;
        }

        .admin-subscriber-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .admin-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
        }

        .admin-badge-success { background: rgba(25, 135, 84, 0.15); color: #198754; }
        .admin-badge-secondary { background: rgba(108, 117, 125, 0.15); color: #6c757d; }

        .admin-btn-icon {
          width: 32px;
          height: 32px;
          border: 1px solid #e8e8e8;
          background: #ffffff;
          border-radius: 6px;
          color: #6c757d;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .admin-btn-icon:hover {
          background: #FFC81A;
          color: #1a1d21;
          border-color: #FFC81A;
        }

        .admin-btn-danger:hover {
          background: #dc3545;
          color: #fff;
          border-color: #dc3545;
        }

        .text-muted {
          color: #6c757d;
        }

        .text-center {
          text-align: center;
        }

        .py-4 {
          padding-top: 32px;
          padding-bottom: 32px;
        }

        .row {
          display: flex;
          flex-wrap: wrap;
          margin: 0 -12px;
        }

        .col-lg-5, .col-lg-7 {
          padding: 0 12px;
          flex: 0 0 auto;
        }

        .col-lg-5 {
          width: 41.666667%;
        }

        .col-lg-7 {
          width: 58.333333%;
        }

        .g-4 {
          gap: 24px;
        }

        @media (max-width: 991px) {
          .col-lg-5, .col-lg-7 {
            width: 100%;
          }
        }
      `}</style>
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
