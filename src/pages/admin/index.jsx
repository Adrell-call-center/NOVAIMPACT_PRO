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

  if (loading) return <LoadingSkeleton />;

  return (
    <>
      <Head><title>Dashboard — Nova Impact</title></Head>
      <AdminLayout title="Overview">
        <div className="dashboard">
          {/* Page Header */}
          <div className="dashboard-header">
            <div>
              <h1 className="dashboard-title">Good morning</h1>
              <p className="dashboard-subtitle">Here's what's happening with your content today.</p>
            </div>
            <Link href="/admin/posts/new" className="btn btn-primary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 5v14M5 12h14"/>
              </svg>
              New Post
            </Link>
          </div>

          {/* Metrics Grid */}
          <div className="metrics-grid">
            <MetricCard
              title="Total Posts"
              value={stats.posts}
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
                </svg>
              }
              trend={`${stats.published} published`}
              href="/admin/posts"
              color="slate"
            />
            <MetricCard
              title="Published"
              value={stats.published}
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              }
              trend="Live on site"
              href="/admin/posts"
              color="green"
            />
            <MetricCard
              title="Drafts"
              value={stats.drafts}
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              }
              trend="Awaiting review"
              href="/admin/posts"
              color="amber"
            />
            <MetricCard
              title="Media Files"
              value={stats.uploads}
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                </svg>
              }
              trend="Uploaded assets"
              href="/admin/uploads"
              color="purple"
            />
            <MetricCard
              title="Messages"
              value={stats.contacts}
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                </svg>
              }
              trend="Contact inquiries"
              href="/admin/contacts"
              color="blue"
            />
            <MetricCard
              title="Subscribers"
              value={stats.subscribers}
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              }
              trend="Newsletter list"
              href="/admin/newsletter"
              color="pink"
            />
          </div>

          {/* Content Grid */}
          <div className="content-grid">
            {/* Recent Posts Table */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Recent Posts</h3>
                <div className="card-actions">
                  <Link href="/admin/posts" className="link">
                    View all <i className="fa-solid fa-arrow-right"></i>
                  </Link>
                </div>
              </div>
              <div className="card-body no-padding">
                {recentPosts.length > 0 ? (
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th className="table-action"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentPosts.map(post => (
                        <tr key={post.id}>
                          <td className="table-cell-title">
                            <Link href={`/admin/posts/${post.id}`}>{post.titleFr}</Link>
                          </td>
                          <td>
                            <Badge variant={post.status === 'PUBLISHED' ? 'success' : 'warning'}>
                              {post.status}
                            </Badge>
                          </td>
                          <td className="table-cell-date">
                            {post.publishedAt 
                              ? formatDate(post.publishedAt)
                              : '—'}
                          </td>
                          <td className="table-action">
                            <Link href={`/admin/posts/${post.id}`} className="btn-icon" title="View">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                              </svg>
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <EmptyState
                    icon={
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
                      </svg>
                    }
                    title="No posts yet"
                    description="Create your first post to get started"
                    action={{ label: 'Create Post', href: '/admin/posts/new' }}
                  />
                )}
              </div>
            </div>

            {/* Recent Messages */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Recent Messages</h3>
                <Link href="/admin/contacts" className="link">
                  View all <i className="fa-solid fa-arrow-right"></i>
                </Link>
              </div>
              <div className="card-body no-padding">
                {recentContacts.length > 0 ? (
                  <div className="list">
                    {recentContacts.map(contact => (
                      <Link href="/admin/contacts" key={contact.id} className="list-item">
                        <div className="list-item-avatar">
                          {contact.name.charAt(0)}
                        </div>
                        <div className="list-item-content">
                          <div className="list-item-header">
                            <span className="list-item-name">{contact.name}</span>
                            <span className="list-item-time">
                              {formatDate(contact.createdAt)}
                            </span>
                          </div>
                          <p className="list-item-preview">{contact.email}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    icon={
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                      </svg>
                    }
                    title="No messages yet"
                    description="Contact form submissions will appear here"
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        <style jsx global>{`
          /* ==========================================
             STRIPE DASHBOARD STYLES
             ========================================== */
          
          :root {
            --bg-primary: #f6f9fc;
            --bg-white: #ffffff;
            --border: #e3e8ee;
            --border-light: #f6f9fc;
            --text-primary: #0a2540;
            --text-secondary: #425466;
            --text-tertiary: #8898aa;
            --primary: #635bff;
            --primary-hover: #7a73ff;
            --primary-subtle: rgba(99, 91, 255, 0.08);
            --green: #3ecf8e;
            --green-bg: rgba(62, 207, 142, 0.1);
            --amber: #ff991f;
            --amber-bg: rgba(255, 153, 31, 0.1);
            --purple: #7c3aed;
            --purple-bg: rgba(124, 58, 237, 0.08);
            --blue: #00d4ff;
            --blue-bg: rgba(0, 212, 255, 0.08);
            --pink: #f43f5e;
            --pink-bg: rgba(244, 63, 94, 0.08);
            --slate: #64748b;
            --slate-bg: rgba(100, 116, 139, 0.08);
            --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.04);
            --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.06);
            --radius: 8px;
            --radius-lg: 12px;
          }

          /* Dashboard Container */
          .dashboard {
            max-width: 1280px;
          }

          /* Page Header */
          .dashboard-header {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            margin-bottom: 32px;
          }

          .dashboard-title {
            margin: 0 0 6px;
            font-size: 24px;
            font-weight: 700;
            color: var(--text-primary);
            letter-spacing: -0.02em;
          }

          .dashboard-subtitle {
            margin: 0;
            font-size: 15px;
            color: var(--text-secondary);
          }

          /* Metrics Grid */
          .metrics-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 16px;
            margin-bottom: 32px;
          }

          .metric-card {
            background: var(--bg-white);
            border: 1px solid var(--border);
            border-radius: var(--radius-lg);
            padding: 20px;
            transition: all 0.15s ease;
          }

          .metric-card:hover {
            box-shadow: var(--shadow-md);
            transform: translateY(-1px);
          }

          .metric-card-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 12px;
          }

          .metric-icon {
            width: 36px;
            height: 36px;
            border-radius: var(--radius);
            display: flex;
            align-items: center;
            justify-content: center;
            background: var(--metric-bg);
            color: var(--metric-color);
          }

          .metric-link {
            font-size: 12px;
            color: var(--text-tertiary);
            text-decoration: none;
            font-weight: 500;
            transition: color 0.1s;
          }

          .metric-link:hover {
            color: var(--primary);
          }

          .metric-value {
            font-size: 28px;
            font-weight: 700;
            color: var(--text-primary);
            line-height: 1;
            margin-bottom: 6px;
            letter-spacing: -0.02em;
          }

          .metric-label {
            font-size: 13px;
            color: var(--text-secondary);
            font-weight: 500;
            margin: 0 0 4px;
          }

          .metric-trend {
            font-size: 12px;
            color: var(--text-tertiary);
          }

          /* Content Grid */
          .content-grid {
            display: grid;
            grid-template-columns: 1.2fr 0.8fr;
            gap: 20px;
          }

          @media (max-width: 1023px) {
            .content-grid {
              grid-template-columns: 1fr;
            }
          }

          /* Card */
          .card {
            background: var(--bg-white);
            border: 1px solid var(--border);
            border-radius: var(--radius-lg);
            overflow: hidden;
          }

          .card-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 16px 20px;
            border-bottom: 1px solid var(--border);
          }

          .card-title {
            margin: 0;
            font-size: 14px;
            font-weight: 600;
            color: var(--text-primary);
          }

          .card-actions {
            display: flex;
            align-items: center;
            gap: 8px;
          }

          .card-body.no-padding {
            padding: 0;
          }

          /* Table */
          .table {
            width: 100%;
            border-collapse: collapse;
          }

          .table th {
            text-align: left;
            padding: 12px 20px;
            font-size: 11px;
            font-weight: 600;
            color: var(--text-tertiary);
            text-transform: uppercase;
            letter-spacing: 0.05em;
            background: var(--bg-primary);
            border-bottom: 1px solid var(--border);
          }

          .table td {
            padding: 14px 20px;
            border-bottom: 1px solid var(--border-light);
            vertical-align: middle;
          }

          .table tr:last-child td {
            border-bottom: none;
          }

          .table tbody tr {
            transition: background 0.1s;
          }

          .table tbody tr:hover {
            background: var(--bg-primary);
          }

          .table-cell-title a {
            color: var(--text-primary);
            text-decoration: none;
            font-weight: 500;
            font-size: 14px;
            transition: color 0.1s;
          }

          .table-cell-title a:hover {
            color: var(--primary);
          }

          .table-cell-date {
            font-size: 13px;
            color: var(--text-tertiary);
            white-space: nowrap;
          }

          .table-action {
            width: 40px;
            text-align: center;
          }

          /* Badge */
          .badge {
            display: inline-flex;
            align-items: center;
            padding: 3px 10px;
            border-radius: 9999px;
            font-size: 12px;
            font-weight: 600;
          }

          .badge-success {
            background: var(--green-bg);
            color: #059669;
          }

          .badge-warning {
            background: var(--amber-bg);
            color: #92400e;
          }

          /* List */
          .list {
            display: flex;
            flex-direction: column;
          }

          .list-item {
            display: flex;
            gap: 12px;
            padding: 16px 20px;
            border-bottom: 1px solid var(--border-light);
            text-decoration: none;
            transition: background 0.1s;
          }

          .list-item:last-child {
            border-bottom: none;
          }

          .list-item:hover {
            background: var(--bg-primary);
          }

          .list-item-avatar {
            width: 36px;
            height: 36px;
            border-radius: var(--radius);
            background: var(--text-primary);
            color: var(--bg-white);
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 600;
            font-size: 14px;
            flex-shrink: 0;
          }

          .list-item-content {
            flex: 1;
            min-width: 0;
          }

          .list-item-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 4px;
          }

          .list-item-name {
            font-size: 14px;
            font-weight: 600;
            color: var(--text-primary);
          }

          .list-item-time {
            font-size: 12px;
            color: var(--text-tertiary);
          }

          .list-item-preview {
            margin: 0;
            font-size: 13px;
            color: var(--text-secondary);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          /* Empty State */
          .empty-state {
            text-align: center;
            padding: 48px 24px;
          }

          .empty-state svg {
            color: var(--text-tertiary);
            margin-bottom: 16px;
            opacity: 0.5;
          }

          .empty-state-title {
            margin: 0 0 6px;
            font-size: 14px;
            font-weight: 600;
            color: var(--text-primary);
          }

          .empty-state-desc {
            margin: 0 0 20px;
            font-size: 13px;
            color: var(--text-tertiary);
          }

          /* Buttons */
          .btn {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 9px 16px;
            border-radius: var(--radius);
            font-size: 14px;
            font-weight: 600;
            text-decoration: none;
            border: none;
            cursor: pointer;
            transition: all 0.1s;
          }

          .btn-primary {
            background: var(--primary);
            color: white;
          }

          .btn-primary:hover {
            background: var(--primary-hover);
          }

          .btn-icon {
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 1px solid var(--border);
            background: var(--bg-white);
            border-radius: var(--radius);
            color: var(--text-tertiary);
            text-decoration: none;
            transition: all 0.1s;
          }

          .btn-icon:hover {
            background: var(--bg-primary);
            color: var(--text-primary);
            border-color: var(--border);
          }

          .link {
            font-size: 13px;
            color: var(--text-tertiary);
            text-decoration: none;
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 6px;
            transition: color 0.1s;
          }

          .link:hover {
            color: var(--primary);
          }

          /* Responsive */
          @media (max-width: 768px) {
            .dashboard-header {
              flex-direction: column;
              gap: 16px;
            }
            .metrics-grid {
              grid-template-columns: repeat(2, 1fr);
            }
            .metric-value {
              font-size: 24px;
            }
            .table th, .table td {
              padding: 12px 16px;
            }
            .table th:nth-child(3), .table td:nth-child(3) {
              display: none;
            }
          }

          @media (max-width: 480px) {
            .metrics-grid {
              grid-template-columns: 1fr;
            }
          }
        `}</style>
      </AdminLayout>
    </>
  );
}

/* ==========================================
   METRIC CARD COMPONENT
   ========================================== */

function MetricCard({ title, value, icon, trend, href, color }) {
  const colors = {
    slate: { bg: 'var(--slate-bg)', color: 'var(--slate)' },
    green: { bg: 'var(--green-bg)', color: 'var(--green)' },
    amber: { bg: 'var(--amber-bg)', color: 'var(--amber)' },
    purple: { bg: 'var(--purple-bg)', color: 'var(--purple)' },
    blue: { bg: 'var(--blue-bg)', color: 'var(--blue)' },
    pink: { bg: 'var(--pink-bg)', color: 'var(--pink)' },
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

/* ==========================================
   BADGE COMPONENT
   ========================================== */

function Badge({ variant, children }) {
  return (
    <span className={`badge badge-${variant}`}>
      {children}
    </span>
  );
}

/* ==========================================
   EMPTY STATE COMPONENT
   ========================================== */

function EmptyState({ icon, title, description, action }) {
  return (
    <div className="empty-state">
      {icon}
      <h4 className="empty-state-title">{title}</h4>
      <p className="empty-state-desc">{description}</p>
      {action && (
        <Link href={action.href} className="btn btn-primary">
          {action.label}
        </Link>
      )}
    </div>
  );
}

/* ==========================================
   LOADING SKELETON
   ========================================== */

function LoadingSkeleton() {
  return (
    <>
      <Head><title>Dashboard — Nova Impact</title></Head>
      <AdminLayout title="Overview">
        <div className="skeleton-page">
          <div className="skeleton-header">
            <div className="skeleton-title"></div>
            <div className="skeleton-subtitle"></div>
          </div>
          <div className="skeleton-metrics">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="skeleton-metric">
                <div className="skeleton-icon"></div>
                <div className="skeleton-value"></div>
                <div className="skeleton-label"></div>
              </div>
            ))}
          </div>
          <div className="skeleton-cards">
            <div className="skeleton-card">
              <div className="skeleton-card-header"></div>
              {[...Array(4)].map((_, i) => (
                <div key={i} className="skeleton-row"></div>
              ))}
            </div>
            <div className="skeleton-card">
              <div className="skeleton-card-header"></div>
              {[...Array(3)].map((_, i) => (
                <div key={i} className="skeleton-list-item"></div>
              ))}
            </div>
          </div>
        </div>
        <style jsx global>{`
          .skeleton-page { max-width: 1280px; }
          .skeleton-header { margin-bottom: 32px; }
          .skeleton-title { width: 200px; height: 28px; background: linear-gradient(90deg, #e3e8ee 25%, #f6f9fc 50%, #e3e8ee 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; border-radius: 6px; margin-bottom: 8px; }
          .skeleton-subtitle { width: 300px; height: 16px; background: linear-gradient(90deg, #e3e8ee 25%, #f6f9fc 50%, #e3e8ee 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; border-radius: 6px; }
          .skeleton-metrics { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 32px; }
          .skeleton-metric { background: #fff; border: 1px solid #e3e8ee; border-radius: 12px; padding: 20px; }
          .skeleton-icon { width: 36px; height: 36px; background: linear-gradient(90deg, #e3e8ee 25%, #f6f9fc 50%, #e3e8ee 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; border-radius: 8px; margin-bottom: 12px; }
          .skeleton-value { width: 60%; height: 24px; background: linear-gradient(90deg, #e3e8ee 25%, #f6f9fc 50%, #e3e8ee 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; border-radius: 6px; margin-bottom: 6px; }
          .skeleton-label { width: 40%; height: 14px; background: linear-gradient(90deg, #e3e8ee 25%, #f6f9fc 50%, #e3e8ee 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; border-radius: 6px; }
          .skeleton-cards { display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 20px; }
          .skeleton-card { background: #fff; border: 1px solid #e3e8ee; border-radius: 12px; overflow: hidden; }
          .skeleton-card-header { height: 53px; background: linear-gradient(90deg, #e3e8ee 25%, #f6f9fc 50%, #e3e8ee 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; border-bottom: 1px solid #e3e8ee; }
          .skeleton-row { height: 48px; background: linear-gradient(90deg, #e3e8ee 25%, #f6f9fc 50%, #e3e8ee 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; border-bottom: 1px solid #f6f9fc; }
          .skeleton-list-item { height: 68px; background: linear-gradient(90deg, #e3e8ee 25%, #f6f9fc 50%, #e3e8ee 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; border-bottom: 1px solid #f6f9fc; }
          @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
          @media (max-width: 1023px) { .skeleton-cards { grid-template-columns: 1fr; } }
        `}</style>
      </AdminLayout>
    </>
  );
}

/* ==========================================
   UTILITIES
   ========================================== */

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

  if (!session) {
    return { redirect: { destination: '/admin/login', permanent: false } };
  }
  return { props: {} };
}
