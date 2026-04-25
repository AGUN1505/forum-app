/**
 * Unit tests untuk threadsSlice reducer dan thunk functions.
 *
 * Skenario pengujian:
 * - Reducer: setActiveCategory, optimisticVoteThread, optimisticVoteComment,
 *   fetchThreads (pending/fulfilled/rejected), fetchThreadDetail, createThread, createComment
 * - Thunk: fetchThreads, fetchThreadDetail, createThread, createComment, voteThread, voteComment
 */

import {
  describe, it, expect, vi, beforeEach,
} from 'vitest';
import threadsReducer, {
  setActiveCategory,
  optimisticVoteThread,
  optimisticVoteComment,
  fetchThreads,
  fetchThreadDetail,
  createThread,
  createComment,
  voteThread,
  voteComment,
} from '../threadsSlice';
import { api } from '../../../utils/api';

vi.mock('../../../utils/api');

const initialState = {
  list: [],
  users: {},
  detail: null,
  activeCategory: '',
  status: 'idle',
  detailStatus: 'idle',
  error: null,
};

const mockThread = {
  id: 'thread-1',
  title: 'Thread Pertama',
  body: 'Ini adalah thread pertama',
  category: 'General',
  createdAt: '2024-01-01T00:00:00.000Z',
  ownerId: 'user-1',
  upVotesBy: [],
  downVotesBy: [],
  totalComments: 0,
};

const mockThread2 = {
  id: 'thread-2',
  title: 'Thread Kedua',
  body: 'Ini adalah thread kedua',
  category: 'Tech',
  createdAt: '2024-01-02T00:00:00.000Z',
  ownerId: 'user-2',
  upVotesBy: ['user-1'],
  downVotesBy: [],
  totalComments: 2,
};

const mockComment = {
  id: 'comment-1',
  content: 'Komentar pertama',
  createdAt: '2024-01-01T01:00:00.000Z',
  upVotesBy: [],
  downVotesBy: [],
  owner: { id: 'user-1', name: 'John', avatar: 'https://avatar.com/1' },
};

const mockDetailThread = {
  id: 'thread-1',
  title: 'Thread Pertama',
  body: 'Ini adalah thread pertama',
  category: 'General',
  createdAt: '2024-01-01T00:00:00.000Z',
  owner: { id: 'user-1', name: 'John', avatar: 'https://avatar.com/1' },
  upVotesBy: [],
  downVotesBy: [],
  comments: [mockComment],
};

