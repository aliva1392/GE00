import React, { useState, useEffect } from 'react';
import CustomerPortal from './pages/CustomerPortal';
import AdminPortal from './pages/AdminPortal';

const App: React.FC = () => {
  const [route, setRoute] = useState(window.location.hash);

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(window.location.hash);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const renderPortal = () => {
    switch (route) {
      case '#/admin':
        return <AdminPortal />;
      default:
        return <CustomerPortal />;
    }
  };

  return <>{renderPortal()}</>;
};

export default App;