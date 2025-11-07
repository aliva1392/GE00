import React from 'react';

const NavItem: React.FC<{ children: React.ReactNode, icon?: React.ReactNode }> = ({ children, icon }) => (
    <a href="#" className="flex items-center gap-2 text-sm text-white hover:bg-white/10 px-3 py-2 rounded-md transition-colors">
        {icon}
        {children}
    </a>
);

const Header: React.FC = () => {
    return (
        <header className="bg-[#1A237E] shadow-md">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Left side icons */}
                    <div className="flex items-center gap-4">
                       <NavItem icon={<CartIcon />}>سبد خرید</NavItem>
                       <NavItem icon={<ChatIcon />}>چت ها</NavItem>
                    </div>

                    {/* Right side logo and nav */}
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <span className="text-white font-bold text-lg">تاپکپی</span>
                            <div className="w-8 h-8 bg-white rounded-full"></div>
                        </div>
                        <nav className="hidden md:flex items-center gap-2">
                            <NavItem icon={<DashboardIcon />}>داشبورد</NavItem>
                            <a href="#" className="flex items-center gap-2 text-sm bg-blue-500 text-white px-3 py-2 rounded-md transition-colors">
                                <PlusIcon />
                                سفارش جدید
                            </a>
                            <NavItem>محصولات تکی</NavItem>
                            <NavItem>پرداخت متفرقه</NavItem>
                        </nav>
                    </div>
                </div>
            </div>
        </header>
    );
};

// SVG Icons
const CartIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
const ChatIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>;
const DashboardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>;


export default Header;