// ============================================================
// REDUCER TESTS
// ============================================================
describe('threadsSlice reducer', () => {
  // --- setActiveCategory ---
  describe('setActiveCategory', () => {
    it('should set activeCategory correctly', () => {
      // Skenario: user mengklik kategori "Tech"
      const state = threadsReducer(initialState, setActiveCategory('Tech'));
      expect(state.activeCategory).toBe('Tech');
    });

    it('should reset activeCategory to empty string', () => {
      // Skenario: user mengklik "All" untuk menghapus filter kategori
      const stateWithCategory = { ...initialState, activeCategory: 'Tech' };
      const state = threadsReducer(stateWithCategory, setActiveCategory(''));
      expect(state.activeCategory).toBe('');
    });
  });

  // --- optimisticVoteThread ---
  describe('optimisticVoteThread', () => {
    it('should add userId to upVotesBy when upvoting a thread in list', () => {
      // Skenario: user melakukan upvote pada thread di daftar
      const stateWithThread = { ...initialState, list: [{ ...mockThread }] };
      const state = threadsReducer(stateWithThread, optimisticVoteThread({
        threadId: 'thread-1',
        voteType: 1,
        userId: 'user-1',
      }));
      expect(state.list[0].upVotesBy).toContain('user-1');
      expect(state.list[0].downVotesBy).not.toContain('user-1');
    });

    it('should add userId to downVotesBy when downvoting a thread in list', () => {
      // Skenario: user melakukan downvote pada thread di daftar
      const stateWithThread = { ...initialState, list: [{ ...mockThread }] };
      const state = threadsReducer(stateWithThread, optimisticVoteThread({
        threadId: 'thread-1',
        voteType: -1,
        userId: 'user-2',
      }));
      expect(state.list[0].downVotesBy).toContain('user-2');
      expect(state.list[0].upVotesBy).not.toContain('user-2');
    });

    it('should remove userId from upVotesBy when neutral voting (toggle off upvote)', () => {
      // Skenario: user membatalkan upvote (neutral) pada thread
      const stateWithVotedThread = {
        ...initialState,
        list: [{ ...mockThread, upVotesBy: ['user-1'] }],
      };
      const state = threadsReducer(stateWithVotedThread, optimisticVoteThread({
        threadId: 'thread-1',
        voteType: 0,
        userId: 'user-1',
      }));
      expect(state.list[0].upVotesBy).not.toContain('user-1');
    });

    it('should also update detail thread if open', () => {
      // Skenario: user vote thread saat berada di halaman detail thread
      const stateWithDetail = {
        ...initialState,
        detail: { ...mockDetailThread, upVotesBy: [] },
      };
      const state = threadsReducer(stateWithDetail, optimisticVoteThread({
        threadId: 'thread-1',
        voteType: 1,
        userId: 'user-2',
      }));
      expect(state.detail.upVotesBy).toContain('user-2');
    });

    it('should not modify other threads in list', () => {
      // Skenario: vote pada thread-1 tidak boleh mempengaruhi thread-2
      const stateWithThreads = {
        ...initialState,
        list: [{ ...mockThread }, { ...mockThread2 }],
      };
      const state = threadsReducer(stateWithThreads, optimisticVoteThread({
        threadId: 'thread-1',
        voteType: 1,
        userId: 'user-3',
      }));
      expect(state.list[1].upVotesBy).toEqual(['user-1']); // thread-2 tidak berubah
    });
  });

  // --- optimisticVoteComment ---
  describe('optimisticVoteComment', () => {
    it('should add userId to comment upVotesBy', () => {
      // Skenario: user upvote komentar di thread
      const stateWithDetail = { ...initialState, detail: { ...mockDetailThread } };
      const state = threadsReducer(stateWithDetail, optimisticVoteComment({
        commentId: 'comment-1',
        voteType: 1,
        userId: 'user-2',
      }));
      expect(state.detail.comments[0].upVotesBy).toContain('user-2');
    });

    it('should add userId to comment downVotesBy when downvoting', () => {
      // Skenario: user downvote komentar di thread
      const stateWithDetail = { ...initialState, detail: { ...mockDetailThread } };
      const state = threadsReducer(stateWithDetail, optimisticVoteComment({
        commentId: 'comment-1',
        voteType: -1,
        userId: 'user-3',
      }));
      expect(state.detail.comments[0].downVotesBy).toContain('user-3');
    });

    it('should not modify comment if detail is null', () => {
      // Skenario: vote comment tidak akan error jika detail null
      const state = threadsReducer(initialState, optimisticVoteComment({
        commentId: 'comment-1',
        voteType: 1,
        userId: 'user-1',
      }));
      expect(state.detail).toBeNull();
    });
  });

  // --- fetchThreads extraReducers ---
  describe('fetchThreads extraReducers', () => {
    it('should set status to loading when pending', () => {
      // Skenario: request fetchThreads sedang berjalan
      const action = { type: fetchThreads.pending.type };
      const state = threadsReducer(initialState, action);
      expect(state.status).toBe('loading');
    });

    it('should populate list and users when fulfilled', () => {
      // Skenario: fetchThreads berhasil mendapatkan data dari API
      const action = {
        type: fetchThreads.fulfilled.type,
        payload: {
          threads: [mockThread, mockThread2],
          users: { 'user-1': { id: 'user-1', name: 'John', avatar: 'x' } },
        },
      };
      const state = threadsReducer(initialState, action);
      expect(state.status).toBe('succeeded');
      expect(state.list).toHaveLength(2);
      expect(state.users['user-1'].name).toBe('John');
    });

    it('should set status to failed and store error when rejected', () => {
      // Skenario: fetchThreads gagal karena error jaringan
      const action = {
        type: fetchThreads.rejected.type,
        payload: 'Network error',
      };
      const state = threadsReducer(initialState, action);
      expect(state.status).toBe('failed');
      expect(state.error).toBe('Network error');
    });
  });

  // --- fetchThreadDetail extraReducers ---
  describe('fetchThreadDetail extraReducers', () => {
    it('should set detailStatus to loading and clear detail when pending', () => {
      // Skenario: mulai fetch detail thread
      const stateWithDetail = { ...initialState, detail: mockDetailThread };
      const action = { type: fetchThreadDetail.pending.type };
      const state = threadsReducer(stateWithDetail, action);
      expect(state.detailStatus).toBe('loading');
      expect(state.detail).toBeNull();
    });

    it('should set detail when fulfilled', () => {
      // Skenario: fetch detail thread berhasil
      const action = {
        type: fetchThreadDetail.fulfilled.type,
        payload: mockDetailThread,
      };
      const state = threadsReducer(initialState, action);
      expect(state.detailStatus).toBe('succeeded');
      expect(state.detail.id).toBe('thread-1');
      expect(state.detail.comments).toHaveLength(1);
    });
  });

  // --- createThread & createComment ---
  describe('createThread fulfilled', () => {
    it('should prepend new thread to list', () => {
      // Skenario: user berhasil membuat thread baru, muncul di urutan pertama
      const stateWithThread = { ...initialState, list: [mockThread2] };
      const action = {
        type: createThread.fulfilled.type,
        payload: mockThread,
      };
      const state = threadsReducer(stateWithThread, action);
      expect(state.list[0].id).toBe('thread-1');
      expect(state.list).toHaveLength(2);
    });
  });

  describe('createComment fulfilled', () => {
    it('should append comment to detail thread comments', () => {
      // Skenario: user berhasil membuat komentar, muncul di bawah thread detail
      const stateWithDetail = {
        ...initialState,
        detail: { ...mockDetailThread, comments: [] },
      };
      const newComment = { ...mockComment, id: 'comment-new' };
      const action = {
        type: createComment.fulfilled.type,
        payload: { comment: newComment, threadId: 'thread-1' },
      };
      const state = threadsReducer(stateWithDetail, action);
      expect(state.detail.comments).toHaveLength(1);
      expect(state.detail.comments[0].id).toBe('comment-new');
    });

    it('should not modify detail if threadId does not match', () => {
      // Skenario: comment dibuat untuk thread lain, detail tidak terpengaruh
      const stateWithDetail = {
        ...initialState,
        detail: { ...mockDetailThread, comments: [] },
      };
      const action = {
        type: createComment.fulfilled.type,
        payload: { comment: mockComment, threadId: 'thread-WRONG' },
      };
      const state = threadsReducer(stateWithDetail, action);
      expect(state.detail.comments).toHaveLength(0);
    });
  });
});

