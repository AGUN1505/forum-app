import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveCategory } from '../../store/slices/threadsSlice';
import styles from './CategoryFilter.module.css';

function CategoryFilter({ categories }) {
  const dispatch = useDispatch();
  const activeCategory = useSelector((state) => state.threads.activeCategory);

  return (
    <div className={styles.wrapper}>
      <span className={styles.label}>Filter:</span>
      <div className={styles.tags}>
        <button
          type="button"
          className={`${styles.tag} ${activeCategory === '' ? styles.active : ''}`}
          onClick={() => dispatch(setActiveCategory(''))}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            className={`${styles.tag} ${activeCategory === cat ? styles.active : ''}`}
            onClick={() => dispatch(setActiveCategory(cat))}
          >
            #
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}

CategoryFilter.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default CategoryFilter;
