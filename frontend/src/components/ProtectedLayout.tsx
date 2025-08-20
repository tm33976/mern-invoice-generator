import { useDispatch } from 'react-redux';
import { useNavigate, Outlet } from 'react-router-dom';
import { logout } from '@/store/authSlice';
import { Button } from './ui/button';

const Logo = () => (
    <div className="flex items-center gap-2">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <div>
        <p className="font-bold text-white">levitation</p>
        <p className="text-xs text-gray-400">infotech</p>
      </div>
    </div>
  );

const ProtectedLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-white">
      <header className="bg-[#161b22] border-b border-gray-800">
        <div className="container mx-auto flex justify-between items-center px-4 py-3">
          <Logo />
          <Button 
            onClick={handleLogout}
            className="bg-green-500 text-white hover:bg-green-600 h-8 px-4 rounded-md"
          >
            Logout
          </Button>
        </div>
      </header>
      <main className="container mx-auto p-4 md:p-8">
        <Outlet /> {/* Child routes will be rendered here */}
      </main>
    </div>
  );
};

export default ProtectedLayout;
