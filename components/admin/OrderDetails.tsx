import React, { useState, useEffect } from 'react';
import { Order, OrderStatus, DeliveryMethod, Address } from '../../types';
import { PAPER_SIZE_OPTIONS, PRINT_QUALITY_OPTIONS } from '../../constants';
import { getOrderById, updateOrderStatus } from '../../services/orderService';

interface OrderDetailsProps {
    orderId: string;
}

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

const getLabel = (options: { value: string, label: string }[], value: string) => {
    return options.find(opt => opt.value === value)?.label || value;
}

const getDeliveryMethodLabel = (method: DeliveryMethod) => {
    switch(method) {
        case 'pickup': return 'تحویل حضوری';
        case 'courier': return 'ارسال با پیک';
        case 'post': return 'ارسال با پست';
        default: return 'نامشخص';
    }
}


const OrderDetails: React.FC<OrderDetailsProps> = ({ orderId }) => {
    const [order, setOrder] = useState<Order | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const foundOrder = getOrderById(orderId);
        setOrder(foundOrder);
        setIsLoading(false);
    }, [orderId]);

    const handleStatusChange = async (newStatus: OrderStatus) => {
        if (!order) return;
        const updatedOrder = await updateOrderStatus(order.id, newStatus);
        if (updatedOrder) {
            setOrder(updatedOrder);
        }
    };

    if (isLoading) {
        return <div className="text-center p-8">در حال بارگذاری اطلاعات سفارش...</div>;
    }

    if (!order) {
        return <div className="text-center p-8 text-red-600">سفارش مورد نظر یافت نشد.</div>;
    }

    return (
        <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center border-b pb-4 mb-4">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">سفارش #{order.id}</h2>
                        <p className="text-sm text-gray-500">تاریخ ثبت: {new Date(order.date).toLocaleString('fa-IR')}</p>
                    </div>
                    <StatusBadge status={order.status} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <h4 className="font-semibold text-gray-600">اطلاعات مشتری</h4>
                        <p className="text-gray-800">{order.customer.fullName}</p>
                        <p className="text-gray-500">{order.customer.phoneNumber}</p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-600">روش ارسال</h4>
                        {order.delivery ? (
                            <>
                                <p className="text-gray-800">{getDeliveryMethodLabel(order.delivery.method)}</p>
                                {order.delivery.address && (
                                    <p className="text-gray-500 text-sm mt-1">
                                        <span className="font-medium">({order.delivery.address.title})</span> {order.delivery.address.fullAddress}
                                    </p>
                                )}
                            </>
                        ) : <p className="text-gray-500">هنوز مشخص نشده</p>}
                    </div>
                     <div>
                        <h4 className="font-semibold text-gray-600">مبلغ کل</h4>
                        <p className="text-gray-800 font-bold text-lg">{order.totalAmount.toLocaleString('fa-IR')} تومان</p>
                    </div>
                </div>
                 <div className="mt-6 pt-4 border-t">
                    <h4 className="font-semibold text-gray-600 mb-2">تغییر وضعیت سفارش</h4>
                    <div className="flex gap-2">
                         {(['new', 'processing', 'completed', 'cancelled'] as OrderStatus[]).map(status => (
                            <button 
                                key={status}
                                onClick={() => handleStatusChange(status)}
                                disabled={order.status === status}
                                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${order.status === status ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                            >
                                { {new: 'جدید', processing: 'در حال انجام', completed: 'تکمیل شده', cancelled: 'لغو شده'}[status] }
                            </button>
                         ))}
                    </div>
                </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-700 border-b pb-4 mb-4">آیتم‌های سفارش</h3>
                 <div className="space-y-4">
                    {order.items.map(item => (
                        <div key={item.id} className="border p-4 rounded-md">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <p><strong className="text-gray-600">سایز:</strong> {getLabel(PAPER_SIZE_OPTIONS, item.config.paperSize)}</p>
                                <p><strong className="text-gray-600">کیفیت:</strong> {getLabel(PRINT_QUALITY_OPTIONS, item.config.printQuality)}</p>
                                <p><strong className="text-gray-600">نوع چاپ:</strong> {item.config.sided === 'double' ? 'دو رو' : 'یک رو'}</p>
                                <p><strong className="text-gray-600">تعداد سری:</strong> {item.config.seriesCount.toLocaleString('fa-IR')}</p>
                                <p><strong className="text-gray-600">تعداد برگه:</strong> {item.numberOfSheets.toLocaleString('fa-IR')}</p>
                                <p><strong className="text-gray-600">هزینه آیتم:</strong> {item.costs.totalCost.toLocaleString('fa-IR')} تومان</p>
                                {item.config.description && <p className="col-span-2 md:col-span-4"><strong className="text-gray-600">توضیحات:</strong> {item.config.description}</p>}
                            </div>
                        </div>
                    ))}
                 </div>
            </div>
        </div>
    );
};

export default OrderDetails;