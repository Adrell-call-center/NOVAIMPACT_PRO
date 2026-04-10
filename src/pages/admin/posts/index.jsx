import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';

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

  const filteredPosts = posts.filter(p => {
    if (statusFilter !== 'all' && p.status.toLowerCase() !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (p.titleFr || '').toLowerCase().includes(q) || (p.category || '').toLowerCase().includes(q);
    }
    return true;
  });

  const totalPages = Math.ceil(filteredPosts.length / ITEMS_PER_PAGE);
  const paginatedPosts = filteredPosts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  const publishedCount = posts.filter(p => p.status === 'PUBLISHED').length;
  const draftsCount = posts.filter(p => p.status === 'DRAFT').length;

  return (
    <>
      <Head><title>Posts — Nova Impact</title></Head>
      <AdminLayout title="Posts">
        <div className="stripe-page">
          <div className="stripe-page-header">
            <div>
              <h1 className="stripe-page-title">Posts</h1>
              <p className="stripe-page-subtitle">Manage your blog posts and articles</p>
            </div>
            <Link href="/admin/posts/new" className="btn btn-primary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
              New Post
            </Link>
          </div>

          <div className="stats-grid">
            <div className="stat-card" style={{ '--stat-bg': 'var(--stripe-slate-bg)', '--stat-color': 'var(--stripe-slate)' }}>
              <div className="stat-card-header"><div className="stat-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></div></div>
              <div className="stat-value">{posts.length}</div><p className="stat-label">Total Posts</p>
            </div>
            <div className="stat-card" style={{ '--stat-bg': 'var(--stripe-success-bg)', '--stat-color': 'var(--stripe-success)' }}>
              <div className="stat-card-header"><div className="stat-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></div></div>
              <div className="stat-value">{publishedCount}</div><p className="stat-label">Published</p>
            </div>
            <div className="stat-card" style={{ '--stat-bg': 'var(--stripe-warning-bg)', '--stat-color': 'var(--stripe-warning)' }}>
              <div className="stat-card-header"><div className="stat-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></div></div>
              <div className="stat-value">{draftsCount}</div><p className="stat-label">Drafts</p>
            </div>
          </div>

          <div className="stripe-card">
            <div className="stripe-card-header">
              <h3 className="stripe-card-title">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                All Posts
              </h3>
              <div className="header-actions">
                <div className="search-box">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                  <input className="form-input" style={{ width: '200px', padding: '7px 14px 7px 34px', fontSize: '13px' }} placeholder="Search posts..." value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }} />
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
                <div style={{ width: '40px', height: '40px', margin: '0 auto 16px', background: 'var(--stripe-bg)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                <p style={{ color: 'var(--stripe-text-tertiary)', fontSize: '13px', margin: 0 }}>Loading posts...</p>
              </div>
            ) : paginatedPosts.length > 0 ? (
              <>
                <table className="stripe-table">
                  <thead>
                    <tr>
                      <th style={{ width: '52px' }}></th>
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
                        <td>
                          {post.coverImage ? (
                            <div className="table-thumb"><img src={post.coverImage} alt="" /></div>
                          ) : (
                            <div className="table-thumb-empty"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg></div>
                          )}
                        </td>
                        <td className="table-cell-title"><Link href={`/admin/posts/${post.id}`}>{post.titleFr || 'Untitled'}</Link></td>
                        <td><span className="table-cell-text">{post.category || '—'}</span></td>
                        <td><span className={`badge badge-${post.status === 'PUBLISHED' ? 'success' : 'warning'}`}>{post.status}</span></td>
                        <td className="table-cell-date">{post.publishedAt ? formatDate(post.publishedAt) : '—'}</td>
                        <td className="table-action">
                          <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
                            <Link href={`/admin/posts/${post.id}`} className="btn-icon" title="Edit"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></Link>
                            <button className="btn-icon btn-icon-danger" onClick={() => setConfirmDelete(post.id)} title="Delete"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />}
              </>
            ) : (
              <EmptyState icon={<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>} title={searchQuery || statusFilter !== 'all' ? 'No matching posts' : 'No posts yet'} description={searchQuery || statusFilter !== 'all' ? 'Try adjusting your search or filter' : 'Create your first post to get started'} action={!searchQuery && statusFilter === 'all' ? { label: 'Create Post', href: '/admin/posts/new' } : null} />
            )}
          </div>
        </div>

        {confirmDelete && (
          <div className="modal-overlay" onClick={() => setConfirmDelete(null)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div className="modal-icon modal-danger"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></div>
              <h3 className="modal-title">Delete Post</h3>
              <p className="modal-desc">This action cannot be undone. The post will be permanently removed.</p>
              <div className="modal-actions">
                <button className="btn btn-secondary" onClick={() => setConfirmDelete(null)}>Cancel</button>
                <button className="btn btn-danger" onClick={() => handleDelete(confirmDelete)}>Delete</button>
              </div>
            </div>
          </div>
        )}

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
          .header-actions { display: flex; align-items: center; gap: 12px; }
          .search-box { position: relative; }
          .search-box svg { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); width: 16px; height: 16px; color: var(--stripe-text-tertiary); pointer-events: none; }
          .filter-tabs { display: flex; gap: 4px; background: var(--stripe-bg); border-radius: var(--stripe-radius); padding: 4px; }
          .filter-tab { padding: 6px 14px; border: none; background: transparent; color: var(--stripe-text-secondary); border-radius: 6px; font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.1s; }
          .filter-tab:hover { color: var(--stripe-text-primary); }
          .filter-tab.active { background: #fff; color: var(--stripe-text-primary); box-shadow: var(--stripe-shadow-sm); }
          .stripe-card { background: #fff; border: 1px solid var(--stripe-border); border-radius: var(--stripe-radius-lg); overflow: hidden; }
          .stripe-card-header { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-bottom: 1px solid var(--stripe-border); flex-wrap: wrap; gap: 12px; }
          .stripe-card-title { margin: 0; font-size: 14px; font-weight: 600; color: var(--stripe-text-primary); display: flex; align-items: center; gap: 8px; }
          .stripe-card-title svg { width: 16px; height: 16px; color: var(--stripe-text-tertiary); }
          .stripe-card-body.no-padding { padding: 0; }
          .btn { display: inline-flex; align-items: center; gap: 8px; padding: 9px 16px; border-radius: var(--stripe-radius); font-size: 14px; font-weight: 600; text-decoration: none; border: none; cursor: pointer; transition: all 0.1s; }
          .btn-primary { background: var(--stripe-primary); color: white; box-shadow: 0 1px 2px rgba(99, 91, 255, 0.2); }
          .btn-primary:hover { background: var(--stripe-primary-hover); box-shadow: 0 4px 8px rgba(99, 91, 255, 0.3); }
          .btn-secondary { background: #fff; color: var(--stripe-text-primary); border: 1px solid var(--stripe-border); }
          .btn-secondary:hover { background: var(--stripe-bg); }
          .btn-danger { background: var(--stripe-danger); color: white; }
          .btn-danger:hover { background: #ef4444; }
          .stripe-table { width: 100%; border-collapse: collapse; }
          .stripe-table th { text-align: left; padding: 12px 20px; font-size: 11px; font-weight: 600; color: var(--stripe-text-tertiary); text-transform: uppercase; letter-spacing: 0.05em; background: var(--stripe-bg); border-bottom: 1px solid var(--stripe-border); }
          .stripe-table td { padding: 14px 20px; border-bottom: 1px solid var(--stripe-border-light); vertical-align: middle; }
          .stripe-table tr:last-child td { border-bottom: none; }
          .stripe-table tbody tr { transition: background 0.1s; }
          .stripe-table tbody tr:hover { background: var(--stripe-bg); }
          .table-cell-title a { color: var(--stripe-text-primary); text-decoration: none; font-weight: 500; font-size: 14px; transition: color 0.1s; }
          .table-cell-title a:hover { color: var(--stripe-primary); }
          .table-cell-text { font-size: 13px; color: var(--stripe-text-secondary); }
          .table-cell-date { font-size: 13px; color: var(--stripe-text-tertiary); white-space: nowrap; }
          .table-action { width: 40px; text-align: center; }
          .table-thumb { width: 44px; height: 44px; border-radius: var(--stripe-radius); overflow: hidden; background: var(--stripe-bg); }
          .table-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
          .table-thumb-empty { width: 44px; height: 44px; border-radius: var(--stripe-radius); background: var(--stripe-bg); border: 1px solid var(--stripe-border); display: flex; align-items: center; justify-content: center; color: var(--stripe-text-tertiary); }
          .badge { display: inline-flex; align-items: center; padding: 3px 10px; border-radius: 9999px; font-size: 12px; font-weight: 600; }
          .badge-success { background: var(--stripe-success-bg); color: var(--stripe-success-text); }
          .badge-warning { background: var(--stripe-warning-bg); color: var(--stripe-warning-text); }
          .btn-icon { width: 32px; height: 32px; display: inline-flex; align-items: center; justify-content: center; border: 1px solid var(--stripe-border); background: #fff; border-radius: var(--stripe-radius); color: var(--stripe-text-tertiary); text-decoration: none; transition: all 0.1s; cursor: pointer; }
          .btn-icon:hover { background: var(--stripe-bg); color: var(--stripe-text-primary); }
          .btn-icon-danger { border-color: var(--stripe-border); }
          .btn-icon-danger:hover { background: var(--stripe-danger-bg); color: var(--stripe-danger-text); border-color: var(--stripe-danger-text); }
          .link { font-size: 13px; color: var(--stripe-text-tertiary); text-decoration: none; font-weight: 500; display: inline-flex; align-items: center; gap: 6px; transition: color 0.1s; }
          .link:hover { color: var(--stripe-primary); }
          .empty-state { text-align: center; padding: 48px 24px; }
          .empty-state svg { color: var(--stripe-text-tertiary); margin-bottom: 16px; opacity: 0.4; }
          .empty-state-title { margin: 0 0 6px; font-size: 14px; font-weight: 600; color: var(--stripe-text-primary); }
          .empty-state-desc { margin: 0 0 20px; font-size: 13px; color: var(--stripe-text-tertiary); }
          .pagination { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-top: 1px solid var(--stripe-border); }
          .pagination-info { font-size: 13px; color: var(--stripe-text-tertiary); }
          .pagination-controls { display: flex; gap: 4px; }
          .pagination-btn { width: 32px; height: 32px; border: 1px solid var(--stripe-border); background: #fff; color: var(--stripe-text-secondary); border-radius: var(--stripe-radius); cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 500; transition: all 0.1s; }
          .pagination-btn:hover:not(:disabled) { background: var(--stripe-bg); border-color: #cbd5e1; }
          .pagination-btn.active { background: var(--stripe-primary); color: white; border-color: var(--stripe-primary); }
          .pagination-btn:disabled { opacity: 0.4; cursor: not-allowed; }
          .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 10000; }
          .modal-content { background: #fff; border-radius: 12px; padding: 32px; max-width: 400px; text-align: center; }
          .modal-icon { width: 48px; height: 48px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; }
          .modal-danger { background: var(--stripe-danger-bg); color: var(--stripe-danger); }
          .modal-title { margin: 0 0 8px; font-size: 18px; font-weight: 700; }
          .modal-desc { margin: 0 0 24px; font-size: 14px; color: var(--stripe-text-secondary); }
          .modal-actions { display: flex; gap: 12px; }
          .modal-actions .btn { flex: 1; justify-content: center; }
          @keyframes spin { to { transform: rotate(360deg); } }
          @media (max-width: 768px) {
            .stats-grid { grid-template-columns: repeat(2, 1fr); }
            .stripe-page-header { flex-direction: column; gap: 16px; }
            .header-actions { flex-direction: column; align-items: stretch; }
            .stripe-table th:nth-child(3), .stripe-table td:nth-child(3) { display: none; }
          }
          @media (max-width: 480px) { .stats-grid { grid-template-columns: 1fr; } }
        `}</style>
      </AdminLayout>
    </>
  );
}

function Pagination({ currentPage, totalPages, onPageChange }) {
  return (
    <div className="pagination">
      <span className="pagination-info">Page {currentPage} of {totalPages}</span>
      <div className="pagination-controls">
        <button className="pagination-btn" disabled={currentPage <= 1} onClick={() => onPageChange(currentPage - 1)}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg></button>
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          let page = totalPages <= 5 ? i + 1 : currentPage <= 3 ? i + 1 : currentPage >= totalPages - 2 ? totalPages - 4 + i : currentPage - 2 + i;
          return <button key={page} className={`pagination-btn ${currentPage === page ? 'active' : ''}`} onClick={() => onPageChange(page)}>{page}</button>;
        })}
        <button className="pagination-btn" disabled={currentPage >= totalPages} onClick={() => onPageChange(currentPage + 1)}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg></button>
      </div>
    </div>
  );
}

function EmptyState({ icon, title, description, action }) {
  return (
    <div className="empty-state">
      {icon}
      <h4 className="empty-state-title">{title}</h4>
      <p className="empty-state-desc">{description}</p>
      {action && <Link href={action.href} className="btn btn-primary">{action.label}</Link>}
    </div>
  );
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  const days = Math.floor((new Date() - date) / (1000 * 60 * 60 * 24));
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export async function getServerSideProps(ctx) {
  const { getServerSession } = await import("next-auth/next");
  const { authOptions } = await import("@/lib/auth");
  const session = await getServerSession(ctx.req, ctx.res, authOptions);
  if (!session) return { redirect: { destination: '/admin/login', permanent: false } };
  return { props: {} };
}
