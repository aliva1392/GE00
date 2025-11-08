import React, { useState, useEffect } from 'react';
import { Order, OrderStatus } from '../../types';

const StatusBadge: React.FC<{ status: OrderStatus }> = ({ status }) => {
    const statusStyles = {
        completed: { text: 'تکمیل شده', bg: 'bg-green-100', text_color: 'text-green-800' },
        processing: { text: 'در حال انجام', bg: 'bg-yellow-100', text_color: 'text-yellow-800' },
        cancelled: { text: 'لغو شده', bg: 'bg-red-100', text_color: 'text-red-800' },
        new: { text: 'جدید', bg: 'bg-blue-100', text_color: 'text-blue-800' },
    };
    const style = statusStyles[status];
    return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${style.bg} ${style.text_color}`}>{style.text}</span>;
};

const Dashboard: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);

    useEffect(() => {
        try {
            const savedOrders = localStorage.getItem('printShopOrders');
            if (savedOrders) {
                setOrders(JSON.parse(savedOrders));
            }
        } catch (error) {
            console.error("Failed to load orders from localStorage", error);
        }
    }, []);
    
    const navigateToOrder = (orderId: string) => {
        window.location.hash = `#/admin/order/${orderId}`;
    };

    const totalRevenue = orders.reduce((sum, order) => order.status === 'completed' ? sum + order.totalAmount : sum, 0);
    const newOrdersCount = orders.filter(o => o.status === 'new').length;

    return (
        <div>
            {/* Stat Cards */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                 <div className="bg-blue-500 text-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-medium">سفارشات جدید</h3>
                    <p className="mt-2 text-3xl font-semibold">{newOrdersCount.toLocaleString('fa-IR')}</p>
                </div>
                 <div className="bg-green-500 text-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-medium">درآمد کل (تومان)</h3>
                    <p className="mt-2 text-3xl font-semibold">{totalRevenue.toLocaleString('fa-IR')}</p>
                </div>
                 <div className="bg-yellow-500 text-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-medium">در حال انجام</h3>
                    <p className="mt-2 text-3xl font-semibold">{orders.filter(o => o.status === 'processing').length.toLocaleString('fa-IR')}</p>
                </div>
                 <div className="bg-indigo-500 text-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-medium">کل سفارشات</h3>
                    <p className="mt-2 text-3xl font-semibold">{orders.length.toLocaleString('fa-IR')}</p>
                </div>
            </div>

            {/* Recent Orders Table */}
            <div className="mt-8 bg-white rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-700 p-6 border-b">آخرین سفارشات</h3>
                <div className="overflow-x-auto">
                    <table className="w-full min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">کد سفارش</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">مشتری</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">تاریخ</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">مبلغ کل</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">وضعیت</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {orders.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-10 text-center text-gray-500">هیچ سفارشی یافت نشد.</td>
                                </tr>
                            ) : (
                                orders.slice(0, 10).map(order => ( // Show latest 10 orders
                                    <tr key={order.id} onClick={() => navigateToOrder(order.id)} className="hover:bg-gray-50 cursor-pointer">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.customer.fullName}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(order.date).toLocaleDateString('fa-IR')}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.totalAmount.toLocaleString('fa-IR')} تومان</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <StatusBadge status={order.status} />
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;