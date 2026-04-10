import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { signOut, useSession } from 'next-auth/react';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: 'fa-solid fa-gauge-high' },
  { href: '/admin/posts', label: 'Posts', icon: 'fa-solid fa-file-lines' },
  { href: '/admin/uploads', label: 'Uploads', icon: 'fa-solid fa-image' },
  { href: '/admin/contacts', label: 'Contacts', icon: 'fa-solid fa-envelope' },
  { href: '/admin/newsletter', label: 'Newsletter', icon: 'fa-solid fa-paper-plane' },
  { href: '/admin/settings', label: 'Settings', icon: 'fa-solid fa-gear' },
];

export default function AdminLayout({ children, title = 'Dashboard' }) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const isActive = (href) => {
    if (href === '/admin') return router.pathname === '/admin';
    return router.asPath.startsWith(href);
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/admin/login' });
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="admin-sidebar-header">
          <h2 className="admin-logo">
            <i className="fa-solid fa-bolt me-2"></i>
            <span>Nova Impact</span>
          </h2>
          <button className="admin-sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <i className={`fa-solid ${sidebarOpen ? 'fa-chevron-left' : 'fa-chevron-right'}`}></i>
          </button>
        </div>

        <nav className="admin-nav">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`admin-nav-item ${isActive(item.href) ? 'active' : ''}`}
            >
              <i className={item.icon}></i>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <button className="admin-logout-btn" onClick={handleLogout}>
            <i className="fa-solid fa-right-from-bracket"></i>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="admin-main">
        {/* Top Header */}
        <header className="admin-header">
          <div className="admin-header-left">
            <button className="admin-mobile-toggle d-md-none" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <i className="fa-solid fa-bars"></i>
            </button>
            <h1 className="admin-page-title">{title}</h1>
          </div>
          <div className="admin-header-right">
            <span className="admin-user-email">admin@novaimpact.fr</span>
          </div>
        </header>

        {/* Content Area */}
        <main className="admin-content">
          {children}
        </main>
      </div>

      {/* Styles */}
      <style jsx global>{`
        .admin-layout {
          display: flex;
          min-height: 100vh;
          background: #f8f9fa;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        /* Sidebar */
        .admin-sidebar {
          width: 260px;
          background: #1a1d21;
          color: #fff;
          display: flex;
          flex-direction: column;
          transition: width 0.3s ease;
          position: fixed;
          top: 0;
          left: 0;
          bottom: 0;
          z-index: 1000;
          overflow: hidden;
        }

        .admin-sidebar.closed {
          width: 70px;
        }

        .admin-sidebar-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 16px;
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }

        .admin-logo {
          font-size: 18px;
          font-weight: 600;
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          transition: opacity 0.2s;
        }

        .admin-sidebar.closed .admin-logo span {
          display: none;
        }

        .admin-sidebar-toggle {
          background: rgba(255,255,255,0.1);
          border: none;
          color: #fff;
          width: 32px;
          height: 32px;
          border-radius: 6px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s;
        }

        .admin-sidebar-toggle:hover {
          background: rgba(255,255,255,0.2);
        }

        /* Navigation */
        .admin-nav {
          flex: 1;
          padding: 16px 12px;
          overflow-y: auto;
        }

        .admin-nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          color: #a0a4a8;
          text-decoration: none;
          border-radius: 8px;
          margin-bottom: 4px;
          transition: all 0.2s;
          white-space: nowrap;
        }

        .admin-nav-item:hover {
          background: rgba(255,255,255,0.06);
          color: #fff;
        }

        .admin-nav-item.active {
          background: #ffffff;
          color: #1a1d21;
          font-weight: 500;
        }

        .admin-nav-item i {
          font-size: 18px;
          width: 20px;
          text-align: center;
        }

        .admin-nav-item span {
          transition: opacity 0.2s;
        }

        .admin-sidebar.closed .admin-nav-item span {
          opacity: 0;
          width: 0;
        }

        /* Sidebar Footer */
        .admin-sidebar-footer {
          padding: 16px 12px;
          border-top: 1px solid rgba(255,255,255,0.08);
        }

        .admin-logout-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          background: rgba(255,77,77,0.1);
          border: none;
          color: #ff4d4d;
          border-radius: 8px;
          cursor: pointer;
          width: 100%;
          text-align: left;
          transition: background 0.2s;
          white-space: nowrap;
        }

        .admin-logout-btn:hover {
          background: rgba(255,77,77,0.2);
        }

        .admin-logout-btn i {
          font-size: 18px;
          width: 20px;
          text-align: center;
        }

        .admin-sidebar.closed .admin-logout-btn span {
          opacity: 0;
          width: 0;
        }

        /* Main Content */
        .admin-main {
          flex: 1;
          margin-left: 260px;
          transition: margin-left 0.3s ease;
          min-height: 100vh;
        }

        .admin-sidebar.closed ~ .admin-main {
          margin-left: 70px;
        }

        /* Header */
        .admin-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 32px;
          background: #fff;
          border-bottom: 1px solid #e9ecef;
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .admin-header-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .admin-mobile-toggle {
          background: none;
          border: none;
          font-size: 20px;
          color: #333;
          cursor: pointer;
        }

        .admin-page-title {
          font-size: 22px;
          font-weight: 600;
          color: #1a1d21;
          margin: 0;
        }

        .admin-header-right {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .admin-user-email {
          font-size: 14px;
          color: #6c757d;
          background: #f8f9fa;
          padding: 8px 16px;
          border-radius: 20px;
        }

        /* Content */
        .admin-content {
          padding: 32px;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .admin-sidebar {
            transform: translateX(-100%);
            width: 260px !important;
          }

          .admin-sidebar.open {
            transform: translateX(0);
          }

          .admin-main {
            margin-left: 0 !important;
          }

          .admin-content {
            padding: 16px;
          }

          .admin-header {
            padding: 16px;
          }
        }

        /* Pagination Styles */
        .admin-pagination {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 24px;
          padding: 16px 0;
        }

        .admin-pagination-info {
          font-size: 13px;
          color: #6c757d;
        }

        .admin-pagination-controls {
          display: flex;
          gap: 4px;
        }

        .admin-page-btn {
          min-width: 36px;
          height: 36px;
          border: 1px solid #2d3036;
          background: #1a1d21;
          color: #a0a4a8;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          transition: all 0.2s;
        }

        .admin-page-btn:hover:not(:disabled) {
          background: #2d3036;
          color: #fff;
        }

        .admin-page-btn.active {
          background: #1a1a1a;
          color: #ffffff;
          border-color: #1a1a1a;
          font-weight: 600;
        }

        .admin-page-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .admin-page-ellipsis {
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 36px;
          height: 36px;
          color: #6c757d;
        }
      `}</style>
    </div>
  );
}
