import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import threadsReducer from './slices/threadsSlice';
import leaderboardReducer from './slices/leaderboardSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    threads: threadsReducer,
    leaderboards: leaderboardReducer,
  },
});

export default store;
