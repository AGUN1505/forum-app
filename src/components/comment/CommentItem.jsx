import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { formatDistanceToNow } from 'date-fns';
import { voteComment, optimisticVoteComment } from '../../store/slices/threadsSlice';
import VoteButton from '../common/VoteButton';
import styles from './CommentItem.module.css';

function CommentItem({ comment, threadId }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const userId = user?.id;

  const upvoted = userId && comment.upVotesBy.includes(userId);
  const downvoted = userId && comment.downVotesBy.includes(userId);

  const handleVote = (voteType) => {
    if (!userId) return;
    const actualVote = (voteType === 1 && upvoted) || (voteType === -1 && downvoted) ? 0 : voteType;
    dispatch(optimisticVoteComment({ commentId: comment.id, voteType: actualVote, userId }));
    dispatch(voteComment({
      threadId, commentId: comment.id, voteType: actualVote, userId,
    }));
  };

  const timeAgo = comment.createdAt
    ? formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })
    : '';

  return (
    <div className={styles.comment}>
      <div className={styles.ownerRow}>
        {comment.owner?.avatar && (
          <img src={comment.owner.avatar} alt={comment.owner.name} className={styles.avatar} />
        )}
        <div className={styles.ownerInfo}>
          <span className={styles.ownerName}>{comment.owner?.name || 'Unknown'}</span>
          <span className={styles.time}>{timeAgo}</span>
        </div>
      </div>

      <div
        className={styles.content}
        dangerouslySetInnerHTML={{ __html: comment.content }}
      />

      <div className={styles.actions}>
        <VoteButton
          count={comment.upVotesBy.length}
          voted={!!upvoted}
          onClick={() => handleVote(1)}
          type="up"
          disabled={!userId}
        />
        <VoteButton
          count={comment.downVotesBy.length}
          voted={!!downvoted}
          onClick={() => handleVote(-1)}
          type="down"
          disabled={!userId}
        />
      </div>
    </div>
  );
}

CommentItem.propTypes = {
  comment: PropTypes.shape({
    id: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    createdAt: PropTypes.string,
    upVotesBy: PropTypes.arrayOf(PropTypes.string).isRequired,
    downVotesBy: PropTypes.arrayOf(PropTypes.string).isRequired,
    owner: PropTypes.shape({
      name: PropTypes.string,
      avatar: PropTypes.string,
    }),
  }).isRequired,
  threadId: PropTypes.string.isRequired,
};

export default CommentItem;
