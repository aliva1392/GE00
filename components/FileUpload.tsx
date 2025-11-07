import React, { useRef, useState, useCallback } from 'react';
import { UploadedFile } from '../types';

interface FileUploadProps {
  files: UploadedFile[];
  onFileChange: (files: UploadedFile[]) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ files, onFileChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadMethod, setUploadMethod] = useState('upload');

  const handleFileSelect = (selectedFiles: FileList | null) => {
    if (selectedFiles) {
      const newFiles = Array.from(selectedFiles).map((file: File) => ({
        id: crypto.randomUUID(),
        name: file.name,
        pages: 1, // Default page count
      }));
      onFileChange([...files, ...newFiles]);
    }
  };

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    if (event.dataTransfer.files) {
      handleFileSelect(event.dataTransfer.files);
    }
  }, [files]);

  return (
    <div className="p-5">
        <h2 className="text-base font-semibold text-gray-800 border-b border-gray-200 pb-4 mb-4">انتخاب و ارسال فایل</h2>
        
        <div className="flex items-center space-x-4 space-x-reverse mb-4 text-sm">
            {['آپلود فایل', 'واتساپ', 'تلگرام', 'لینک', 'ایمیل', 'سایر'].map(method => (
                <label key={method} className="flex items-center space-x-2 space-x-reverse cursor-pointer">
                    <input 
                        type="radio" 
                        name="uploadMethod" 
                        value={method} 
                        checked={uploadMethod === method}
                        onChange={(e) => setUploadMethod(e.target.value)}
                        className="form-radio text-blue-600 focus:ring-blue-500"
                    />
                    <span>{method}</span>
                </label>
            ))}
        </div>

        <div 
            className={`flex items-center justify-center w-full p-8 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'}`}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
        >
            <div className="text-center">
                <p className="text-gray-500">فایل را اینجا بکشید</p>
            </div>
            <input
                type="file"
                ref={fileInputRef}
                multiple
                onChange={(e) => handleFileSelect(e.target.files)}
                className="hidden"
                accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png"
            />
        </div>
        
        {files.length > 0 && (
             <div className="mt-4 text-sm">
                <p className="font-semibold mb-2">فایل‌های انتخاب شده:</p>
                <ul className="list-disc pr-5 space-y-1">
                    {files.map(file => <li key={file.id}>{file.name}</li>)}
                </ul>
            </div>
        )}

        <div className="mt-4 space-y-3 text-sm">
             <label className="block text-gray-600">توضیحات فایل/شماره اکانت خود را وارد نمایید</label>
             <input type="text" className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
        </div>
    </div>
  );
};

export default FileUpload;