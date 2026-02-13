import { useState } from 'react';
import { X, Menu, Home, ShoppingBag, User, ShoppingCart, Phone, Info } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const MobileMenu = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { user, logout } = useAuth();
    const { items } = useCart();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        setIsOpen(false);
        navigate('/');
    };

    const menuItems = [
        { icon: Home, label: 'Ana Sayfa', path: '/' },
        { icon: ShoppingBag, label: 'Ürünler', path: '/products' },
        { icon: ShoppingCart, label: 'Sepet', path: '/cart', badge: items.length },
        { icon: Info, label: 'Hakkımızda', path: '/about' },
        { icon: Phone, label: 'İletişim', path: '/contact' },
    ];

    return (
        <>
            {/* Hamburger Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="md:hidden p-2 text-gray-700 hover:text-indigo-600 btn-icon"
                aria-label="Open menu"
            >
                <Menu size={24} />
            </button>

            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden animate-fade-in"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div
                className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 md:hidden ${isOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200">
                        <h2 className="text-xl font-bold text-gray-900">Menü</h2>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-2 text-gray-500 hover:text-gray-700 btn-icon"
                            aria-label="Close menu"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* User Section */}
                    {user && (
                        <div className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-200">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                                    {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900">{user.firstName} {user.lastName}</p>
                                    <p className="text-sm text-gray-600">{user.email}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Menu Items */}
                    <nav className="flex-1 overflow-y-auto p-4">
                        <ul className="space-y-2">
                            {menuItems.map((item) => (
                                <li key={item.path}>
                                    <Link
                                        to={item.path}
                                        onClick={() => setIsOpen(false)}
                                        className="flex items-center gap-3 p-3 rounded-lg text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                                    >
                                        <item.icon size={20} />
                                        <span className="font-medium">{item.label}</span>
                                        {item.badge !== undefined && item.badge > 0 && (
                                            <span className="ml-auto bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                                                {item.badge}
                                            </span>
                                        )}
                                    </Link>
                                </li>
                            ))}

                            {user && (
                                <>
                                    <li className="pt-2 border-t border-gray-200">
                                        <Link
                                            to="/profile"
                                            onClick={() => setIsOpen(false)}
                                            className="flex items-center gap-3 p-3 rounded-lg text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                                        >
                                            <User size={20} />
                                            <span className="font-medium">Profilim</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            to="/orders"
                                            onClick={() => setIsOpen(false)}
                                            className="flex items-center gap-3 p-3 rounded-lg text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                                        >
                                            <ShoppingBag size={20} />
                                            <span className="font-medium">Siparişlerim</span>
                                        </Link>
                                    </li>
                                </>
                            )}
                        </ul>
                    </nav>

                    {/* Footer */}
                    <div className="p-4 border-t border-gray-200">
                        {user ? (
                            <button
                                onClick={handleLogout}
                                className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors"
                            >
                                Çıkış Yap
                            </button>
                        ) : (
                            <div className="space-y-2">
                                <Link
                                    to="/login"
                                    onClick={() => setIsOpen(false)}
                                    className="block w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium text-center hover:bg-indigo-700 transition-colors"
                                >
                                    Giriş Yap
                                </Link>
                                <Link
                                    to="/register"
                                    onClick={() => setIsOpen(false)}
                                    className="block w-full bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium text-center hover:bg-gray-300 transition-colors"
                                >
                                    Kayıt Ol
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default MobileMenu;
