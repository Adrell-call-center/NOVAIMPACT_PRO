import { useState } from 'react';
import { signIn } from 'next-auth/react';
import Head from 'next/head';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError('Invalid email or password. Please try again.');
        setLoading(false);
      } else {
        window.location.href = '/admin';
      }
    } catch (err) {
      setError('Login failed. Please check your connection and try again.');
      setLoading(false);
    }
  };

  return (
    <>
      <Head><title>Login — Nova Impact Admin</title></Head>
      <div className="admin-login-page">
        <div className="admin-login-card">
          <div className="admin-login-header">
            <div className="admin-login-logo">
              <i className="fa-solid fa-bolt"></i>
            </div>
            <h2>Nova Impact</h2>
            <p className="text-muted">Admin Panel</p>
          </div>
          {error && <div className="admin-alert-error">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email Address</label>
              <div className="input-icon-group">
                <i className="fa-solid fa-envelope"></i>
                <input type="email" className="admin-input" value={email} onChange={e => setEmail(e.target.value)} required placeholder="admin@novaimpact.fr" />
              </div>
            </div>
            <div className="form-group">
              <label>Password</label>
              <div className="input-icon-group">
                <i className="fa-solid fa-lock"></i>
                <input type="password" className="admin-input" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" />
              </div>
            </div>
            <button type="submit" className="btn-primary w-100 py-3" disabled={loading}>
              {loading ? <><span className="spinner me-2"></span>Signing in...</> : 'Sign In'}
            </button>
          </form>
        </div>
      </div>

      <style jsx global>{`
        .admin-login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          padding: 20px;
        }

        .admin-login-card {
          background: #ffffff;
          border-radius: 20px;
          padding: 48px 40px;
          width: 100%;
          max-width: 440px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.1);
          border: 1px solid #e8e8e8;
        }

        .admin-login-header {
          text-align: center;
          margin-bottom: 36px;
        }

        .admin-login-logo {
          width: 64px;
          height: 64px;
          background: linear-gradient(135deg, #1a1a1a, #333333);
          color: #1a1d21;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          margin: 0 auto 20px;
          box-shadow: 0 8px 20px rgba(255,200,26,0.3);
        }

        .admin-login-header h2 {
          margin: 0 0 4px 0;
          font-size: 26px;
          font-weight: 700;
          color: #1a1d21;
        }

        .admin-login-header p {
          margin: 0;
          font-size: 14px;
          color: #6c757d;
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

        .input-icon-group {
          position: relative;
        }

        .input-icon-group i {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #6c757d;
          font-size: 14px;
        }

        .input-icon-group .admin-input {
          padding-left: 42px;
        }

        .admin-input {
          width: 100%;
          padding: 14px 16px;
          background: #ffffff;
          border: 1px solid #e8e8e8;
          border-radius: 10px;
          color: #1a1d21;
          font-size: 14px;
          transition: all 0.2s;
        }

        .admin-input:focus {
          outline: none;
          border-color: #1a1a1a;
          box-shadow: 0 0 0 3px rgba(255,200,26,0.15);
        }

        .admin-input::placeholder {
          color: #adb5bd;
        }

        .btn-primary {
          background: #1a1a1a;
          color: #1a1d21;
          border: none;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.2s;
        }

        .btn-primary:hover {
          background: #333333;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(255,200,26,0.3);
        }

        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .py-3 {
          padding-top: 14px;
          padding-bottom: 14px;
        }

        .w-100 {
          width: 100%;
        }

        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(26,29,33,0.3);
          border-top-color: #1a1d21;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .admin-alert-error {
          background: rgba(220, 53, 69, 0.1);
          color: #dc3545;
          padding: 12px 16px;
          border-radius: 8px;
          margin-bottom: 20px;
          font-size: 14px;
          border: 1px solid rgba(220, 53, 69, 0.2);
        }

        .text-muted {
          color: #6c757d;
        }
      `}</style>
    </>
  );
}

export async function getServerSideProps(ctx) {
  const { getServerSession } = await import("next-auth/next");
  const { authOptions } = await import("@/lib/auth");
  const session = await getServerSession(ctx.req, ctx.res, authOptions);

  if (session) return { redirect: { destination: '/admin', permanent: false } };
  return { props: {} };
}
