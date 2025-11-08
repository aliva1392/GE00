import React, { useState, useEffect } from 'react';
import Header from '../components/admin/Header';
import Sidebar from '../components/admin/Sidebar';
import Dashboard from '../components/admin/Dashboard';
import OrderDetails from '../components/admin/OrderDetails';
import PriceManagement from '../components/admin/PriceManagement';
import UserManagement from '../components/admin/UserManagement';

const AdminPortal: React.FC = () => {
    const [view, setView] = useState<{ page: 'dashboard' | 'order' | 'prices' | 'users'; id?: string }>({ page: 'dashboard' });
    const [pageTitle, setPageTitle] = useState('داشبورد');

    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash;
            const orderMatch = hash.match(/#\/admin\/order\/(.*)/);

            if (orderMatch && orderMatch[1]) {
                setView({ page: 'order', id: orderMatch[1] });
                setPageTitle(`جزئیات سفارش - ${orderMatch[1]}`);
            } else if (hash === '#/admin/prices') {
                 setView({ page: 'prices' });
                 setPageTitle('مدیریت قیمت‌ها');
            } else if (hash === '#/admin/users') {
                 setView({ page: 'users' });
                 setPageTitle('مدیریت کاربران');
            }
            else {
                setView({ page: 'dashboard' });
                setPageTitle('داشبورد');
            }
        };

        // Initial check
        handleHashChange();

        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);


    const renderContent = () => {
        switch (view.page) {
            case 'order':
                return view.id ? <OrderDetails orderId={view.id} /> : <Dashboard />;
            case 'prices':
                return <PriceManagement />;
            case 'users':
                return <UserManagement />;
            case 'dashboard':
            default:
                return <Dashboard />;
        }
    };

    return (
        <div className="flex h-screen bg-gray-100 font-sans">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header title={pageTitle} />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
                    <div className="container mx-auto px-6 py-8">
                        {renderContent()}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminPortal;