import React, { useState, useEffect } from 'react';
import Header from '../components/customer/Header';
import { useAuth } from '../contexts/AuthContext';
import { Order, OrderStatus } from '../types';
import { getOrdersForUser } from '../services/orderService';

const StatusBadge: React.FC<{ status: OrderStatus }> = ({ status }) => {
    const statusStyles = {
        completed: { text: 'تکمیل شده', bg: 'bg-green-800/50', text_color: 'text-green-300', border: 'border-green-700' },
        processing: { text: 'در حال انجام', bg: 'bg-yellow-800/50', text_color: 'text-yellow-300', border: 'border-yellow-700' },
        cancelled: { text: 'لغو شده', bg: 'bg-red-800/50', text_color: 'text-red-300', border: 'border-red-700' },
        new: { text: 'جدید', bg: 'bg-blue-800/50', text_color: 'text-blue-300', border: 'border-blue-700' },
    };
    const style = statusStyles[status];
    return <span className={`px-3 py-1 text-xs font-medium rounded-full border ${style.bg} ${style.text_color} ${style.border}`}>{style.text}</span>;
};

const StatCard: React.FC<{title: string, value: number, icon: React.ReactNode}> = ({ title, value, icon }) => (
    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 flex items-center gap-4">
        <div className="bg-gray-700 p-3 rounded-full text-teal-400">
            {icon}
        </div>
        <div>
            <p className="text-sm text-gray-400">{title}</p>
            <p className="text-2xl font-bold text-white">{value.toLocaleString('fa-IR')}</p>
        </div>
    </div>
);


const CustomerAccount: React.FC = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [stats, setStats] = useState({ total: 0, processing: 0, completed: 0 });

    useEffect(() => {
        if (user) {
            const userOrders = getOrdersForUser(user.phoneNumber);
            setOrders(userOrders);
            
            setStats({
                total: userOrders.length,
                processing: userOrders.filter(o => o.status === 'processing' || o.status === 'new').length,
                completed: userOrders.filter(o => o.status === 'completed').length
            });
        }
    }, [user]);

    return (
        <div className="bg-gray-900 text-white min-h-screen font-sans">
            <Header />
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                 <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-100">پنل کاربری شما</h2>
                        <p className="text-gray-400">سلام {user?.fullName}، به پنل کاربری خود خوش آمدید.</p>
                    </div>
                    <a href="#/" className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 hover:text-white transition-colors">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H3" />
                         </svg>
                        <span>بازگشت به فروشگاه</span>
                    </a>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                     <StatCard title="کل سفارشات" value={stats.total} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>} />
                     <StatCard title="سفارشات در حال انجام" value={stats.processing} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
                     <StatCard title="سفارشات تکمیل شده" value={stats.completed} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
                </div>
                
                <div>
                     <h3 className="text-lg font-semibold text-gray-200 mb-4">تاریخچه سفارشات</h3>
                     {orders.length === 0 ? (
                        <div className="text-center py-16 bg-gray-800 rounded-lg border border-dashed border-gray-700">
                            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <p className="mt-4 text-gray-400">شما تاکنون هیچ سفارشی ثبت نکرده‌اید.</p>
                             <a href="#/" className="mt-4 inline-block bg-teal-500 text-white px-6 py-2 rounded-lg hover:bg-teal-600 transition-colors">شروع خرید</a>
                        </div>
                    ) : (
                       <div className="space-y-4">
                            {orders.map(order => (
                                <div key={order.id} className="bg-gray-800 border border-gray-700 rounded-lg p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-gray-700/50 transition-colors">
                                    <div className="flex-1">
                                         <p className="font-mono text-sm text-teal-400">{order.id}</p>
                                         <p className="text-xs text-gray-400 mt-1"> ثبت در {new Date(order.date).toLocaleDateString('fa-IR')}</p>
                                    </div>
                                    <div className="flex-1 text-right sm:text-center">
                                         <p className="text-lg font-semibold">{order.totalAmount.toLocaleString('fa-IR')} <span className="text-sm font-normal text-gray-400">تومان</span></p>
                                    </div>
                                    <div className="w-full sm:w-auto sm:text-left mt-2 sm:mt-0">
                                        <StatusBadge status={order.status} />
                                    </div>
                                </div>
                            ))}
                       </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default CustomerAccount;