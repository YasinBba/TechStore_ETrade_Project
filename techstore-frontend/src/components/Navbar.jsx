import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Search, LogOut, Menu, X, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import CartDrawer from './CartDrawer';
import { productService } from '../services/productService';
import useDebounce from '../hooks/useDebounce';
import appConfig from '../config/app.config';
import { formatPrice } from '../utils/currencyUtils';

const Navbar = () => {
    const { t, i18n } = useTranslation();
    const { user, logout } = useAuth();
    const { cartCount, cartItems, updateQuantity, removeFromCart, cartTotal } = useCart();
    const { wishlistCount } = useWishlist();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const debouncedSearchTerm = useDebounce(searchQuery, 300);

    const changeLanguage = () => {
        const newLang = i18n.language === 'tr' ? 'en' : 'tr';
        i18n.changeLanguage(newLang);
    };

    // Live Search Effect
    React.useEffect(() => {
        const searchProducts = async () => {
            if (debouncedSearchTerm.trim().length < 2) {
                setSearchResults([]);
                return;
            }

            setIsSearching(true);
            try {
                // Fetch only a few results for the dropdown
                const response = await productService.getAll({
                    Search: debouncedSearchTerm,
                    PageSize: 5
                });
                if (response.success) {
                    setSearchResults(response.data.items);
                } else {
                    setSearchResults([]);
                }
            } catch (error) {
                console.error("Search error:", error);
                setSearchResults([]);
            } finally {
                setIsSearching(false);
            }
        };

        if (debouncedSearchTerm) {
            searchProducts();
        } else {
            setSearchResults([]);
        }
    }, [debouncedSearchTerm]);

    // Close suggestions when clicking outside
    React.useEffect(() => {
        const handleClickOutside = () => setShowResults(false);
        window.addEventListener('click', handleClickOutside);
        return () => window.removeEventListener('click', handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            setShowResults(false);
            navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
        }
    };

    return (
        <>
            <nav className="bg-white shadow-md sticky top-0 z-[100]">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <Link to="/" className="text-2xl font-bold text-blue-600 font-orbitron tracking-wider">
                            {appConfig.brand.name}
                        </Link>

                        {/* Search Bar - Desktop */}
                        <form onSubmit={handleSearch} className="hidden md:flex items-center flex-1 max-w-md mx-8">
                            <div className="relative w-full" onClick={(e) => e.stopPropagation()}>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value);
                                        setShowResults(true);
                                    }}
                                    onFocus={() => setShowResults(true)}
                                    placeholder={t('common.search')}
                                    className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                />
                                <button type="submit" className="absolute left-3 top-2.5 text-gray-400 hover:text-blue-500">
                                    <Search size={20} />
                                </button>

                                {/* Search Suggestions Dropdown */}
                                {showResults && searchQuery.length > 1 && (
                                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-[101]">
                                        {isSearching ? (
                                            <div className="p-4 text-center text-gray-500 text-sm">Aranıyor...</div>
                                        ) : searchResults.length > 0 ? (
                                            <ul>
                                                {searchResults.map(product => (
                                                    <li key={product.id}>
                                                        <Link
                                                            to={`/products/${product.slug}`}
                                                            className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
                                                            onClick={() => setShowResults(false)}
                                                        >
                                                            <img
                                                                src={product.imageUrl || 'https://via.placeholder.com/40'}
                                                                alt={product.name}
                                                                className="w-10 h-10 object-contain rounded bg-white border border-gray-100"
                                                            />
                                                            <div className="flex-1 min-w-0">
                                                                <div className="text-sm font-medium text-gray-800 truncate">{product.name}</div>
                                                                <div className="text-xs text-blue-600 font-bold">{formatPrice(product.price)}</div>
                                                            </div>
                                                        </Link>
                                                    </li>
                                                ))}
                                                <li>
                                                    <button
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            handleSearch(e);
                                                        }}
                                                        className="w-full text-center py-2 text-xs font-semibold text-blue-600 hover:bg-blue-50 transition-colors"
                                                    >
                                                        Tüm sonuçları gör ({searchResults.length}+)
                                                    </button>
                                                </li>
                                            </ul>
                                        ) : (
                                            <div className="p-4 text-center text-gray-500 text-sm">Sonuç bulunamadı</div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </form>

                        {/* Desktop Menu */}
                        <div className="hidden md:flex items-center space-x-6">
                            <button onClick={changeLanguage} className="text-gray-600 hover:text-blue-600 font-medium text-sm border border-gray-300 rounded px-2 py-1">
                                {i18n.language === 'tr' ? 'EN' : 'TR'}
                            </button>

                            <Link to="/products" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
                                {t('common.products')}
                            </Link>

                            {appConfig.features.wishlist && (
                                <Link to="/wishlist" className="relative text-gray-600 hover:text-red-500 transition-colors">
                                    <Heart size={24} />
                                    {wishlistCount > 0 && (
                                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center transform scale-90 animate-pulse">
                                            {wishlistCount}
                                        </span>
                                    )}
                                </Link>
                            )}

                            <button
                                onClick={() => setCartDrawerOpen(true)}
                                className="relative text-gray-600 hover:text-blue-600 transition-colors"
                            >
                                <ShoppingCart size={24} />
                                {cartCount > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center transform scale-90 animate-pulse">
                                        {cartCount}
                                    </span>
                                )}
                            </button>

                            {user ? (
                                <div className="flex items-center space-x-4">
                                    <Link to="/profile" className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors">
                                        <User size={20} className="text-blue-600" />
                                        <span className="font-medium hidden lg:block">
                                            {user.firstName || user.email?.split('@')[0]}
                                        </span>
                                    </Link>
                                    <Link to="/orders" className="text-sm text-gray-600 hover:text-blue-600">{t('common.orders')}</Link>
                                    <button
                                        onClick={handleLogout}
                                        className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                                        title={t('common.logout')}
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
                                    <span>{t('common.login')}</span>
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
                        <form onSubmit={handleSearch} className="relative" onClick={(e) => e.stopPropagation()}>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setShowResults(true);
                                }}
                                onFocus={() => setShowResults(true)}
                                placeholder={t('common.search')}
                                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />

                            {/* Mobile Search Suggestions */}
                            {showResults && searchQuery.length > 1 && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50">
                                    {isSearching ? (
                                        <div className="p-3 text-center text-gray-500 text-sm">Aranıyor...</div>
                                    ) : searchResults.length > 0 ? (
                                        <ul>
                                            {searchResults.slice(0, 3).map(product => (
                                                <li key={product.id}>
                                                    <Link
                                                        to={`/products/${product.slug}`}
                                                        className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors border-b border-gray-50"
                                                        onClick={() => {
                                                            setShowResults(false);
                                                            setIsMenuOpen(false);
                                                        }}
                                                    >
                                                        <img
                                                            src={product.imageUrl || 'https://via.placeholder.com/40'}
                                                            alt={product.name}
                                                            className="w-8 h-8 object-contain rounded bg-white border border-gray-100"
                                                        />
                                                        <div className="flex-1 min-w-0">
                                                            <div className="text-sm font-medium text-gray-800 truncate">{product.name}</div>
                                                            <div className="text-xs text-blue-600 font-bold">{formatPrice(product.price)}</div>
                                                        </div>
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : null}
                                </div>
                            )}
                        </form>

                        <div className="flex flex-col space-y-3">
                            <div className="flex justify-between items-center py-2 border-b border-gray-50">
                                <span className="text-gray-700">Dil / Language</span>
                                <button onClick={changeLanguage} className="text-blue-600 font-bold">
                                    {i18n.language === 'tr' ? 'English' : 'Türkçe'}
                                </button>
                            </div>

                            <Link to="/products" className="text-gray-700 hover:text-blue-600 py-2 border-b border-gray-50">
                                {t('common.allProducts')}
                            </Link>
                            {appConfig.features.wishlist && (
                                <Link to="/wishlist" className="flex items-center justify-between text-gray-700 hover:text-red-500 py-2 border-b border-gray-50">
                                    <span>{t('common.wishlist')}</span>
                                    {wishlistCount > 0 && (
                                        <span className="bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">{wishlistCount}</span>
                                    )}
                                </Link>
                            )}
                            <button
                                onClick={() => {
                                    setIsMenuOpen(false);
                                    setCartDrawerOpen(true);
                                }}
                                className="flex items-center justify-between text-gray-700 hover:text-blue-600 py-2 border-b border-gray-50 w-full"
                            >
                                <span>{t('common.cart')}</span>
                                {cartCount > 0 && (
                                    <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">{cartCount}</span>
                                )}
                            </button>

                            {user ? (
                                <div className="pt-2">
                                    <Link to="/profile" className="flex items-center space-x-2 text-gray-700 mb-3 hover:text-blue-600 transition-colors">
                                        <User size={20} className="text-blue-600" />
                                        <span className="font-semibold">{user.email}</span>
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left text-red-600 font-medium flex items-center space-x-2"
                                    >
                                        <LogOut size={18} />
                                        <span>{t('common.logout')}</span>
                                    </button>
                                </div>
                            ) : (
                                <Link to="/login" className="block text-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                                    {t('common.login')}
                                </Link>
                            )}
                        </div>
                    </div>
                )}
            </nav>

            {/* Cart Drawer */}
            <CartDrawer
                isOpen={cartDrawerOpen}
                onClose={() => setCartDrawerOpen(false)}
                cartItems={cartItems}
                updateQuantity={updateQuantity}
                removeFromCart={removeFromCart}
                cartTotal={cartTotal}
            />
        </>
    );
};

export default Navbar;
