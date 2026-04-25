import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createThread } from '../store/slices/threadsSlice';
import styles from './CreateThreadPage.module.css';

function CreateThreadPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) {
      setError('Title and body are required.');
      return;
    }
    setLoading(true);
    setError('');
    const result = await dispatch(createThread({
      title: title.trim(),
      body: body.trim(),
      category: category.trim() || 'General',
    }));
    if (createThread.fulfilled.match(result)) {
      navigate(`/threads/${result.payload.id}`);
    } else {
      setError(result.payload || 'Failed to create thread.');
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <button type="button" onClick={() => navigate(-1)} className={styles.backBtn}>
            ← Back
          </button>
          <h1 className={styles.title}>Create Thread</h1>
          <p className={styles.subtitle}>Share your thoughts with the community</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.field}>
            <label className={styles.label} htmlFor="title">
              Title *
              <input
                id="title"
                type="text"
                className={styles.input}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What's on your mind?"
                maxLength={150}
                required
              />
            </label>
            <span className={styles.hint}>
              {title.length}
              /150
            </span>
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="category">
              Category
              <input
                id="category"
                type="text"
                className={styles.input}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. General, Tech, Discussion (optional)"
                maxLength={50}
              />
            </label>
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="body">
              Body *
              <textarea
                id="body"
                className={styles.textarea}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Elaborate on your topic..."
                rows={12}
                required
              />
            </label>
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className={styles.cancelBtn}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={loading || !title.trim() || !body.trim()}
            >
              {loading ? 'Publishing...' : 'Publish Thread'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateThreadPage;
