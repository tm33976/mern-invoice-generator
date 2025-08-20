import { Link, Outlet, useLocation } from 'react-router-dom';
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

const PublicLayout = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  return (
    <div className="min-h-screen bg-[#0d1117] text-white">
      <header className="bg-[#161b22] border-b border-gray-800">
        <div className="container mx-auto flex justify-between items-center px-4 py-3">
          <Logo /> 
          <Link to={isLoginPage ? "/" : "/login"}>
            <Button 
              variant="outline" 
              className="bg-green-500 text-white hover:bg-green-600 h-8 px-4 rounded-md cursor-pointer"
            >
              {isLoginPage ? "Register" : "Login"}
            </Button>
            
          </Link>
        </div>
      </header>
      <main className="container mx-auto p-4 md:p-8 flex items-center justify-center flex-grow">
        <Outlet /> {/* Child pages (Login/Register) will be rendered here */}
      </main>
    </div>
  );
};

export default PublicLayout;
