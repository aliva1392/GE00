import React from 'react';
import { OrderConfig, UploadedFile } from '../../types';
import {
    PAPER_SIZE_OPTIONS,
    PRINT_QUALITY_OPTIONS,
    SIDED_OPTIONS,
    SERVICE_OPTIONS,
    TALC_TYPE_OPTIONS,
    SPRING_COLOR_OPTIONS
} from '../../constants';

interface PrintOptionsProps {
    config: OrderConfig;
    setConfig: React.Dispatch<React.SetStateAction<OrderConfig>>;
    files: UploadedFile[];
}

const SelectInput: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & { label: string }> = ({ label, children, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-gray-400 mb-1">{label} {props.required && <span className="text-red-500">*</span>}</label>
        <select {...props} className="block w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm disabled:bg-gray-600 disabled:text-gray-400">
            <option value="">انتخاب کنید</option>
            {children}
        </select>
    </div>
);

const NumberInput: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string }> = ({ label, ...props }) => (
     <div>
        <label className="block text-sm font-medium text-gray-400 mb-1">{label} {props.required && <span className="text-red-500">*</span>}</label>
        <input type="number" {...props} className="block w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm disabled:bg-gray-600 disabled:text-gray-400" />
    </div>
);

const TextAreaInput: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }> = ({ label, ...props }) => (
    <div className="col-span-1 sm:col-span-2 lg:col-span-3">
        <label className="block text-sm font-medium text-gray-400 mb-1">{label}</label>
        <textarea {...props} rows={3} className="block w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm" />
    </div>
);


const PrintOptions: React.FC<PrintOptionsProps> = ({ config, setConfig, files }) => {
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setConfig(prev => ({ ...prev, [name]: name.includes('Count') ? parseInt(value) || 0 : value }));
    };

    const isPaperSizeSelected = !!config.paperSize;
    const isSidedSelected = !!config.sided;
    const hasFiles = files.length > 0;
    const isServiceSpring = config.service === 'spring';

    return (
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h3 className="text-lg font-semibold text-gray-100 border-b border-gray-600 pb-4 mb-6">۱. تنظیمات چاپ و خدمات</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <SelectInput label="سایز کاغذ" name="paperSize" value={config.paperSize} onChange={handleChange} required>
                    {PAPER_SIZE_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </SelectInput>
                <SelectInput label="رنگ و کلاس چاپ" name="printQuality" value={config.printQuality} onChange={handleChange} disabled={!isPaperSizeSelected} required>
                    {PRINT_QUALITY_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </SelectInput>
                 <SelectInput label="نوع چاپ" name="sided" value={config.sided} onChange={handleChange} disabled={!isPaperSizeSelected} required>
                    {SIDED_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </SelectInput>
                <NumberInput label="تعداد صفحات" name="manualPageCount" value={config.manualPageCount} onChange={handleChange} disabled={!isSidedSelected || hasFiles} min="1" />
                <NumberInput label="تعداد سری" name="seriesCount" value={config.seriesCount} onChange={handleChange} disabled={!isSidedSelected} required min="1" />
                
                <SelectInput label="خدمات" name="service" value={config.service} onChange={handleChange} disabled={!isPaperSizeSelected}>
                    {SERVICE_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </SelectInput>

                {isServiceSpring && (
                    <>
                        <SelectInput label="نوع طلق" name="talcType" value={config.talcType} onChange={handleChange}>
                            {TALC_TYPE_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                        </SelectInput>
                        <SelectInput label="رنگ فنر" name="springColor" value={config.springColor} onChange={handleChange}>
                           {SPRING_COLOR_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                        </SelectInput>
                    </>
                )}
                 <TextAreaInput label="توضیحات سفارش" name="description" value={config.description} onChange={handleChange} placeholder="مثال: ۱۰ صفحه اول رنگی و بقیه سیاه سفید چاپ شوند."/>
            </div>
        </div>
    );
};

export default PrintOptions;