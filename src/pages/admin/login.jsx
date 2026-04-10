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
                <label className="form-label" htmlFor="password">Password</label>
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
          :root {
            --stripe-bg: #f6f9fc;
            --stripe-white: #ffffff;
            --stripe-border: #e3e8ee;
            --stripe-text-primary: #0a2540;
            --stripe-text-secondary: #425466;
            --stripe-text-tertiary: #8898aa;
            --stripe-primary: #635bff;
            --stripe-primary-hover: #7a73ff;
            --stripe-primary-subtle: rgba(99, 91, 255, 0.1);
            --stripe-danger: #ff4f4f;
            --stripe-danger-bg: rgba(255, 79, 79, 0.1);
            --stripe-danger-text: #dc2626;
            --stripe-radius: 8px;
            --stripe-radius-lg: 12px;
          }
          .login-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: var(--stripe-bg); padding: 20px; }
          .login-container { width: 100%; max-width: 400px; }
          .login-logo { text-align: center; margin-bottom: 24px; color: var(--stripe-primary); }
          .login-content { background: var(--stripe-white); border: 1px solid var(--stripe-border); border-radius: var(--stripe-radius-lg); padding: 32px; box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04); }
          .login-title { margin: 0 0 8px; font-size: 22px; font-weight: 700; color: var(--stripe-text-primary); letter-spacing: -0.02em; }
          .login-subtitle { margin: 0 0 24px; font-size: 14px; color: var(--stripe-text-secondary); }
          .form-group { margin-bottom: 20px; }
          .form-label { display: block; margin-bottom: 6px; font-size: 13px; font-weight: 600; color: var(--stripe-text-secondary); }
          .form-input { width: 100%; padding: 10px 14px; background: #fff; border: 1px solid var(--stripe-border); border-radius: var(--stripe-radius); color: var(--stripe-text-primary); font-size: 14px; transition: all 0.1s; }
          .form-input:focus { outline: none; border-color: var(--stripe-primary); box-shadow: 0 0 0 3px var(--stripe-primary-subtle); }
          .btn { display: inline-flex; align-items: center; gap: 8px; padding: 9px 16px; border-radius: var(--stripe-radius); font-size: 14px; font-weight: 600; text-decoration: none; border: none; cursor: pointer; transition: all 0.1s; }
          .btn-primary { background: var(--stripe-primary); color: white; box-shadow: 0 1px 2px rgba(99, 91, 255, 0.2); }
          .btn-primary:hover { background: var(--stripe-primary-hover); }
          .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
          .btn-block { width: 100%; justify-content: center; padding: 12px 16px; }
          .alert { display: flex; align-items: flex-start; gap: 12px; padding: 14px 16px; border-radius: var(--stripe-radius); font-size: 14px; margin-bottom: 20px; }
          .alert-error { background: var(--stripe-danger-bg); color: var(--stripe-danger-text); border: 1px solid rgba(255, 79, 79, 0.2); }
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
      </div>
    </>
  );
}
