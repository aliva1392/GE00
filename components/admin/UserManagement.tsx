import React, { useState, useEffect } from 'react';
import { User } from '../../types';
import { getAllUsers } from '../../services/authService';

const UserManagement: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        setUsers(getAllUsers());
    }, []);

    const RoleBadge: React.FC<{ role: 'admin' | 'customer' }> = ({ role }) => {
        const is_admin = role === 'admin';
        return (
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${is_admin ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>
                {is_admin ? 'ادمین' : 'مشتری'}
            </span>
        );
    };

    return (
        <div className="bg-white rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700 p-6 border-b">لیست کاربران</h3>
            <div className="overflow-x-auto">
                <table className="w-full min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">نام و نام خانوادگی</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">شماره موبایل</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">نقش</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {users.length === 0 ? (
                            <tr>
                                <td colSpan={3} className="px-6 py-10 text-center text-gray-500">هیچ کاربری یافت نشد.</td>
                            </tr>
                        ) : (
                            users.map(user => (
                                <tr key={user.phoneNumber} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.fullName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.phoneNumber}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <RoleBadge role={user.role} />
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserManagement;