import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchThreads } from '../store/slices/threadsSlice';
import ThreadCard from '../components/thread/ThreadCard';
import CategoryFilter from '../components/thread/CategoryFilter';
import LoadingSpinner from '../components/common/LoadingSpinner';
import styles from './HomePage.module.css';

function HomePage() {
  const dispatch = useDispatch();
  const {
    list: threads, users, status, activeCategory,
  } = useSelector((state) => state.threads);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchThreads());
  }, [dispatch]);

  const categories = useMemo(() => {
    const cats = threads.map((t) => t.category).filter(Boolean);
    return [...new Set(cats)];
  }, [threads]);

  const filteredThreads = useMemo(() => {
    if (!activeCategory) return threads;
    return threads.filter((t) => t.category === activeCategory);
  }, [threads, activeCategory]);

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Where Ideas
            <br />
            <em>Connect</em>
          </h1>
          <p className={styles.heroSub}>
            Join the conversation — explore threads, share knowledge, and engage with the community.
          </p>
          {!user && (
            <div className={styles.heroCta}>
              <Link to="/register" className={styles.ctaBtn}>Get Started</Link>
              <Link to="/login" className={styles.ctaLink}>Already have an account →</Link>
            </div>
          )}
          {user && (
            <Link to="/create" className={styles.ctaBtn}>+ Create Thread</Link>
          )}
        </div>
        <div className={styles.heroDecor} />
      </div>

      <div className={styles.container}>
        <div className={styles.toolbar}>
          <div className={styles.toolbarLeft}>
            <h2 className={styles.sectionTitle}>
              {activeCategory ? `#${activeCategory}` : 'All Threads'}
              <span className={styles.count}>{filteredThreads.length}</span>
            </h2>
          </div>
          {categories.length > 0 && (
            <CategoryFilter categories={categories} />
          )}
        </div>

        {status === 'loading' && <LoadingSpinner fullPage />}

        {status === 'failed' && (
          <div className={styles.error}>
            <span>⚠</span>
            {' '}
            Failed to load threads. Please try again.
          </div>
        )}

        {status === 'succeeded' && filteredThreads.length === 0 && (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>🧵</div>
            <p>
              No threads found
              {activeCategory ? ` in #${activeCategory}` : ''}
              .
            </p>
            {user && <Link to="/create" className={styles.ctaBtn}>Be the first to post</Link>}
          </div>
        )}

        <div className={styles.threadList}>
          {filteredThreads.map((thread, idx) => (
            <div
              key={thread.id}
              style={{ animationDelay: `${idx * 0.05}s` }}
            >
              <ThreadCard
                thread={thread}
                owner={users[thread.ownerId]}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HomePage;
