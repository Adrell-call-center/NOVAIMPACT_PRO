import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { signOut } from 'next-auth/react';

const navItems = [
  { href: '/admin', label: 'Overview', icon: 'fa-solid fa-house' },
  { href: '/admin/posts', label: 'Posts', icon: 'fa-solid fa-file-lines' },
  { href: '/admin/uploads', label: 'Media', icon: 'fa-solid fa-photo-film' },
  { href: '/admin/contacts', label: 'Messages', icon: 'fa-solid fa-inbox' },
  { href: '/admin/newsletter', label: 'Newsletter', icon: 'fa-solid fa-paper-plane' },
  { href: '/admin/settings', label: 'Settings', icon: 'fa-solid fa-gear' },
];

export default function AdminLayout({ children, title = 'Overview' }) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      setSidebarOpen(!mobile);
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
    <div className="stripe-layout">
      {isMobile && sidebarOpen && (
        <div className="stripe-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`stripe-sidebar ${!sidebarOpen ? 'collapsed' : ''} ${isMobile && !sidebarOpen ? 'mobile-hidden' : ''}`}>
        <div className="stripe-sidebar-header">
          <Link href="/admin" className="stripe-logo">
            <div className="stripe-logo-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="currentColor"/>
              </svg>
            </div>
            <span className="stripe-logo-text">Nova Impact</span>
          </Link>
        </div>

        <nav className="stripe-nav">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`stripe-nav-item ${isActive(item.href) ? 'active' : ''}`}
            >
              <i className={item.icon}></i>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="stripe-sidebar-footer">
          <button className="stripe-user" onClick={handleLogout}>
            <div className="stripe-user-avatar">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21v-2a4 4 0 0 1 4-4h2a4 4 0 0 1 4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <div className="stripe-user-info">
              <span className="stripe-user-name">Admin</span>
              <span className="stripe-user-email">admin@novaimpact.io</span>
            </div>
            <i className="fa-solid fa-right-from-bracket stripe-user-logout"></i>
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="stripe-main">
        <header className="stripe-header">
          <div className="stripe-header-left">
            <button className="stripe-menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <i className="fa-solid fa-bars"></i>
            </button>
            <div className="stripe-breadcrumb">
              <span className="stripe-breadcrumb-home">Dashboard</span>
              <span className="stripe-breadcrumb-sep">/</span>
              <span className="stripe-breadcrumb-current">{title}</span>
            </div>
          </div>
          <div className="stripe-header-right">
            <span className="stripe-header-date">
              {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
        </header>

        <main className="stripe-content">
          {children}
        </main>
      </div>

      <style jsx global>{`
        /* ==========================================
           STRIPE-QUALITY ADMIN DESIGN SYSTEM
           Inspired by Stripe Dashboard
           ========================================== */
        
        :root {
          --stripe-bg: #f6f9fc;
          --stripe-white: #ffffff;
          --stripe-border: #e3e8ee;
          --stripe-text-primary: #0a2540;
          --stripe-text-secondary: #425466;
          --stripe-text-tertiary: #8898aa;
          --stripe-primary: #635bff;
          --stripe-primary-hover: #7a73ff;
          --stripe-success: #3ecf8e;
          --stripe-warning: #ff991f;
          --stripe-danger: #ff4f4f;
          --stripe-info: #00d4ff;
          --stripe-sidebar-width: 260px;
          --stripe-sidebar-collapsed: 72px;
        }

        .stripe-layout {
          display: flex;
          min-height: 100vh;
          background: var(--stripe-bg);
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
          color: var(--stripe-text-primary);
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        .stripe-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.3);
          z-index: 999;
        }

        /* ==========================================
           SIDEBAR
           ========================================== */
        
        .stripe-sidebar {
          width: var(--stripe-sidebar-width);
          background: var(--stripe-white);
          border-right: 1px solid var(--stripe-border);
          display: flex;
          flex-direction: column;
          transition: width 0.2s cubic-bezier(0.2, 0, 0, 1);
          position: fixed;
          top: 0;
          left: 0;
          bottom: 0;
          z-index: 1000;
        }

        .stripe-sidebar.collapsed {
          width: var(--stripe-sidebar-collapsed);
        }

        .stripe-sidebar.mobile-hidden {
          transform: translateX(-100%);
        }

        .stripe-sidebar-header {
          padding: 20px;
          border-bottom: 1px solid var(--stripe-border);
        }

        .stripe-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
          color: var(--stripe-text-primary);
        }

        .stripe-logo-icon {
          width: 32px;
          height: 32px;
          background: var(--stripe-primary);
          color: white;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .stripe-logo-text {
          font-size: 15px;
          font-weight: 700;
          letter-spacing: -0.01em;
          transition: opacity 0.15s;
        }

        .stripe-sidebar.collapsed .stripe-logo-text {
          opacity: 0;
          width: 0;
          overflow: hidden;
        }

        .stripe-nav {
          flex: 1;
          padding: 16px 12px;
          overflow-y: auto;
        }

        .stripe-nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          color: var(--stripe-text-secondary);
          text-decoration: none;
          border-radius: 6px;
          margin-bottom: 2px;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.1s;
          white-space: nowrap;
        }

        .stripe-nav-item:hover {
          background: var(--stripe-bg);
          color: var(--stripe-text-primary);
        }

        .stripe-nav-item.active {
          background: var(--stripe-bg);
          color: var(--stripe-primary);
          font-weight: 600;
        }

        .stripe-nav-item i {
          width: 20px;
          text-align: center;
          font-size: 16px;
          flex-shrink: 0;
        }

        .stripe-sidebar.collapsed .stripe-nav-item span {
          opacity: 0;
          width: 0;
          overflow: hidden;
        }

        .stripe-sidebar-footer {
          padding: 16px 12px;
          border-top: 1px solid var(--stripe-border);
        }

        .stripe-user {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 12px;
          width: 100%;
          background: none;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          transition: background 0.1s;
          text-align: left;
        }

        .stripe-user:hover {
          background: var(--stripe-bg);
        }

        .stripe-user-avatar {
          width: 28px;
          height: 28px;
          border-radius: 6px;
          background: var(--stripe-bg);
          border: 1px solid var(--stripe-border);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--stripe-text-secondary);
          flex-shrink: 0;
        }

        .stripe-user-info {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .stripe-user-name {
          font-size: 13px;
          font-weight: 600;
          color: var(--stripe-text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .stripe-user-email {
          font-size: 11px;
          color: var(--stripe-text-tertiary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .stripe-sidebar.collapsed .stripe-user-info,
        .stripe-sidebar.collapsed .stripe-user-logout {
          display: none;
        }

        .stripe-user-logout {
          color: var(--stripe-text-tertiary);
          font-size: 14px;
        }

        /* ==========================================
           MAIN CONTENT
           ========================================== */
        
        .stripe-main {
          flex: 1;
          margin-left: var(--stripe-sidebar-width);
          transition: margin-left 0.2s cubic-bezier(0.2, 0, 0, 1);
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        .stripe-sidebar.collapsed ~ .stripe-main {
          margin-left: var(--stripe-sidebar-collapsed);
        }

        @media (max-width: 1023px) {
          .stripe-main {
            margin-left: 0 !important;
          }
        }

        .stripe-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 32px;
          background: var(--stripe-white);
          border-bottom: 1px solid var(--stripe-border);
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .stripe-header-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .stripe-menu-btn {
          width: 32px;
          height: 32px;
          border: none;
          background: none;
          color: var(--stripe-text-secondary);
          border-radius: 6px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.1s;
          font-size: 16px;
        }

        .stripe-menu-btn:hover {
          background: var(--stripe-bg);
          color: var(--stripe-text-primary);
        }

        .stripe-breadcrumb {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
        }

        .stripe-breadcrumb-home {
          color: var(--stripe-text-tertiary);
        }

        .stripe-breadcrumb-sep {
          color: var(--stripe-border);
        }

        .stripe-breadcrumb-current {
          color: var(--stripe-text-primary);
          font-weight: 600;
        }

        .stripe-header-right {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .stripe-header-date {
          font-size: 13px;
          color: var(--stripe-text-tertiary);
          font-weight: 500;
        }

        .stripe-content {
          padding: 32px;
          flex: 1;
        }

        @media (max-width: 768px) {
          .stripe-header {
            padding: 16px 20px;
          }
          .stripe-content {
            padding: 20px;
          }
          .stripe-breadcrumb {
            display: none;
          }
        }

        @media (max-width: 1023px) {
          .stripe-sidebar.mobile-hidden {
            transform: translateX(-100%);
          }
        }

        /* ==========================================
           GLOBAL UTILITIES
           ========================================== */
        
        * {
          box-sizing: border-box;
        }

        /* Smooth scrollbar */
        ::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }

        ::-webkit-scrollbar-track {
          background: transparent;
        }

        ::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 3px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }

        /* Selection */
        ::selection {
          background: rgba(99, 91, 255, 0.1);
          color: var(--stripe-primary);
        }
      `}</style>
    </div>
  );
}
