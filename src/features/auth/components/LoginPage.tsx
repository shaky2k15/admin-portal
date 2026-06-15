import { useState } from 'react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { isAzureADEnabled } from '@/features/auth/config/msalConfig';
import { Shield } from 'lucide-react';
import { Navigate, useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleMockLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await login(username, password);
      navigate('/dashboard');
    } catch {
      setError('Invalid username or password');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-[#0a0e27] via-[#131842] to-[#1a0a2e]">
      {/* Animated background orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-80 w-80 animate-pulse rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-96 w-96 animate-pulse rounded-full bg-purple-500/10 blur-3xl [animation-delay:1s]" />
        <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-indigo-500/8 blur-3xl [animation-delay:2s]" />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Login card */}
      <div className="animate-fade-in relative z-10 mx-4 w-full max-w-md">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl sm:p-10">
          {/* Logo / icon */}
          <div className="mb-8 flex flex-col items-center">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/25">
              <Shield className="h-8 w-8 text-white" />
            </div>

            <h1 className="gradient-text text-3xl font-bold tracking-tight">
              Admin Portal
            </h1>
            <p className="mt-2 text-center text-sm text-slate-400">
              Secure access to your management dashboard
            </p>
          </div>

          {/* Divider */}
          <div className="mb-8 flex items-center gap-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          </div>

          {isAzureADEnabled ? (
            /* ── Azure AD mode ────────────────────────────────────── */
            <>
              <button
                onClick={() => void login()}
                className="group flex w-full items-center justify-center gap-3 rounded-xl bg-[#0078d4] px-6 py-3.5 font-semibold text-white shadow-lg shadow-blue-500/25 transition-all duration-200 hover:bg-[#106ebe] hover:shadow-blue-500/40 active:scale-[0.98]"
              >
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 21 21"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect x="1" y="1" width="9" height="9" fill="#f25022" />
                  <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
                  <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
                  <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
                </svg>
                Sign in with Microsoft
              </button>

              <p className="mt-6 text-center text-xs text-slate-500">
                Protected by Azure Active Directory
              </p>
            </>
          ) : (
            /* ── Mock / dev mode ──────────────────────────────────── */
            <form onSubmit={(e) => void handleMockLogin(e)} className="space-y-4">
              <div>
                <label
                  htmlFor="username"
                  className="mb-1.5 block text-sm font-medium text-slate-300"
                >
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white placeholder:text-slate-500 focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  placeholder="Enter username"
                  autoComplete="username"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-1.5 block text-sm font-medium text-slate-300"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white placeholder:text-slate-500 focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  placeholder="Enter password"
                  autoComplete="current-password"
                />
              </div>

              {error && (
                <p className="rounded-lg bg-red-500/10 px-3 py-2 text-center text-sm font-medium text-red-400">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-blue-500/25 transition-all duration-200 hover:shadow-blue-500/40 active:scale-[0.98] disabled:opacity-60"
              >
                {isSubmitting ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                ) : (
                  'Sign In'
                )}
              </button>

              <p className="text-center text-xs text-slate-500">
                Development mode — Use{' '}
                <span className="font-mono text-slate-400">admin</span> /{' '}
                <span className="font-mono text-slate-400">admin123</span>
              </p>
            </form>
          )}
        </div>

        {/* Subtle glow beneath card */}
        <div className="absolute -bottom-4 left-1/2 h-8 w-3/4 -translate-x-1/2 rounded-full bg-blue-500/20 blur-2xl" />
      </div>
    </div>
  );
}
