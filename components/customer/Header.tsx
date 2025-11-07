import React from 'react';

const Header: React.FC = () => {
    const navigateToAdmin = () => {
        window.location.hash = '#/admin';
    };

    return (
        <header className="bg-gray-800 shadow-md border-b border-gray-700">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <a href="#" className="flex-shrink-0">
                             <h1 className="text-white text-xl font-bold">تاپکپی</h1>
                        </a>
                    </div>
                    <div className="flex items-center space-x-4">
                       <a href="#" className="text-gray-300 hover:text-white">سبد خرید</a>
                       <a href="#" className="text-gray-300 hover:text-white">چت‌ها</a>
                       <button
                         onClick={navigateToAdmin}
                         className="text-white hover:text-gray-200 bg-teal-500 hover:bg-teal-600 px-3 py-1 rounded transition-colors focus:outline-none"
                       >
                         پنل مدیریت
                       </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;