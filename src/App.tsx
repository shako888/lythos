import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import AboutPage from './pages/AboutPage';
import SyllabusPage from './pages/SyllabusPage';
import RegisterPage from './pages/RegisterPage';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import TermsPage from './pages/TermsPage';
import IPBlocker from './components/IPBlocker';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

// Admin pages don't show the Navbar
const publicNavbarRoutes = ['/', '/about', '/syllabus', '/register', '/terms'];

function Layout() {
  const { pathname } = useLocation();
  const showNavbar = publicNavbarRoutes.includes(pathname);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {showNavbar && <Navbar />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/syllabus" element={<SyllabusPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      {showNavbar && (
        <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 py-8 text-center text-sm text-slate-400 dark:text-slate-500 transition-colors duration-300">
          © {new Date().getFullYear()} LYTHOS
        </footer>
      )}
    </div>
  );
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <IPBlocker>
        <Layout />
      </IPBlocker>
    </Router>
  );
}

export default App;
