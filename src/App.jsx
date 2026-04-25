import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fetchProfile } from './store/slices/authSlice';
import Navbar from './components/common/Navbar';
import HomePage from './pages/HomePage';
import ThreadDetailPage from './pages/ThreadDetailPage';
import CreateThreadPage from './pages/CreateThreadPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import LeaderboardPage from './pages/LeaderboardPage';

function AppContent() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(fetchProfile());
    }
  }, [dispatch]);

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/threads/:threadId" element={<ThreadDetailPage />} />
        <Route path="/create" element={<CreateThreadPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
