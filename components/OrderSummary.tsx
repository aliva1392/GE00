import React from 'react';
import { OrderConfig, OrderCosts } from '../types';

interface OrderSummaryProps {
  config: OrderConfig;
  costs: OrderCosts;
  totalPages: number;
}

const formatCurrency = (amount: number) => {
    return amount.toLocaleString('fa-IR');
}

const SummaryRow: React.FC<{ label: string; value: string; isTotal?: boolean }> = ({ label, value, isTotal = false }) => (
    <div className={`flex justify-between items-center py-2 ${isTotal ? 'font-bold text-lg' : 'text-sm'}`}>
        <span className="text-gray-600">{label}:</span>
        <span className="text-gray-900">{value}</span>
    </div>
);

const OrderSummary: React.FC<OrderSummaryProps> = ({ config, costs, totalPages }) => {
    const pricePerPage = costs.printCost / totalPages || 0;

    return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <h2 className="text-base font-semibold text-gray-800 p-4 border-b border-gray-200">خلاصه سفارش</h2>
        <div className="p-4 space-y-1 divide-y divide-gray-100">
            <SummaryRow label="تعداد برگه" value={formatCurrency(totalPages)} />
            <SummaryRow label="هر برگه" value={`${formatCurrency(pricePerPage)} تومان`} />
            <SummaryRow label="مجموع" value={`${formatCurrency(costs.printCost)} تومان`} />
            <SummaryRow label="هزینه خدمات" value={`${formatCurrency(costs.bindingCost)} تومان`} />
            <SummaryRow label="قابل پرداخت" value={`${formatCurrency(costs.totalCost)} تومان`} isTotal={true} />
        </div>
        <div className="p-4 bg-gray-50 rounded-b-lg">
             <button 
                className="w-full bg-blue-600 text-white font-bold py-2.5 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition disabled:bg-gray-400" 
                disabled={totalPages === 0}
            >
                ادامه سفارش
            </button>
        </div>
    </div>
  );
};

export default OrderSummary;