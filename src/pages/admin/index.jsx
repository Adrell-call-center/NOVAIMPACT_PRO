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
      <>
        <Head><title>Dashboard — Nova Impact</title></Head>
        <AdminLayout title="Dashboard">
          <div className="dashboard-loading">
            <div className="loading-skeleton">
              <div className="skeleton-grid">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="skeleton-card">
                    <div className="skeleton-icon"></div>
                    <div className="skeleton-value"></div>
                    <div className="skeleton-label"></div>
                  </div>
                ))}
              </div>
              <div className="skeleton-content">
                <div className="skeleton-table">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="skeleton-row"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </AdminLayout>
      </>
    );
  }

  return (
    <>
      <Head><title>Dashboard — Nova Impact</title></Head>
      <AdminLayout title="Dashboard">
        <div className="dashboard-page">
          {/* Welcome Header */}
          <div className="dashboard-welcome">
            <div className="dashboard-welcome-content">
              <h2>Welcome back!</h2>
              <p>Here's what's happening with your content today.</p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="dashboard-stats">
            <StatCard 
              title="Total Posts" 
              value={stats.posts} 
              icon="fa-solid fa-file-lines"
              color="slate"
              link="/admin/posts" 
              trend={stats.published > 0 ? `+${stats.published} published` : 'No activity'}
            />
            <StatCard 
              title="Published" 
              value={stats.published} 
              icon="fa-solid fa-circle-check"
              color="emerald"
              link="/admin/posts"
              trend="Live on site"
            />
            <StatCard 
              title="Drafts" 
              value={stats.drafts} 
              icon="fa-solid fa-pencil"
              color="amber"
              link="/admin/posts"
              trend="In progress"
            />
            <StatCard 
              title="Media Files" 
              value={stats.uploads} 
              icon="fa-solid fa-image"
              color="violet"
              link="/admin/uploads"
              trend="Uploaded assets"
            />
            <StatCard 
              title="Messages" 
              value={stats.contacts} 
              icon="fa-solid fa-inbox"
              color="sky"
              link="/admin/contacts"
              trend="Contact form"
            />
            <StatCard 
              title="Subscribers" 
              value={stats.subscribers} 
              icon="fa-solid fa-users"
              color="rose"
              link="/admin/newsletter"
              trend="Newsletter list"
            />
          </div>

          {/* Main Grid */}
          <div className="dashboard-grid">
            {/* Recent Posts */}
            <div className="dashboard-card">
              <div className="dashboard-card-header">
                <div className="dashboard-card-title">
                  <i className="fa-solid fa-clock"></i>
                  <h3>Recent Posts</h3>
                </div>
                <div className="dashboard-card-actions">
                  <Link href="/admin/posts/new" className="btn-primary">
                    <i className="fa-solid fa-plus"></i> New Post
                  </Link>
                  <Link href="/admin/posts" className="btn-ghost">
                    View All <i className="fa-solid fa-arrow-right"></i>
                  </Link>
                </div>
              </div>
              <div className="dashboard-card-body">
                {recentPosts.length > 0 ? (
                  <div className="modern-table">
                    <table>
                      <thead>
                        <tr>
                          <th>Title</th>
                          <th>Category</th>
                          <th>Status</th>
                          <th>Date</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentPosts.map(post => (
                          <tr key={post.id}>
                            <td className="table-title">
                              <Link href={`/admin/posts/${post.id}`}>{post.titleFr}</Link>
                            </td>
                            <td>
                              <span className="table-text">{post.category || '—'}</span>
                            </td>
                            <td>
                              <Badge status={post.status === 'PUBLISHED' ? 'success' : 'warning'}>
                                {post.status}
                              </Badge>
                            </td>
                            <td className="table-date">
                              {post.publishedAt 
                                ? new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                                : 'Draft'}
                            </td>
                            <td>
                              <Link href={`/admin/posts/${post.id}`} className="btn-icon">
                                <i className="fa-solid fa-arrow-right"></i>
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <EmptyState
                    icon="fa-solid fa-file-lines"
                    title="No posts yet"
                    description="Create your first post to get started"
                    action={{ label: 'Create Post', href: '/admin/posts/new' }}
                  />
                )}
              </div>
            </div>

            {/* Recent Messages */}
            <div className="dashboard-card">
              <div className="dashboard-card-header">
                <div className="dashboard-card-title">
                  <i className="fa-solid fa-envelope"></i>
                  <h3>Recent Messages</h3>
                </div>
                <Link href="/admin/contacts" className="btn-ghost">
                  View All <i className="fa-solid fa-arrow-right"></i>
                </Link>
              </div>
              <div className="dashboard-card-body">
                {recentContacts.length > 0 ? (
                  <div className="message-list">
                    {recentContacts.map(contact => (
                      <Link href="/admin/contacts" key={contact.id} className="message-item">
                        <div className="message-avatar">
                          {contact.name.charAt(0)}
                        </div>
                        <div className="message-content">
                          <div className="message-header">
                            <span className="message-name">{contact.name}</span>
                            <span className="message-time">
                              {new Date(contact.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </span>
                          </div>
                          <p className="message-preview">{contact.message.substring(0, 80)}...</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    icon="fa-solid fa-inbox"
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
             DASHBOARD V2 - PREMIUM SAAS DESIGN
             ========================================== */
          
          .dashboard-loading {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 400px;
          }

          .loading-skeleton {
            width: 100%;
          }

          .skeleton-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 32px;
          }

          .skeleton-card {
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 16px;
            padding: 24px;
          }

          .skeleton-icon, .skeleton-value, .skeleton-label, .skeleton-row {
            background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
            background-size: 200% 100%;
            animation: shimmer 1.5s infinite;
            border-radius: 6px;
          }

          .skeleton-icon {
            width: 48px;
            height: 48px;
            margin-bottom: 16px;
          }

          .skeleton-value {
            width: 60%;
            height: 24px;
            margin-bottom: 8px;
          }

          .skeleton-label {
            width: 40%;
            height: 14px;
          }

          .skeleton-content {
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 16px;
            padding: 24px;
          }

          .skeleton-table .skeleton-row {
            height: 48px;
            margin-bottom: 12px;
          }

          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }

          /* Page */
          .dashboard-page {
            max-width: 1400px;
          }

          /* Welcome */
          .dashboard-welcome {
            margin-bottom: 32px;
          }

          .dashboard-welcome-content h2 {
            margin: 0 0 8px;
            font-size: 28px;
            font-weight: 800;
            color: #0f172a;
            letter-spacing: -0.02em;
          }

          .dashboard-welcome-content p {
            margin: 0;
            font-size: 15px;
            color: #64748b;
          }

          /* Stats Grid */
          .dashboard-stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
            gap: 20px;
            margin-bottom: 32px;
          }

          .stat-card {
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 16px;
            padding: 24px;
            transition: all 0.2s ease;
            position: relative;
            overflow: hidden;
          }

          .stat-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 3px;
            background: var(--stat-color);
            opacity: 0;
            transition: opacity 0.2s;
          }

          .stat-card:hover {
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
            transform: translateY(-2px);
          }

          .stat-card:hover::before {
            opacity: 1;
          }

          .stat-card-header {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            margin-bottom: 16px;
          }

          .stat-card-icon {
            width: 48px;
            height: 48px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            background: var(--stat-bg);
            color: var(--stat-text);
          }

          .stat-card-link {
            color: #94a3b8;
            text-decoration: none;
            font-size: 12px;
            font-weight: 500;
            transition: color 0.15s;
          }

          .stat-card-link:hover {
            color: #0f172a;
          }

          .stat-card-value {
            font-size: 32px;
            font-weight: 800;
            color: #0f172a;
            line-height: 1;
            margin-bottom: 6px;
            letter-spacing: -0.02em;
          }

          .stat-card-title {
            font-size: 13px;
            color: #64748b;
            font-weight: 500;
            margin: 0 0 4px;
          }

          .stat-card-trend {
            font-size: 12px;
            color: #94a3b8;
          }

          /* Dashboard Grid */
          .dashboard-grid {
            display: grid;
            grid-template-columns: 1.2fr 0.8fr;
            gap: 24px;
          }

          @media (max-width: 1023px) {
            .dashboard-grid {
              grid-template-columns: 1fr;
            }
          }

          /* Cards */
          .dashboard-card {
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 16px;
            overflow: hidden;
          }

          .dashboard-card-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 20px 24px;
            border-bottom: 1px solid #f1f5f9;
          }

          .dashboard-card-title {
            display: flex;
            align-items: center;
            gap: 10px;
          }

          .dashboard-card-title i {
            font-size: 16px;
            color: #64748b;
          }

          .dashboard-card-title h3 {
            margin: 0;
            font-size: 15px;
            font-weight: 700;
            color: #0f172a;
          }

          .dashboard-card-actions {
            display: flex;
            align-items: center;
            gap: 8px;
          }

          .dashboard-card-body {
            padding: 0;
          }

          /* Buttons */
          .btn-primary {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            background: #0f172a;
            color: #ffffff;
            border: none;
            padding: 8px 16px;
            border-radius: 8px;
            font-size: 13px;
            font-weight: 600;
            text-decoration: none;
            transition: all 0.15s;
            cursor: pointer;
          }

          .btn-primary:hover {
            background: #1e293b;
          }

          .btn-ghost {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            background: transparent;
            color: #64748b;
            border: none;
            padding: 8px 14px;
            border-radius: 8px;
            font-size: 13px;
            font-weight: 500;
            text-decoration: none;
            transition: all 0.15s;
          }

          .btn-ghost:hover {
            background: #f8fafc;
            color: #0f172a;
          }

          .btn-icon {
            width: 32px;
            height: 32px;
            border: 1px solid #e2e8f0;
            background: #ffffff;
            border-radius: 6px;
            color: #64748b;
            display: flex;
            align-items: center;
            justify-content: center;
            text-decoration: none;
            transition: all 0.15s;
            font-size: 14px;
          }

          .btn-icon:hover {
            background: #0f172a;
            color: #ffffff;
            border-color: #0f172a;
          }

          /* Table */
          .modern-table {
            overflow-x: auto;
          }

          .modern-table table {
            width: 100%;
            border-collapse: collapse;
          }

          .modern-table th {
            text-align: left;
            padding: 12px 24px;
            font-size: 11px;
            font-weight: 600;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            background: #f8fafc;
            border-bottom: 1px solid #f1f5f9;
          }

          .modern-table td {
            padding: 16px 24px;
            border-bottom: 1px solid #f1f5f9;
            vertical-align: middle;
          }

          .modern-table tr:last-child td {
            border-bottom: none;
          }

          .modern-table tr:hover td {
            background: #fafbfc;
          }

          .table-title a {
            color: #0f172a;
            text-decoration: none;
            font-weight: 600;
            font-size: 14px;
            transition: color 0.15s;
          }

          .table-title a:hover {
            color: #2563eb;
          }

          .table-text {
            font-size: 13px;
            color: #64748b;
          }

          .table-date {
            font-size: 12px;
            color: #94a3b8;
            white-space: nowrap;
          }

          /* Badges */
          .badge {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            padding: 4px 10px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
          }

          .badge-success {
            background: #dcfce7;
            color: #166534;
          }

          .badge-warning {
            background: #fef3c7;
            color: #92400e;
          }

          .badge-error {
            background: #fee2e2;
            color: #991b1b;
          }

          .badge-info {
            background: #dbeafe;
            color: #1e40af;
          }

          /* Message List */
          .message-list {
            display: flex;
            flex-direction: column;
          }

          .message-item {
            display: flex;
            gap: 14px;
            padding: 20px 24px;
            border-bottom: 1px solid #f1f5f9;
            text-decoration: none;
            transition: background 0.15s;
          }

          .message-item:last-child {
            border-bottom: none;
          }

          .message-item:hover {
            background: #fafbfc;
          }

          .message-avatar {
            width: 44px;
            height: 44px;
            background: #0f172a;
            color: #ffffff;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            font-size: 16px;
            flex-shrink: 0;
          }

          .message-content {
            flex: 1;
            min-width: 0;
          }

          .message-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 4px;
          }

          .message-name {
            font-size: 14px;
            font-weight: 600;
            color: #0f172a;
          }

          .message-time {
            font-size: 12px;
            color: #94a3b8;
          }

          .message-preview {
            margin: 0;
            font-size: 13px;
            color: #64748b;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          /* Empty State */
          .empty-state {
            text-align: center;
            padding: 48px 24px;
          }

          .empty-state-icon {
            width: 64px;
            height: 64px;
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            color: #cbd5e1;
            margin: 0 auto 16px;
          }

          .empty-state-title {
            margin: 0 0 6px;
            font-size: 15px;
            font-weight: 700;
            color: #0f172a;
          }

          .empty-state-desc {
            margin: 0 0 20px;
            font-size: 13px;
            color: #64748b;
          }

          /* Responsive */
          @media (max-width: 768px) {
            .dashboard-welcome-content h2 {
              font-size: 24px;
            }

            .dashboard-stats {
              grid-template-columns: repeat(2, 1fr);
            }

            .stat-card-value {
              font-size: 28px;
            }

            .dashboard-card-header {
              flex-direction: column;
              align-items: flex-start;
              gap: 12px;
            }

            .modern-table th, .modern-table td {
              padding: 12px 16px;
            }
          }
        `}</style>
      </AdminLayout>
    </>
  );
}

/* ==========================================
   STAT CARD COMPONENT
   ========================================== */

function StatCard({ title, value, icon, color, link, trend }) {
  const colors = {
    slate: { bg: '#f1f5f9', text: '#475569', accent: '#64748b' },
    emerald: { bg: '#d1fae5', text: '#059669', accent: '#10b981' },
    amber: { bg: '#fef3c7', text: '#d97706', accent: '#f59e0b' },
    violet: { bg: '#ede9fe', text: '#7c3aed', accent: '#8b5cf6' },
    sky: { bg: '#e0f2fe', text: '#0284c7', accent: '#0ea5e9' },
    rose: { bg: '#ffe4e6', text: '#e11d48', accent: '#f43f5e' },
  };

  const c = colors[color] || colors.slate;

  return (
    <div className="stat-card" style={{ '--stat-bg': c.bg, '--stat-text': c.text, '--stat-color': c.accent }}>
      <div className="stat-card-header">
        <div className="stat-card-icon">
          <i className={icon}></i>
        </div>
        <Link href={link} className="stat-card-link">View all</Link>
      </div>
      <div className="stat-card-value">{value}</div>
      <p className="stat-card-title">{title}</p>
      <div className="stat-card-trend">{trend}</div>
    </div>
  );
}

/* ==========================================
   BADGE COMPONENT
   ========================================== */

function Badge({ status, children }) {
  const statusMap = {
    success: 'badge-success',
    warning: 'badge-warning',
    error: 'badge-error',
    info: 'badge-info',
  };

  return (
    <span className={`badge ${statusMap[status] || 'badge-info'}`}>
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
      <div className="empty-state-icon">
        <i className={icon}></i>
      </div>
      <h4 className="empty-state-title">{title}</h4>
      <p className="empty-state-desc">{description}</p>
      {action && (
        <Link href={action.href} className="btn-primary">
          {action.label}
        </Link>
      )}
    </div>
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
