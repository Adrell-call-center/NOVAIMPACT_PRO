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

  const handleDelete = async (id) => {
    if (!confirm('Delete this message?')) return;
    await fetch(`/api/admin/contacts/${id}`, { method: 'DELETE' });
    if (selected?.id === id) setSelected(null);
    fetchContacts();
  };

  const unreadCount = contacts.filter(c => !c.isRead).length;

  // Pagination
  const totalPages = Math.ceil(contacts.length / ITEMS_PER_PAGE);
  const paginatedContacts = contacts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <>
      <Head><title>Contact Messages — Nova Impact Admin</title></Head>
      <AdminLayout title="Contact Messages">
        <div className="admin-page-header">
          <div className="admin-contacts-header">
            <span className="admin-stat">{contacts.length}</span> total messages
            {unreadCount > 0 && <span className="admin-unread-badge">{unreadCount} unread</span>}
          </div>
        </div>

        {loading ? (
          <div className="admin-loading"><div className="admin-spinner"></div></div>
        ) : (
          <div className="row g-4">
            <div className="col-lg-7">
              <div className="admin-light-card">
                <div className="admin-contacts-list">
                  {paginatedContacts.map(c => (
                    <div key={c.id} className={`admin-contact-item ${!c.isRead ? 'unread' : ''} ${selected?.id === c.id ? 'active' : ''}`} onClick={() => { setSelected(c); if (!c.isRead) markRead(c.id); }}>
                      <div className="admin-contact-avatar">{c.name.charAt(0)}</div>
                      <div className="admin-contact-content">
                        <div className="admin-contact-header">
                          <strong>{c.name}</strong>
                          <small>{new Date(c.createdAt).toLocaleDateString()}</small>
                        </div>
                        <p className="admin-contact-email">{c.email}</p>
                        <p className="admin-contact-preview">{c.message.substring(0, 80)}...</p>
                      </div>
                    </div>
                  ))}
                  {contacts.length === 0 && <p className="text-muted text-center py-5">No messages yet.</p>}
                </div>
              </div>
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} itemsPerPage={ITEMS_PER_PAGE} totalItems={contacts.length} />
            </div>
            <div className="col-lg-5">
              {selected ? (
                <div className="admin-light-card admin-contact-detail">
                  <div className="admin-contact-detail-header">
                    <div>
                      <h3>{selected.name}</h3>
                      <p className="admin-contact-detail-email">{selected.email}</p>
                    </div>
                    <button className="btn-outline-danger" onClick={() => handleDelete(selected.id)}><i className="fa-solid fa-trash me-1"></i></button>
                  </div>
                  <div className="admin-contact-detail-meta">
                    {selected.phone && <p><i className="fa-solid fa-phone me-2"></i><a href={`tel:${selected.phone}`}>{selected.phone}</a></p>}
                    <p><i className="fa-solid fa-calendar me-2"></i>{new Date(selected.createdAt).toLocaleString()}</p>
                  </div>
                  <hr />
                  <div className="admin-contact-message">
                    <p style={{ whiteSpace: 'pre-wrap' }}>{selected.message}</p>
                  </div>
                  <div className="admin-contact-actions">
                    <a href={`mailto:${selected.email}`} className="btn-gold"><i className="fa-solid fa-reply me-2"></i>Reply</a>
                    {selected.phone && <a href={`tel:${selected.phone}`} className="btn-outline"><i className="fa-solid fa-phone me-2"></i>Call</a>}
                  </div>
                </div>
              ) : <div className="admin-light-card admin-contact-empty"><i className="fa-solid fa-inbox"></i><p>Select a message to view details</p></div>}
            </div>
          </div>
        )}
      </AdminLayout>

      <style jsx global>{`
        .admin-page-header {
          margin-bottom: 24px;
        }

        .admin-contacts-header {
          font-size: 14px;
          color: #6c757d;
        }

        .admin-stat {
          font-size: 24px;
          font-weight: 700;
          color: #1a1d21;
          margin-right: 8px;
        }

        .admin-unread-badge {
          background: #FFC81A;
          color: #1a1d21;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          margin-left: 12px;
        }

        .admin-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 300px;
        }

        .admin-spinner {
          width: 32px;
          height: 32px;
          border: 3px solid #e8e8e8;
          border-top-color: #FFC81A;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
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

        .admin-contacts-list {
          max-height: 70vh;
          overflow-y: auto;
        }

        .admin-contact-item {
          display: flex;
          gap: 16px;
          padding: 16px 20px;
          border-bottom: 1px solid #f0f0f0;
          cursor: pointer;
          transition: background 0.2s;
        }

        .admin-contact-item:last-child {
          border-bottom: none;
        }

        .admin-contact-item:hover {
          background: #fafafa;
        }

        .admin-contact-item.active {
          background: rgba(255,200,26,0.08);
          border-left: 3px solid #FFC81A;
        }

        .admin-contact-item.unread {
          background: #f8f9fa;
        }

        .admin-contact-item.unread .admin-contact-name {
          font-weight: 600;
        }

        .admin-contact-avatar {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: linear-gradient(135deg, #FFC81A, #e6b517);
          color: #1a1d21;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 16px;
          flex-shrink: 0;
        }

        .admin-contact-content {
          flex: 1;
          min-width: 0;
        }

        .admin-contact-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 4px;
        }

        .admin-contact-header small {
          color: #6c757d;
        }

        .admin-contact-email {
          font-size: 13px;
          color: #6c757d;
          margin: 0 0 4px 0;
        }

        .admin-contact-preview {
          font-size: 14px;
          color: #495057;
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .admin-contact-detail {
          padding: 24px;
          height: 70vh;
          display: flex;
          flex-direction: column;
        }

        .admin-contact-detail-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
        }

        .admin-contact-detail-header h3 {
          margin: 0 0 4px 0;
          font-size: 20px;
          color: #1a1d21;
        }

        .admin-contact-detail-email {
          margin: 0;
          font-size: 14px;
          color: #6c757d;
        }

        .admin-contact-detail-meta {
          margin-bottom: 16px;
        }

        .admin-contact-detail-meta p {
          margin: 8px 0;
          font-size: 14px;
        }

        .admin-contact-detail-meta a {
          color: #FFC81A;
          text-decoration: none;
        }

        .admin-contact-message {
          flex: 1;
          overflow-y: auto;
          padding: 16px 0;
          font-size: 15px;
          line-height: 1.7;
          color: #495057;
        }

        .admin-contact-actions {
          display: flex;
          gap: 12px;
          padding-top: 16px;
          border-top: 1px solid #f0f0f0;
        }

        .btn-gold {
          background: #FFC81A;
          color: #1a1d21;
          border: none;
          padding: 10px 20px;
          border-radius: 8px;
          font-weight: 600;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s;
        }

        .btn-gold:hover {
          background: #e6b517;
        }

        .btn-outline {
          background: transparent;
          color: #6c757d;
          border: 1px solid #e8e8e8;
          padding: 10px 20px;
          border-radius: 8px;
          font-weight: 500;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s;
        }

        .btn-outline:hover {
          background: #f8f9fa;
          color: #1a1d21;
        }

        .btn-outline-danger {
          background: transparent;
          color: #dc3545;
          border: 1px solid #dc3545;
          padding: 8px 12px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-outline-danger:hover {
          background: #dc3545;
          color: #fff;
        }

        .admin-contact-empty {
          padding: 48px 24px;
          text-align: center;
          color: #6c757d;
          height: 70vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .admin-contact-empty i {
          font-size: 48px;
          margin-bottom: 16px;
          opacity: 0.3;
        }

        .text-muted {
          color: #6c757d;
        }

        .text-center {
          text-align: center;
        }

        .py-5 {
          padding-top: 48px;
          padding-bottom: 48px;
        }

        .row {
          display: flex;
          flex-wrap: wrap;
          margin: 0 -12px;
        }

        .col-lg-7, .col-lg-5 {
          padding: 0 12px;
          flex: 0 0 auto;
        }

        .col-lg-7 {
          width: 58.333333%;
        }

        .col-lg-5 {
          width: 41.666667%;
        }

        .g-4 {
          gap: 24px;
        }

        @media (max-width: 991px) {
          .col-lg-7, .col-lg-5 {
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
