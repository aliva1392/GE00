import React, { useState, useEffect } from 'react';
import Header from '../components/customer/Header';
import PrintOptions from '../components/customer/PrintOptions';
import FileUpload from '../components/customer/FileUpload';
import OrderSummary from '../components/customer/OrderSummary';
import CartSummary from '../components/customer/CartSummary';
import AIAssistant from '../components/customer/AIAssistant';
import { OrderConfig, UploadedFile, CartItem, PaperSize, PrintQuality, Sided } from '../types';
import { TIERED_PRICING, SERVICE_PRICING } from '../constants';

const initialConfig: OrderConfig = {
    paperSize: '',
    printQuality: '',
    sided: '',
    manualPageCount: 1,
    seriesCount: 1,
    service: 'none',
    talcType: 'none',
    springColor: 'white',
    description: '',
    uploadMethod: '',
    uploadDetails: ''
};

const CustomerPortal: React.FC = () => {
    const [config, setConfig] = useState<OrderConfig>(initialConfig);
    const [files, setFiles] = useState<UploadedFile[]>([]);
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [costs, setCosts] = useState({ printCost: 0, serviceCost: 0, totalCost: 0, pricePerSheet: 0 });
    const [numberOfSheets, setNumberOfSheets] = useState(0);

    useEffect(() => {
        const calculateCosts = () => {
            if (!config.paperSize || !config.printQuality || !config.sided || config.seriesCount < 1) {
                setCosts({ printCost: 0, serviceCost: 0, totalCost: 0, pricePerSheet: 0 });
                setNumberOfSheets(0);
                return;
            }

            const totalPages = files.length > 0
                ? files.reduce((sum, file) => sum + file.pageCount, 0)
                : config.manualPageCount;
            
            if (totalPages <= 0) {
                 setCosts({ printCost: 0, serviceCost: 0, totalCost: 0, pricePerSheet: 0 });
                 setNumberOfSheets(0);
                 return;
            }

            const sheets = config.sided === 'double' ? Math.ceil(totalPages / 2) : totalPages;
            setNumberOfSheets(sheets);

            const tiers = TIERED_PRICING[config.paperSize as PaperSize]?.[config.printQuality as PrintQuality];
            if (!tiers) return;

            // Calculate price based on the total number of sheets across all series
            const totalSheetsForAllSeries = sheets * config.seriesCount;
            const tier = tiers.find(t => totalSheetsForAllSeries >= t.min && totalSheetsForAllSeries <= t.max);
            
            if (!tier) return;
            
            const pricePerSheet = tier.prices[config.sided as Sided];
            const printCostPerSeries = sheets * pricePerSheet;
            const printCost = printCostPerSeries * config.seriesCount;
            
            const serviceCostPerSeries = config.service !== 'none' ? SERVICE_PRICING[config.service as keyof typeof SERVICE_PRICING] : 0;
            const serviceCost = serviceCostPerSeries * config.seriesCount;
            
            const totalCost = printCost + serviceCost;

            setCosts({ printCost, serviceCost: serviceCostPerSeries, totalCost, pricePerSheet });
        };

        calculateCosts();
    }, [config, files]);
    
    const handleAISuggestion = (suggestion: Partial<OrderConfig>) => {
        setConfig(prev => ({ ...prev, ...suggestion }));
    };

    const addToCart = () => {
        const totalPages = files.length > 0 ? files.reduce((sum, file) => sum + file.actualPageCount, 0) : config.manualPageCount;

        const newCartItem: CartItem = {
            id: `item-${Date.now()}`,
            config: { ...config },
            files: [...files],
            totalPages,
            numberOfSheets,
            costs: {
                printCost: costs.printCost,
                serviceCost: costs.serviceCost * config.seriesCount,
                totalCost: costs.totalCost
            },
        };

        setCartItems(prev => [...prev, newCartItem]);
        setConfig(initialConfig);
        setFiles([]);
    };

    const removeFromCart = (id: string) => {
        setCartItems(prev => prev.filter(item => item.id !== id));
    };
    
    const clearCart = () => {
        setCartItems([]);
    }

    const pageCountAvailable = files.length > 0 || config.manualPageCount > 0;
    const uploadMethodValid =
        (config.uploadMethod === 'upload' && files.length > 0) ||
        (config.uploadMethod && config.uploadMethod !== 'upload' && config.uploadDetails.trim() !== '');

    const isOrderReady =
        !!config.paperSize &&
        !!config.printQuality &&
        !!config.sided &&
        config.seriesCount > 0 &&
        pageCountAvailable &&
        uploadMethodValid;

    return (
        <div className="bg-gray-900 text-white min-h-screen font-sans">
            <Header />
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="space-y-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                        <div className="lg:col-span-2 space-y-8">
                            <PrintOptions config={config} setConfig={setConfig} files={files} />
                            <FileUpload files={files} setFiles={setFiles} config={config} setConfig={setConfig} />
                        </div>
                        <div className="lg:col-span-1 space-y-8">
                            <AIAssistant onSuggestion={handleAISuggestion} />
                            <OrderSummary
                                config={config}
                                numberOfSheets={numberOfSheets}
                                costs={costs}
                                isOrderReady={isOrderReady}
                                onAddToCart={addToCart}
                            />
                        </div>
                    </div>

                    {cartItems.length > 0 && (
                        <CartSummary items={cartItems} onRemoveItem={removeFromCart} onClearCart={clearCart} />
                    )}
                </div>
            </main>
        </div>
    );
};

export default CustomerPortal;