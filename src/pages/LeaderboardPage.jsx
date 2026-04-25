import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLeaderboards } from '../store/slices/leaderboardSlice';
import LoadingSpinner from '../components/common/LoadingSpinner';
import styles from './LeaderboardPage.module.css';

const medals = ['🥇', '🥈', '🥉'];

function LeaderboardPage() {
  const dispatch = useDispatch();
  const { list, status } = useSelector((state) => state.leaderboards);

  useEffect(() => {
    dispatch(fetchLeaderboards());
  }, [dispatch]);

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Leaderboard</h1>
          <p className={styles.subtitle}>Top contributors in our community</p>
        </div>

        {status === 'loading' && <LoadingSpinner fullPage />}

        {status === 'succeeded' && (
          <>
            {list.length >= 3 && (
              <div className={styles.podium}>
                <div className={`${styles.podiumItem} ${styles.second}`}>
                  <img
                    src={list[1].user.avatar}
                    alt={list[1].user.name}
                    className={styles.podiumAvatar}
                  />
                  <div className={styles.podiumMedal}>🥈</div>
                  <span className={styles.podiumName}>{list[1].user.name}</span>
                  <span className={styles.podiumScore}>
                    {list[1].score}
                    {' '}
                    pts
                  </span>
                  <div className={styles.podiumBar} style={{ height: '80px' }} />
                </div>
                <div className={`${styles.podiumItem} ${styles.first}`}>
                  <div className={styles.crown}>👑</div>
                  <img
                    src={list[0].user.avatar}
                    alt={list[0].user.name}
                    className={`${styles.podiumAvatar} ${styles.podiumAvatarLarge}`}
                  />
                  <div className={styles.podiumMedal}>🥇</div>
                  <span className={styles.podiumName}>{list[0].user.name}</span>
                  <span className={styles.podiumScore}>
                    {list[0].score}
                    {' '}
                    pts
                  </span>
                  <div className={styles.podiumBar} style={{ height: '120px' }} />
                </div>
                <div className={`${styles.podiumItem} ${styles.third}`}>
                  <img
                    src={list[2].user.avatar}
                    alt={list[2].user.name}
                    className={styles.podiumAvatar}
                  />
                  <div className={styles.podiumMedal}>🥉</div>
                  <span className={styles.podiumName}>{list[2].user.name}</span>
                  <span className={styles.podiumScore}>
                    {list[2].score}
                    {' '}
                    pts
                  </span>
                  <div className={styles.podiumBar} style={{ height: '60px' }} />
                </div>
              </div>
            )}

            <div className={styles.listSection}>
              <h2 className={styles.listTitle}>Full Rankings</h2>
              <div className={styles.list}>
                {list.map((entry, index) => {
                  const maxScore = list[0].score > 0 ? list[0].score : 1;
                  const barWidth = `${(entry.score / maxScore) * 100}%`;
                  return (
                    <div
                      key={entry.user.id}
                      className={`${styles.item} ${index < 3 ? styles.topItem : ''}`}
                      style={{ animationDelay: `${index * 0.04}s` }}
                    >
                      <div className={styles.rank}>
                        {index < 3 ? (
                          <span className={styles.rankMedal}>{medals[index]}</span>
                        ) : (
                          <span className={styles.rankNum}>{index + 1}</span>
                        )}
                      </div>
                      <img
                        src={entry.user.avatar}
                        alt={entry.user.name}
                        className={styles.avatar}
                      />
                      <div className={styles.info}>
                        <span className={styles.name}>{entry.user.name}</span>
                        <span className={styles.email}>{entry.user.email}</span>
                      </div>
                      <div className={styles.scoreWrapper}>
                        <span className={styles.score}>{entry.score}</span>
                        <span className={styles.scoreLabel}>pts</span>
                      </div>
                      <div className={styles.bar} style={{ width: barWidth }} />
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default LeaderboardPage;
