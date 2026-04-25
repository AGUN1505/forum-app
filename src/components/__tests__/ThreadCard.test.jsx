/**
 * Integration tests untuk komponen ThreadCard.
 *
 * Skenario pengujian:
 * - Menampilkan judul thread
 * - Menampilkan kategori thread
 * - Menampilkan nama pemilik thread
 * - Menampilkan jumlah komentar
 * - Menampilkan tombol vote
 * - Dispatch vote action saat user yang sudah login mengklik vote
 */

import {
  describe, it, expect, vi,
} from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import ThreadCard from '../thread/ThreadCard';
import threadsReducer from '../../store/slices/threadsSlice';
import authReducer from '../../store/slices/authSlice';

vi.mock('../../utils/api');

const mockThread = {
  id: 'thread-1',
  title: 'Diskusi React Testing Library',
  body: 'Bagaimana cara menulis test yang baik di React?',
  category: 'Tech',
  createdAt: '2024-06-01T00:00:00.000Z',
  ownerId: 'user-1',
  upVotesBy: [],
  downVotesBy: [],
  totalComments: 5,
};

const mockOwner = {
  id: 'user-1',
  name: 'John Doe',
  avatar: 'https://avatar.com/1',
};

const mockLoggedInUser = {
  id: 'user-2',
  name: 'Jane Doe',
  email: 'jane@example.com',
  avatar: 'https://avatar.com/2',
};

const createTestStore = (authUser = null) => configureStore({
  reducer: {
    auth: authReducer,
    threads: threadsReducer,
  },
  preloadedState: {
    auth: { user: authUser, status: 'idle', error: null },
    threads: {
      list: [mockThread],
      users: {},
      detail: null,
      activeCategory: '',
      status: 'idle',
      detailStatus: 'idle',
      error: null,
    },
  },
});

const renderWithProviders = (component, store) => render(
  <Provider store={store}>
    <MemoryRouter>
      {component}
    </MemoryRouter>
  </Provider>,
);

describe('ThreadCard component', () => {
  it('should render thread title', () => {
    // Skenario: judul thread harus tampil di card
    const store = createTestStore();
    renderWithProviders(<ThreadCard thread={mockThread} owner={mockOwner} />, store);
    expect(screen.getByText('Diskusi React Testing Library')).toBeInTheDocument();
  });

  it('should render thread category', () => {
    // Skenario: kategori thread ditampilkan dengan prefix #
    const store = createTestStore();
    renderWithProviders(<ThreadCard thread={mockThread} owner={mockOwner} />, store);
    expect(screen.getByText('#Tech')).toBeInTheDocument();
  });

  it('should render owner name', () => {
    // Skenario: nama pemilik thread harus tampil
    const store = createTestStore();
    renderWithProviders(<ThreadCard thread={mockThread} owner={mockOwner} />, store);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('should render total comments count', () => {
    // Skenario: jumlah komentar harus ditampilkan di card
    const store = createTestStore();
    renderWithProviders(<ThreadCard thread={mockThread} owner={mockOwner} />, store);
    expect(screen.getByText(/5 comment/)).toBeInTheDocument();
  });

  it('should render upvote and downvote buttons', () => {
    // Skenario: tombol vote harus selalu tampil (meski disabled jika tidak login)
    const store = createTestStore();
    renderWithProviders(<ThreadCard thread={mockThread} owner={mockOwner} />, store);
    expect(screen.getByTitle('Upvote')).toBeInTheDocument();
    expect(screen.getByTitle('Downvote')).toBeInTheDocument();
  });

  it('should show disabled vote buttons when user is not logged in', () => {
    // Skenario: user belum login, tombol vote harus disabled
    const store = createTestStore(null);
    renderWithProviders(<ThreadCard thread={mockThread} owner={mockOwner} />, store);
    const buttons = screen.getAllByRole('button');
    buttons.forEach((btn) => {
      if (btn.title === 'Upvote' || btn.title === 'Downvote') {
        expect(btn).toBeDisabled();
      }
    });
  });

  it('should show upvote count of 0 initially', () => {
    // Skenario: thread baru belum ada vote, count harus 0
    const store = createTestStore();
    renderWithProviders(<ThreadCard thread={mockThread} owner={mockOwner} />, store);
    // Both up and down vote counts are 0
    const zeros = screen.getAllByText('0');
    expect(zeros.length).toBeGreaterThanOrEqual(2);
  });

  it('should dispatch optimistic vote when logged in user clicks upvote', () => {
    // Skenario: user yang sudah login mengklik upvote, state harus berubah optimistically
    const store = createTestStore(mockLoggedInUser);
    renderWithProviders(<ThreadCard thread={mockThread} owner={mockOwner} />, store);

    const upvoteBtn = screen.getByTitle('Upvote');
    fireEvent.click(upvoteBtn);

    const state = store.getState();
    expect(state.threads.list[0].upVotesBy).toContain('user-2');
  });

  it('should render body preview truncated at 120 chars', () => {
    // Skenario: body panjang hanya ditampilkan sebagian (preview)
    const longBodyThread = {
      ...mockThread,
      body: 'A'.repeat(150),
    };
    const store = createTestStore();
    renderWithProviders(<ThreadCard thread={longBodyThread} owner={mockOwner} />, store);
    expect(screen.getByText(`${'A'.repeat(120)}...`)).toBeInTheDocument();
  });
});
