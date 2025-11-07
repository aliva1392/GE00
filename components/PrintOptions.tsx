import React from 'react';
import { OrderConfig } from '../types';
import { PRINT_OPTIONS } from '../constants';

interface PrintOptionsProps {
  config: OrderConfig;
  options: typeof PRINT_OPTIONS;
  bindingOptions: any;
  onChange: (field: keyof OrderConfig, value: any) => void;
}

const SelectInput: React.FC<{ label: string, value: any, options: any[], onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void, required?: boolean, disabled?: boolean }> = ({ label, value, options, onChange, required, disabled }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <select value={value} onChange={onChange} disabled={disabled} className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-200 disabled:cursor-not-allowed">
            <option value="" disabled>انتخاب کنید</option>
            {options.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
        </select>
    </div>
);

const NumberInput: React.FC<{ label: string, value: number, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, required?: boolean, disabled?: boolean }> = ({ label, value, onChange, required, disabled }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <input 
            type="number" 
            min="1" 
            value={value} 
            onChange={onChange}
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-200 disabled:cursor-not-allowed"
            disabled={disabled}
        />
    </div>
);


const PrintOptions: React.FC<PrintOptionsProps> = ({ config, options, bindingOptions, onChange }) => {
  const isPaperSizeSelected = !!config.paperSize;

  return (
    <div className="p-5">
      <div className="border-b border-gray-200 pb-4 mb-4">
        <h2 className="text-base font-semibold text-gray-800">تنظیمات چاپ</h2>
        <div className="mt-2 p-3 text-sm text-blue-800 bg-blue-50 border border-blue-200 rounded-md">
            نکته: لطفا برای ثبت آسانتر روی علامت آبی کلیک کنید. (تعرفه هر برگ بر اساس جمع کل ردیف های فاکتور شما محاسبه می شود و بر حسب تعداد متغیر است) لطفا در هنگام وارد کردن اعداد کیبورد را در حالت لاتین قرار دهید.
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
        <SelectInput 
            label="سایز کاغذ" 
            value={config.paperSize} 
            options={options.paperSize} 
            onChange={(e) => onChange('paperSize', e.target.value)}
            required
        />
        <SelectInput 
            label="رنگ و کلاس چاپ" 
            value={config.printQuality} 
            options={options.printQuality} 
            onChange={(e) => onChange('printQuality', e.target.value)}
            required
            disabled={!isPaperSizeSelected}
        />
        <SelectInput 
            label="نوع چاپ" 
            value={config.sided} 
            options={options.sided} 
            onChange={(e) => onChange('sided', e.target.value)}
            disabled={!isPaperSizeSelected}
            required
        />
         <NumberInput 
            label="تعداد صفحات"
            value={config.manualPageCount}
            onChange={(e) => onChange('manualPageCount', parseInt(e.target.value, 10) || 1)}
            required
            disabled={config.files.length > 0 || !isPaperSizeSelected}
        />
        <NumberInput 
            label="تعداد سری"
            value={config.copies}
            onChange={(e) => onChange('copies', parseInt(e.target.value, 10) || 1)}
            required
            disabled={!isPaperSizeSelected}
        />
        <SelectInput 
            label="خدمات" 
            value={config.binding} 
            options={bindingOptions.binding} 
            onChange={(e) => onChange('binding', e.target.value)}
            disabled={!isPaperSizeSelected}
        />
        {config.binding !== 'none' && (
            <SelectInput 
                label="نوع طلق" 
                options={bindingOptions.cover} 
                value={config.cover} 
                onChange={(e) => onChange('cover', e.target.value)}
                disabled={!isPaperSizeSelected}
            />
        )}
        {config.binding === 'spiral' && (
            <SelectInput 
                label="رنگ فنر" 
                options={bindingOptions.spiralColor} 
                value={config.spiralColor} 
                onChange={(e) => onChange('spiralColor', e.target.value)}
                disabled={!isPaperSizeSelected}
            />
        )}
         <div className="md:col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
                توضیحات سفارش
            </label>
            <textarea
                value={config.description}
                onChange={(e) => onChange('description', e.target.value)}
                disabled={!isPaperSizeSelected}
                rows={3}
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-200 disabled:cursor-not-allowed"
            />
        </div>
      </div>
    </div>
  );
};

export default PrintOptions;