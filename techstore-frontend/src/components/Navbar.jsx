import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Search, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { cartCount } = useCart(); // Added useCart hook call
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
        }
    };

    return (
        <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="text-2xl font-bold text-blue-600 font-orbitron tracking-wider">
                        TechStore
                    </Link>

                    {/* Search Bar - Desktop */}
                    <form onSubmit={handleSearch} className="hidden md:flex items-center flex-1 max-w-md mx-8">
                        <div className="relative w-full">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Ürün ara..."
                                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            />
                            <button type="submit" className="absolute left-3 top-2.5 text-gray-400 hover:text-blue-500">
                                <Search size={20} />
                            </button>
                        </div>
                    </form>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-6">
                        <Link to="/products" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
                            Ürünler
                        </Link>

                        <Link to="/cart" className="relative text-gray-600 hover:text-blue-600 transition-colors">
                            <ShoppingCart size={24} />
                            {cartCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center transform scale-90">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        {user ? (
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-2 text-gray-700">
                                    <User size={20} className="text-blue-600" />
                                    <span className="font-medium hidden lg:block">
                                        {user.firstName || user.email?.split('@')[0]}
                                    </span>
                                </div>
                                <Link to="/orders" className="text-sm text-gray-600 hover:text-blue-600">Siparişlerim</Link>
                                <button
                                    onClick={handleLogout}
                                    className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                                    title="Çıkış Yap"
                                >
                                    <LogOut size={20} />
                                </button>
                            </div>
                        ) : (
                            <Link
                                to="/login"
                                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-colors shadow-sm"
                            >
                                <User size={18} />
                                <span>Giriş Yap</span>
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden text-gray-600"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-100 py-4 px-4 space-y-4 shadow-lg animate-in slide-in-from-top-2">
                    <form onSubmit={handleSearch} className="relative">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Ürün ara..."
                            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
                    </form>

                    <div className="flex flex-col space-y-3">
                        <Link to="/products" className="text-gray-700 hover:text-blue-600 py-2 border-b border-gray-50">
                            Tüm Ürünler
                        </Link>
                        <Link to="/cart" className="flex items-center justify-between text-gray-700 hover:text-blue-600 py-2 border-b border-gray-50">
                            <span>Sepetim</span>
                            <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">0</span>
                        </Link>

                        {user ? (
                            <div className="pt-2">
                                <div className="flex items-center space-x-2 text-gray-700 mb-3">
                                    <User size={20} className="text-blue-600" />
                                    <span className="font-semibold">{user.email}</span>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left text-red-600 font-medium flex items-center space-x-2"
                                >
                                    <LogOut size={18} />
                                    <span>Çıkış Yap</span>
                                </button>
                            </div>
                        ) : (
                            <Link to="/login" className="block text-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                                Giriş Yap
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
