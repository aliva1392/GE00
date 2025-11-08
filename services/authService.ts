import { User } from '../types';

const ADMIN_PHONE_NUMBERS = ['09123456789'];
const MOCK_OTP = '123456';
const USER_STORAGE_KEY = 'printShopUser';

// Simulate sending an OTP. In a real app, this would call an SMS gateway API.
export const sendOtp = async (phoneNumber: string): Promise<void> => {
    console.log(`Sending OTP to ${phoneNumber}...`);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
    // For demonstration, we'll alert the mock OTP.
    alert(`کد تایید برای شماره ${phoneNumber}: ${MOCK_OTP}`);
    console.log(`OTP for ${phoneNumber} is ${MOCK_OTP}`);
};

// Simulate verifying the OTP.
export const verifyOtp = async (phoneNumber: string, otp: string): Promise<User | null> => {
    console.log(`Verifying OTP for ${phoneNumber}...`);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay

    if (otp === MOCK_OTP) {
        const user: User = {
            phoneNumber,
            role: ADMIN_PHONE_NUMBERS.includes(phoneNumber) ? 'admin' : 'customer',
        };
        try {
            localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
        } catch (error) {
            console.error("Failed to save user to localStorage", error);
        }
        return user;
    }

    return null;
};

// Log out the user by clearing storage.
export const logout = (): void => {
    try {
        localStorage.removeItem(USER_STORAGE_KEY);
    } catch (error) {
        console.error("Failed to remove user from localStorage", error);
    }
};

// Get the current user from storage.
export const getCurrentUser = (): User | null => {
    try {
        const userJson = localStorage.getItem(USER_STORAGE_KEY);
        return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
        console.error("Failed to get user from localStorage", error);
        return null;
    }
};
