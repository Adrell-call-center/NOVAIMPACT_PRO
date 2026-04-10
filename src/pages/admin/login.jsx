import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await signIn('credentials', { redirect: false, email, password });

    if (result?.error) {
      setError('Invalid email or password');
    } else {
      router.push('/admin');
    }
    setLoading(false);
  };

  return (
    <>
      <Head><title>Sign In — Nova Impact</title></Head>
      <div className="login-page">
        <div className="login-container">
          {/* Logo */}
          <div className="login-logo">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="currentColor"/>
            </svg>
          </div>

          <div className="login-content">
            <h1 className="login-title">Sign in to your account</h1>
            <p className="login-subtitle">Enter your credentials to access the admin panel</p>

            {error && (
              <div className="alert alert-error">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="email">Email</label>
                <input className="form-input" id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@novaimpact.io" required autoComplete="email" />
              </div>

              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <label className="form-label" htmlFor="password" style={{ marginBottom: 0 }}>Password</label>
                </div>
                <input className="form-input" id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required autoComplete="current-password" />
              </div>

              <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" style={{ animation: 'spin 1s linear infinite' }}><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" strokeDasharray="31.4 31.4" strokeLinecap="round"/></svg>
                    Signing in...
                  </span>
                ) : 'Sign in'}
              </button>
            </form>
          </div>
        </div>

        <style jsx global>{`
          .login-page {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: var(--bg-primary);
            padding: 20px;
          }
          .login-container {
            width: 100%;
            max-width: 400px;
          }
          .login-logo {
            text-align: center;
            margin-bottom: 24px;
            color: var(--primary);
          }
          .login-content {
            background: var(--bg-white);
            border: 1px solid var(--border);
            border-radius: var(--radius-lg);
            padding: 32px;
            box-shadow: var(--shadow-sm);
          }
          .login-title {
            margin: 0 0 8px;
            font-size: 22px;
            font-weight: 700;
            color: var(--text-primary);
            letter-spacing: -0.02em;
          }
          .login-subtitle {
            margin: 0 0 24px;
            font-size: 14px;
            color: var(--text-secondary);
          }
          .btn-block {
            width: 100%;
            justify-content: center;
            padding: 12px 16px;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </>
  );
}
