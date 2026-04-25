/**
 * Stories untuk komponen LoadingSpinner.
 * Menampilkan berbagai ukuran dan mode loading spinner.
 */

import LoadingSpinner from '../components/common/LoadingSpinner';

export default {
  title: 'Components/LoadingSpinner',
  component: LoadingSpinner,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Komponen loading indicator yang ditampilkan saat memuat data dari API.',
      },
    },
  },
  argTypes: {
    size: {
      control: { type: 'radio' },
      options: ['sm', 'md', 'lg'],
      description: 'Ukuran spinner',
    },
    fullPage: {
      control: { type: 'boolean' },
      description: 'Apakah spinner ditampilkan full-page dengan overlay',
    },
  },
};

// Story: Small spinner
export const Small = {
  name: 'Small',
  args: {
    size: 'sm',
    fullPage: false,
  },
};

// Story: Medium spinner (default)
export const Medium = {
  name: 'Medium (Default)',
  args: {
    size: 'md',
    fullPage: false,
  },
};

// Story: Large spinner
export const Large = {
  name: 'Large',
  args: {
    size: 'lg',
    fullPage: false,
  },
};
