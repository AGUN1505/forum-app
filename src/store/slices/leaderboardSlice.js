import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../utils/api';

export const fetchLeaderboards = createAsyncThunk(
  'leaderboards/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const data = await api.getLeaderboards();
      return data.leaderboards;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

const leaderboardSlice = createSlice({
  name: 'leaderboards',
  initialState: {
    list: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeaderboards.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchLeaderboards.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(fetchLeaderboards.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default leaderboardSlice.reducer;
