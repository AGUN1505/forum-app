import PropTypes from 'prop-types';
import styles from './LoadingSpinner.module.css';

function LoadingSpinner({ fullPage = false, size = 'md' }) {
  if (fullPage) {
    return (
      <div className={styles.fullPage}>
        <div className={styles.wrapper}>
          <div className={`${styles.spinner} ${styles[size]}`} />
          <span className={styles.text}>Loading...</span>
        </div>
      </div>
    );
  }

  return <div className={`${styles.spinner} ${styles[size]}`} />;
}

LoadingSpinner.propTypes = {
  fullPage: PropTypes.bool,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
};

export default LoadingSpinner;
