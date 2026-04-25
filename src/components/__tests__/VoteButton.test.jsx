/**
 * Integration tests untuk komponen VoteButton.
 *
 * Skenario pengujian:
 * - Render jumlah vote dengan benar
 * - Menampilkan visual indikator saat voted
 * - Memanggil onClick saat diklik
 * - Disabled saat prop disabled=true
 * - Menampilkan icon yang benar untuk up/down
 */

import {
  describe, it, expect, vi,
} from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import VoteButton from '../common/VoteButton';

describe('VoteButton component', () => {
  it('should render vote count correctly', () => {
    // Skenario: VoteButton menampilkan jumlah vote yang diterima via props
    render(
      <VoteButton count={42} voted={false} onClick={vi.fn()} type="up" />,
    );
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('should render upvote icon ▲ for type up', () => {
    // Skenario: VoteButton dengan type "up" menampilkan icon segitiga atas
    render(
      <VoteButton count={0} voted={false} onClick={vi.fn()} type="up" />,
    );
    expect(screen.getByText('▲')).toBeInTheDocument();
  });

  it('should render downvote icon ▼ for type down', () => {
    // Skenario: VoteButton dengan type "down" menampilkan icon segitiga bawah
    render(
      <VoteButton count={0} voted={false} onClick={vi.fn()} type="down" />,
    );
    expect(screen.getByText('▼')).toBeInTheDocument();
  });

  it('should call onClick when button is clicked', () => {
    // Skenario: user mengklik tombol vote, callback onClick harus terpanggil
    const handleClick = vi.fn();
    render(
      <VoteButton count={5} voted={false} onClick={handleClick} type="up" />,
    );
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should not call onClick when button is disabled', () => {
    // Skenario: user belum login, tombol vote disabled dan tidak bisa diklik
    const handleClick = vi.fn();
    render(
      <VoteButton count={5} voted={false} onClick={handleClick} type="up" disabled />,
    );
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('should have disabled attribute when disabled prop is true', () => {
    // Skenario: memastikan atribut disabled benar-benar ada di DOM
    render(
      <VoteButton count={0} voted={false} onClick={vi.fn()} type="up" disabled />,
    );
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('should render with correct title for upvote button', () => {
    // Skenario: memastikan accessibility title pada tombol upvote
    render(
      <VoteButton count={0} voted={false} onClick={vi.fn()} type="up" />,
    );
    expect(screen.getByTitle('Upvote')).toBeInTheDocument();
  });

  it('should render with correct title for downvote button', () => {
    // Skenario: memastikan accessibility title pada tombol downvote
    render(
      <VoteButton count={0} voted={false} onClick={vi.fn()} type="down" />,
    );
    expect(screen.getByTitle('Downvote')).toBeInTheDocument();
  });
});
