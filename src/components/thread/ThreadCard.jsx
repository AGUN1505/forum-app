import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { formatDistanceToNow } from 'date-fns';
import { voteThread, optimisticVoteThread, setActiveCategory } from '../../store/slices/threadsSlice';
import VoteButton from '../common/VoteButton';
import styles from './ThreadCard.module.css';

function ThreadCard({ thread, owner = null }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const userId = user?.id;

  const upvoted = userId && thread.upVotesBy.includes(userId);
  const downvoted = userId && thread.downVotesBy.includes(userId);

  const handleVote = (voteType) => {
    if (!userId) return;
    const isNeutral = (voteType === 1 && upvoted) || (voteType === -1 && downvoted);
    const actualVote = isNeutral ? 0 : voteType;
    dispatch(optimisticVoteThread({ threadId: thread.id, voteType: actualVote, userId }));
    dispatch(voteThread({ threadId: thread.id, voteType: actualVote, userId }));
  };

  const handleCategoryClick = (e, category) => {
    e.preventDefault();
    dispatch(setActiveCategory(category));
  };

  const bodyPreview = thread.body?.length > 120
    ? `${thread.body.slice(0, 120)}...`
    : thread.body;

  const timeAgo = thread.createdAt
    ? formatDistanceToNow(new Date(thread.createdAt), { addSuffix: true })
    : '';

  const commentLabel = thread.totalComments !== 1 ? 's' : '';

  return (
    <article className={styles.card}>
      <div className={styles.voteCol}>
        <VoteButton
          count={thread.upVotesBy.length}
          voted={!!upvoted}
          onClick={() => handleVote(1)}
          type="up"
          disabled={!userId}
        />
        <VoteButton
          count={thread.downVotesBy.length}
          voted={!!downvoted}
          onClick={() => handleVote(-1)}
          type="down"
          disabled={!userId}
        />
      </div>

      <div className={styles.content}>
        {thread.category && (
          <button
            type="button"
            className={styles.category}
            onClick={(e) => handleCategoryClick(e, thread.category)}
          >
            #
            {thread.category}
          </button>
        )}
        <Link to={`/threads/${thread.id}`} className={styles.title}>
          {thread.title}
        </Link>
        <p className={styles.body}>{bodyPreview}</p>

        <div className={styles.meta}>
          <div className={styles.owner}>
            {owner?.avatar && (
              <img src={owner.avatar} alt={owner.name} className={styles.ownerAvatar} />
            )}
            <span className={styles.ownerName}>{owner?.name || 'Unknown'}</span>
          </div>
          <span className={styles.dot}>·</span>
          <span className={styles.time}>{timeAgo}</span>
          <span className={styles.dot}>·</span>
          <span className={styles.comments}>
            💬
            {' '}
            {thread.totalComments}
            {' '}
            comment
            {commentLabel}
          </span>
        </div>
      </div>
    </article>
  );
}

ThreadCard.propTypes = {
  thread: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    body: PropTypes.string,
    category: PropTypes.string,
    createdAt: PropTypes.string,
    upVotesBy: PropTypes.arrayOf(PropTypes.string).isRequired,
    downVotesBy: PropTypes.arrayOf(PropTypes.string).isRequired,
    totalComments: PropTypes.number.isRequired,
  }).isRequired,
  owner: PropTypes.shape({
    name: PropTypes.string,
    avatar: PropTypes.string,
  }),
};

export default ThreadCard;
