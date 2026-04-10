import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { signOut } from 'next-auth/react';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: 'fa-solid fa-grid-2' },
  { href: '/admin/posts', label: 'Posts', icon: 'fa-solid fa-file-lines' },
  { href: '/admin/uploads', label: 'Media', icon: 'fa-solid fa-image' },
  { href: '/admin/contacts', label: 'Messages', icon: 'fa-solid fa-envelope' },
  { href: '/admin/newsletter', label: 'Newsletter', icon: 'fa-solid fa-paper-plane' },
  { href: '/admin/settings', label: 'Settings', icon: 'fa-solid fa-gear' },
];

export default function AdminLayout({ children, title = 'Dashboard' }) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) setSidebarOpen(false);
      else setSidebarOpen(true);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const isActive = (href) => {
    if (href === '/admin') return router.pathname === '/admin';
    return router.asPath.startsWith(href);
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/admin/login' });
  };

  return (
    <div className="admin-v2-layout">
      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <div className="admin-v2-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`admin-v2-sidebar ${sidebarOpen ? 'open' : 'closed'} ${isMobile ? 'mobile' : ''}`}>
        {/* Logo */}
        <div className="admin-v2-logo">
          <div className="admin-v2-logo-icon">N</div>
          <span className="admin-v2-logo-text">Nova Impact</span>
        </div>

        {/* Navigation */}
        <nav className="admin-v2-nav">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`admin-v2-nav-item ${isActive(item.href) ? 'active' : ''}`}
            >
              <i className={item.icon}></i>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* User Profile */}
        <div className="admin-v2-user">
          <div className="admin-v2-user-avatar">A</div>
          <div className="admin-v2-user-info">
            <span className="admin-v2-user-name">Admin</span>
            <span className="admin-v2-user-email">admin@novaimpact.io</span>
          </div>
          <button className="admin-v2-logout" onClick={handleLogout} title="Logout">
            <i className="fa-solid fa-right-from-bracket"></i>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="admin-v2-main">
        {/* Top Navbar */}
        <header className="admin-v2-header">
          <div className="admin-v2-header-left">
            <button 
              className="admin-v2-menu-btn" 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle sidebar"
            >
              <i className={`fa-solid ${sidebarOpen ? 'fa-bars-staggered' : 'fa-bars'}`}></i>
            </button>
            <h1 className="admin-v2-page-title">{title}</h1>
          </div>
          <div className="admin-v2-header-right">
            <span className="admin-v2-date">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </span>
          </div>
        </header>

        {/* Content */}
        <main className="admin-v2-content">
          {children}
        </main>
      </div>

      <style jsx global>{`
        /* ==========================================
           ADMIN V2 - PREMIUM SAAS DESIGN SYSTEM
           ========================================== */
        
        .admin-v2-layout {
          display: flex;
          min-height: 100vh;
          background: #f8fafc;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', sans-serif;
          color: #0f172a;
        }

        /* Overlay for mobile */
        .admin-v2-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 999;
          backdrop-filter: blur(4px);
        }

        /* ==========================================
           SIDEBAR
           ========================================== */
        
        .admin-v2-sidebar {
          width: 280px;
          background: #ffffff;
          border-right: 1px solid #e2e8f0;
          display: flex;
          flex-direction: column;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: fixed;
          top: 0;
          left: 0;
          bottom: 0;
          z-index: 1000;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }

        .admin-v2-sidebar.closed {
          width: 80px;
        }

        .admin-v2-sidebar.mobile {
          transform: translateX(-100%);
        }

        .admin-v2-sidebar.mobile.open {
          transform: translateX(0);
        }

        /* Logo */
        .admin-v2-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 20px 24px;
          border-bottom: 1px solid #f1f5f9;
        }

        .admin-v2-logo-icon {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #0f172a 0%, #334155 100%);
          color: #ffffff;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 18px;
          flex-shrink: 0;
        }

        .admin-v2-logo-text {
          font-size: 16px;
          font-weight: 700;
          color: #0f172a;
          white-space: nowrap;
          transition: opacity 0.2s;
        }

        .admin-v2-sidebar.closed .admin-v2-logo-text {
          opacity: 0;
          width: 0;
          overflow: hidden;
        }

        /* Navigation */
        .admin-v2-nav {
          flex: 1;
          padding: 16px 12px;
          overflow-y: auto;
        }

        .admin-v2-nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 14px;
          color: #64748b;
          text-decoration: none;
          border-radius: 8px;
          margin-bottom: 4px;
          transition: all 0.15s ease;
          font-size: 14px;
          font-weight: 500;
          white-space: nowrap;
        }

        .admin-v2-nav-item:hover {
          background: #f8fafc;
          color: #0f172a;
        }

        .admin-v2-nav-item.active {
          background: #0f172a;
          color: #ffffff;
          font-weight: 600;
        }

        .admin-v2-nav-item.active:hover {
          color: #ffffff;
          background: #0f172a;
        }

        .admin-v2-nav-item i {
          font-size: 18px;
          width: 20px;
          text-align: center;
          flex-shrink: 0;
        }

        .admin-v2-sidebar.closed .admin-v2-nav-item span {
          opacity: 0;
          width: 0;
          overflow: hidden;
        }

        /* User Profile */
        .admin-v2-user {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 20px;
          border-top: 1px solid #f1f5f9;
        }

        .admin-v2-user-avatar {
          width: 36px;
          height: 36px;
          background: #f1f5f9;
          color: #0f172a;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 14px;
          flex-shrink: 0;
        }

        .admin-v2-user-info {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .admin-v2-user-name {
          font-size: 13px;
          font-weight: 600;
          color: #0f172a;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .admin-v2-user-email {
          font-size: 11px;
          color: #64748b;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .admin-v2-sidebar.closed .admin-v2-user-info {
          display: none;
        }

        .admin-v2-logout {
          width: 32px;
          height: 32px;
          border: none;
          background: transparent;
          color: #64748b;
          border-radius: 6px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.15s;
          flex-shrink: 0;
        }

        .admin-v2-logout:hover {
          background: #fee2e2;
          color: #dc2626;
        }

        /* ==========================================
           MAIN CONTENT
           ========================================== */
        
        .admin-v2-main {
          flex: 1;
          margin-left: 280px;
          transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        .admin-v2-sidebar.closed ~ .admin-v2-main {
          margin-left: 80px;
        }

        @media (max-width: 1023px) {
          .admin-v2-main {
            margin-left: 0 !important;
          }
        }

        /* Header */
        .admin-v2-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 32px;
          background: #ffffff;
          border-bottom: 1px solid #e2e8f0;
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .admin-v2-header-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .admin-v2-menu-btn {
          width: 36px;
          height: 36px;
          border: 1px solid #e2e8f0;
          background: #ffffff;
          color: #64748b;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.15s;
          font-size: 16px;
        }

        .admin-v2-menu-btn:hover {
          background: #f8fafc;
          color: #0f172a;
          border-color: #cbd5e1;
        }

        .admin-v2-page-title {
          font-size: 20px;
          font-weight: 700;
          color: #0f172a;
          margin: 0;
        }

        @media (max-width: 768px) {
          .admin-v2-page-title {
            font-size: 18px;
          }
        }

        .admin-v2-header-right {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .admin-v2-date {
          font-size: 13px;
          color: #64748b;
          background: #f8fafc;
          padding: 8px 14px;
          border-radius: 8px;
          font-weight: 500;
        }

        /* Content Area */
        .admin-v2-content {
          padding: 32px;
          flex: 1;
        }

        @media (max-width: 768px) {
          .admin-v2-content {
            padding: 20px;
          }
        }

        @media (max-width: 1023px) {
          .admin-v2-sidebar.mobile {
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}
