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

  return (
    <>
      <Head><title>Dashboard — Nova Impact Admin</title></Head>
      <AdminLayout title="Dashboard">
        {loading ? (
          <div className="admin-loading"><div className="admin-spinner"></div></div>
        ) : (
          <>
            {/* Welcome Banner */}
            <div className="admin-welcome-banner">
              <div className="admin-welcome-content">
                <h2>Welcome back, Admin! 👋</h2>
                <p>Here's what's happening with your website today.</p>
              </div>
              <div className="admin-welcome-date">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            </div>

            {/* Stats Cards */}
            <div className="admin-stats-grid">
              <StatCard title="Total Posts" value={stats.posts} icon="fa-file-lines" color="black" link="/admin/posts" />
              <StatCard title="Published" value={stats.published} icon="fa-check-circle" color="dark-gray" link="/admin/posts" />
              <StatCard title="Drafts" value={stats.drafts} icon="fa-pen-to-square" color="medium-gray" link="/admin/posts" />
              <StatCard title="Media Files" value={stats.uploads} icon="fa-image" color="light-gray" link="/admin/uploads" />
              <StatCard title="Messages" value={stats.contacts} icon="fa-envelope" color="darker-gray" link="/admin/contacts" />
              <StatCard title="Subscribers" value={stats.subscribers} icon="fa-users" color="darkest-gray" link="/admin/newsletter" />
            </div>

            {/* Main Content Grid */}
            <div className="admin-main-grid">
              {/* Left Column */}
              <div className="admin-col-main">
                {/* Recent Posts */}
                <div className="admin-light-card">
                  <div className="admin-card-header">
                    <h3 className="admin-card-title">
                      <span className="admin-card-icon black"><i className="fa-solid fa-clock-rotate-left"></i></span>
                      Recent Posts
                    </h3>
                    <div className="admin-card-actions">
                      <Link href="/admin/posts/new" className="dash-btn-sm">
                        <i className="fa-solid fa-plus"></i> New Post
                      </Link>
                      <Link href="/admin/posts" className="admin-card-link">View All <i className="fa-solid fa-arrow-right ms-1"></i></Link>
                    </div>
                  </div>
                  <div className="admin-card-body no-padding">
                    {recentPosts.length > 0 ? (
                      <div className="admin-recent-list">
                        {recentPosts.map(post => (
                          <div key={post.id} className="admin-recent-item">
                            <div className="admin-recent-content">
                              <h4><Link href={`/admin/posts/${post.id}`}>{post.titleFr}</Link></h4>
                              <p>{post.category || 'No category'}</p>
                            </div>
                            <div className="admin-recent-meta">
                              <span className={`admin-badge ${post.status === 'PUBLISHED' ? 'admin-badge-success' : 'admin-badge-secondary'}`}>{post.status}</span>
                              <small>{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'Draft'}</small>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="admin-empty-state">
                        <i className="fa-solid fa-file-lines"></i>
                        <p>No posts yet</p>
                        <Link href="/admin/posts/new" className="dash-btn">Create Your First Post</Link>
                      </div>
                    )}
                  </div>
                </div>

                {/* Recent Messages */}
                <div className="admin-light-card mt-4">
                  <div className="admin-card-header">
                    <h3 className="admin-card-title">
                      <span className="admin-card-icon darker-gray"><i className="fa-solid fa-envelope"></i></span>
                      Recent Messages
                    </h3>
                    <Link href="/admin/contacts" className="admin-card-link">View All</Link>
                  </div>
                  <div className="admin-card-body">
                    {recentContacts.length > 0 ? (
                      <div className="admin-message-list">
                        {recentContacts.map(contact => (
                          <div key={contact.id} className="admin-message-item">
                            <div className="admin-message-avatar">{contact.name.charAt(0)}</div>
                            <div className="admin-message-content">
                              <strong>{contact.name}</strong>
                              <p>{contact.message.substring(0, 60)}...</p>
                            </div>
                            <small>{new Date(contact.createdAt).toLocaleDateString()}</small>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted text-center">No messages yet</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="admin-col-sidebar">
                {/* Quick Actions */}
                <div className="admin-light-card">
                  <div className="admin-card-header">
                    <h3 className="admin-card-title">
                      <span className="admin-card-icon black"><i className="fa-solid fa-bolt"></i></span>
                      Quick Actions
                    </h3>
                  </div>
                  <div className="admin-card-body">
                    <div className="admin-quick-actions">
                      <Link href="/admin/posts/new" className="admin-quick-btn">
                        <span className="admin-quick-number">1</span>
                        <span>New Post</span>
                      </Link>
                      <Link href="/admin/uploads" className="admin-quick-btn">
                        <span className="admin-quick-number">2</span>
                        <span>Upload Media</span>
                      </Link>
                      <Link href="/admin/newsletter" className="admin-quick-btn">
                        <span className="admin-quick-number">3</span>
                        <span>Newsletter</span>
                      </Link>
                      <Link href="/admin/contacts" className="admin-quick-btn">
                        <span className="admin-quick-number">4</span>
                        <span>Messages</span>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Site Stats */}
                <div className="admin-light-card mt-4">
                  <div className="admin-card-header">
                    <h3 className="admin-card-title">
                      <span className="admin-card-icon dark-gray"><i className="fa-solid fa-chart-line"></i></span>
                      Overview
                    </h3>
                  </div>
                  <div className="admin-card-body">
                    <div className="admin-overview-item">
                      <span>Published Posts</span>
                      <strong>{stats.published}</strong>
                    </div>
                    <div className="admin-overview-item">
                      <span>Draft Posts</span>
                      <strong>{stats.drafts}</strong>
                    </div>
                    <div className="admin-overview-item">
                      <span>Media Files</span>
                      <strong>{stats.uploads}</strong>
                    </div>
                    <div className="admin-overview-item">
                      <span>Newsletter Subscribers</span>
                      <strong>{stats.subscribers}</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </AdminLayout>

      <style jsx global>{`
        .admin-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 400px;
        }

        .admin-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid #e8e8e8;
          border-top-color: #1a1a1a;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Welcome Banner */
        .admin-welcome-banner {
          background: linear-gradient(135deg, #1a1a1a 0%, #333333 100%);
          border-radius: 16px;
          padding: 28px 32px;
          margin-bottom: 28px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: #ffffff;
        }

        .admin-welcome-content h2 {
          margin: 0 0 6px 0;
          font-size: 24px;
          font-weight: 700;
        }

        .admin-welcome-content p {
          margin: 0;
          font-size: 14px;
          opacity: 0.8;
        }

        .admin-welcome-date {
          font-size: 14px;
          font-weight: 500;
          opacity: 0.7;
        }

        /* Stats Grid */
        .admin-stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 20px;
          margin-bottom: 28px;
        }

        .admin-stat-card {
          background: #ffffff;
          border-radius: 16px;
          padding: 24px;
          border: 1px solid #e8e8e8;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .admin-stat-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: var(--card-color);
        }

        .admin-stat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(0,0,0,0.12);
          border-color: var(--card-color);
        }

        .admin-stat-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }

        .admin-stat-card-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          color: #fff;
          background: var(--card-color);
        }

        .admin-stat-card-link {
          color: #6c757d;
          text-decoration: none;
          font-size: 13px;
          transition: color 0.2s;
        }

        .admin-stat-card-link:hover {
          color: #1a1a1a;
        }

        .admin-stat-card-value {
          font-size: 32px;
          font-weight: 700;
          color: #1a1d21;
          margin-bottom: 4px;
        }

        .admin-stat-card-title {
          font-size: 13px;
          color: #6c757d;
          margin: 0;
        }

        /* Main Grid Layout */
        .admin-main-grid {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 24px;
        }

        @media (max-width: 1199px) {
          .admin-main-grid {
            grid-template-columns: 1fr;
          }
        }

        .admin-col-sidebar {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        /* Light Cards */
        .admin-light-card {
          background: #ffffff;
          border-radius: 16px;
          border: 1px solid #e8e8e8;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .admin-light-card:hover {
          box-shadow: 0 8px 30px rgba(0,0,0,0.08);
        }

        .admin-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 24px;
          border-bottom: 1px solid #f0f0f0;
        }

        .admin-card-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .admin-card-title {
          font-size: 16px;
          font-weight: 600;
          color: #1a1d21;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .admin-card-icon {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          color: #fff;
        }

        .admin-card-icon.black { background: #1a1a1a; }
        .admin-card-icon.dark-gray { background: #333333; }
        .admin-card-icon.medium-gray { background: #6c757d; }
        .admin-card-icon.light-gray { background: #adb5bd; }
        .admin-card-icon.darker-gray { background: #495057; }
        .admin-card-icon.darkest-gray { background: #212529; }

        .admin-card-link {
          color: #1a1a1a;
          text-decoration: none;
          font-size: 13px;
          font-weight: 500;
        }

        .admin-card-link:hover {
          color: #6c757d;
        }

        .admin-card-body {
          padding: 20px 24px;
        }

        .admin-card-body.no-padding {
          padding: 0;
        }

        /* Recent List */
        .admin-recent-list {
          display: flex;
          flex-direction: column;
        }

        .admin-recent-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 24px;
          border-bottom: 1px solid #f0f0f0;
          transition: background 0.2s;
        }

        .admin-recent-item:last-child {
          border-bottom: none;
        }

        .admin-recent-item:hover {
          background: #fafafa;
        }

        .admin-recent-content h4 {
          margin: 0 0 4px 0;
          font-size: 15px;
        }

        .admin-recent-content h4 a {
          color: #1a1d21;
          text-decoration: none;
        }

        .admin-recent-content h4 a:hover {
          color: #6c757d;
        }

        .admin-recent-content p {
          margin: 0;
          font-size: 13px;
          color: #6c757d;
        }

        .admin-recent-meta {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 6px;
        }

        .admin-recent-meta small {
          color: #6c757d;
          font-size: 12px;
        }

        /* Quick Actions */
        .admin-quick-actions {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        .admin-quick-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          padding: 20px 16px;
          background: #f8f9fa;
          border-radius: 12px;
          text-decoration: none;
          color: #495057;
          transition: all 0.2s;
          border: 1px solid transparent;
        }

        .admin-quick-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        }

        .admin-quick-number {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          font-weight: 700;
          color: #ffffff;
          background: #1a1a1a;
        }

        .admin-quick-btn span:last-child {
          font-size: 13px;
          font-weight: 500;
        }

        /* Message List */
        .admin-message-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .admin-message-item {
          display: flex;
          gap: 12px;
          align-items: center;
          padding: 12px;
          background: #f8f9fa;
          border-radius: 10px;
          transition: background 0.2s;
        }

        .admin-message-item:hover {
          background: #f0f0f0;
        }

        .admin-message-avatar {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: linear-gradient(135deg, #1a1a1a, #333333);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          flex-shrink: 0;
        }

        .admin-message-content {
          flex: 1;
          min-width: 0;
        }

        .admin-message-content strong {
          display: block;
          font-size: 14px;
          color: #1a1d21;
        }

        .admin-message-content p {
          margin: 2px 0 0 0;
          font-size: 12px;
          color: #6c757d;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .admin-message-item small {
          color: #6c757d;
          font-size: 11px;
          flex-shrink: 0;
        }

        /* Overview */
        .admin-overview-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 0;
          border-bottom: 1px solid #f0f0f0;
        }

        .admin-overview-item:last-child {
          border-bottom: none;
        }

        .admin-overview-item span {
          color: #6c757d;
          font-size: 14px;
        }

        .admin-overview-item strong {
          color: #1a1d21;
          font-size: 16px;
        }

        /* Badges */
        .admin-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
        }

        .admin-badge-success { background: rgba(25, 135, 84, 0.15); color: #198754; }
        .admin-badge-secondary { background: rgba(108, 117, 125, 0.15); color: #6c757d; }

        /* Dashboard Unique Buttons */
        .dash-btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: linear-gradient(135deg, #1a1a1a 0%, #333333 100%);
          color: #ffffff;
          border: none;
          padding: 14px 32px;
          border-radius: 50px;
          font-weight: 700;
          font-size: 15px;
          text-decoration: none;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 15px rgba(26, 26, 26, 0.25);
          position: relative;
          overflow: hidden;
        }

        .dash-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
          transition: left 0.5s;
        }

        .dash-btn:hover::before {
          left: 100%;
        }

        .dash-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(26, 26, 26, 0.4);
        }

        /* Dashboard Small Button (Black Text) */
        .dash-btn-sm {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #ffffff;
          color: #1a1a1a;
          border: 2px solid #1a1a1a;
          padding: 8px 18px;
          border-radius: 50px;
          font-weight: 600;
          font-size: 13px;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .dash-btn-sm:hover {
          background: #1a1a1a;
          color: #ffffff;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(26, 26, 26, 0.2);
        }

        /* Empty State */
        .admin-empty-state {
          text-align: center;
          padding: 40px 20px;
        }

        .admin-empty-state i {
          font-size: 48px;
          color: #e8e8e8;
          margin-bottom: 16px;
        }

        .admin-empty-state p {
          color: #6c757d;
          margin-bottom: 20px;
        }

        /* Utilities */
        .text-muted { color: #6c757d; }
        .text-center { text-align: center; }
        .mt-4 { margin-top: 24px; }

        @media (max-width: 768px) {
          .admin-welcome-banner {
            flex-direction: column;
            text-align: center;
            gap: 12px;
          }
          
          .admin-stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </>
  );
}

function StatCard({ title, value, icon, color, link }) {
  const colorMap = {
    black: { bg: '#1a1a1a', accent: '#1a1a1a' },
    'dark-gray': { bg: '#333333', accent: '#333333' },
    'medium-gray': { bg: '#6c757d', accent: '#6c757d' },
    'light-gray': { bg: '#adb5bd', accent: '#adb5bd' },
    'darker-gray': { bg: '#495057', accent: '#495057' },
    'darkest-gray': { bg: '#212529', accent: '#212529' },
  };

  const colors = colorMap[color] || colorMap.black;

  return (
    <div className="admin-stat-card" style={{ '--card-color': colors.accent }}>
      <div className="admin-stat-card-header">
        <div className="admin-stat-card-icon" style={{ background: colors.bg }}>
          <i className={`fa-solid ${icon}`}></i>
        </div>
        <Link href={link} className="admin-stat-card-link">View all <i className="fa-solid fa-arrow-right ms-1"></i></Link>
      </div>
      <div className="admin-stat-card-value">{value}</div>
      <p className="admin-stat-card-title">{title}</p>
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
