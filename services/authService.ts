import { User } from '../types';

const ADMIN_PHONE_NUMBERS = ['09123456789'];
const MOCK_OTP = '123456';
const USER_STORAGE_KEY = 'printShopUser';
const USERS_DB_KEY = 'printShopUsers';

// Helper to get all users from the simulated DB
const getUsersFromDb = (): User[] => {
    try {
        const usersJson = localStorage.getItem(USERS_DB_KEY);
        return usersJson ? JSON.parse(usersJson) : [];
    } catch (e) {
        console.error("Failed to parse users from DB", e);
        return [];
    }
};

// Helper to save all users to the simulated DB
const saveUsersToDb = (users: User[]): void => {
    try {
        localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));
    } catch (e) {
        console.error("Failed to save users", e);
    }
};


// Simulate sending an OTP. In a real app, this would call an SMS gateway API.
export const sendOtp = async (phoneNumber: string): Promise<void> => {
    console.log(`Sending OTP to ${phoneNumber}...`);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
    // For demonstration, we'll alert the mock OTP.
    alert(`کد تایید برای شماره ${phoneNumber}: ${MOCK_OTP}`);
    console.log(`OTP for ${phoneNumber} is ${MOCK_OTP}`);
};

// Simulate verifying the OTP.
export const verifyOtp = async (phoneNumber: string, otp: string): Promise<{ user: User | null, isNew: boolean }> => {
    console.log(`Verifying OTP for ${phoneNumber}...`);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay

    if (otp === MOCK_OTP) {
        const allUsers = getUsersFromDb();
        const existingUser = allUsers.find(u => u.phoneNumber === phoneNumber);

        if (existingUser) {
            // User exists, log them in
            try {
                localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(existingUser));
            } catch (error) {
                console.error("Failed to save user to localStorage", error);
            }
            return { user: existingUser, isNew: false };
        } else {
            // User does not exist, signal to UI to register
            return { user: null, isNew: true };
        }
    }

    return { user: null, isNew: false };
};

// Register a new user and log them in
export const registerNewUser = async (phoneNumber: string, fullName: string): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
    const allUsers = getUsersFromDb();
    const newUser: User = {
        phoneNumber,
        fullName,
        role: ADMIN_PHONE_NUMBERS.includes(phoneNumber) ? 'admin' : 'customer',
        addresses: [], // Initialize with an empty address list
    };
    saveUsersToDb([...allUsers, newUser]);
    
    // Log the new user in
    try {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));
    } catch (error) {
        console.error("Failed to save user to localStorage", error);
    }
    return newUser;
};

// Update user data in the DB and current session
export const updateUserData = async (updatedUser: User): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    const allUsers = getUsersFromDb();
    const userIndex = allUsers.findIndex(u => u.phoneNumber === updatedUser.phoneNumber);

    if (userIndex !== -1) {
        allUsers[userIndex] = updatedUser;
        saveUsersToDb(allUsers);
        
        // Also update the currently logged-in user's session
        const currentUser = getCurrentUser();
        if (currentUser && currentUser.phoneNumber === updatedUser.phoneNumber) {
            localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
        }
        
        return updatedUser;
    } else {
        throw new Error("User not found for update");
    }
};


// Log out the user by clearing storage.
export const logout = (): void => {
    try {
        localStorage.removeItem(USER_STORAGE_KEY);
    } catch (error)
    {
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


// Get all users for admin panel
export const getAllUsers = (): User[] => {
    return getUsersFromDb();
};
