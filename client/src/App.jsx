import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import LeadCaptureForm from './pages/LeadCaptureForm';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './utils/firebase';

// Stateful dynamic Protected Route wrapper
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
};

function App() {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  useEffect(() => {
    // Listen to Firebase authentication state changes in real-time
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const idToken = await user.getIdToken(true); // Force token refresh to make sure it is fresh
          localStorage.setItem('token', idToken);
          localStorage.setItem('user', JSON.stringify({
            email: user.email,
            name: user.displayName || user.email.split('@')[0],
            uid: user.uid
          }));
          setIsAuthenticated(true);
        } catch (err) {
          console.error("Error retrieving Firebase ID token:", err);
        }
      } else {
        // If there's no Firebase user, check if there's a legacy token before setting unauthorized
        if (!localStorage.getItem('token')) {
          setIsAuthenticated(false);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500"></div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} 
        />
        <Route path="/lead-form" element={<LeadCaptureForm />} />
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        {/* Wildcard fallback to redirect unknown paths */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
