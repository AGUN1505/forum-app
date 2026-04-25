import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError } from '../store/slices/authSlice';
import styles from './AuthPage.module.css';

function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, status, error } = useSelector((state) => state.auth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (user) navigate('/');
    return () => dispatch(clearError());
  }, [user, navigate, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div className={styles.logo}>⬡ ForumKu</div>
          <h1 className={styles.title}>Welcome back</h1>
          <p className={styles.subtitle}>Sign in to continue the conversation</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.field}>
            <label className={styles.label} htmlFor="email">
              Email
              <input
                id="email"
                type="email"
                className={styles.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoComplete="email"
              />
            </label>
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="password">
              Password
              <input
                id="password"
                type="password"
                className={styles.input}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
            </label>
          </div>

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={status === 'loading'}
          >
            {status === 'loading' ? (
              <span className={styles.loadingRow}>
                <span className={styles.spinner} />
                {' '}
                Signing in...
              </span>
            ) : 'Sign In'}
          </button>
        </form>

        <div className={styles.footer}>
          <p>
            Don&apos;t have an account?
            {' '}
            <Link to="/register" className={styles.link}>Create one →</Link>
          </p>
        </div>
      </div>

      <div className={styles.decor}>
        <div className={styles.decorCircle1} />
        <div className={styles.decorCircle2} />
      </div>
    </div>
  );
}

export default LoginPage;
