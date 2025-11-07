import React from 'react';

const NavLink: React.FC<{
    children: React.ReactNode;
    // Fix: Changed `JSX.Element` to `React.ReactNode` to resolve the 'Cannot find namespace JSX' error.
    icon: React.ReactNode;
}> = ({ children, icon }) => (
    <a
        href="#"
        onClick={(e) => e.preventDefault()}
        className="flex items-center px-4 py-2 mt-5 text-gray-100 transition-colors duration-200 transform rounded-md bg-gray-700"
    >
        {icon}
        <span className="mx-4 font-medium">{children}</span>
    </a>
);


const Sidebar: React.FC = () => {
    return (
        <div className="flex flex-col w-64 h-screen px-4 py-8 bg-gray-800 border-r rtl:border-r-0 rtl:border-l">
            <a href="#/admin" className="text-2xl font-bold text-white">
                پنل مدیریت
            </a>
            <div className="flex flex-col justify-between flex-1 mt-6">
                <nav>
                    <NavLink
                        icon={<svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19 11H5M19 11C20.1046 11 21 11.8954 21 13V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V13C3 11.8954 3.89543 11 5 11M19 11V9C19 7.89543 18.1046 7 17 7M5 11V9C5 7.89543 5.89543 7 7 7M7 7V5C7 3.89543 7.89543 3 9 3H15C16.1046 3 17 3.89543 17 5V7M7 7H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                    >
                        داشبورد
                    </NavLink>
                </nav>
            </div>
        </div>
    );
};

export default Sidebar;
