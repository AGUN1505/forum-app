import PropTypes from 'prop-types';
import styles from './VoteButton.module.css';

function VoteButton({
  count, voted = false, onClick, type = 'up', disabled = false,
}) {
  const icon = type === 'up' ? '▲' : '▼';
  let votedClass = '';
  if (voted) {
    votedClass = type === 'up' ? styles.votedUp : styles.votedDown;
  }

  return (
    <button
      type="button"
      className={`${styles.btn} ${votedClass} ${disabled ? styles.disabled : ''}`}
      onClick={onClick}
      disabled={disabled}
      title={type === 'up' ? 'Upvote' : 'Downvote'}
    >
      <span className={styles.icon}>{icon}</span>
      <span className={styles.count}>{count}</span>
    </button>
  );
}

VoteButton.propTypes = {
  count: PropTypes.number.isRequired,
  voted: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  type: PropTypes.oneOf(['up', 'down']),
  disabled: PropTypes.bool,
};

export default VoteButton;
