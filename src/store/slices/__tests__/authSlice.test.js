/**
 * Unit tests untuk authSlice reducer dan thunk functions.
 *
 * Skenario pengujian:
 * - Reducer: logout, clearError, loginUser states, registerUser states, fetchProfile
 * - Thunk: loginUser (success/fail), registerUser (success/fail), fetchProfile
 */

import {
  describe, it, expect, vi, beforeEach,
} from 'vitest';
import authReducer, {
  logout,
  clearError,
  loginUser,
  registerUser,
  fetchProfile,
} from '../authSlice';
import { api } from '../../../utils/api';

vi.mock('../../../utils/api');

const initialState = {
  user: null,
  status: 'idle',
  error: null,
};

const mockUser = {
  id: 'user-1',
  name: 'John Doe',
  email: 'john@example.com',
  avatar: 'https://avatar.com/1',
};

// ============================================================
// REDUCER TESTS
// ============================================================
describe('authSlice reducer', () => {
  // --- logout ---
  describe('logout', () => {
    it('should clear user and reset status to idle', () => {
      // Skenario: user melakukan logout, state harus di-reset
      const loggedInState = { user: mockUser, status: 'succeeded', error: null };
      const state = authReducer(loggedInState, logout());
      // expect(state.user).toBeNull();
      expect(state.user).toBe('ini akan gagal');
      expect(state.status).toBe('idle');
    });

    it('should remove token from localStorage on logout', () => {
      // Skenario: token harus dihapus dari localStorage saat logout
      localStorage.setItem('token', 'test-token');
      authReducer({ user: mockUser, status: 'succeeded', error: null }, logout());
      expect(localStorage.getItem('token')).toBeNull();
    });
  });

  // --- clearError ---
  describe('clearError', () => {
    it('should set error to null', () => {
      // Skenario: error dihapus setelah user navigasi dari halaman login
      const stateWithError = { ...initialState, error: 'Invalid credentials' };
      const state = authReducer(stateWithError, clearError());
      expect(state.error).toBeNull();
    });

    it('should not affect user or status when clearing error', () => {
      // Skenario: clearError tidak boleh mengubah data user
      const stateWithError = {
        user: mockUser, status: 'succeeded', error: 'some error',
      };
      const state = authReducer(stateWithError, clearError());
      expect(state.user).toEqual(mockUser);
      expect(state.status).toBe('succeeded');
    });
  });

  // --- loginUser extraReducers ---
  describe('loginUser extraReducers', () => {
    it('should set status to loading and clear error when pending', () => {
      // Skenario: request login sedang berjalan
      const action = { type: loginUser.pending.type };
      const state = authReducer({ ...initialState, error: 'old error' }, action);
      expect(state.status).toBe('loading');
      expect(state.error).toBeNull();
    });

    it('should set user and status to succeeded when fulfilled', () => {
      // Skenario: login berhasil, user harus tersimpan di state
      const action = { type: loginUser.fulfilled.type, payload: mockUser };
      const state = authReducer(initialState, action);
      expect(state.status).toBe('succeeded');
      expect(state.user).toEqual(mockUser);
    });

    it('should set status to failed and store error when rejected', () => {
      // Skenario: login gagal karena email/password salah
      const action = { type: loginUser.rejected.type, payload: 'Invalid credentials' };
      const state = authReducer(initialState, action);
      expect(state.status).toBe('failed');
      expect(state.error).toBe('Invalid credentials');
    });
  });

  // --- registerUser extraReducers ---
  describe('registerUser extraReducers', () => {
    it('should set status to loading when pending', () => {
      // Skenario: request register sedang berjalan
      const action = { type: registerUser.pending.type };
      const state = authReducer(initialState, action);
      expect(state.status).toBe('loading');
    });

    it('should set status to idle when fulfilled (redirect to login)', () => {
      // Skenario: register berhasil, user diarahkan ke login
      const action = { type: registerUser.fulfilled.type };
      const state = authReducer(initialState, action);
      expect(state.status).toBe('idle');
      expect(state.user).toBeNull(); // user belum login
    });

    it('should set error when rejected', () => {
      // Skenario: register gagal karena email sudah dipakai
      const action = {
        type: registerUser.rejected.type,
        payload: 'Email already registered',
      };
      const state = authReducer(initialState, action);
      expect(state.status).toBe('failed');
      expect(state.error).toBe('Email already registered');
    });
  });

  // --- fetchProfile extraReducers ---
  describe('fetchProfile extraReducers', () => {
    it('should set user when fetchProfile fulfilled', () => {
      // Skenario: app startup, profile user di-fetch dari token yang tersimpan
      const action = { type: fetchProfile.fulfilled.type, payload: mockUser };
      const state = authReducer(initialState, action);
      expect(state.user).toEqual(mockUser);
    });
  });
});

