import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import AddProductPage from '@/pages/AddProductPage';
import ProtectedRoute from '@/components/ProtectedRoute';
import ProtectedLayout from '@/components/ProtectedLayout';
import PublicLayout from '@/components/PublicLayout'; // Import the new public layout

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<RegisterPage />} /> {/* Register is now the landing page */}
          <Route path="/login" element={<LoginPage />} />
        </Route>
        
        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<ProtectedLayout />}>
            <Route path="/add-product" element={<AddProductPage />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
