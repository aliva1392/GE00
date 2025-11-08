import React from 'react';

const NavLink: React.FC<{
    children: React.ReactNode;
    icon: React.ReactNode;
    href: string;
    isActive?: boolean;
}> = ({ children, icon, href, isActive = false }) => (
    <a
        href={href}
        className={`flex items-center px-4 py-2 mt-5 text-gray-100 transition-colors duration-200 transform rounded-md ${isActive ? 'bg-gray-700' : 'hover:bg-gray-700 hover:text-gray-200'}`}
    >
        {icon}
        <span className="mx-4 font-medium">{children}</span>
    </a>
);


const Sidebar: React.FC = () => {
    const hash = window.location.hash;

    return (
        <div className="flex flex-col w-64 h-screen px-4 py-8 bg-gray-800 border-r rtl:border-r-0 rtl:border-l">
            <a href="#/admin" className="text-2xl font-bold text-white">
                پنل مدیریت
            </a>
            <div className="flex flex-col justify-between flex-1 mt-6">
                <nav>
                    <NavLink
                        href="#/admin"
                        isActive={hash === '#/admin' || hash.startsWith('#/admin/order')}
                        icon={<svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19 11H5M19 11C20.1046 11 21 11.8954 21 13V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V13C3 11.8954 3.89543 11 5 11M19 11V9C19 7.89543 18.1046 7 17 7M5 11V9C5 7.89543 5.89543 7 7 7M7 7V5C7 3.89543 7.89543 3 9 3H15C16.1046 3 17 3.89543 17 5V7M7 7H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                    >
                        داشبورد
                    </NavLink>
                     <NavLink
                        href="#/admin/prices"
                        isActive={hash === '#/admin/prices'}
                        icon={<svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17 9.5C17 11.433 15.433 13 13.5 13H10.5C8.567 13 7 11.433 7 9.5C7 7.567 8.567 6 10.5 6H13.5C15.433 6 17 7.567 17 9.5ZM12 18.5C14.4853 18.5 16.5 16.4853 16.5 14H7.5C7.5 16.4853 9.51472 18.5 12 18.5ZM12 4.5C9.51472 4.5 7.5 6.51472 7.5 9H16.5C16.5 6.51472 14.4853 4.5 12 4.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M12 21V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M12 2V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M21 12L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M2 12L3 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                    >
                        مدیریت قیمت‌ها
                    </NavLink>
                     <NavLink
                        href="#/admin/users"
                        isActive={hash === '#/admin/users'}
                        icon={<svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17 21V19C17 16.7909 15.2091 15 13 15H5C2.79086 15 1 16.7909 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M23 21V19C22.9992 16.9143 21.3695 15.2453 19.284 15.067" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M16 3.13C17.9253 3.58557 19.4144 5.07471 19.87 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                    >
                        مدیریت کاربران
                    </NavLink>
                </nav>
            </div>
        </div>
    );
};

export default Sidebar;