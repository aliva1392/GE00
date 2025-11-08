import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface HeaderProps {
    title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
    const { logout } = useAuth();
    return (
        <header className="relative z-10 py-4 bg-white shadow-md">
            <div className="container flex items-center justify-between h-full px-6 mx-auto text-purple-600">
                <div className="flex items-center">
                    <h1 className="text-lg font-semibold text-gray-700">{title}</h1>
                </div>
                <ul className="flex items-center flex-shrink-0 space-x-6 space-x-reverse">
                    <li>
                        <a
                           href="#/"
                           className="text-sm font-medium text-gray-600 hover:text-purple-600 focus:outline-none"
                        >
                           بازگشت به سایت
                        </a>
                    </li>
                     <li>
                        <button
                           onClick={logout}
                           className="text-sm font-medium text-purple-600 hover:text-purple-700 focus:outline-none"
                        >
                           خروج از حساب
                        </button>
                    </li>
                </ul>
            </div>
        </header>
    );
};

export default Header;