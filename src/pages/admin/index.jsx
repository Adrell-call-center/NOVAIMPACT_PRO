import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';

export default function AdminIndex() {
  const router = useRouter();
  const [stats, setStats] = useState({ posts: 0, published: 0, drafts: 0, contacts: 0, subscribers: 0, uploads: 0 });
  const [recentPosts, setRecentPosts] = useState([]);
  const [recentContacts, setRecentContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [postsRes, contactsRes, subsRes, uploadsRes] = await Promise.all([
        fetch('/api/admin/posts'),
        fetch('/api/admin/contacts'),
        fetch('/api/admin/newsletter'),
        fetch('/api/admin/uploads'),
      ]);

      const postsData = await postsRes.json();
      const contactsData = await contactsRes.json();
      const subsData = await subsRes.json();
      const uploadsData = await uploadsRes.json();

      if (postsData.error === 'Unauthorized') {
        router.push('/admin/login');
        return;
      }

      const posts = postsData.posts || [];
      const contacts = contactsData.contacts || [];

      setStats({
        posts: posts.length,
        published: posts.filter(p => p.status === 'PUBLISHED').length,
        drafts: posts.filter(p => p.status === 'DRAFT').length,
        contacts: contacts.length,
        subscribers: subsData.subscribers?.length || 0,
        uploads: uploadsData.uploads?.length || 0,
      });

      setRecentPosts(posts.slice(0, 5));
      setRecentContacts(contacts.slice(0, 3));
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Overview">
        <div className="loading-skeleton">
          <div className="skeleton-header"><div className="skeleton"></div><div className="skeleton" style={{ width: '60%' }}></div></div>
          <div className="skeleton-stats">
            {[...Array(6)].map((_, i) => <div key={i} className="skeleton-card"><div className="skeleton-icon"></div><div className="skeleton-value"></div><div className="skeleton-label"></div></div>)}
          </div>
          <div className="skeleton-table"><div className="skeleton"></div><div className="skeleton"></div><div className="skeleton"></div></div>
        </div>
        <style jsx global>{`
          .loading-skeleton { max-width: 1280px; }
          .skeleton-header { margin-bottom: 32px; }
          .skeleton-header .skeleton { height: 28px; width: 180px; margin-bottom: 8px; }
          .skeleton-header .skeleton:last-child { height: 16px; width: 280px; }
          .skeleton-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 32px; }
          .skeleton-card { background: #fff; border: 1px solid #e3e8ee; border-radius: 12px; padding: 20px; }
          .skeleton { background: linear-gradient(90deg, #e3e8ee 25%, #f6f9fc 50%, #e3e8ee 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; border-radius: 6px; }
          .skeleton-icon { width: 36px; height: 36px; margin-bottom: 12px; }
          .skeleton-value { width: 50%; height: 24px; margin-bottom: 6px; }
          .skeleton-label { width: 35%; height: 14px; }
          .skeleton-table { background: #fff; border: 1px solid #e3e8ee; border-radius: 12px; padding: 20px; }
          .skeleton-table .skeleton { height: 48px; margin-bottom: 12px; }
          @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        `}</style>
      </AdminLayout>
    );
  }

  return (
    <>
      <Head><title>Dashboard — Nova Impact</title></Head>
      <AdminLayout title="Overview">
        <div className="dashboard-page">
          {/* Page Header */}
          <div className="dashboard-header">
            <div>
              <h1 className="dashboard-title">Good morning</h1>
              <p className="dashboard-subtitle">Here's what's happening with your content today.</p>
            </div>
            <Link href="/admin/posts/new" className="btn btn-primary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
              New Post
            </Link>
          </div>

          {/* Metrics Grid */}
          <div className="metrics-grid">
            <MetricCard title="Total Posts" value={stats.posts} href="/admin/posts" trend={`${stats.published} published`} color="slate"
              icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>} />
            <MetricCard title="Published" value={stats.published} href="/admin/posts" trend="Live on site" color="green"
              icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>} />
            <MetricCard title="Drafts" value={stats.drafts} href="/admin/posts" trend="Awaiting review" color="amber"
              icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>} />
            <MetricCard title="Media Files" value={stats.uploads} href="/admin/uploads" trend="Uploaded assets" color="purple"
              icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>} />
            <MetricCard title="Messages" value={stats.contacts} href="/admin/contacts" trend="Contact inquiries" color="blue"
              icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>} />
            <MetricCard title="Subscribers" value={stats.subscribers} href="/admin/newsletter" trend="Newsletter list" color="pink"
              icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>} />
          </div>

          {/* Content Grid */}
          <div className="content-grid">
            {/* Recent Posts Table */}
            <div className="stripe-card">
              <div className="stripe-card-header">
                <h3 className="stripe-card-title">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                  Recent Posts
                </h3>
                <Link href="/admin/posts" className="link">View all <i className="fa-solid fa-arrow-right"></i></Link>
              </div>
              <div className="stripe-card-body no-padding">
                {recentPosts.length > 0 ? (
                  <table className="stripe-table">
                    <thead>
                      <tr>
                        <th style={{ width: '52px' }}></th>
                        <th>Title</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th className="table-action"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentPosts.map(post => (
                        <tr key={post.id}>
                          <td>
                            {post.coverImage ? (
                              <div className="table-thumb"><img src={post.coverImage} alt="" /></div>
                            ) : (
                              <div className="table-thumb-empty"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg></div>
                            )}
                          </td>
                          <td className="table-cell-title"><Link href={`/admin/posts/${post.id}`}>{post.titleFr || 'Untitled'}</Link></td>
                          <td><span className={`badge badge-${post.status === 'PUBLISHED' ? 'success' : 'warning'}`}>{post.status}</span></td>
                          <td className="table-cell-date">{post.publishedAt ? formatDate(post.publishedAt) : '—'}</td>
                          <td className="table-action"><Link href={`/admin/posts/${post.id}`} className="btn-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg></Link></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <EmptyState icon={<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>} title="No posts yet" description="Create your first post to get started" action={{ label: 'Create Post', href: '/admin/posts/new' }} />
                )}
              </div>
            </div>

            {/* Recent Messages */}
            <div className="stripe-card">
              <div className="stripe-card-header">
                <h3 className="stripe-card-title">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  Recent Messages
                </h3>
                <Link href="/admin/contacts" className="link">View all <i className="fa-solid fa-arrow-right"></i></Link>
              </div>
              <div className="stripe-card-body no-padding">
                {recentContacts.length > 0 ? (
                  <div className="stripe-list">
                    {recentContacts.map(contact => (
                      <Link href="/admin/contacts" key={contact.id} className="stripe-list-item">
                        <div className="stripe-list-avatar">{contact.name.charAt(0)}</div>
                        <div className="stripe-list-content">
                          <div className="stripe-list-header">
                            <span className="stripe-list-name">{contact.name}</span>
                            <span className="stripe-list-time">{formatDate(contact.createdAt)}</span>
                          </div>
                          <p className="stripe-list-preview">{contact.email}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <EmptyState icon={<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>} title="No messages yet" description="Contact form submissions will appear here" />
                )}
              </div>
            </div>
          </div>
        </div>

        <style jsx global>{`
          .dashboard-page { max-width: 1280px; }
          .dashboard-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 32px; }
          .dashboard-title { margin: 0 0 6px; font-size: 24px; font-weight: 700; color: var(--stripe-text-primary); letter-spacing: -0.02em; }
          .dashboard-subtitle { margin: 0; font-size: 15px; color: var(--stripe-text-secondary); }

          .metrics-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 32px; }
          .metric-card { background: #fff; border: 1px solid var(--stripe-border); border-radius: var(--stripe-radius-lg); padding: 20px; transition: all 0.15s; }
          .metric-card:hover { box-shadow: var(--stripe-shadow-md); transform: translateY(-1px); }
          .metric-card-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
          .metric-icon { width: 36px; height: 36px; border-radius: var(--stripe-radius); display: flex; align-items: center; justify-content: center; background: var(--metric-bg); color: var(--metric-color); }
          .metric-link { font-size: 12px; color: var(--stripe-text-tertiary); text-decoration: none; font-weight: 500; transition: color 0.1s; }
          .metric-link:hover { color: var(--stripe-primary); }
          .metric-value { font-size: 28px; font-weight: 700; color: var(--stripe-text-primary); line-height: 1; margin-bottom: 6px; letter-spacing: -0.02em; }
          .metric-label { font-size: 13px; color: var(--stripe-text-secondary); font-weight: 500; margin: 0 0 4px; }
          .metric-trend { font-size: 12px; color: var(--stripe-text-tertiary); }

          .content-grid { display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 20px; }
          @media (max-width: 1023px) { .content-grid { grid-template-columns: 1fr; } }

          .stripe-card { background: #fff; border: 1px solid var(--stripe-border); border-radius: var(--stripe-radius-lg); overflow: hidden; }
          .stripe-card-header { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-bottom: 1px solid var(--stripe-border); }
          .stripe-card-title { margin: 0; font-size: 14px; font-weight: 600; color: var(--stripe-text-primary); display: flex; align-items: center; gap: 8px; }
          .stripe-card-title svg { width: 16px; height: 16px; color: var(--stripe-text-tertiary); }
          .stripe-card-body.no-padding { padding: 0; }

          .btn { display: inline-flex; align-items: center; gap: 8px; padding: 9px 16px; border-radius: var(--stripe-radius); font-size: 14px; font-weight: 600; text-decoration: none; border: none; cursor: pointer; transition: all 0.1s; }
          .btn-primary { background: var(--stripe-primary); color: white; box-shadow: 0 1px 2px rgba(99, 91, 255, 0.2); }
          .btn-primary:hover { background: var(--stripe-primary-hover); box-shadow: 0 4px 8px rgba(99, 91, 255, 0.3); }
          .link { font-size: 13px; color: var(--stripe-text-tertiary); text-decoration: none; font-weight: 500; display: inline-flex; align-items: center; gap: 6px; transition: color 0.1s; }
          .link:hover { color: var(--stripe-primary); }

          .stripe-table { width: 100%; border-collapse: collapse; }
          .stripe-table th { text-align: left; padding: 12px 20px; font-size: 11px; font-weight: 600; color: var(--stripe-text-tertiary); text-transform: uppercase; letter-spacing: 0.05em; background: var(--stripe-bg); border-bottom: 1px solid var(--stripe-border); }
          .stripe-table td { padding: 14px 20px; border-bottom: 1px solid var(--stripe-border-light); vertical-align: middle; }
          .stripe-table tr:last-child td { border-bottom: none; }
          .stripe-table tbody tr { transition: background 0.1s; }
          .stripe-table tbody tr:hover { background: var(--stripe-bg); }
          .table-cell-title a { color: var(--stripe-text-primary); text-decoration: none; font-weight: 500; font-size: 14px; transition: color 0.1s; }
          .table-cell-title a:hover { color: var(--stripe-primary); }
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

          .stripe-list { display: flex; flex-direction: column; }
          .stripe-list-item { display: flex; gap: 12px; padding: 16px 20px; border-bottom: 1px solid var(--stripe-border-light); text-decoration: none; transition: background 0.1s; }
          .stripe-list-item:last-child { border-bottom: none; }
          .stripe-list-item:hover { background: var(--stripe-bg); }
          .stripe-list-avatar { width: 36px; height: 36px; border-radius: var(--stripe-radius); background: var(--stripe-text-primary); color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 14px; flex-shrink: 0; }
          .stripe-list-content { flex: 1; min-width: 0; }
          .stripe-list-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px; }
          .stripe-list-name { font-size: 14px; font-weight: 600; color: var(--stripe-text-primary); }
          .stripe-list-time { font-size: 12px; color: var(--stripe-text-tertiary); }
          .stripe-list-preview { margin: 0; font-size: 13px; color: var(--stripe-text-secondary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

          .empty-state { text-align: center; padding: 48px 24px; }
          .empty-state svg { color: var(--stripe-text-tertiary); margin-bottom: 16px; opacity: 0.4; }
          .empty-state-title { margin: 0 0 6px; font-size: 14px; font-weight: 600; color: var(--stripe-text-primary); }
          .empty-state-desc { margin: 0 0 20px; font-size: 13px; color: var(--stripe-text-tertiary); }

          @media (max-width: 768px) {
            .metrics-grid { grid-template-columns: repeat(2, 1fr); }
            .metric-value { font-size: 24px; }
            .dashboard-header { flex-direction: column; gap: 16px; }
            .stripe-table th:nth-child(3), .stripe-table td:nth-child(3) { display: none; }
          }
          @media (max-width: 480px) { .metrics-grid { grid-template-columns: 1fr; } }
        `}</style>
      </AdminLayout>
    </>
  );
}

function MetricCard({ title, value, icon, trend, href, color }) {
  const colors = {
    slate: { bg: 'var(--stripe-slate-bg)', color: 'var(--stripe-slate)' },
    green: { bg: 'var(--stripe-success-bg)', color: 'var(--stripe-success)' },
    amber: { bg: 'var(--stripe-warning-bg)', color: 'var(--stripe-warning)' },
    purple: { bg: 'var(--stripe-purple-bg)', color: 'var(--stripe-purple)' },
    blue: { bg: 'var(--stripe-info-bg)', color: 'var(--stripe-info)' },
    pink: { bg: 'var(--stripe-pink-bg)', color: 'var(--stripe-pink)' },
  };
  const c = colors[color] || colors.slate;
  return (
    <div className="metric-card" style={{ '--metric-bg': c.bg, '--metric-color': c.color }}>
      <div className="metric-card-header">
        <div className="metric-icon">{icon}</div>
        <Link href={href} className="metric-link">View</Link>
      </div>
      <div className="metric-value">{value}</div>
      <p className="metric-label">{title}</p>
      <div className="metric-trend">{trend}</div>
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
  const now = new Date();
  const diff = now - date;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return 'Today';
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
