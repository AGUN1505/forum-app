import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import styles from './Navbar.module.css';

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        <Link to="/" className={styles.logo}>
          <span className={styles.logoIcon}>⬡</span>
          <span className={styles.logoText}>
            Forum
            <em>Ku</em>
          </span>
        </Link>

        <div className={styles.links}>
          <Link to="/" className={`${styles.link} ${isActive('/') ? styles.active : ''}`}>
            Threads
          </Link>
          <Link to="/leaderboard" className={`${styles.link} ${isActive('/leaderboard') ? styles.active : ''}`}>
            Leaderboard
          </Link>
        </div>

        <div className={styles.actions}>
          {user ? (
            <>
              <Link to="/create" className={styles.createBtn}>
                <span>+</span>
                {' '}
                New Thread
              </Link>
              <div className={styles.userInfo}>
                <img src={user.avatar} alt={user.name} className={styles.avatar} />
                <span className={styles.userName}>{user.name}</span>
              </div>
              <button type="button" onClick={handleLogout} className={styles.logoutBtn}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={styles.loginBtn}>Login</Link>
              <Link to="/register" className={styles.registerBtn}>Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
