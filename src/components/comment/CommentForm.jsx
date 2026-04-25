import PropTypes from 'prop-types';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { createComment } from '../../store/slices/threadsSlice';
import styles from './CommentForm.module.css';

function CommentForm({ threadId }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    setLoading(true);
    await dispatch(createComment({ threadId, content: content.trim() }));
    setContent('');
    setLoading(false);
  };

  if (!user) {
    return (
      <div className={styles.loginPrompt}>
        <span>Want to join the discussion?</span>
        <Link to="/login" className={styles.loginLink}>Login to comment</Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.inputRow}>
        <img src={user.avatar} alt={user.name} className={styles.avatar} />
        <textarea
          className={styles.textarea}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Share your thoughts..."
          rows={3}
          required
        />
      </div>
      <div className={styles.actions}>
        <span className={styles.charCount}>
          {content.length}
          {' '}
          chars
        </span>
        <button type="submit" className={styles.submitBtn} disabled={loading || !content.trim()}>
          {loading ? 'Posting...' : 'Post Comment'}
        </button>
      </div>
    </form>
  );
}

CommentForm.propTypes = {
  threadId: PropTypes.string.isRequired,
};

export default CommentForm;
