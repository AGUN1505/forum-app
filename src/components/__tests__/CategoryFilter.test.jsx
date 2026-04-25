/**
 * Integration tests untuk komponen CategoryFilter.
 *
 * Skenario pengujian:
 * - Menampilkan tombol "All"
 * - Menampilkan semua kategori yang diberikan
 * - Dispatch setActiveCategory saat kategori diklik
 * - Tombol "All" aktif saat tidak ada filter
 * - Tombol kategori aktif saat kategori dipilih
 */

import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import CategoryFilter from '../thread/CategoryFilter';
import threadsReducer from '../../store/slices/threadsSlice';

const createStore = (activeCategory = '') => configureStore({
  reducer: { threads: threadsReducer },
  preloadedState: {
    threads: {
      list: [],
      users: {},
      detail: null,
      activeCategory,
      status: 'idle',
      detailStatus: 'idle',
      error: null,
    },
  },
});

describe('CategoryFilter component', () => {
  const categories = ['Tech', 'General', 'Discussion'];

  it('should render "All" button', () => {
    // Skenario: tombol "All" selalu tampil untuk mereset filter
    const store = createStore();
    render(
      <Provider store={store}>
        <CategoryFilter categories={categories} />
      </Provider>,
    );
    expect(screen.getByText('All')).toBeInTheDocument();
  });

  it('should render all provided categories', () => {
    // Skenario: semua kategori dari props harus tampil sebagai tombol filter
    const store = createStore();
    render(
      <Provider store={store}>
        <CategoryFilter categories={categories} />
      </Provider>,
    );
    expect(screen.getByText('#Tech')).toBeInTheDocument();
    expect(screen.getByText('#General')).toBeInTheDocument();
    expect(screen.getByText('#Discussion')).toBeInTheDocument();
  });

  it('should dispatch setActiveCategory when a category is clicked', () => {
    // Skenario: user mengklik kategori "Tech", activeCategory di store berubah
    const store = createStore();
    render(
      <Provider store={store}>
        <CategoryFilter categories={categories} />
      </Provider>,
    );
    fireEvent.click(screen.getByText('#Tech'));
    expect(store.getState().threads.activeCategory).toBe('Tech');
  });

  it('should dispatch setActiveCategory to empty string when All is clicked', () => {
    // Skenario: user mengklik "All" untuk menghapus filter, activeCategory menjadi ""
    const store = createStore('Tech');
    render(
      <Provider store={store}>
        <CategoryFilter categories={categories} />
      </Provider>,
    );
    fireEvent.click(screen.getByText('All'));
    expect(store.getState().threads.activeCategory).toBe('');
  });

  it('should show correct number of filter buttons including All', () => {
    // Skenario: jumlah tombol = jumlah kategori + 1 (tombol All)
    const store = createStore();
    render(
      <Provider store={store}>
        <CategoryFilter categories={categories} />
      </Provider>,
    );
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(categories.length + 1);
  });
});
