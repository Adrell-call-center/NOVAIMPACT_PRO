import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';
import Pagination from '@/components/admin/Pagination';

const ITEMS_PER_PAGE = 10;

export default function AdminPosts() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => { fetchPosts(); }, []);

  const fetchPosts = async (q = '') => {
    setLoading(true);
    const url = q ? `/api/admin/posts?search=${q}` : '/api/admin/posts';
    const res = await fetch(url);
    const data = await res.json();
    setPosts(data.posts || []);
    setLoading(false);
    setCurrentPage(1);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this post?')) return;
    await fetch(`/api/admin/posts/${id}`, { method: 'DELETE' });
    fetchPosts(search);
  };

  const handlePublish = async (id, currentStatus) => {
    const post = posts.find(p => p.id === id);
    await fetch(`/api/admin/posts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...post, status: currentStatus === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED', publishedAt: currentStatus === 'DRAFT' ? new Date().toISOString() : null }),
    });
    fetchPosts(search);
  };

  // Pagination logic
  const filteredPosts = posts.filter(p => 
    !search || p.titleFr.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filteredPosts.length / ITEMS_PER_PAGE);
  const paginatedPosts = filteredPosts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <>
      <Head><title>Posts — Nova Impact Admin</title></Head>
      <AdminLayout title="Posts">
        <div className="admin-page-header">
          <div className="admin-search-box">
            <i className="fa-solid fa-search"></i>
            <input className="admin-search-input" placeholder="Search posts..." value={search} onChange={e => { setSearch(e.target.value); fetchPosts(e.target.value); }} />
          </div>
          <Link href="/admin/posts/new" className="btn-gold">
            <i className="fa-solid fa-plus me-2"></i>New Post
          </Link>
        </div>

        {loading ? (
          <div className="admin-loading"><div className="admin-spinner"></div></div>
        ) : (
          <>
            <div className="admin-light-card">
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Category</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedPosts.map(p => (
                      <tr key={p.id}>
                        <td><Link href={`/admin/posts/${p.id}`} className="admin-table-link">{p.titleFr}</Link></td>
                        <td>{p.category || '—'}</td>
                        <td><span className={`admin-badge ${p.status === 'PUBLISHED' ? 'admin-badge-success' : 'admin-badge-secondary'}`}>{p.status}</span></td>
                        <td>{p.publishedAt ? new Date(p.publishedAt).toLocaleDateString() : '—'}</td>
                        <td>
                          <div className="admin-table-actions">
                            <Link href={`/admin/posts/${p.id}`} className="admin-btn-icon" title="Edit"><i className="fa-solid fa-pen"></i></Link>
                            <button className="admin-btn-icon" onClick={() => handlePublish(p.id, p.status)} title={p.status === 'PUBLISHED' ? 'Unpublish' : 'Publish'}>
                              <i className={`fa-solid ${p.status === 'PUBLISHED' ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                            </button>
                            <button className="admin-btn-icon admin-btn-danger" onClick={() => handleDelete(p.id)} title="Delete"><i className="fa-solid fa-trash"></i></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {paginatedPosts.length === 0 && <p className="text-muted text-center py-5">No posts found. <Link href="/admin/posts/new">Create your first post</Link></p>}
              </div>
            </div>

            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} itemsPerPage={ITEMS_PER_PAGE} totalItems={filteredPosts.length} />
          </>
        )}
      </AdminLayout>

      <style jsx global>{`
        .admin-page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          gap: 16px;
        }

        .admin-search-box {
          position: relative;
          flex: 1;
          max-width: 400px;
        }

        .admin-search-box i {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #6c757d;
        }

        .admin-search-input {
          width: 100%;
          padding: 12px 16px 12px 42px;
          background: #ffffff;
          border: 1px solid #e8e8e8;
          border-radius: 10px;
          color: #1a1d21;
          font-size: 14px;
        }

        .admin-search-input:focus {
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
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s;
          white-space: nowrap;
        }

        .btn-gold:hover {
          background: #e6b517;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(255,200,26,0.3);
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

        .admin-table-wrapper {
          overflow: hidden;
        }

        .admin-table {
          width: 100%;
          border-collapse: collapse;
        }

        .admin-table th {
          background: #f8f9fa;
          padding: 14px 20px;
          text-align: left;
          font-size: 12px;
          font-weight: 600;
          color: #6c757d;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border-bottom: 1px solid #e8e8e8;
        }

        .admin-table td {
          padding: 16px 20px;
          border-top: 1px solid #f0f0f0;
          font-size: 14px;
        }

        .admin-table tbody tr:hover {
          background: #fafafa;
        }

        .admin-table-link {
          color: #1a1d21;
          text-decoration: none;
          font-weight: 500;
        }

        .admin-table-link:hover {
          color: #FFC81A;
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

        .admin-table-actions {
          display: flex;
          gap: 8px;
        }

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

        .py-5 {
          padding-top: 48px;
          padding-bottom: 48px;
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
