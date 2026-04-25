import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../utils/api';

export const fetchThreads = createAsyncThunk(
  'threads/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const [threadsData, usersData] = await Promise.all([
        api.getThreads(),
        api.getUsers(),
      ]);
      const usersMap = {};
      usersData.users.forEach((u) => {
        usersMap[u.id] = u;
      });
      return { threads: threadsData.threads, users: usersMap };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const fetchThreadDetail = createAsyncThunk(
  'threads/fetchDetail',
  async (threadId, { rejectWithValue }) => {
    try {
      const data = await api.getThreadDetail(threadId);
      return data.detailThread;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const createThread = createAsyncThunk(
  'threads/create',
  async ({ title, body, category }, { rejectWithValue }) => {
    try {
      const data = await api.createThread(title, body, category);
      return data.thread;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const createComment = createAsyncThunk(
  'threads/createComment',
  async ({ threadId, content }, { rejectWithValue }) => {
    try {
      const data = await api.createComment(threadId, content);
      return { comment: data.comment, threadId };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const voteThread = createAsyncThunk(
  'threads/vote',
  async ({ threadId, voteType, userId }, { rejectWithValue }) => {
    try {
      if (voteType === 1) await api.upvoteThread(threadId);
      else if (voteType === -1) await api.downvoteThread(threadId);
      else await api.neutralvoteThread(threadId);
      return { threadId, voteType, userId };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const voteComment = createAsyncThunk(
  'threads/voteComment',
  async ({
    threadId, commentId, voteType, userId,
  }, { rejectWithValue }) => {
    try {
      if (voteType === 1) await api.upvoteComment(threadId, commentId);
      else if (voteType === -1) await api.downvoteComment(threadId, commentId);
      else await api.neutralvoteComment(threadId, commentId);
      return { commentId, voteType, userId };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

const applyVote = (upVotes, downVotes, userId, voteType) => {
  let newUp = upVotes.filter((id) => id !== userId);
  let newDown = downVotes.filter((id) => id !== userId);
  if (voteType === 1) newUp = [...newUp, userId];
  else if (voteType === -1) newDown = [...newDown, userId];
  return { upVotesBy: newUp, downVotesBy: newDown };
};

const threadsSlice = createSlice({
  name: 'threads',
  initialState: {
    list: [],
    users: {},
    detail: null,
    activeCategory: '',
    status: 'idle',
    detailStatus: 'idle',
    error: null,
  },
  reducers: {
    setActiveCategory: (state, action) => {
      state.activeCategory = action.payload;
    },
    optimisticVoteThread: (state, action) => {
      const { threadId, voteType, userId } = action.payload;
      const thread = state.list.find((t) => t.id === threadId);
      if (thread) {
        const result = applyVote(thread.upVotesBy, thread.downVotesBy, userId, voteType);
        thread.upVotesBy = result.upVotesBy;
        thread.downVotesBy = result.downVotesBy;
      }
      if (state.detail && state.detail.id === threadId) {
        const result = applyVote(
          state.detail.upVotesBy,
          state.detail.downVotesBy,
          userId,
          voteType,
        );
        state.detail.upVotesBy = result.upVotesBy;
        state.detail.downVotesBy = result.downVotesBy;
      }
    },
    optimisticVoteComment: (state, action) => {
      const { commentId, voteType, userId } = action.payload;
      if (state.detail) {
        const comment = state.detail.comments.find((c) => c.id === commentId);
        if (comment) {
          const result = applyVote(comment.upVotesBy, comment.downVotesBy, userId, voteType);
          comment.upVotesBy = result.upVotesBy;
          comment.downVotesBy = result.downVotesBy;
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchThreads.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchThreads.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload.threads;
        state.users = action.payload.users;
      })
      .addCase(fetchThreads.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchThreadDetail.pending, (state) => {
        state.detailStatus = 'loading';
        state.detail = null;
      })
      .addCase(fetchThreadDetail.fulfilled, (state, action) => {
        state.detailStatus = 'succeeded';
        state.detail = action.payload;
      })
      .addCase(fetchThreadDetail.rejected, (state, action) => {
        state.detailStatus = 'failed';
        state.error = action.payload;
      })
      .addCase(createThread.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
      })
      .addCase(createComment.fulfilled, (state, action) => {
        if (state.detail && state.detail.id === action.payload.threadId) {
          state.detail.comments.push(action.payload.comment);
        }
      });
  },
});

export const {
  setActiveCategory,
  optimisticVoteThread,
  optimisticVoteComment,
} = threadsSlice.actions;

export default threadsSlice.reducer;
