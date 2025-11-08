import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { User } from '../types';
import * as authService from '../services/authService';

interface AuthContextType {
    user: User | null;
    login: (user: User) => void;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check for a logged-in user on initial load
        const currentUser = authService.getCurrentUser();
        if (currentUser) {
            setUser(currentUser);
        }
        setIsLoading(false);
    }, []);

    const login = (loggedInUser: User) => {
        setUser(loggedInUser);
    };

    const logout = () => {
        authService.logout();
        setUser(null);
        // Redirect to appropriate page after logout
        if (window.location.hash.startsWith('#/admin')) {
             window.location.hash = '#/admin/login';
        } else {
             window.location.hash = '#/';
        }
    };

    const value = { user, login, logout, isLoading };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
