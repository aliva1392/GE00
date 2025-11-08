import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

const Header: React.FC = () => {
    const { user, logout } = useAuth();

    const handleLoginClick = () => {
        window.location.hash = '#/login';
    };

    return (
        <header className="bg-gray-800 shadow-md border-b border-gray-700">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <a href="#/" className="flex-shrink-0 flex items-center gap-3">
                             <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
                                <path d="M6 13.5H30V22.5H6V13.5Z" fill="#22D3EE"/>
                                <path d="M9 9H27V13.5H9V9Z" fill="#22D3EE"/>
                                <path d="M9 22.5H27V28.5H9V22.5Z" stroke="#9CA3AF" strokeWidth="2"/>
                                <path d="M12 24.75H24" stroke="#22D3EE" strokeWidth="1.5" strokeLinecap="round"/>
                                <path d="M12 26.25H24" stroke="#22D3EE" strokeWidth="1.5" strokeLinecap="round"/>
                                <circle cx="28.5" cy="16.5" r="1" fill="#9CA3AF"/>
                            </svg>
                            <span className="text-white text-xl font-bold">چاپینو</span>
                        </a>
                    </div>
                    <div className="flex items-center">
                        {user ? (
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2 text-gray-300">
                                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                    </svg>
                                    <span className="font-medium">{user.phoneNumber}</span>
                                </div>
                                <button
                                    onClick={logout}
                                    className="text-gray-300 hover:text-white bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition-colors text-sm"
                                >
                                    خروج
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={handleLoginClick}
                                className="text-white hover:text-gray-100 bg-teal-500 hover:bg-teal-600 px-4 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-teal-500 font-medium"
                            >
                                ورود / ثبت نام
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;