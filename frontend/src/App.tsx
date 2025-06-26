import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'
import LandingPage from './pages/LandingPage';
import Login from './features/auth/Login';
import SignUp from './features/auth/SignUp';
import HomePage from './pages/HomePage';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider> 
        <BrowserRouter>
          <Routes> 
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path = "/signup" element={<SignUp />} />
            <Route path = "/home" element={<ProtectedRoute>
              <HomePage />
            </ProtectedRoute>} /> 
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App
