import React, { useState, useEffect } from 'react';
import { getPricingConfig, savePricingConfig, PricingConfig } from '../../services/pricingService';
import { PAPER_SIZE_OPTIONS, PRINT_QUALITY_OPTIONS } from '../../constants';
import { produce } from 'immer';

const PriceManagement: React.FC = () => {
    const [pricing, setPricing] = useState<PricingConfig | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    useEffect(() => {
        setPricing(getPricingConfig());
    }, []);

    const handleTieredPriceChange = (paperSize: string, quality: string, tierIndex: number, side: 'single' | 'double', value: string) => {
        if (!pricing) return;
        
        const nextState = produce(pricing, draft => {
            draft.tiered[paperSize][quality][tierIndex].prices[side] = parseInt(value) || 0;
        });
        setPricing(nextState);
    };
    
    const handleServicePriceChange = (service: 'simple' | 'spring', value: string) => {
        if (!pricing) return;

        const nextState = produce(pricing, draft => {
            draft.services[service] = parseInt(value) || 0;
        });
        setPricing(nextState);
    };

    const handleSaveChanges = () => {
        if (!pricing) return;

        setIsSaving(true);
        setSaveSuccess(false);
        savePricingConfig(pricing);
        
        setTimeout(() => {
            setIsSaving(false);
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        }, 1000);
    };

    if (!pricing) {
        return <div>در حال بارگذاری قیمت‌ها...</div>;
    }

    return (
        <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold text-gray-800 border-b pb-4 mb-6">قیمت‌گذاری پلکانی چاپ</h2>
                
                {PAPER_SIZE_OPTIONS.map(sizeOpt => (
                    <div key={sizeOpt.value} className="mb-8">
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">سایز {sizeOpt.label}</h3>
                        <div className="space-y-4">
                            {PRINT_QUALITY_OPTIONS.map(qualityOpt => (
                                <div key={qualityOpt.value} className="border p-4 rounded-md">
                                    <h4 className="font-medium text-gray-600">{qualityOpt.label}</h4>
                                     <div className="overflow-x-auto mt-2">
                                        <table className="min-w-full text-sm">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-4 py-2 text-right font-medium text-gray-500">محدوده تعداد</th>
                                                    <th className="px-4 py-2 text-right font-medium text-gray-500">قیمت یک رو (تومان)</th>
                                                    <th className="px-4 py-2 text-right font-medium text-gray-500">قیمت دو رو (تومان)</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {pricing.tiered[sizeOpt.value]?.[qualityOpt.value]?.map((tier, index) => (
                                                    <tr key={index} className="border-t">
                                                        <td className="px-4 py-2 text-gray-600">{tier.min} - {tier.max === Infinity ? '+' : tier.max}</td>
                                                        <td className="px-4 py-2">
                                                            <input 
                                                                type="number"
                                                                value={tier.prices.single}
                                                                onChange={(e) => handleTieredPriceChange(sizeOpt.value, qualityOpt.value, index, 'single', e.target.value)}
                                                                className="w-24 p-1 border rounded-md"
                                                            />
                                                        </td>
                                                        <td className="px-4 py-2">
                                                            <input 
                                                                type="number"
                                                                value={tier.prices.double}
                                                                onChange={(e) => handleTieredPriceChange(sizeOpt.value, qualityOpt.value, index, 'double', e.target.value)}
                                                                className="w-24 p-1 border rounded-md"
                                                            />
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                     </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold text-gray-800 border-b pb-4 mb-6">قیمت‌گذاری خدمات</h2>
                <div className="space-y-4">
                     <div className="flex items-center gap-4">
                        <label className="w-32 text-gray-600">صحافی ساده:</label>
                        <input
                            type="number"
                            value={pricing.services.simple}
                            onChange={(e) => handleServicePriceChange('simple', e.target.value)}
                            className="w-32 p-1 border rounded-md"
                        />
                         <span>تومان</span>
                    </div>
                     <div className="flex items-center gap-4">
                        <label className="w-32 text-gray-600">صحافی فنری:</label>
                        <input
                            type="number"
                            value={pricing.services.spring}
                            onChange={(e) => handleServicePriceChange('spring', e.target.value)}
                            className="w-32 p-1 border rounded-md"
                        />
                        <span>تومان</span>
                    </div>
                </div>
            </div>

             <div className="flex justify-end items-center gap-4 mt-8 sticky bottom-8">
                 {saveSuccess && <span className="text-sm text-green-600">تغییرات با موفقیت ذخیره شد.</span>}
                <button
                    onClick={handleSaveChanges}
                    disabled={isSaving}
                    className="px-8 py-3 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-wait"
                >
                    {isSaving ? 'در حال ذخیره‌سازی...' : 'ذخیره تغییرات'}
                </button>
            </div>
        </div>
    );
};

export default PriceManagement;
