import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import * as authService from '../services/authService';

interface LoginPageProps {
    portal: 'customer' | 'admin';
}

const Spinner: React.FC = () => (
    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

const LoginPage: React.FC<LoginPageProps> = ({ portal }) => {
    const [step, setStep] = useState<'phone' | 'otp' | 'register'>('phone');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [fullName, setFullName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { login } = useAuth();

    const title = portal === 'admin' ? 'ورود به پنل مدیریت' : 'ورود / ثبت نام';
    const accentColor = portal === 'admin' ? 'purple' : 'teal';

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!/^\d{11}$/.test(phoneNumber)) {
            setError('لطفا یک شماره موبایل ۱۱ رقمی معتبر وارد کنید.');
            return;
        }
        setError(null);
        setIsLoading(true);
        try {
            await authService.sendOtp(phoneNumber);
            setStep('otp');
        } catch (err) {
            setError('خطا در ارسال کد. لطفا دوباره تلاش کنید.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);
        try {
            const { user, isNew } = await authService.verifyOtp(phoneNumber, otp);
            if (user) { // Existing user
                if (portal === 'admin' && user.role !== 'admin') {
                     setError('شما دسترسی لازم برای ورود به این بخش را ندارید.');
                     return;
                }
                login(user);
                window.location.hash = portal === 'admin' ? '#/admin' : '#/';
            } else if (isNew) {
                setStep('register');
            }
            else {
                setError('کد تایید وارد شده صحیح نمی‌باشد.');
            }
        } catch (err) {
            setError('خطا در تایید کد. لطفا دوباره تلاش کنید.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!fullName.trim()) {
            setError('لطفا نام و نام خانوادگی خود را وارد کنید.');
            return;
        }
        setError(null);
        setIsLoading(true);
        try {
            const newUser = await authService.registerNewUser(phoneNumber, fullName);
             if (portal === 'admin' && newUser.role !== 'admin') {
                setError('شما دسترسی لازم برای ورود به این بخش را ندارید.');
                authService.logout(); // Log them out immediately
                setStep('phone');
                return;
            }
            login(newUser);
            window.location.hash = portal === 'admin' ? '#/admin' : '#/';
        } catch (err) {
            setError('خطا در ثبت نام. لطفا دوباره تلاش کنید.');
        } finally {
            setIsLoading(false);
        }
    };

    const renderForm = () => {
        switch(step) {
            case 'otp':
                return (
                     <form onSubmit={handleVerifyOtp} className="space-y-6">
                        <p className="text-center text-sm text-gray-400">کد تایید به شماره {phoneNumber} ارسال شد. <button type="button" onClick={() => setStep('phone')} className="font-medium text-teal-400 hover:text-teal-300">ویرایش شماره</button></p>
                        <div>
                            <label htmlFor="otp" className="block text-sm font-medium text-gray-400 mb-2">کد تایید</label>
                            <input
                                id="otp"
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                placeholder="کد ۶ رقمی را وارد کنید"
                                required
                                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800"
                                 style={{borderColor: `var(--color-${accentColor}-500)`}}
                            />
                        </div>
                        <button
                             type="submit"
                             disabled={isLoading}
                             className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-${accentColor}-600 hover:bg-${accentColor}-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-${accentColor}-500 disabled:bg-gray-600`}
                        >
                            {isLoading ? <Spinner /> : 'تایید و ادامه'}
                        </button>
                    </form>
                );
            case 'register':
                return (
                     <form onSubmit={handleRegister} className="space-y-6">
                        <p className="text-center text-sm text-gray-400">برای تکمیل ثبت‌نام، لطفا نام خود را وارد کنید.</p>
                        <div>
                            <label htmlFor="fullName" className="block text-sm font-medium text-gray-400 mb-2">نام و نام خانوادگی</label>
                            <input
                                id="fullName"
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="مثال: مریم رضایی"
                                required
                                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800"
                                 style={{borderColor: `var(--color-${accentColor}-500)`}}
                            />
                        </div>
                        <button
                             type="submit"
                             disabled={isLoading}
                             className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-${accentColor}-600 hover:bg-${accentColor}-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-${accentColor}-500 disabled:bg-gray-600`}
                        >
                            {isLoading ? <Spinner /> : 'ثبت نام و ورود'}
                        </button>
                    </form>
                );
            case 'phone':
            default:
                 return (
                    <form onSubmit={handleSendOtp} className="space-y-6">
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-400 mb-2">شماره موبایل</label>
                            <input
                                id="phone"
                                type="tel"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                placeholder="مثال: 09123456789"
                                required
                                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800"
                                style={{borderColor: `var(--color-${accentColor}-500)`}}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-${accentColor}-600 hover:bg-${accentColor}-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-${accentColor}-500 disabled:bg-gray-600`}
                        >
                            {isLoading ? <Spinner /> : 'ارسال کد تایید'}
                        </button>
                    </form>
                );
        }
    }


    return (
        <div className="min-h-screen bg-gray-900 flex flex-col justify-center items-center px-4">
            <a href="#/" className="flex items-center gap-3 mb-8">
                <svg width="40" height="40" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 13.5H30V22.5H6V13.5Z" fill="#22D3EE"/>
                    <path d="M9 9H27V13.5H9V9Z" fill="#22D3EE"/>
                    <path d="M9 22.5H27V28.5H9V22.5Z" stroke="#9CA3AF" strokeWidth="2"/>
                    <path d="M12 24.75H24" stroke="#22D3EE" strokeWidth="1.5" strokeLinecap="round"/>
                    <path d="M12 26.25H24" stroke="#22D3EE" strokeWidth="1.5" strokeLinecap="round"/>
                    <circle cx="28.5" cy="16.5" r="1" fill="#9CA3AF"/>
                </svg>
                <span className="text-white text-3xl font-bold">چاپینو</span>
            </a>
            <div className="w-full max-w-md bg-gray-800 p-8 rounded-lg border border-gray-700 shadow-xl">
                <h2 className="text-2xl font-bold text-center text-gray-100 mb-6">{title}</h2>
                {renderForm()}
                 {error && <p className="mt-4 text-center text-sm text-red-400">{error}</p>}
            </div>
             <style>{`
                :root {
                    --color-teal-500: #14b8a6;
                    --color-teal-600: #0d9488;
                    --color-teal-700: #0f766e;
                    --color-purple-500: #8b5cf6;
                    --color-purple-600: #7c3aed;
                    --color-purple-700: #6d28d9;
                }
                .bg-teal-600 { background-color: var(--color-teal-600); }
                .hover\\:bg-teal-700:hover { background-color: var(--color-teal-700); }
                .focus\\:ring-teal-500:focus { --tw-ring-color: var(--color-teal-500); }
                 .bg-purple-600 { background-color: var(--color-purple-600); }
                .hover\\:bg-purple-700:hover { background-color: var(--color-purple-700); }
                .focus\\:ring-purple-500:focus { --tw-ring-color: var(--color-purple-500); }
            `}</style>
        </div>
    );
};

export default LoginPage;