// ============================================================
// THUNK TESTS
// ============================================================
describe('threadsSlice thunks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // --- fetchThreads thunk ---
  describe('fetchThreads thunk', () => {
    it('should dispatch fulfilled with threads and users on success', async () => {
      // Skenario: API mengembalikan threads dan users dengan sukses
      api.getThreads.mockResolvedValue({ threads: [mockThread] });
      api.getUsers.mockResolvedValue({
        users: [{
          id: 'user-1', name: 'John', avatar: 'x', email: 'j@j.com',
        }],
      });

      const dispatch = vi.fn();
      const thunk = fetchThreads();
      await thunk(dispatch, () => {}, undefined);

      const [pendingCall, fulfilledCall] = dispatch.mock.calls;
      expect(pendingCall[0].type).toBe('threads/fetchAll/pending');
      expect(fulfilledCall[0].type).toBe('threads/fetchAll/fulfilled');
      expect(fulfilledCall[0].payload.threads).toHaveLength(1);
      expect(fulfilledCall[0].payload.users['user-1'].name).toBe('John');
    });

    it('should dispatch rejected on API failure', async () => {
      // Skenario: API gagal, thunk harus dispatch rejected
      api.getThreads.mockRejectedValue(new Error('Server error'));
      api.getUsers.mockResolvedValue({ users: [] });

      const dispatch = vi.fn();
      await fetchThreads()(dispatch, () => {}, undefined);

      const calls = dispatch.mock.calls.map((c) => c[0].type);
      expect(calls).toContain('threads/fetchAll/rejected');
    });
  });

  // --- fetchThreadDetail thunk ---
  describe('fetchThreadDetail thunk', () => {
    it('should dispatch fulfilled with detailThread on success', async () => {
      // Skenario: user membuka halaman detail thread berhasil
      api.getThreadDetail.mockResolvedValue({ detailThread: mockDetailThread });

      const dispatch = vi.fn();
      await fetchThreadDetail('thread-1')(dispatch, () => {}, undefined);

      const fulfilledCall = dispatch.mock.calls.find(
        (c) => c[0].type === 'threads/fetchDetail/fulfilled',
      );
      expect(fulfilledCall[0].payload.id).toBe('thread-1');
      expect(fulfilledCall[0].payload.comments).toHaveLength(1);
    });

    it('should dispatch rejected when thread not found', async () => {
      // Skenario: thread ID tidak valid, API mengembalikan error
      api.getThreadDetail.mockRejectedValue(new Error('Thread not found'));

      const dispatch = vi.fn();
      await fetchThreadDetail('invalid-id')(dispatch, () => {}, undefined);

      const calls = dispatch.mock.calls.map((c) => c[0].type);
      expect(calls).toContain('threads/fetchDetail/rejected');
    });
  });

  // --- createThread thunk ---
  describe('createThread thunk', () => {
    it('should dispatch fulfilled with new thread on success', async () => {
      // Skenario: user berhasil membuat thread baru
      api.createThread.mockResolvedValue({ thread: mockThread });

      const dispatch = vi.fn();
      await createThread({ title: 'Judul', body: 'Isi', category: 'General' })(dispatch, () => {}, undefined);

      const fulfilledCall = dispatch.mock.calls.find(
        (c) => c[0].type === 'threads/create/fulfilled',
      );
      expect(fulfilledCall[0].payload.id).toBe('thread-1');
      expect(fulfilledCall[0].payload.title).toBe('Thread Pertama');
    });

    it('should dispatch rejected when API returns error', async () => {
      // Skenario: gagal membuat thread (misal: user tidak terautentikasi)
      api.createThread.mockRejectedValue(new Error('Unauthorized'));

      const dispatch = vi.fn();
      await createThread({ title: 'x', body: 'y', category: 'z' })(dispatch, () => {}, undefined);

      const calls = dispatch.mock.calls.map((c) => c[0].type);
      expect(calls).toContain('threads/create/rejected');
    });
  });

  // --- createComment thunk ---
  describe('createComment thunk', () => {
    it('should dispatch fulfilled with comment and threadId on success', async () => {
      // Skenario: user berhasil menambahkan komentar
      api.createComment.mockResolvedValue({ comment: mockComment });

      const dispatch = vi.fn();
      await createComment({ threadId: 'thread-1', content: 'Komentar saya' })(dispatch, () => {}, undefined);

      const fulfilledCall = dispatch.mock.calls.find(
        (c) => c[0].type === 'threads/createComment/fulfilled',
      );
      expect(fulfilledCall[0].payload.comment.id).toBe('comment-1');
      expect(fulfilledCall[0].payload.threadId).toBe('thread-1');
    });

    it('should dispatch rejected when comment creation fails', async () => {
      // Skenario: gagal membuat komentar karena error API
      api.createComment.mockRejectedValue(new Error('Bad request'));

      const dispatch = vi.fn();
      await createComment({ threadId: 'thread-1', content: '' })(dispatch, () => {}, undefined);

      const calls = dispatch.mock.calls.map((c) => c[0].type);
      expect(calls).toContain('threads/createComment/rejected');
    });
  });

  // --- voteThread thunk ---
  describe('voteThread thunk', () => {
    it('should call upvoteThread API and dispatch fulfilled when voteType is 1', async () => {
      // Skenario: user melakukan upvote pada thread
      api.upvoteThread.mockResolvedValue({});

      const dispatch = vi.fn();
      await voteThread({ threadId: 'thread-1', voteType: 1, userId: 'user-1' })(dispatch, () => {}, undefined);

      expect(api.upvoteThread).toHaveBeenCalledWith('thread-1');
      const fulfilledCall = dispatch.mock.calls.find(
        (c) => c[0].type === 'threads/vote/fulfilled',
      );
      expect(fulfilledCall[0].payload.voteType).toBe(1);
    });

    it('should call downvoteThread API when voteType is -1', async () => {
      // Skenario: user melakukan downvote pada thread
      api.downvoteThread.mockResolvedValue({});

      const dispatch = vi.fn();
      await voteThread({ threadId: 'thread-1', voteType: -1, userId: 'user-1' })(dispatch, () => {}, undefined);

      expect(api.downvoteThread).toHaveBeenCalledWith('thread-1');
    });

    it('should call neutralvoteThread API when voteType is 0', async () => {
      // Skenario: user membatalkan vote pada thread
      api.neutralvoteThread.mockResolvedValue({});

      const dispatch = vi.fn();
      await voteThread({ threadId: 'thread-1', voteType: 0, userId: 'user-1' })(dispatch, () => {}, undefined);

      expect(api.neutralvoteThread).toHaveBeenCalledWith('thread-1');
    });

    it('should dispatch rejected when vote API fails', async () => {
      // Skenario: vote gagal karena error jaringan
      api.upvoteThread.mockRejectedValue(new Error('Network error'));

      const dispatch = vi.fn();
      await voteThread({ threadId: 'thread-1', voteType: 1, userId: 'user-1' })(dispatch, () => {}, undefined);

      const calls = dispatch.mock.calls.map((c) => c[0].type);
      expect(calls).toContain('threads/vote/rejected');
    });
  });

  // --- voteComment thunk ---
  describe('voteComment thunk', () => {
    it('should call upvoteComment API when voteType is 1', async () => {
      // Skenario: user upvote komentar
      api.upvoteComment.mockResolvedValue({});

      const dispatch = vi.fn();
      await voteComment({
        threadId: 'thread-1', commentId: 'comment-1', voteType: 1, userId: 'user-1',
      })(dispatch, () => {}, undefined);

      expect(api.upvoteComment).toHaveBeenCalledWith('thread-1', 'comment-1');
    });

    it('should call downvoteComment API when voteType is -1', async () => {
      // Skenario: user downvote komentar
      api.downvoteComment.mockResolvedValue({});

      const dispatch = vi.fn();
      await voteComment({
        threadId: 'thread-1', commentId: 'comment-1', voteType: -1, userId: 'user-1',
      })(dispatch, () => {}, undefined);

      expect(api.downvoteComment).toHaveBeenCalledWith('thread-1', 'comment-1');
    });
  });
});
