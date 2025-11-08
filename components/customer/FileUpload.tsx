import React, { useState, useCallback, useEffect } from 'react';
import { UploadedFile, UploadMethod, OrderConfig } from '../../types';
import { UPLOAD_METHOD_OPTIONS } from '../../constants';
import * as pdfjsLib from 'pdfjs-dist';

// Set worker source for pdf.js
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@4.4.168/build/pdf.worker.min.mjs`;

const Spinner: React.FC = () => (
    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

const TextAreaInput: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }> = ({ label, ...props }) => (
    <div className="mt-4">
        <label className="block text-sm font-medium text-gray-400 mb-1">{label}</label>
        <textarea {...props} rows={2} className="block w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm" />
    </div>
);


interface FileUploadProps {
    files: UploadedFile[];
    setFiles: React.Dispatch<React.SetStateAction<UploadedFile[]>>;
    config: OrderConfig;
    setConfig: React.Dispatch<React.SetStateAction<OrderConfig>>;
    isPrintOptionsSelected: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ files, setFiles, config, setConfig, isPrintOptionsSelected }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleMethodSelect = (method: UploadMethod) => {
        if (method === 'upload') {
            setConfig(prev => ({ ...prev, uploadMethod: method, uploadDetails: '' }));
        } else {
             setFiles([]); // Clear files if switching away from upload
             setConfig(prev => ({ ...prev, uploadMethod: method }));
        }
    };
    
    const handleDetailsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setConfig(prev => ({ ...prev, [name]: value }));
    };


    const handleFileChange = async (newFiles: FileList | null) => {
        if (!newFiles) return;

        setIsProcessing(true);
        setError(null);

        const processedFilesPromises = Array.from(newFiles).map(async (file): Promise<UploadedFile | null> => {
            let actualPageCount = 1;
            let previewUrl: string | undefined = undefined;

            if (file.type === 'application/pdf') {
                try {
                    const arrayBuffer = await file.arrayBuffer();
                    const loadingTask = pdfjsLib.getDocument(arrayBuffer);
                    const pdf = await loadingTask.promise;
                    actualPageCount = pdf.numPages;
                } catch (e) {
                    console.error("Error processing PDF:", e);
                    setError(`فایل ${file.name} یک PDF معتبر نیست.`);
                    return null;
                }
            } else if (file.type.startsWith('image/')) {
                previewUrl = URL.createObjectURL(file);
            }
            
            // The page count used for calculation, adjusted for double-sided printing
            const pageCount = (config.sided === 'double' && actualPageCount % 2 !== 0)
                ? actualPageCount + 1
                : actualPageCount;

            return { file, actualPageCount, pageCount, previewUrl };
        });

        const newProcessedFiles = (await Promise.all(processedFilesPromises)).filter(Boolean) as UploadedFile[];
        setFiles(prev => [...prev, ...newProcessedFiles]);
        setIsProcessing(false);
    };
    
    useEffect(() => {
        return () => {
            files.forEach(f => {
                if (f.previewUrl) {
                    URL.revokeObjectURL(f.previewUrl);
                }
            });
        };
    }, [files]);


    const onDragEnter = useCallback((e: React.DragEvent<HTMLLabelElement>) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); }, []);
    const onDragLeave = useCallback((e: React.DragEvent<HTMLLabelElement>) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); }, []);
    const onDragOver = useCallback((e: React.DragEvent<HTMLLabelElement>) => { e.preventDefault(); e.stopPropagation(); }, []);
    const onDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFileChange(e.dataTransfer.files);
        }
    }, [config.sided]);

    const removeFile = (index: number) => {
        const fileToRemove = files[index];
        if (fileToRemove.previewUrl) {
            URL.revokeObjectURL(fileToRemove.previewUrl);
        }
        setFiles(files.filter((_, i) => i !== index));
    };
    
    const getDetailsPlaceholder = () => {
        switch(config.uploadMethod) {
            case 'whatsapp':
            case 'telegram':
                return 'لطفا شماره تماس یا آیدی خود را وارد کنید.';
            case 'link':
                return 'لطفا لینک فایل (مانند گوگل درایو) را اینجا قرار دهید.';
            case 'email':
                return 'لطفا ایمیلی که فایل را از آن ارسال می‌کنید، ذکر کنید.';
            case 'other':
                return 'لطفا روش ارسال و جزئیات لازم را توضیح دهید.';
            default:
                return '';
        }
    }


    return (
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 relative">
             {!isPrintOptionsSelected && (
                <div className="absolute inset-0 bg-gray-900 bg-opacity-80 flex items-center justify-center rounded-lg z-10 cursor-not-allowed">
                    <p className="text-gray-300 font-semibold text-center px-4">
                        لطفا ابتدا تنظیمات اصلی چاپ (سایز، رنگ و نوع چاپ) را در بخش ۱ مشخص کنید.
                    </p>
                </div>
            )}
            <h3 className="text-lg font-semibold text-gray-100 border-b border-gray-600 pb-4 mb-6">۲. انتخاب و ارسال فایل</h3>
            
             <label className="block text-sm font-medium text-gray-400 mb-3">روش ارسال فایل</label>
            <div className="flex flex-wrap gap-3">
                {UPLOAD_METHOD_OPTIONS.map(opt => (
                    <button
                        key={opt.value}
                        type="button"
                        onClick={() => handleMethodSelect(opt.value as UploadMethod)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
                            config.uploadMethod === opt.value
                                ? 'bg-teal-500 text-white border-teal-500 shadow-md'
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600 border-gray-600'
                        }`}
                    >
                        {opt.label}
                    </button>
                ))}
            </div>

            {config.uploadMethod !== 'upload' && config.uploadMethod !== '' && (
                <TextAreaInput 
                    label="جزئیات ارسال"
                    name="uploadDetails"
                    value={config.uploadDetails}
                    onChange={handleDetailsChange}
                    placeholder={getDetailsPlaceholder()}
                />
            )}

            {config.uploadMethod === 'upload' && (
                <div className="mt-6">
                    <div className="mb-4">
                        <p className="text-sm text-gray-400">در صورت آپلود فایل، تعداد صفحات به صورت خودکار محاسبه شده و جایگزین مقدار دستی می‌شود.</p>
                    </div>
                     <label onDragEnter={onDragEnter} onDragLeave={onDragLeave} onDragOver={onDragOver} onDrop={onDrop} className={`flex justify-center w-full h-32 px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-md cursor-pointer transition-colors ${isDragging ? 'border-teal-500 bg-gray-700' : ''}`}>
                        <div className="space-y-1 text-center">
                            <svg className="mx-auto h-12 w-12 text-gray-500" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <div className="flex text-sm text-gray-400">
                                <p className="pl-1">فایل را اینجا بکشید یا</p>
                                <span className="relative font-medium text-teal-400 hover:text-teal-300">
                                    برای انتخاب کلیک کنید
                                    <input id="file-upload" name="file-upload" type="file" multiple className="sr-only" onChange={e => handleFileChange(e.target.files)} disabled={isProcessing} />
                                </span>
                            </div>
                             <p className="text-xs text-gray-500">PDF, DOCX, JPG, PNG</p>
                        </div>
                    </label>

                    {isProcessing && <div className="flex items-center justify-center mt-4 text-gray-300"><Spinner /><span>در حال پردازش فایل‌ها...</span></div>}
                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                    
                    {files.length > 0 && (
                        <div className="mt-6">
                            <h4 className="font-medium text-gray-200">فایل‌های انتخاب شده:</h4>
                            <ul className="mt-2 divide-y divide-gray-700">
                                {files.map((f, i) => (
                                    <li key={i} className="flex items-center justify-between py-3">
                                        <div className="flex items-center">
                                            {f.previewUrl && <img src={f.previewUrl} alt="Preview" className="w-10 h-10 object-cover rounded-md ml-4" />}
                                            <span className="text-gray-300">{f.file.name} ({f.actualPageCount.toLocaleString('fa-IR')} صفحه)</span>
                                        </div>
                                        <button onClick={() => removeFile(i)} className="text-red-500 hover:text-red-400 text-sm">حذف</button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default FileUpload;