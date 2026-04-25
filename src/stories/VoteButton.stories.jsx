/**
 * Stories untuk komponen VoteButton.
 * Menampilkan berbagai state dari tombol vote.
 */

import VoteButton from '../components/common/VoteButton';

export default {
  title: 'Components/VoteButton',
  component: VoteButton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Tombol vote yang dapat digunakan untuk upvote atau downvote thread dan komentar.',
      },
    },
  },
  argTypes: {
    type: {
      control: { type: 'radio' },
      options: ['up', 'down'],
      description: 'Jenis vote: upvote atau downvote',
    },
    count: {
      control: { type: 'number' },
      description: 'Jumlah vote yang ditampilkan',
    },
    voted: {
      control: { type: 'boolean' },
      description: 'Apakah user sudah melakukan vote',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Apakah tombol dinonaktifkan (user belum login)',
    },
    onClick: { action: 'voted' },
  },
};

// Story: Upvote button - belum divote
export const Upvote = {
  name: 'Upvote (Default)',
  args: {
    count: 12,
    voted: false,
    type: 'up',
    disabled: false,
  },
};

// Story: Upvote button - sudah divote (aktif)
export const UpvoteActive = {
  name: 'Upvote (Active / Sudah Divote)',
  args: {
    count: 13,
    voted: true,
    type: 'up',
    disabled: false,
  },
};

// Story: Downvote button - belum divote
export const Downvote = {
  name: 'Downvote (Default)',
  args: {
    count: 3,
    voted: false,
    type: 'down',
    disabled: false,
  },
};

// Story: Downvote button - sudah divote (aktif)
export const DownvoteActive = {
  name: 'Downvote (Active / Sudah Divote)',
  args: {
    count: 4,
    voted: true,
    type: 'down',
    disabled: false,
  },
};

// Story: Disabled - user belum login
export const DisabledNotLoggedIn = {
  name: 'Disabled (User Belum Login)',
  args: {
    count: 5,
    voted: false,
    type: 'up',
    disabled: true,
  },
};

// Story: Count nol
export const ZeroCount = {
  name: 'Zero Count (Belum Ada Vote)',
  args: {
    count: 0,
    voted: false,
    type: 'up',
    disabled: false,
  },
};
