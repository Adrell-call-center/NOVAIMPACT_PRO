import { useState, useEffect } from 'react';
import Head from 'next/head';
import AdminLayout from '@/components/admin/AdminLayout';
import '@/styles/admin-stripe.css';

export default function AdminSettings() {
  const [settings, setSettings] = useState({ siteName: '', siteUrl: '', siteDesc: '' });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSettings({ siteName: 'Nova Impact', siteUrl: 'https://novaimpact.io', siteDesc: 'Digital Agency' });
  }, []);

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 3000); };

  return (
    <>
      <Head><title>Settings — Nova Impact</title></Head>
      <AdminLayout title="Settings">
        <div className="stripe-page">
          <div className="stripe-page-header">
            <div>
              <h1 className="stripe-page-title">Settings</h1>
              <p className="stripe-page-subtitle">Configure your application preferences</p>
            </div>
          </div>

          {saved && (
            <div className="alert alert-success">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              <span>Settings saved successfully</span>
            </div>
          )}

          <div className="content-grid content-grid-full">
            {/* General Settings */}
            <div className="stripe-card">
              <div className="stripe-card-header">
                <h3 className="stripe-card-title">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                  General
                </h3>
              </div>
              <div className="stripe-card-body">
                <div className="form-group">
                  <label className="form-label">Site Name</label>
                  <input className="form-input" value={settings.siteName} onChange={e => setSettings({ ...settings, siteName: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Site URL</label>
                  <input className="form-input" value={settings.siteUrl} onChange={e => setSettings({ ...settings, siteUrl: e.target.value })} />
                  <p className="form-hint">The primary URL of your website</p>
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea className="form-textarea" rows={3} value={settings.siteDesc} onChange={e => setSettings({ ...settings, siteDesc: e.target.value })} />
                </div>
                <button className="btn btn-primary" onClick={handleSave}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                  Save Changes
                </button>
              </div>
            </div>

            {/* Quick Links */}
            <div className="stripe-card">
              <div className="stripe-card-header">
                <h3 className="stripe-card-title">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                  Quick Links
                </h3>
              </div>
              <div className="stripe-card-body">
                <div className="settings-links">
                  <a href="/admin/posts" className="settings-link">
                    <div className="settings-link-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></div>
                    <div className="settings-link-content"><span className="settings-link-title">Manage Posts</span><span className="settings-link-desc">Create, edit, and delete blog posts</span></div>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="settings-link-arrow"><path d="M9 18l6-6-6-6"/></svg>
                  </a>
                  <a href="/admin/uploads" className="settings-link">
                    <div className="settings-link-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg></div>
                    <div className="settings-link-content"><span className="settings-link-title">Media Library</span><span className="settings-link-desc">Upload and manage images and files</span></div>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="settings-link-arrow"><path d="M9 18l6-6-6-6"/></svg>
                  </a>
                  <a href="/admin/contacts" className="settings-link">
                    <div className="settings-link-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg></div>
                    <div className="settings-link-content"><span className="settings-link-title">Messages</span><span className="settings-link-desc">View contact form submissions</span></div>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="settings-link-arrow"><path d="M9 18l6-6-6-6"/></svg>
                  </a>
                  <a href="/admin/newsletter" className="settings-link">
                    <div className="settings-link-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg></div>
                    <div className="settings-link-content"><span className="settings-link-title">Newsletter</span><span className="settings-link-desc">Manage email subscribers and campaigns</span></div>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="settings-link-arrow"><path d="M9 18l6-6-6-6"/></svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <style jsx global>{`
          .settings-links { display: flex; flex-direction: column; }
          .settings-link { display: flex; align-items: center; gap: 14px; padding: 16px; border: 1px solid var(--border); border-radius: var(--radius); text-decoration: none; color: inherit; transition: all 0.1s; margin-bottom: 12px; }
          .settings-link:last-child { margin-bottom: 0; }
          .settings-link:hover { border-color: var(--primary); background: var(--primary-subtle); }
          .settings-link-icon { width: 40px; height: 40px; background: var(--bg-primary); border-radius: var(--radius); display: flex; align-items: center; justify-content: center; color: var(--text-secondary); flex-shrink: 0; }
          .settings-link-content { flex: 1; }
          .settings-link-title { display: block; font-size: 14px; font-weight: 600; color: var(--text-primary); margin-bottom: 2px; }
          .settings-link-desc { font-size: 13px; color: var(--text-tertiary); }
          .settings-link-arrow { color: var(--text-tertiary); transition: transform 0.1s; }
          .settings-link:hover .settings-link-arrow { transform: translateX(4px); color: var(--primary); }
        `}</style>
      </AdminLayout>
    </>
  );
}

export async function getServerSideProps(ctx) {
  const { getServerSession } = await import("next-auth/next");
  const { authOptions } = await import("@/lib/auth");
  const session = await getServerSession(ctx.req, ctx.res, authOptions);
  if (!session) return { redirect: { destination: '/admin/login', permanent: false } };
  return { props: {} };
}
