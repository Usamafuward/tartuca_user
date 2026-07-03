import { Outlet } from 'react-router-dom';

function AuthLayout() {
  return (
    <div className="min-h-screen bg-light flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <Outlet />
    </div>
  );
}

export default AuthLayout;
