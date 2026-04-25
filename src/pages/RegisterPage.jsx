import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, clearError } from '../store/slices/authSlice';
import styles from './AuthPage.module.css';

function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, status, error } = useSelector((state) => state.auth);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');

  useEffect(() => {
    if (user) navigate('/');
    return () => dispatch(clearError());
  }, [user, navigate, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters.');
      return;
    }
    setLocalError('');
    const result = await dispatch(registerUser({ name, email, password }));
    if (registerUser.fulfilled.match(result)) {
      navigate('/login');
    }
  };

  const displayError = localError || error;

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div className={styles.logo}>⬡ ForumKu</div>
          <h1 className={styles.title}>Join ForumKu</h1>
          <p className={styles.subtitle}>Create an account to start the conversation</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {displayError && <div className={styles.error}>{displayError}</div>}

          <div className={styles.field}>
            <label className={styles.label} htmlFor="name">
              Display Name
              <input
                id="name"
                type="text"
                className={styles.input}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                required
              />
            </label>
          </div>

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
              {' '}
              <span className={styles.labelHint}>(min. 6 chars)</span>
              <input
                id="password"
                type="password"
                className={styles.input}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="new-password"
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
                Creating account...
              </span>
            ) : 'Create Account'}
          </button>
        </form>

        <div className={styles.footer}>
          <p>
            Already have an account?
            {' '}
            <Link to="/login" className={styles.link}>Sign in →</Link>
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

export default RegisterPage;
