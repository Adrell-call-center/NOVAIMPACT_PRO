import Head from 'next/head';
import AdminLayout from '@/components/admin/AdminLayout';

export default function AdminSettings() {
  return (
    <>
      <Head><title>Settings — Nova Impact Admin</title></Head>
      <AdminLayout title="Settings">
        <div className="row g-4">
          <div className="col-lg-8">
            <div className="admin-light-card admin-settings-card">
              <h3 className="admin-section-title"><i className="fa-solid fa-globe me-2" style={{ color: '#FFC81A' }}></i>Site Configuration</h3>
              <p className="admin-section-desc">Configure your site name, logo URL, and default OG image. These values are used in auto-generated Schema.org JSON-LD and Open Graph tags.</p>
              <div className="form-group">
                <label>Organization Name</label>
                <input className="admin-input" defaultValue="Nova Impact" />
              </div>
              <div className="form-group">
                <label>Logo URL</label>
                <input className="admin-input" defaultValue="/assets/imgs/logo/site-logo-white-2.png" />
              </div>
              <div className="form-group">
                <label>Default OG Image</label>
                <input className="admin-input" placeholder="/uploads/default-og.jpg" />
              </div>
              <button className="btn-gold">Save Settings</button>
              <p className="admin-note">Note: Settings persistence requires a SiteSettings model. For now, update these values directly in your Schema builder component.</p>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="admin-light-card admin-settings-card">
              <h3 className="admin-section-title"><i className="fa-solid fa-user me-2" style={{ color: '#6f42c1' }}></i>Admin Account</h3>
              <div className="admin-admin-info">
                <div className="admin-admin-avatar">A</div>
                <div>
                  <strong>Admin</strong>
                  <p className="admin-admin-email">admin@novaimpact.fr</p>
                </div>
              </div>
            </div>
            <div className="admin-light-card admin-settings-card mt-4">
              <h3 className="admin-section-title"><i className="fa-solid fa-server me-2" style={{ color: '#20c997' }}></i>System Info</h3>
              <ul className="admin-system-info">
                <li><span>Version</span><strong>1.0.0</strong></li>
                <li><span>Database</span><strong>PostgreSQL</strong></li>
                <li><span>Framework</span><strong>Next.js 13</strong></li>
                <li><span>Node.js</span><strong>v22.x</strong></li>
              </ul>
            </div>
          </div>
        </div>
      </AdminLayout>

      <style jsx global>{`
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

        .admin-settings-card {
          padding: 24px;
          height: 100%;
        }

        .admin-section-title {
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 16px;
          color: #1a1d21;
        }

        .admin-section-desc {
          font-size: 14px;
          color: #6c757d;
          margin-bottom: 24px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-size: 13px;
          font-weight: 500;
          color: #495057;
        }

        .admin-input {
          width: 100%;
          padding: 12px 16px;
          background: #ffffff;
          border: 1px solid #e8e8e8;
          border-radius: 8px;
          color: #1a1d21;
          font-size: 14px;
        }

        .admin-input:focus {
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
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-gold:hover {
          background: #e6b517;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(255,200,26,0.3);
        }

        .admin-note {
          font-size: 12px;
          color: #6c757d;
          margin-top: 16px;
          font-style: italic;
        }

        .admin-admin-info {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px 0;
        }

        .admin-admin-avatar {
          width: 56px;
          height: 56px;
          border-radius: 14px;
          background: linear-gradient(135deg, #FFC81A, #e6b517);
          color: #1a1d21;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 22px;
        }

        .admin-admin-info strong {
          display: block;
          font-size: 16px;
          color: #1a1d21;
        }

        .admin-admin-email {
          margin: 4px 0 0 0;
          font-size: 13px;
          color: #6c757d;
        }

        .admin-system-info {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .admin-system-info li {
          display: flex;
          justify-content: space-between;
          padding: 12px 0;
          border-bottom: 1px solid #f0f0f0;
          font-size: 14px;
        }

        .admin-system-info li:last-child {
          border-bottom: none;
        }

        .admin-system-info li span {
          color: #6c757d;
        }

        .admin-system-info li strong {
          color: #1a1d21;
        }

        .row {
          display: flex;
          flex-wrap: wrap;
          margin: 0 -12px;
        }

        .col-lg-8, .col-lg-4 {
          padding: 0 12px;
          flex: 0 0 auto;
        }

        .col-lg-8 {
          width: 66.666667%;
        }

        .col-lg-4 {
          width: 33.333333%;
        }

        .g-4 {
          gap: 24px;
        }

        .mt-4 {
          margin-top: 24px;
        }

        @media (max-width: 991px) {
          .col-lg-8, .col-lg-4 {
            width: 100%;
          }
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
