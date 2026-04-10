import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';
import '@/styles/admin-stripe.css';

const ITEMS_PER_PAGE = 12;

export default function AdminPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => { fetchPosts(); }, []);

  const fetchPosts = async () => {
    const res = await fetch('/api/admin/posts');
    const data = await res.json();
    setPosts(data.posts || []);
    setLoading(false);
  };

  const handleDelete = async (id) => {
    await fetch(`/api/admin/posts/${id}`, { method: 'DELETE' });
    setConfirmDelete(null);
    fetchPosts();
  };

  // Filter posts
  const filteredPosts = posts.filter(p => {
    if (statusFilter !== 'all' && p.status.toLowerCase() !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (p.titleFr || '').toLowerCase().includes(q) || (p.category || '').toLowerCase().includes(q);
    }
    return true;
  });

  // Pagination
  const totalPages = Math.ceil(filteredPosts.length / ITEMS_PER_PAGE);
  const paginatedPosts = filteredPosts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const publishedCount = posts.filter(p => p.status === 'PUBLISHED').length;
  const draftsCount = posts.filter(p => p.status === 'DRAFT').length;

  return (
    <>
      <Head><title>Posts — Nova Impact</title></Head>
      <AdminLayout title="Posts">
        <div className="stripe-page">
          {/* Page Header */}
          <div className="stripe-page-header">
            <div>
              <h1 className="stripe-page-title">Posts</h1>
              <p className="stripe-page-subtitle">Manage your blog posts and articles</p>
            </div>
            <Link href="/admin/posts/new" className="btn btn-primary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 5v14M5 12h14"/>
              </svg>
              New Post
            </Link>
          </div>

          {/* Stats */}
          <div className="stats-grid">
            <div className="stat-card" style={{ '--stat-bg': 'var(--slate-bg)', '--stat-color': 'var(--slate)' }}>
              <div className="stat-card-header">
                <div className="stat-card-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
                  </svg>
                </div>
              </div>
              <div className="stat-card-value">{posts.length}</div>
              <p className="stat-card-label">Total Posts</p>
            </div>
            <div className="stat-card" style={{ '--stat-bg': 'var(--success-bg)', '--stat-color': 'var(--success)' }}>
              <div className="stat-card-header">
                <div className="stat-card-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                </div>
              </div>
              <div className="stat-card-value">{publishedCount}</div>
              <p className="stat-card-label">Published</p>
            </div>
            <div className="stat-card" style={{ '--stat-bg': 'var(--warning-bg)', '--stat-color': 'var(--warning)' }}>
              <div className="stat-card-header">
                <div className="stat-card-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                </div>
              </div>
              <div className="stat-card-value">{draftsCount}</div>
              <p className="stat-card-label">Drafts</p>
            </div>
          </div>

          {/* Posts Table Card */}
          <div className="stripe-card">
            <div className="stripe-card-header">
              <h3 className="stripe-card-title">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
                </svg>
                All Posts
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div className="search-box">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                  </svg>
                  <input 
                    className="form-input" 
                    style={{ width: '200px', padding: '7px 14px 7px 34px', fontSize: '13px' }}
                    placeholder="Search posts..." 
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                  />
                </div>
                <div className="filter-tabs">
                  <button className={`filter-tab ${statusFilter === 'all' ? 'active' : ''}`} onClick={() => { setStatusFilter('all'); setCurrentPage(1); }}>All</button>
                  <button className={`filter-tab ${statusFilter === 'published' ? 'active' : ''}`} onClick={() => { setStatusFilter('published'); setCurrentPage(1); }}>Published</button>
                  <button className={`filter-tab ${statusFilter === 'draft' ? 'active' : ''}`} onClick={() => { setStatusFilter('draft'); setCurrentPage(1); }}>Drafts</button>
                </div>
              </div>
            </div>

            {loading ? (
              <div style={{ padding: '48px 24px', textAlign: 'center' }}>
                <div className="skeleton" style={{ width: '40px', height: '40px', margin: '0 auto 16px', borderRadius: '50%' }}></div>
                <p style={{ color: 'var(--text-tertiary)', fontSize: '13px', margin: 0 }}>Loading posts...</p>
              </div>
            ) : paginatedPosts.length > 0 ? (
              <>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Category</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th className="table-action"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedPosts.map(post => (
                      <tr key={post.id}>
                        <td className="table-cell-title">
                          <Link href={`/admin/posts/${post.id}`}>{post.titleFr || 'Untitled'}</Link>
                        </td>
                        <td>
                          <span className="table-cell-text">{post.category || '—'}</span>
                        </td>
                        <td>
                          <Badge variant={post.status === 'PUBLISHED' ? 'success' : 'warning'}>
                            {post.status}
                          </Badge>
                        </td>
                        <td className="table-cell-date">
                          {post.publishedAt ? formatDate(post.publishedAt) : '—'}
                        </td>
                        <td className="table-action">
                          <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
                            <Link href={`/admin/posts/${post.id}`} className="btn-icon" title="Edit">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                              </svg>
                            </Link>
                            <button className="btn-icon danger" onClick={() => setConfirmDelete(post.id)} title="Delete">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {totalPages > 1 && (
                  <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                )}
              </>
            ) : (
              <EmptyState
                icon={
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
                  </svg>
                }
                title={searchQuery || statusFilter !== 'all' ? 'No matching posts' : 'No posts yet'}
                description={searchQuery || statusFilter !== 'all' ? 'Try adjusting your search or filter' : 'Create your first post to get started'}
                action={!searchQuery && statusFilter === 'all' ? { label: 'Create Post', href: '/admin/posts/new' } : null}
              />
            )}
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {confirmDelete && (
          <Modal onClose={() => setConfirmDelete(null)}>
            <div className="modal-content">
              <div className="modal-icon danger">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
              </div>
              <h3 className="modal-title">Delete Post</h3>
              <p className="modal-desc">This action cannot be undone. The post will be permanently removed.</p>
              <div className="modal-actions">
                <button className="btn btn-secondary" onClick={() => setConfirmDelete(null)}>Cancel</button>
                <button className="btn btn-danger" onClick={() => handleDelete(confirmDelete)}>Delete</button>
              </div>
            </div>
          </Modal>
        )}

        <style jsx global>{`
          .modal-content {
            background: white;
            border-radius: 12px;
            padding: 32px;
            max-width: 400px;
            text-align: center;
          }
          .modal-icon {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 16px;
          }
          .modal-icon.danger {
            background: var(--danger-bg);
            color: var(--danger);
          }
          .modal-title {
            margin: 0 0 8px;
            font-size: 18px;
            font-weight: 700;
            color: var(--text-primary);
          }
          .modal-desc {
            margin: 0 0 24px;
            font-size: 14px;
            color: var(--text-secondary);
          }
          .modal-actions {
            display: flex;
            gap: 12px;
            justify-content: center;
          }
          .modal-actions .btn {
            flex: 1;
          }
        `}</style>
      </AdminLayout>
    </>
  );
}

/* Badge Component */
function Badge({ variant, children }) {
  return <span className={`badge badge-${variant}`}>{children}</span>;
}

/* Empty State Component */
function EmptyState({ icon, title, description, action }) {
  return (
    <div className="empty-state">
      {icon}
      <h4 className="empty-state-title">{title}</h4>
      <p className="empty-state-desc">{description}</p>
      {action && (
        <Link href={action.href} className="btn btn-primary">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          {action.label}
        </Link>
      )}
    </div>
  );
}

/* Modal Component */
function Modal({ children, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000 }}>
      <div onClick={e => e.stopPropagation()}>{children}</div>
    </div>
  );
}

