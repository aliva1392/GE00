import React, { useState } from 'react';
import { CartItem, Order } from '../../types';
import { PAPER_SIZE_OPTIONS, PRINT_QUALITY_OPTIONS } from '../../constants';
import { useAuth } from '../../contexts/AuthContext';

interface CartSummaryProps {
    items: CartItem[];
    onRemoveItem: (id: string) => void;
    onClearCart: () => void;
}

const CartSummary: React.FC<CartSummaryProps> = ({ items, onRemoveItem, onClearCart }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const { user } = useAuth();
    const totalCartCost = items.reduce((sum, item) => sum + item.costs.totalCost, 0);

    const handleFinalSubmit = () => {
        if (!user) {
            alert('برای ثبت نهایی سفارش، لطفا ابتدا وارد حساب کاربری خود شوید.');
            window.location.hash = '#/login';
            return;
        }

        setIsSubmitting(true);
        setSubmitSuccess(false);

        // Simulate API call
        setTimeout(() => {
            try {
                const newOrder: Order = {
                    id: `ORD-${Date.now()}`,
                    customer: {
                        phoneNumber: user.phoneNumber,
                        fullName: user.fullName
                    },
                    date: new Date().toISOString(),
                    totalAmount: totalCartCost,
                    status: 'new',
                    items: items,
                };
                
                const existingOrders: Order[] = JSON.parse(localStorage.getItem('printShopOrders') || '[]');
                localStorage.setItem('printShopOrders', JSON.stringify([newOrder, ...existingOrders]));

                setSubmitSuccess(true);
                onClearCart();
            } catch (error) {
                console.error("Failed to save order:", error);
                alert('خطا در ثبت سفارش. لطفا دوباره تلاش کنید.');
            } finally {
                setIsSubmitting(false);
            }
        }, 1500);
    };
    
    const getLabel = (options: {value: string, label: string}[], value: string) => {
        return options.find(opt => opt.value === value)?.label || value;
    }

    return (
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h3 className="text-lg font-semibold text-gray-100 border-b border-gray-600 pb-4 mb-4">سبد خرید</h3>
            {submitSuccess && (
                 <div className="px-6 py-10 text-center bg-green-900/50 border border-green-700 rounded-lg">
                    <h4 className="text-lg font-bold text-green-300">سفارش شما با موفقیت ثبت شد!</h4>
                    <p className="text-green-400 mt-2">می‌توانید وضعیت سفارش را از پنل کاربری خود پیگیری کنید.</p>
                     <a href="#/account" className="mt-4 inline-block bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">مشاهده سفارشات</a>
                </div>
            )}
            {!submitSuccess && items.length === 0 ? (
                <div className="px-6 py-10 text-center text-gray-500">
                    سبد خرید شما خالی است.
                </div>
            ) : !submitSuccess && (
                <>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-right text-gray-400">
                            <thead className="text-xs text-gray-300 uppercase bg-gray-700">
                                <tr>
                                    <th scope="col" className="px-6 py-3">جزئیات</th>
                                    <th scope="col" className="px-6 py-3">تعداد برگه</th>
                                    <th scope="col" className="px-6 py-3">تعداد سری</th>
                                    <th scope="col" className="px-6 py-3">مبلغ کل</th>
                                    <th scope="col" className="px-6 py-3"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map(item => (
                                    <tr key={item.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                                        <td className="px-6 py-4 font-medium text-gray-200">
                                            {getLabel(PAPER_SIZE_OPTIONS, item.config.paperSize || '')}، {getLabel(PRINT_QUALITY_OPTIONS, item.config.printQuality || '')}، {item.config.sided === 'double' ? 'دو رو' : 'یک رو'}
                                        </td>
                                        <td className="px-6 py-4">{item.numberOfSheets.toLocaleString('fa-IR')}</td>
                                        <td className="px-6 py-4">{item.config.seriesCount.toLocaleString('fa-IR')}</td>
                                        <td className="px-6 py-4">{item.costs.totalCost.toLocaleString('fa-IR')} تومان</td>
                                        <td className="px-6 py-4">
                                            <button onClick={() => onRemoveItem(item.id)} className="font-medium text-red-500 hover:text-red-400">حذف</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-6 pt-4 border-t-2 border-gray-600 flex justify-between items-center">
                        <span className="text-lg font-bold text-gray-100">جمع کل سبد خرید:</span>
                        <span className="text-xl font-bold text-teal-400">{totalCartCost.toLocaleString('fa-IR')} تومان</span>
                    </div>

                    <div className="mt-6">
                        <button
                            onClick={handleFinalSubmit}
                            disabled={items.length === 0 || isSubmitting}
                            className="w-full bg-green-600 text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                        >
                            {isSubmitting ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    در حال ثبت...
                                </>
                            ) : "پرداخت و ثبت نهایی سفارش"}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default CartSummary;