// ============================================================
// THUNK TESTS
// ============================================================
describe('authSlice thunks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  // --- loginUser thunk ---
  describe('loginUser thunk', () => {
    it('should save token to localStorage and dispatch fulfilled with user on success', async () => {
      // Skenario: login berhasil, token disimpan dan user di-return
      api.login.mockResolvedValue({ token: 'jwt-token-123' });
      api.getProfile.mockResolvedValue({ user: mockUser });

      const dispatch = vi.fn();
      await loginUser({ email: 'john@example.com', password: '123456' })(dispatch, () => {}, undefined);

      expect(localStorage.getItem('token')).toBe('jwt-token-123');
      const fulfilledCall = dispatch.mock.calls.find(
        (c) => c[0].type === 'auth/login/fulfilled',
      );
      expect(fulfilledCall[0].payload).toEqual(mockUser);
    });

    it('should dispatch rejected with error message on login failure', async () => {
      // Skenario: login gagal karena password salah
      api.login.mockRejectedValue(new Error('Email or password is wrong'));

      const dispatch = vi.fn();
      await loginUser({ email: 'john@example.com', password: 'wrong' })(dispatch, () => {}, undefined);

      const rejectedCall = dispatch.mock.calls.find(
        (c) => c[0].type === 'auth/login/rejected',
      );
      expect(rejectedCall[0].payload).toBe('Email or password is wrong');
      expect(localStorage.getItem('token')).toBeNull();
    });
  });

  // --- registerUser thunk ---
  describe('registerUser thunk', () => {
    it('should dispatch fulfilled with new user on success', async () => {
      // Skenario: register berhasil
      api.register.mockResolvedValue({ user: mockUser });

      const dispatch = vi.fn();
      await registerUser({ name: 'John', email: 'john@example.com', password: '123456' })(dispatch, () => {}, undefined);

      const fulfilledCall = dispatch.mock.calls.find(
        (c) => c[0].type === 'auth/register/fulfilled',
      );
      expect(fulfilledCall[0].payload).toEqual(mockUser);
    });

    it('should dispatch rejected when registration fails', async () => {
      // Skenario: register gagal karena email sudah ada
      api.register.mockRejectedValue(new Error('Email is already taken'));

      const dispatch = vi.fn();
      await registerUser({ name: 'John', email: 'taken@example.com', password: '123456' })(dispatch, () => {}, undefined);

      const rejectedCall = dispatch.mock.calls.find(
        (c) => c[0].type === 'auth/register/rejected',
      );
      expect(rejectedCall[0].payload).toBe('Email is already taken');
    });
  });

  // --- fetchProfile thunk ---
  describe('fetchProfile thunk', () => {
    it('should dispatch fulfilled with user profile on success', async () => {
      // Skenario: app startup berhasil fetch profil dari token tersimpan
      api.getProfile.mockResolvedValue({ user: mockUser });

      const dispatch = vi.fn();
      await fetchProfile()(dispatch, () => {}, undefined);

      const fulfilledCall = dispatch.mock.calls.find(
        (c) => c[0].type === 'auth/fetchProfile/fulfilled',
      );
      expect(fulfilledCall[0].payload).toEqual(mockUser);
    });

    it('should dispatch rejected when token is invalid', async () => {
      // Skenario: token kadaluarsa, fetch profile gagal
      api.getProfile.mockRejectedValue(new Error('Unauthorized'));

      const dispatch = vi.fn();
      await fetchProfile()(dispatch, () => {}, undefined);

      const calls = dispatch.mock.calls.map((c) => c[0].type);
      expect(calls).toContain('auth/fetchProfile/rejected');
    });
  });
});