/* Pagination Component */
function Pagination({ currentPage, totalPages, onPageChange }) {
  return (
    <div className="pagination">
      <span className="pagination-info">Page {currentPage} of {totalPages}</span>
      <div className="pagination-controls">
        <button className="pagination-btn" disabled={currentPage <= 1} onClick={() => onPageChange(currentPage - 1)}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          let page;
          if (totalPages <= 5) page = i + 1;
          else if (currentPage <= 3) page = i + 1;
          else if (currentPage >= totalPages - 2) page = totalPages - 4 + i;
          else page = currentPage - 2 + i;
          return (
            <button key={page} className={`pagination-btn ${currentPage === page ? 'active' : ''}`} onClick={() => onPageChange(page)}>
              {page}
            </button>
          );
        })}
        <button className="pagination-btn" disabled={currentPage >= totalPages} onClick={() => onPageChange(currentPage + 1)}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
        </button>
      </div>
    </div>
  );
}

/* Utility */
function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export async function getServerSideProps(ctx) {
  const { getServerSession } = await import("next-auth/next");
  const { authOptions } = await import("@/lib/auth");
  const session = await getServerSession(ctx.req, ctx.res, authOptions);
  if (!session) return { redirect: { destination: '/admin/login', permanent: false } };
  return { props: {} };
}
