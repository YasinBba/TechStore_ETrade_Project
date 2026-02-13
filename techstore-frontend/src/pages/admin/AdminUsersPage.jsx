import React, { useEffect, useState } from 'react';
import { User, Shield, ShieldOff, Mail, Calendar } from 'lucide-react';
// import { userService } from '../../services/userService'; // Uncomment when service is ready

// Mock data for now to fix build
const MOCK_USERS = [
    { id: 1, firstName: 'Admin', lastName: 'User', email: 'admin@techstore.com', role: 'Admin', created: '2024-01-01' },
    { id: 2, firstName: 'John', lastName: 'Doe', email: 'john@example.com', role: 'Customer', created: '2024-02-15' },
    { id: 3, firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', role: 'Customer', created: '2024-03-20' },
];

const AdminUsersPage = () => {
    const [users, setUsers] = useState(MOCK_USERS);
    const [loading, setLoading] = useState(false);

    // useEffect(() => {
    //     loadUsers();
    // }, []);

    // const loadUsers = async () => {
    //     setLoading(true);
    //     try {
    //         const result = await userService.getAll();
    //         if (result.success) setUsers(result.data);
    //     } catch (error) {
    //         console.error(error);
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    if (loading) return <div>Yükleniyor...</div>;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <User className="text-blue-600" /> Kullanıcı Yönetimi
            </h1>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-sm uppercase">
                            <th className="p-4 font-semibold">Kullanıcı</th>
                            <th className="p-4 font-semibold">Email</th>
                            <th className="p-4 font-semibold">Rol</th>
                            <th className="p-4 font-semibold">Kayıt Tarihi</th>
                            <th className="p-4 font-semibold text-right">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {users.map(user => (
                            <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                <td className="p-4 font-medium text-gray-900">
                                    {user.firstName} {user.lastName}
                                </td>
                                <td className="p-4 text-gray-600 flex items-center gap-2">
                                    <Mail size={16} /> {user.email}
                                </td>
                                <td className="p-4">
                                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${user.role === 'Admin'
                                            ? 'bg-purple-100 text-purple-800'
                                            : 'bg-green-100 text-green-800'
                                        }`}>
                                        {user.role === 'Admin' ? <Shield size={12} /> : <User size={12} />}
                                        {user.role}
                                    </span>
                                </td>
                                <td className="p-4 text-gray-500 text-sm">
                                    <div className="flex items-center gap-2">
                                        <Calendar size={16} />
                                        {user.created}
                                    </div>
                                </td>
                                <td className="p-4 text-right">
                                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium mr-3">Düzenle</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminUsersPage;
