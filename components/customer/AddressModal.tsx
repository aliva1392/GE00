import React, { useState } from 'react';
import { Address } from '../../types';

interface AddressModalProps {
    onClose: () => void;
    onSave: (address: Address) => void;
    addressToEdit?: Address | null;
}

const AddressModal: React.FC<AddressModalProps> = ({ onClose, onSave, addressToEdit }) => {
    const [title, setTitle] = useState(addressToEdit?.title || '');
    const [fullAddress, setFullAddress] = useState(addressToEdit?.fullAddress || '');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !fullAddress.trim()) {
            setError('لطفا هر دو فیلد عنوان و آدرس کامل را پر کنید.');
            return;
        }

        onSave({
            id: addressToEdit?.id || `addr-${Date.now()}`,
            title,
            fullAddress,
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[60] p-4">
            <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-md border border-gray-700">
                <form onSubmit={handleSubmit}>
                    <div className="p-6 border-b border-gray-700">
                        <h3 className="text-lg font-bold text-white">
                            {addressToEdit ? 'ویرایش آدرس' : 'افزودن آدرس جدید'}
                        </h3>
                    </div>
                    <div className="p-6 space-y-4">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-400 mb-2">عنوان آدرس</label>
                            <input
                                id="title"
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="مثال: خانه، محل کار"
                                required
                                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="fullAddress" className="block text-sm font-medium text-gray-400 mb-2">آدرس کامل</label>
                            <textarea
                                id="fullAddress"
                                value={fullAddress}
                                onChange={(e) => setFullAddress(e.target.value)}
                                rows={3}
                                placeholder="استان، شهر، خیابان اصلی، کوچه، پلاک، واحد و کد پستی"
                                required
                                className="block w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md shadow-sm focus:outline-none focus:ring-teal-500 sm:text-sm"
                            />
                        </div>
                        {error && <p className="text-sm text-red-400">{error}</p>}
                    </div>
                    <div className="p-4 bg-gray-900/50 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-600 rounded-lg hover:bg-gray-500">
                            انصراف
                        </button>
                        <button type="submit" className="px-6 py-2 text-sm font-medium text-white bg-teal-500 rounded-lg hover:bg-teal-600">
                            ذخیره
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddressModal;