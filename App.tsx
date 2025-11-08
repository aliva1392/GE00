import React from 'react';
import CustomerPortal from './pages/CustomerPortal';
import AdminPortal from './pages/AdminPortal';
import LoginPage from './pages/LoginPage';
import CustomerAccount from './pages/CustomerAccount';
import { AuthProvider, useAuth } from './contexts/AuthContext';

const AppRouter: React.FC = () => {
    const [route, setRoute] = React.useState(window.location.hash);
    const { user, isLoading } = useAuth();

    React.useEffect(() => {
        const handleHashChange = () => {
            setRoute(window.location.hash);
        };
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
                <svg className="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            </div>
        );
    }
    
    // Admin routing logic
    if (route.startsWith('#/admin')) {
        if (route === '#/admin/login') {
            if (user?.role === 'admin') {
                window.location.hash = '#/admin';
                return null;
            }
            return <LoginPage portal="admin" />;
        }
        if (user?.role !== 'admin') {
            window.location.hash = '#/admin/login';
            return null;
        }
        return <AdminPortal />;
    }

    // Customer routing logic
    if (route === '#/login') {
         if (user) {
            window.location.hash = '#/';
            return null;
        }
        return <LoginPage portal="customer" />;
    }

    if (route === '#/account') {
        if (!user) {
            window.location.hash = '#/login';
            return null;
        }
        return <CustomerAccount />;
    }


    return <CustomerPortal />;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
};

export default App;