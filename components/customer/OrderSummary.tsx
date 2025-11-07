import React from 'react';
import { OrderConfig } from '../../types';

interface OrderSummaryProps {
    config: OrderConfig;
    numberOfSheets: number;
    costs: {
        printCost: number;
        serviceCost: number;
        totalCost: number;
        pricePerSheet: number;
    };
    isOrderReady: boolean;
    onAddToCart: () => void;
}

const SummaryRow: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
    <div className="flex justify-between py-2 border-b border-gray-700 text-sm">
        <span className="text-gray-400">{label}:</span>
        <span className="font-medium text-gray-200">{value}</span>
    </div>
);

const OrderSummary: React.FC<OrderSummaryProps> = ({ config, numberOfSheets, costs, isOrderReady, onAddToCart }) => {
    
    const singleSheetCost = costs.pricePerSheet + (costs.serviceCost > 0 ? costs.serviceCost / numberOfSheets : 0)

    return (
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 sticky top-8">
            <h3 className="text-lg font-semibold text-gray-100 border-b border-gray-600 pb-4 mb-4">خلاصه سفارش</h3>
            <div className="space-y-2">
                <SummaryRow label="تعداد برگه" value={numberOfSheets.toLocaleString('fa-IR')} />
                {costs.pricePerSheet > 0 && <SummaryRow label="قیمت هر برگ" value={`${costs.pricePerSheet.toLocaleString('fa-IR')} تومان`} />}
                <SummaryRow label="تعداد سری" value={config.seriesCount.toLocaleString('fa-IR')} />
                <SummaryRow label="هزینه خدمات هر سری" value={`${costs.serviceCost.toLocaleString('fa-IR')} تومان`} />
                
                <div className="!mt-6 pt-4 border-t-2 border-gray-600 flex justify-between items-center">
                     <span className="text-lg font-bold text-gray-100">مبلغ قابل پرداخت:</span>
                     <span className="text-xl font-bold text-teal-400">{costs.totalCost.toLocaleString('fa-IR')} تومان</span>
                </div>
            </div>
            <div className="mt-6">
                <button
                    disabled={!isOrderReady}
                    onClick={onAddToCart}
                    className="w-full bg-teal-500 text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:bg-teal-600 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
                >
                    افزودن به سبد خرید
                </button>
            </div>
        </div>
    );
};

export default OrderSummary;