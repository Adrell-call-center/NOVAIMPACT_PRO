import { useState } from 'react';
import Head from 'next/head';
import AdminLayout from '@/components/admin/AdminLayout';

export default function AdminSettings() {
  const [saved, setSaved] = useState(false);

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

          <div className="content-grid">
            <div className="stripe-card">
              <div className="stripe-card-header">
                <h3 className="stripe-card-title"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>General</h3>
              </div>
              <div className="stripe-card-body">
                <div className="form-group">
                  <label className="form-label">Site Name</label>
                  <input className="form-input" defaultValue="Nova Impact" />
                </div>
                <div className="form-group">
                  <label className="form-label">Site URL</label>
                  <input className="form-input form-input-mono" defaultValue="https://novaimpact.io" />
                  <p className="form-hint">The primary URL of your website</p>
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea className="form-textarea" rows={3} defaultValue="Digital Agency" />
                </div>
                <button className="btn btn-primary" onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 3000); }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                  Save Changes
                </button>
              </div>
            </div>

            <div className="stripe-card">
              <div className="stripe-card-header">
                <h3 className="stripe-card-title"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>Quick Links</h3>
              </div>
              <div className="stripe-card-body">
                <div className="settings-links">
                  {[
                    { href: '/admin/posts', icon: 'fa-solid fa-file-lines', title: 'Manage Posts', desc: 'Create, edit, and delete blog posts' },
                    { href: '/admin/uploads', icon: 'fa-solid fa-image', title: 'Media Library', desc: 'Upload and manage images and files' },
                    { href: '/admin/contacts', icon: 'fa-solid fa-inbox', title: 'Messages', desc: 'View contact form submissions' },
                    { href: '/admin/newsletter', icon: 'fa-solid fa-paper-plane', title: 'Newsletter', desc: 'Manage email subscribers' },
                  ].map(link => (
                    <a href={link.href} key={link.href} className="settings-link">
                      <div className="settings-link-icon"><i className={link.icon}></i></div>
                      <div className="settings-link-content"><span className="settings-link-title">{link.title}</span><span className="settings-link-desc">{link.desc}</span></div>
                      <i className="fa-solid fa-chevron-right settings-link-arrow"></i>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <style jsx global>{`
          .stripe-page { max-width: 1280px; }
          .stripe-page-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 32px; }
          .stripe-page-title { margin: 0 0 6px; font-size: 24px; font-weight: 700; color: var(--stripe-text-primary); letter-spacing: -0.02em; }
          .stripe-page-subtitle { margin: 0; font-size: 15px; color: var(--stripe-text-secondary); }
          .content-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
          .stripe-card { background: #fff; border: 1px solid var(--stripe-border); border-radius: var(--stripe-radius-lg); overflow: hidden; }
          .stripe-card-header { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-bottom: 1px solid var(--stripe-border); }
          .stripe-card-title { margin: 0; font-size: 14px; font-weight: 600; color: var(--stripe-text-primary); display: flex; align-items: center; gap: 8px; }
          .stripe-card-title svg { width: 16px; height: 16px; color: var(--stripe-text-tertiary); }
          .stripe-card-body { padding: 20px; }
          .form-group { margin-bottom: 20px; }
          .form-label { display: block; margin-bottom: 6px; font-size: 13px; font-weight: 600; color: var(--stripe-text-secondary); }
          .form-input { width: 100%; padding: 10px 14px; background: #fff; border: 1px solid var(--stripe-border); border-radius: var(--stripe-radius); color: var(--stripe-text-primary); font-size: 14px; transition: all 0.1s; }
          .form-input:focus { outline: none; border-color: var(--stripe-primary); box-shadow: 0 0 0 3px var(--stripe-primary-subtle); }
          .form-textarea { width: 100%; padding: 10px 14px; background: #fff; border: 1px solid var(--stripe-border); border-radius: var(--stripe-radius); color: var(--stripe-text-primary); font-size: 14px; font-family: inherit; resize: vertical; line-height: 1.6; min-height: 80px; }
          .form-textarea:focus { outline: none; border-color: var(--stripe-primary); box-shadow: 0 0 0 3px var(--stripe-primary-subtle); }
          .form-hint { font-size: 12px; color: var(--stripe-text-tertiary); margin-top: 4px; }
          .form-input-mono { font-family: 'SF Mono', 'Monaco', 'Consolas', monospace; font-size: 13px; }
          .alert { display: flex; align-items: flex-start; gap: 12px; padding: 14px 16px; border-radius: var(--stripe-radius); font-size: 14px; margin-bottom: 20px; }
          .alert-success { background: var(--stripe-success-bg); color: var(--stripe-success-text); border: 1px solid rgba(62, 207, 142, 0.2); }
          .btn { display: inline-flex; align-items: center; gap: 8px; padding: 9px 16px; border-radius: var(--stripe-radius); font-size: 14px; font-weight: 600; text-decoration: none; border: none; cursor: pointer; transition: all 0.1s; }
          .btn-primary { background: var(--stripe-primary); color: white; box-shadow: 0 1px 2px rgba(99, 91, 255, 0.2); }
          .btn-primary:hover { background: var(--stripe-primary-hover); }
          .settings-links { display: flex; flex-direction: column; gap: 12px; }
          .settings-link { display: flex; align-items: center; gap: 14px; padding: 16px; border: 1px solid var(--stripe-border); border-radius: var(--stripe-radius); text-decoration: none; color: inherit; transition: all 0.1s; }
          .settings-link:hover { border-color: var(--stripe-primary); background: var(--stripe-primary-subtle); }
          .settings-link-icon { width: 40px; height: 40px; background: var(--stripe-bg); border-radius: var(--stripe-radius); display: flex; align-items: center; justify-content: center; color: var(--stripe-text-secondary); font-size: 16px; flex-shrink: 0; }
          .settings-link-content { flex: 1; }
          .settings-link-title { display: block; font-size: 14px; font-weight: 600; color: var(--stripe-text-primary); margin-bottom: 2px; }
          .settings-link-desc { font-size: 13px; color: var(--stripe-text-tertiary); }
          .settings-link-arrow { color: var(--stripe-text-tertiary); transition: transform 0.1s; font-size: 12px; }
          .settings-link:hover .settings-link-arrow { transform: translateX(4px); color: var(--stripe-primary); }
          @media (max-width: 1023px) { .content-grid { grid-template-columns: 1fr; } }
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
