import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { formatDistanceToNow } from 'date-fns';
import {
  fetchThreadDetail,
  voteThread,
  optimisticVoteThread,
} from '../store/slices/threadsSlice';
import CommentItem from '../components/comment/CommentItem';
import CommentForm from '../components/comment/CommentForm';
import VoteButton from '../components/common/VoteButton';
import LoadingSpinner from '../components/common/LoadingSpinner';
import styles from './ThreadDetailPage.module.css';

function ThreadDetailPage() {
  const { threadId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { detail: thread, detailStatus } = useSelector((state) => state.threads);
  const { user } = useSelector((state) => state.auth);
  const userId = user?.id;

  useEffect(() => {
    dispatch(fetchThreadDetail(threadId));
  }, [dispatch, threadId]);

  const upvoted = userId && thread?.upVotesBy.includes(userId);
  const downvoted = userId && thread?.downVotesBy.includes(userId);

  const handleVote = (voteType) => {
    if (!userId) return;
    const isNeutral = (voteType === 1 && upvoted) || (voteType === -1 && downvoted);
    const actualVote = isNeutral ? 0 : voteType;
    dispatch(optimisticVoteThread({ threadId, voteType: actualVote, userId }));
    dispatch(voteThread({ threadId, voteType: actualVote, userId }));
  };

  if (detailStatus === 'loading') return <LoadingSpinner fullPage />;

  if (detailStatus === 'failed' || !thread) {
    return (
      <div className={styles.error}>
        <p>Thread not found.</p>
        <button type="button" onClick={() => navigate('/')} className={styles.backBtn}>
          ← Back to threads
        </button>
      </div>
    );
  }

  const timeAgo = formatDistanceToNow(new Date(thread.createdAt), { addSuffix: true });
  const commentLabel = thread.comments.length !== 1 ? 's' : '';

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <button type="button" onClick={() => navigate('/')} className={styles.backBtn}>
          ← Back to threads
        </button>

        <article className={styles.thread}>
          <div className={styles.threadHeader}>
            {thread.category && (
              <span className={styles.category}>
                #
                {thread.category}
              </span>
            )}
            <h1 className={styles.title}>{thread.title}</h1>

            <div className={styles.meta}>
              <div className={styles.owner}>
                <img
                  src={thread.owner.avatar}
                  alt={thread.owner.name}
                  className={styles.ownerAvatar}
                />
                <div>
                  <span className={styles.ownerName}>{thread.owner.name}</span>
                  <span className={styles.time}>{timeAgo}</span>
                </div>
              </div>
            </div>
          </div>

          <div
            className={styles.body}
            dangerouslySetInnerHTML={{ __html: thread.body }}
          />

          <div className={styles.threadFooter}>
            <div className={styles.votes}>
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
            <span className={styles.commentCount}>
              💬
              {' '}
              {thread.comments.length}
              {' '}
              comment
              {commentLabel}
            </span>
          </div>
        </article>

        <section className={styles.commentsSection}>
          <h2 className={styles.commentsTitle}>
            Discussion
            <span className={styles.commentsBadge}>{thread.comments.length}</span>
          </h2>

          <CommentForm threadId={threadId} />

          <div className={styles.commentsList}>
            {thread.comments.length === 0 ? (
              <div className={styles.noComments}>
                No comments yet. Start the discussion!
              </div>
            ) : (
              thread.comments.map((comment) => (
                <CommentItem key={comment.id} comment={comment} threadId={threadId} />
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default ThreadDetailPage;
