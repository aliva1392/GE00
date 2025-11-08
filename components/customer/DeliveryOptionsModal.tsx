import React, { useState } from 'react';
import { Order, DeliveryMethod, DeliveryInfo } from '../../types';
import { updateOrderDelivery } from '../../services/orderService';

interface DeliveryOptionsModalProps {
    order: Order;
    onClose: () => void;
}

const Spinner: React.FC = () => (
    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

const DeliveryOptionCard: React.FC<{
    method: DeliveryMethod,
    title: string,
    description: string,
    icon: React.ReactNode,
    selected: boolean,
    onSelect: () => void
}> = ({ method, title, description, icon, selected, onSelect }) => (
    <div
        onClick={onSelect}
        className={`p-4 border rounded-lg cursor-pointer transition-all ${selected ? 'bg-teal-800/50 border-teal-500 ring-2 ring-teal-500' : 'bg-gray-700 border-gray-600 hover:border-teal-600'}`}
    >
        <div className="flex items-center gap-4">
            <div className="text-teal-400">{icon}</div>
            <div>
                <h4 className="font-semibold text-white">{title}</h4>
                <p className="text-sm text-gray-400">{description}</p>
            </div>
        </div>
    </div>
);

const DeliveryOptionsModal: React.FC<DeliveryOptionsModalProps> = ({ order, onClose }) => {
    const [selectedMethod, setSelectedMethod] = useState<DeliveryMethod | null>(null);
    const [address, setAddress] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        if (!selectedMethod) {
            setError('لطفا یک روش ارسال را انتخاب کنید.');
            return;
        }
        if ((selectedMethod === 'courier' || selectedMethod === 'post') && !address.trim()) {
            setError('لطفا آدرس خود را برای ارسال وارد کنید.');
            return;
        }
        
        setError('');
        setIsLoading(true);

        const deliveryInfo: DeliveryInfo = {
            method: selectedMethod,
            address: (selectedMethod === 'courier' || selectedMethod === 'post') ? address : undefined,
        };

        try {
            await updateOrderDelivery(order.id, deliveryInfo);
            onClose();
        } catch(err) {
            console.error("Failed to update delivery info", err);
            setError('خطا در ذخیره اطلاعات ارسال. لطفا دوباره تلاش کنید.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-lg border border-gray-700">
                <div className="p-6 border-b border-gray-700">
                    <h3 className="text-lg font-bold text-white">انتخاب روش دریافت سفارش</h3>
                    <p className="text-sm text-gray-400 mt-1">سفارش شما با موفقیت ثبت شد. لطفا نحوه دریافت آن را مشخص کنید.</p>
                </div>
                <div className="p-6 space-y-4">
                    <DeliveryOptionCard
                        method="pickup"
                        title="تحویل حضوری"
                        description="مراجعه به دفتر و دریافت سفارش بدون هزینه ارسال."
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
                        selected={selectedMethod === 'pickup'}
                        onSelect={() => setSelectedMethod('pickup')}
                    />
                    <DeliveryOptionCard
                        method="courier"
                        title="ارسال با پیک"
                        description="ارسال سریع در محدوده شهر (هزینه بر عهده مشتری)."
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2-2h8a1 1 0 001-1z" /></svg>}
                        selected={selectedMethod === 'courier'}
                        onSelect={() => setSelectedMethod('courier')}
                    />
                     <DeliveryOptionCard
                        method="post"
                        title="ارسال با پست"
                        description="ارسال به سراسر کشور از طریق پست پیشتاز."
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
                        selected={selectedMethod === 'post'}
                        onSelect={() => setSelectedMethod('post')}
                    />

                    {(selectedMethod === 'courier' || selectedMethod === 'post') && (
                        <div className="pt-2">
                             <label htmlFor="address" className="block text-sm font-medium text-gray-400 mb-2">آدرس دقیق</label>
                             <textarea
                                id="address"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                rows={3}
                                placeholder="استان، شهر، خیابان اصلی، کوچه، پلاک، واحد و کد پستی"
                                className="block w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                             />
                        </div>
                    )}

                    {error && <p className="text-sm text-red-400">{error}</p>}
                </div>
                <div className="p-4 bg-gray-900/50 flex justify-end">
                     <button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="w-full sm:w-auto bg-teal-500 text-white font-semibold py-2 px-8 rounded-lg shadow-md hover:bg-teal-600 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                    >
                         {isLoading ? <Spinner /> : 'تایید و ثبت نهایی'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeliveryOptionsModal;
