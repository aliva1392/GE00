import React, { useState, useEffect } from 'react';
import Header from '../components/customer/Header';
import { useAuth } from '../contexts/AuthContext';
import { Order, OrderStatus } from '../types';

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


const CustomerAccount: React.FC = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);

    useEffect(() => {
        if (user) {
            try {
                const allOrders: Order[] = JSON.parse(localStorage.getItem('printShopOrders') || '[]');
                const userOrders = allOrders.filter(order => order.customer.phoneNumber === user.phoneNumber);
                setOrders(userOrders);
            } catch (error) {
                console.error("Failed to load orders:", error);
            }
        }
    }, [user]);

    return (
        <div className="bg-gray-900 text-white min-h-screen font-sans">
            <Header />
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                    <h2 className="text-2xl font-bold text-gray-100 mb-6">حساب کاربری</h2>
                    <div className="border-b border-gray-600 pb-4 mb-6">
                        <h3 className="text-lg font-semibold">تاریخچه سفارشات</h3>
                    </div>

                    <div className="overflow-x-auto">
                         {orders.length === 0 ? (
                            <div className="text-center py-10 text-gray-500">
                                شما تاکنون هیچ سفارشی ثبت نکرده‌اید.
                            </div>
                        ) : (
                            <table className="w-full text-sm text-right text-gray-300">
                                <thead className="text-xs text-gray-400 uppercase bg-gray-700/50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">کد سفارش</th>
                                        <th scope="col" className="px-6 py-3">تاریخ</th>
                                        <th scope="col" className="px-6 py-3">مبلغ کل</th>
                                        <th scope="col" className="px-6 py-3">وضعیت</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map(order => (
                                        <tr key={order.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                                            <td className="px-6 py-4 font-mono text-gray-400">{order.id}</td>
                                            <td className="px-6 py-4">{new Date(order.date).toLocaleDateString('fa-IR')}</td>
                                            <td className="px-6 py-4">{order.totalAmount.toLocaleString('fa-IR')} تومان</td>
                                            <td className="px-6 py-4">
                                                <StatusBadge status={order.status} />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CustomerAccount;