import React from 'react';

interface HeaderProps {
    title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
    return (
        <header className="relative z-10 py-4 bg-white shadow-md">
            <div className="container flex items-center justify-between h-full px-6 mx-auto text-purple-600">
                <div className="flex items-center">
                    <h1 className="text-lg font-semibold text-gray-700">{title}</h1>
                </div>
                <ul className="flex items-center flex-shrink-0 space-x-6">
                    {/* Profile dropdown */}
                    <li className="relative">
                        <button className="align-middle rounded-full focus:shadow-outline-purple focus:outline-none" aria-label="Account" aria-haspopup="true">
                            <img className="object-cover w-8 h-8 rounded-full" src="https://via.placeholder.com/40" alt="" aria-hidden="true" />
                        </button>
                    </li>
                     {/* Back to customer portal link */}
                     <li>
                        <button
                           onClick={() => window.location.hash = '#/'}
                           className="text-sm font-medium text-gray-600 hover:text-purple-600 focus:outline-none"
                        >
                           بازگشت به سایت
                        </button>
                    </li>
                </ul>
            </div>
        </header>
    );
};

export default Header;
