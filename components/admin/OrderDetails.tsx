import React, { useState, useEffect } from 'react';
import { Order, CartItem, OrderStatus } from '../../types';
import { PAPER_SIZE_OPTIONS, PRINT_QUALITY_OPTIONS } from '../../constants';

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

const OrderDetails: React.FC<OrderDetailsProps> = ({ orderId }) => {
    const [order, setOrder] = useState<Order | null>(null);
    const [status, setStatus] = useState<OrderStatus | ''>('');
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    useEffect(() => {
        try {
            const savedOrders: Order[] = JSON.parse(localStorage.getItem('printShopOrders') || '[]');
            const currentOrder = savedOrders.find(o => o.id === orderId);
            if (currentOrder) {
                setOrder(currentOrder);
                setStatus(currentOrder.status);
            }
        } catch (error) {
            console.error("Failed to load order:", error);
        }
    }, [orderId]);

    const handleStatusUpdate = () => {
        if (!order || !status) return;

        setIsSaving(true);
        setSaveSuccess(false);

        setTimeout(() => { // Simulate API call
            try {
                const savedOrders: Order[] = JSON.parse(localStorage.getItem('printShopOrders') || '[]');
                const updatedOrders = savedOrders.map(o => o.id === orderId ? { ...o, status: status } : o);
                localStorage.setItem('printShopOrders', JSON.stringify(updatedOrders));
                setOrder(prev => prev ? { ...prev, status: status } : null);
                setSaveSuccess(true);
            } catch (error) {
                console.error("Failed to update status:", error);
            } finally {
                setIsSaving(false);
                setTimeout(() => setSaveSuccess(false), 3000);
            }
        }, 1000);
    };

    if (!order) {
        return <div className="text-center text-gray-600">در حال بارگذاری اطلاعات سفارش...</div>;
    }

    return (
        <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">سفارش {order.id}</h2>
                        <div className="text-sm text-gray-500 mt-2 space-y-1">
                            <p>مشتری: <strong className="text-gray-700">{order.customer.fullName}</strong></p>
                            <p>شماره تماس: <span className="text-gray-700">{order.customer.phoneNumber}</span></p>
                            <p>تاریخ ثبت: {new Date(order.date).toLocaleString('fa-IR')}</p>
                        </div>
                    </div>
                    <div className="flex flex-col items-end">
                        <StatusBadge status={order.status} />
                         <span className="text-xl font-bold text-gray-700 mt-2">{order.totalAmount.toLocaleString('fa-IR')} تومان</span>
                    </div>
                </div>
                 <div className="mt-6 border-t pt-4 flex items-center gap-4">
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700">تغییر وضعیت:</label>
                    <select
                        id="status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value as OrderStatus)}
                        className="block w-48 px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                    >
                        <option value="new">جدید</option>
                        <option value="processing">در حال انجام</option>
                        <option value="completed">تکمیل شده</option>
                        <option value="cancelled">لغو شده</option>
                    </select>
                    <button 
                        onClick={handleStatusUpdate}
                        disabled={isSaving || status === order.status}
                        className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-gray-400"
                    >
                        {isSaving ? 'در حال ذخیره...' : 'ذخیره'}
                    </button>
                    {saveSuccess && <span className="text-sm text-green-600">وضعیت با موفقیت به‌روز شد.</span>}
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                 <h3 className="text-lg font-semibold text-gray-700 border-b pb-4 mb-4">آیتم‌های سفارش</h3>
                 <div className="space-y-6">
                    {order.items.map((item, index) => (
                        <div key={item.id} className="border border-gray-200 p-4 rounded-md">
                            <h4 className="font-bold text-gray-800">آیتم #{index + 1}</h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2 text-sm">
                                <div><strong className="text-gray-600">سایز:</strong> {getLabel(PAPER_SIZE_OPTIONS, item.config.paperSize || '')}</div>
                                <div><strong className="text-gray-600">کیفیت:</strong> {getLabel(PRINT_QUALITY_OPTIONS, item.config.printQuality || '')}</div>
                                <div><strong className="text-gray-600">نوع چاپ:</strong> {item.config.sided === 'double' ? 'دو رو' : 'یک رو'}</div>
                                <div><strong className="text-gray-600">خدمات:</strong> {item.config.service !== 'none' ? 'دارد' : 'ندارد'}</div>
                                <div><strong className="text-gray-600">تعداد صفحات:</strong> {item.totalPages.toLocaleString('fa-IR')}</div>
                                <div><strong className="text-gray-600">تعداد برگه‌ها:</strong> {item.numberOfSheets.toLocaleString('fa-IR')}</div>
                                <div><strong className="text-gray-600">تعداد سری:</strong> {item.config.seriesCount.toLocaleString('fa-IR')}</div>
                                <div><strong className="text-gray-600">هزینه کل آیتم:</strong> {item.costs.totalCost.toLocaleString('fa-IR')} تومان</div>
                                <div className="col-span-full"><strong className="text-gray-600">روش ارسال:</strong> {item.config.uploadMethod}</div>
                                {item.config.uploadDetails && <div className="col-span-full"><strong className="text-gray-600">جزئیات ارسال:</strong> {item.config.uploadDetails}</div>}
                                {item.config.description && <div className="col-span-full"><strong className="text-gray-600">توضیحات:</strong> {item.config.description}</div>}
                                {item.files.length > 0 && (
                                     <div className="col-span-full">
                                        <strong className="text-gray-600">فایل‌ها:</strong>
                                        <ul className="list-disc list-inside mt-1">
                                            {item.files.map(f => <li key={f.file.name}>{f.file.name}</li>)}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                 </div>
            </div>
            
            <a href="#/admin" className="text-purple-600 hover:underline">بازگشت به داشبورد</a>
        </div>
    );
};

export default OrderDetails;