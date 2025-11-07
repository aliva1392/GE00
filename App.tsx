import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { OrderConfig, UploadedFile, OrderCosts } from './types';
import { PRINT_OPTIONS, BINDING_OPTIONS, PRICING } from './constants';
import FileUpload from './components/FileUpload';
import PrintOptions from './components/PrintOptions';
import OrderSummary from './components/OrderSummary';
import Header from './components/Header';

const App: React.FC = () => {
  const [orderConfig, setOrderConfig] = useState<OrderConfig>({
    files: [],
    paperSize: '',
    printQuality: '',
    sided: '',
    copies: 1,
    manualPageCount: 1,
    binding: 'none',
    cover: 'none',
    spiralColor: 'black',
    description: '',
  });

  const [costs, setCosts] = useState<OrderCosts>({
    printCost: 0,
    bindingCost: 0,
    totalCost: 0,
  });

  const totalPagesPerCopy = useMemo(() => {
    if (orderConfig.files.length > 0) {
      return orderConfig.files.reduce((sum, file) => sum + file.pages, 0);
    }
    return orderConfig.manualPageCount;
  }, [orderConfig.files, orderConfig.manualPageCount]);

  const totalPages = totalPagesPerCopy * orderConfig.copies;

  const calculateCosts = useCallback(() => {
    if (!orderConfig.paperSize || !orderConfig.printQuality || !orderConfig.sided) {
        setCosts({ printCost: 0, bindingCost: 0, totalCost: 0 });
        return;
    }
    
    const pricePerPage = PRICING.print[orderConfig.paperSize]?.[orderConfig.printQuality] || 0;
    const totalPrintCost = totalPagesPerCopy * pricePerPage * orderConfig.copies;
    
    let totalBindingCost = 0;
    const sheetsPerCopy = orderConfig.sided === 'double' ? Math.ceil(totalPagesPerCopy / 2) : totalPagesPerCopy;

    if (orderConfig.binding !== 'none' && sheetsPerCopy > 0) {
      const bindingPriceInfo = PRICING.binding[orderConfig.binding];
      const baseBindingCost = bindingPriceInfo.base;
      const costPerSheet = bindingPriceInfo.perPage;
      totalBindingCost = (baseBindingCost + (sheetsPerCopy * costPerSheet)) * orderConfig.copies;
    }
    
    setCosts({
      printCost: totalPrintCost,
      bindingCost: totalBindingCost,
      totalCost: totalPrintCost + totalBindingCost,
    });
  }, [orderConfig.copies, orderConfig.sided, orderConfig.binding, orderConfig.paperSize, orderConfig.printQuality, totalPagesPerCopy]);

  useEffect(() => {
    calculateCosts();
  }, [calculateCosts]);

  const handleConfigChange = (field: keyof OrderConfig, value: any) => {
    setOrderConfig(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (files: UploadedFile[]) => {
    setOrderConfig(prev => ({ ...prev, files }));
  };

  return (
    <div className="bg-gray-100 min-h-screen text-slate-800">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                <PrintOptions 
                    config={orderConfig} 
                    options={PRINT_OPTIONS} 
                    bindingOptions={BINDING_OPTIONS}
                    onChange={handleConfigChange} 
                />
            </div>
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                <FileUpload files={orderConfig.files} onFileChange={handleFileChange} />
            </div>
            <div className="flex justify-start">
                <button 
                    className="bg-blue-600 text-white font-semibold py-2 px-8 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition disabled:bg-gray-400"
                    disabled={totalPages === 0 || !orderConfig.paperSize || !orderConfig.printQuality || !orderConfig.sided}
                >
                    ثبت سفارش
                </button>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-6">
                <OrderSummary config={orderConfig} costs={costs} totalPages={totalPages} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;