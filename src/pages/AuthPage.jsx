export default function AuthPage({ app }) {
  const { authView, setAuthView, signIn } = app;
  const isLogin = authView === 'login';

  return (
    <div className="auth-wrap">
      <div className="auth-brand">
        <div
          style={{
            width: 52,
            height: 52,
            background: 'linear-gradient(135deg, rgba(91,108,255,.16), rgba(6,182,212,.14))',
            borderRadius: 16,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 24,
            fontWeight: 800,
            color: 'var(--blue-t)',
            marginBottom: 18,
            border: '1px solid rgba(91,108,255,.14)',
            boxShadow: '0 14px 28px rgba(91,108,255,.12)',
          }}
        >
          ✦
        </div>

        <div className="auth-pill" style={{ marginBottom: 14 }}>Futuristic light workspace</div>

        <h2
          style={{
            fontSize: 30,
            fontWeight: 800,
            color: 'var(--color-text-primary)',
            letterSpacing: '-0.03em',
            lineHeight: 1.15,
            marginBottom: 12,
            whiteSpace: 'pre-line',
          }}
        >
          {isLogin ? 'Your services,\nreimagined beautifully.' : 'Join Booknest.\nRun everything in one view.'}
        </h2>

        <p
          style={{
            fontSize: 13,
            color: 'var(--color-text-secondary)',
            lineHeight: 1.75,
            marginBottom: 26,
            maxWidth: 460,
          }}
        >
          {isLogin
            ? 'A smooth, future-ready booking dashboard for customers and providers — all in one elegant light interface.'
            : 'Create one account to book services, manage your business, and keep every interaction beautifully organized.'}
        </p>

        <div style={{ display: 'grid', gap: 10 }}>
          {[
            ['📅', 'Track every appointment with a polished calendar view'],
            ['🚀', 'Onboard and manage your service from the same account'],
            ['🔔', 'Receive real-time notifications and offers instantly'],
            ['✨', 'Enjoy a clean futuristic light UI across every screen'],
          ].map(([icon, text]) => (
            <div
              key={text}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                color: 'var(--color-text-secondary)',
                background: 'rgba(255,255,255,.54)',
                border: '1px solid rgba(148,163,184,.16)',
                borderRadius: 14,
                padding: '10px 12px',
              }}
            >
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 8,
                  background: 'linear-gradient(135deg, rgba(91,108,255,.14), rgba(6,182,212,.12))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 12,
                  flexShrink: 0,
                }}
              >
                {icon}
              </div>
              <span style={{ fontSize: 12 }}>{text}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="auth-form">
        <div className="auth-card">
          <div className="auth-pill" style={{ marginBottom: 14 }}>
            {isLogin ? 'Sign in to continue' : 'Create your account'}
          </div>

          <h3 style={{ fontSize: 24, fontWeight: 800, marginBottom: 6 }}>
            {isLogin ? 'Welcome back' : 'Create account'}
          </h3>
          <p style={{ fontSize: 12, color: 'var(--color-text-tertiary)', marginBottom: 22 }}>
            {isLogin ? 'Enter your Booknest workspace' : 'Start with the new reusable React + Vite experience'}
          </p>

          {!isLogin ? (
            <div className="ff">
              <label className="fl">Full name</label>
              <input className="inp" placeholder="Rahul Mehta" />
            </div>
          ) : null}

          <div className="ff">
            <label className="fl">Email</label>
            <input className="inp" type="email" defaultValue="rahul@example.com" placeholder="you@example.com" />
          </div>

          <div className="ff">
            <label className="fl">Password</label>
            <input className="inp" type="password" defaultValue="Password123!" placeholder="••••••••" />
          </div>

          <button
            className="btn-p"
            style={{ width: '100%', justifyContent: 'center', padding: 11, fontSize: 13, marginTop: 6, marginBottom: 18 }}
            onClick={signIn}
          >
            {isLogin ? 'Enter workspace →' : 'Create account →'}
          </button>

          <div style={{ height: 1, background: 'rgba(148,163,184,.18)', marginBottom: 16 }} />

          <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--color-text-tertiary)' }}>
            {isLogin ? 'New here?' : 'Already have an account?'}{' '}
            <span
              style={{ color: 'var(--blue-t)', cursor: 'pointer', fontWeight: 700 }}
              onClick={() => setAuthView(isLogin ? 'register' : 'login')}
            >
              {isLogin ? 'Create account' : 'Sign in'}
            </span>
          </p>

          {isLogin ? (
            <div
              style={{
                marginTop: 18,
                padding: 12,
                background: 'linear-gradient(135deg, rgba(91,108,255,.08), rgba(6,182,212,.06))',
                borderRadius: 14,
                border: '1px solid rgba(91,108,255,.12)',
              }}
            >
              <div style={{ fontSize: 10, color: 'var(--color-text-tertiary)', fontWeight: 700, marginBottom: 5 }}>
                DEMO ACCESS
              </div>
              <div style={{ fontSize: 11, color: 'var(--color-text-secondary)', fontFamily: 'monospace' }}>
                rahul@example.com · Password123!
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
