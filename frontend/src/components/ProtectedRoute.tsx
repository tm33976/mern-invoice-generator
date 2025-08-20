import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import type { RootState } from '@/store/store';

const ProtectedRoute = () => {
  // Get user info from the Redux store
  const { userInfo } = useSelector((state: RootState) => state.auth);

  // If user is logged in, render the child route (e.g., the ProtectedLayout)
  // Otherwise, redirect them to the login page
  return userInfo ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
