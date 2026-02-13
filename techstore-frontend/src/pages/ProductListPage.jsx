import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams, Link } from 'react-router-dom';
import { Filter, Star, ShoppingCart, ChevronDown, ChevronUp, X, SlidersHorizontal, Eye, Heart } from 'lucide-react';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';
import { brandService } from '../services/brandService';
import { useWishlist } from '../context/WishlistContext';
import Breadcrumb from '../components/common/Breadcrumb';
import Pagination from '../components/common/Pagination';
import PriceRangeSlider from '../components/common/PriceRangeSlider';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorState from '../components/common/ErrorState';
import EmptyState from '../components/common/EmptyState';
import QuickViewModal from '../components/common/QuickViewModal';
import { formatPrice } from '../utils/currencyUtils';
import SEO from '../components/SEO';
import clsx from 'clsx';

const ProductListPage = () => {
    const { t } = useTranslation();
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalCount, setTotalCount] = useState(0);
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const { addToWishlist, isInWishlist } = useWishlist();

    // Quick View State
    const [quickViewProduct, setQuickViewProduct] = useState(null);
    const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

    const openQuickView = (product) => {
        setQuickViewProduct(product);
        setIsQuickViewOpen(true);
    };

    const closeQuickView = () => {
        setIsQuickViewOpen(false);
        setQuickViewProduct(null);
    };

    // Filtre state'leri
    const [filters, setFilters] = useState({
        categories: searchParams.get('categories') ? searchParams.get('categories').split(',') : [],
        brands: searchParams.get('brands') ? searchParams.get('brands').split(',') : [],
        search: searchParams.get('search') || '',
        minPrice: parseInt(searchParams.get('minPrice')) || 0,
        maxPrice: parseInt(searchParams.get('maxPrice')) || 10000,
        sort: searchParams.get('sort') || '',
        pageNumber: parseInt(searchParams.get('page')) || 1,
        pageSize: 12,
        inStock: searchParams.get('inStock') === 'true',
        onSale: searchParams.get('onSale') === 'true'
    });

    // Geçici filtre state'i (UI için)
    const [tempFilters, setTempFilters] = useState(filters);

    // Initial load: filters -> tempFilters
    useEffect(() => {
        setTempFilters(filters);
    }, [filters]);

    const [availableCategories, setAvailableCategories] = useState([]);
    const [availableBrands, setAvailableBrands] = useState([]);

    // Fetch filters data
    useEffect(() => {
        const fetchFiltersData = async () => {
            try {
                const [categoriesRes, brandsRes] = await Promise.all([
                    categoryService.getAll(),
                    brandService.getAll()
                ]);

                if (categoriesRes.success) setAvailableCategories(categoriesRes.data);
                if (brandsRes.success) setAvailableBrands(brandsRes.data);
            } catch (e) {
                console.error('Failed to load filter data', e);
            }
        };
        fetchFiltersData();
    }, []);


    // URL parametrelerini sync et
    useEffect(() => {
        setFilters(prev => ({
            ...prev,
            categories: searchParams.get('categories') ? searchParams.get('categories').split(',') : [],
            brands: searchParams.get('brands') ? searchParams.get('brands').split(',') : [],
            search: searchParams.get('search') || '',
            minPrice: parseInt(searchParams.get('minPrice')) || 0,
            maxPrice: parseInt(searchParams.get('maxPrice')) || 10000,
            sort: searchParams.get('sort') || '',
            pageNumber: parseInt(searchParams.get('page')) || 1,
            inStock: searchParams.get('inStock') === 'true',
            onSale: searchParams.get('onSale') === 'true'
        }));
    }, [searchParams]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError(null);

            // API sorgusu için parametreleri hazırla
            // API sorgusu için parametreleri hazırla
            // Backend DTO: ProductFilterDto (Page, PageSize, CategoryIds, BrandIds, etc.)
            const query = {
                Page: filters.pageNumber,
                PageSize: filters.pageSize,
                Search: filters.search,
                MinPrice: filters.minPrice > 0 ? filters.minPrice : undefined,
                MaxPrice: filters.maxPrice < 10000 ? filters.maxPrice : undefined,
                InStock: filters.inStock,
                OnSale: filters.onSale,
                SortBy: filters.sort ? filters.sort.split('_')[0] : 'createdAt',
                SortOrder: filters.sort ? filters.sort.split('_')[1] : 'desc'
            };

            if (filters.categories && filters.categories.length > 0) {
                query.CategoryIds = filters.categories;
            }

            if (filters.brands && filters.brands.length > 0) {
                query.BrandIds = filters.brands;
            }

            const result = await productService.getAll(query);
            if (result.success) {
                setProducts(result.data.items);
                setTotalCount(result.data.totalItems || 0); // Backend returns totalItems
            } else {
                setError(result.message);
            }
        } catch (err) {
            console.error('Error fetching products:', err);
            setError(t('common.error'));
        } finally {
            setLoading(false);
        }
    };

    // Filtreler değiştiğinde verileri çek
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        fetchProducts();
    }, [filters.categories, filters.brands, filters.search, filters.sort, filters.pageNumber, filters.inStock, filters.onSale]);

    // Debounced fiyat filtresi tetikleme (butonla manuel yapılacak)

    const handlePriceChange = (newRange) => {
        setTempFilters(prev => ({
            ...prev,
            minPrice: newRange[0],
            maxPrice: newRange[1]
        }));
    };

    const handleSortChange = (e) => {
        const sortValue = e.target.value;
        setFilters(prev => ({ ...prev, sort: sortValue, pageNumber: 1 }));
        // Sıralama hemen URL'e yansısın
        const params = new URLSearchParams(searchParams);
        if (sortValue) params.set('sort', sortValue);
        else params.delete('sort');
        setSearchParams(params);
    };

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setTempFilters(prev => ({ ...prev, [name]: checked }));
    };

    const handleMultiSelectChange = (type, value) => {
        setTempFilters(prev => {
            const current = prev[type];
            const updated = current.includes(value)
                ? current.filter(item => item !== value)
                : [...current, value];

            return { ...prev, [type]: updated };
        });
    };

    const applyFilters = () => {
        const params = new URLSearchParams();

        if (tempFilters.categories.length > 0) params.set('categories', tempFilters.categories.join(','));
        if (tempFilters.brands.length > 0) params.set('brands', tempFilters.brands.join(','));
        if (tempFilters.search) params.set('search', tempFilters.search);
        if (tempFilters.minPrice > 0) params.set('minPrice', tempFilters.minPrice);
        if (tempFilters.maxPrice < 10000) params.set('maxPrice', tempFilters.maxPrice);
        if (filters.sort) params.set('sort', filters.sort); // Keep current sort
        if (tempFilters.inStock) params.set('inStock', 'true');
        if (tempFilters.onSale) params.set('onSale', 'true');

        params.set('page', '1'); // Reset to page 1

        setSearchParams(params);
        setShowMobileFilters(false);
    };

    const clearAllFilters = () => {
        setFilters({
            categories: [],
            brands: [],
            search: '',
            minPrice: 0,
            maxPrice: 10000,
            sort: '',
            pageNumber: 1,
            pageSize: 12,
            inStock: false,
            onSale: false
        });
        setSearchParams({});
    };

    // Breadcrumb items
    const breadcrumbItems = [
        { label: t('common.allProducts'), url: '/products' }
    ];
    if (filters.categories.length > 0) {
        breadcrumbItems.push({ label: `${filters.categories.length} ${t('filters.active.categorySelected')}`, url: null });
    }
    if (filters.search) {
        breadcrumbItems.push({ label: `${t('filters.active.search')}: ${filters.search}` });
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <SEO
                title={filters.categories.length > 0 ? `${filters.categories.length} Kategori | TechStore` : 'Ürünler | TechStore'}
                description="En yeni teknoloji ürünlerini keşfedin."
            />

            {/* Mobile Filter Button */}
            <div className="md:hidden mb-4 flex justify-between items-center">
                <Breadcrumb items={breadcrumbItems} />
                <button
                    onClick={() => setShowMobileFilters(true)}
                    className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200 text-gray-700"
                >
                    <SlidersHorizontal size={20} />
                    <span>{t('common.filter')}</span>
                </button>
            </div>

            <div className="hidden md:block w-full mb-6">
                <Breadcrumb items={breadcrumbItems} />
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Filters Sidebar */}
                <aside className={clsx(
                    "fixed top-16 bottom-0 left-0 z-50 w-full md:w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out md:relative md:transform-none md:shadow-none md:block md:top-0 md:bottom-auto",
                    showMobileFilters ? "translate-x-0" : "-translate-x-full md:translate-x-0"
                )}>
                    <div className="p-6 h-full overflow-y-auto">
                        <div className="flex justify-between items-center mb-6 md:hidden">
                            <h3 className="text-lg font-bold font-orbitron">{t('filters.title')}</h3>
                            <button onClick={() => setShowMobileFilters(false)} className="text-gray-500">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="space-y-8">
                            {/* Categories Filter */}
                            <div>
                                <h4 className="font-semibold mb-4 text-sm text-gray-900 uppercase tracking-wider">{t('filters.categories')}</h4>
                                <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
                                    {availableCategories.length > 0 ? availableCategories.map((category) => {
                                        // availableCategories are objects { id, name }
                                        const catName = category.name;
                                        const catId = String(category.id); // Use ID as string for comparison
                                        return (
                                            <label key={catId} className="flex items-center space-x-2 cursor-pointer group">
                                                <input
                                                    type="checkbox"
                                                    checked={tempFilters.categories && tempFilters.categories.includes(catId)}
                                                    onChange={() => handleMultiSelectChange('categories', catId)}
                                                    className="form-checkbox text-blue-600 focus:ring-blue-500 rounded border-gray-300"
                                                />
                                                <span className="text-gray-700 group-hover:text-blue-600 transition-colors text-sm">
                                                    {catName}
                                                </span>
                                            </label>
                                        );
                                    }) : (
                                        <p className="text-sm text-gray-500">{t('filters.notFound.category')}</p>
                                    )}
                                </div>
                            </div>

                            {/* Brands Filter */}
                            <div>
                                <h4 className="font-semibold mb-4 text-sm text-gray-900 uppercase tracking-wider">{t('filters.brands')}</h4>
                                <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
                                    {availableBrands.length > 0 ? availableBrands.map((brand) => {
                                        const brandName = brand.name;
                                        const brandId = String(brand.id);
                                        return (
                                            <label key={brandId} className="flex items-center space-x-2 cursor-pointer group">
                                                <input
                                                    type="checkbox"
                                                    checked={tempFilters.brands && tempFilters.brands.includes(brandId)}
                                                    onChange={() => handleMultiSelectChange('brands', brandId)}
                                                    className="form-checkbox text-blue-600 focus:ring-blue-500 rounded border-gray-300"
                                                />
                                                <span className="text-gray-700 group-hover:text-blue-600 transition-colors text-sm">
                                                    {brandName}
                                                </span>
                                            </label>
                                        );
                                    }) : (
                                        <p className="text-sm text-gray-500">{t('filters.notFound.brand')}</p>
                                    )}
                                </div>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-4 text-sm text-gray-900 uppercase tracking-wider">{t('filters.status')}</h4>
                                <div className="space-y-2">
                                    <label className="flex items-center space-x-2 cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            name="inStock"
                                            checked={tempFilters.inStock}
                                            onChange={handleCheckboxChange}
                                            className="form-checkbox text-blue-600 focus:ring-blue-500 rounded border-gray-300"
                                        />
                                        <span className="text-gray-700 group-hover:text-blue-600 transition-colors">{t('filters.inStock')}</span>
                                    </label>
                                    <label className="flex items-center space-x-2 cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            name="onSale"
                                            checked={tempFilters.onSale}
                                            onChange={handleCheckboxChange}
                                            className="form-checkbox text-blue-600 focus:ring-blue-500 rounded border-gray-300"
                                        />
                                        <span className="text-gray-700 group-hover:text-blue-600 transition-colors">{t('filters.onSale')}</span>
                                    </label>
                                </div>
                            </div>

                            {/* Price Filter */}
                            <div>
                                <h4 className="font-semibold mb-4 text-sm text-gray-900 uppercase tracking-wider">{t('filters.priceRange')}</h4>
                                <PriceRangeSlider
                                    min={0}
                                    max={10000}
                                    value={[tempFilters.minPrice, tempFilters.maxPrice]}
                                    onChange={handlePriceChange}
                                />
                                <div className="flex justify-between mt-2 text-sm text-gray-600">
                                    <span>{formatPrice(tempFilters.minPrice)}</span>
                                    <span>{formatPrice(tempFilters.maxPrice)}</span>
                                </div>
                                <button
                                    onClick={applyFilters}
                                    className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                                >
                                    {t('common.apply')}
                                </button>
                            </div>

                            {/* Sort */}
                            <div>
                                <h4 className="font-semibold mb-4 text-sm text-gray-900 uppercase tracking-wider">{t('filters.sort')}</h4>
                                <div className="space-y-2">
                                    {[
                                        { value: '', label: t('filters.sortBy.default') },
                                        { value: 'price_asc', label: t('filters.sortBy.priceAsc') },
                                        { value: 'price_desc', label: t('filters.sortBy.priceDesc') },
                                        { value: 'name_asc', label: t('filters.sortBy.nameAsc') },
                                        { value: 'name_desc', label: t('filters.sortBy.nameDesc') }
                                    ].map(option => (
                                        <label key={option.value} className="flex items-center space-x-2 cursor-pointer group">
                                            <input
                                                type="radio"
                                                name="sort"
                                                value={option.value}
                                                checked={filters.sort === option.value}
                                                onChange={handleSortChange}
                                                className="form-radio text-blue-600 focus:ring-blue-500"
                                            />
                                            <span className="text-gray-700 group-hover:text-blue-600 transition-colors">{option.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={clearAllFilters}
                                className="w-full py-2 text-red-600 hover:text-red-700 font-medium text-sm transition-colors border border-red-200 rounded-lg hover:bg-red-50"
                            >
                                {t('filters.clearFilters')}
                            </button>
                        </div>
                    </div>
                </aside>

                {/* Overlay for mobile */}
                {
                    showMobileFilters && (
                        <div
                            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                            onClick={() => setShowMobileFilters(false)}
                        ></div>
                    )
                }

                {/* Product Grid */}
                <div className="flex-1">
                    <div className="mb-6 flex justify-between items-center">
                        <h1 className="text-2xl font-bold font-orbitron text-gray-900">
                            {filters.categories.length > 0 ? `${filters.categories.length} ${t('filters.active.categorySelected')}` : t('common.allProducts')}
                        </h1>
                        <span className="text-gray-500 font-medium">{totalCount} {t('common.results')}</span>
                    </div>

                    {/* Active Filters Chips */}
                    {(filters.categories.length > 0 || filters.brands.length > 0 || filters.search || filters.inStock || filters.onSale || filters.minPrice > 0 || filters.maxPrice < 10000) && (
                        <div className="flex flex-wrap gap-2 mb-6">
                            {filters.categories.map(catId => {
                                const cat = availableCategories.find(c => String(c.id) === catId);
                                const label = cat ? cat.name : catId;
                                return (
                                    <button
                                        key={catId}
                                        onClick={() => handleMultiSelectChange('categories', catId)}
                                        className="flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium hover:bg-blue-100 transition-colors"
                                    >
                                        {label} <X size={14} />
                                    </button>
                                );
                            })}
                            {filters.brands.map(brandId => {
                                const brand = availableBrands.find(b => String(b.id) === brandId);
                                const label = brand ? brand.name : brandId;
                                return (
                                    <button
                                        key={brandId}
                                        onClick={() => handleMultiSelectChange('brands', brandId)}
                                        className="flex items-center gap-1 bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-sm font-medium hover:bg-purple-100 transition-colors"
                                    >
                                        {label} <X size={14} />
                                    </button>
                                );
                            })}
                            {filters.search && (
                                <button
                                    onClick={() => {
                                        setFilters(prev => ({ ...prev, search: '' }));
                                        const newParams = new URLSearchParams(searchParams);
                                        newParams.delete('search');
                                        setSearchParams(newParams);
                                    }}
                                    className="flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium hover:bg-blue-100 transition-colors"
                                >
                                    {t('filters.active.search')}: {filters.search} <X size={14} />
                                </button>
                            )}
                            {filters.inStock && (
                                <button
                                    onClick={() => handleCheckboxChange({ target: { name: 'inStock', checked: false } })}
                                    className="flex items-center gap-1 bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium hover:bg-green-100 transition-colors"
                                >
                                    {t('filters.active.stock')} <X size={14} />
                                </button>
                            )}
                            {filters.onSale && (
                                <button
                                    onClick={() => handleCheckboxChange({ target: { name: 'onSale', checked: false } })}
                                    className="flex items-center gap-1 bg-red-50 text-red-700 px-3 py-1 rounded-full text-sm font-medium hover:bg-red-100 transition-colors"
                                >
                                    {t('filters.active.sale')} <X size={14} />
                                </button>
                            )}
                            {(filters.minPrice > 0 || filters.maxPrice < 10000) && (
                                <button
                                    onClick={() => handlePriceChange([0, 10000])}
                                    className="flex items-center gap-1 bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors"
                                >
                                    {t('filters.active.price')}: {formatPrice(filters.minPrice)} - {formatPrice(filters.maxPrice)} <X size={14} />
                                </button>
                            )}
                            <button
                                onClick={clearAllFilters}
                                className="text-sm text-red-600 hover:text-red-800 underline ml-2"
                            >
                                {t('common.clearAll')}
                            </button>
                        </div>
                    )}

                    {loading ? (
                        <LoadingSpinner size="lg" text={t('common.loading')} />
                    ) : error ? (
                        <ErrorState
                            title={t('common.error')}
                            message={error}
                            onRetry={fetchProducts}
                        />
                    ) : products.length === 0 ? (
                        <EmptyState
                            type="search"
                            message={t('filters.notFound.products')}
                            action={clearAllFilters}
                            actionLabel={t('filters.clearFilters')}
                        />
                    ) : (
                        <>
                            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
                                {products.map(product => (
                                    <div key={product.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 group flex flex-col">
                                        <div className="relative h-40 md:h-56 bg-white p-2 md:p-4 overflow-hidden group">
                                            <img
                                                src={product.imageUrl || 'https://via.placeholder.com/300'}
                                                alt={product.name}
                                                className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                                            />
                                            {/* Wishlist Button */}
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    addToWishlist(product);
                                                }}
                                                className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-all z-10"
                                            >
                                                <Heart
                                                    size={20}
                                                    className={isInWishlist(product.id) ? "fill-red-500 text-red-500" : "text-gray-400 hover:text-red-500"}
                                                />
                                            </button>

                                            {/* Quick Actions overlay */}
                                            <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex justify-center">
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        openQuickView(product);
                                                    }}
                                                    className="bg-white text-gray-800 hover:text-blue-600 font-medium py-2 px-6 rounded-full shadow-lg border border-gray-100 flex items-center gap-2 transform hover:scale-105 transition-all"
                                                >
                                                    <Eye size={18} />
                                                    <span>{t('home.explore')}</span>
                                                </button>
                                            </div>
                                        </div>
                                        <div className="p-5 flex-1 flex flex-col">
                                            <div className="text-xs text-blue-600 font-bold uppercase tracking-wider mb-1">
                                                {product.category || 'Genel'}
                                            </div>
                                            <Link to={`/products/${product.slug}`} className="block mb-2">
                                                <h3 className="font-bold text-gray-900 text-lg leading-tight group-hover:text-blue-600 transition-colors line-clamp-2">
                                                    {product.name}
                                                </h3>
                                            </Link>

                                            <div className="flex items-center mb-4">
                                                <div className="flex text-yellow-500 text-xs">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star key={i} size={14} fill={i < (product.rating || 4) ? "currentColor" : "none"} />
                                                    ))}
                                                </div>
                                                <span className="text-xs text-gray-500 ml-2">({product.reviewCount || 0})</span>
                                            </div>

                                            <div className="mt-auto flex justify-between items-center">
                                                <span className="text-xl font-bold text-gray-900">{formatPrice(product.price)}</span>
                                                <button className="bg-blue-50 text-blue-600 p-2.5 rounded-full hover:bg-blue-600 hover:text-white transition-all shadow-sm hover:shadow-md">
                                                    <ShoppingCart size={20} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination */}
                            <div className="mt-10">
                                <Pagination
                                    currentPage={filters.pageNumber}
                                    totalPages={Math.ceil(totalCount / filters.pageSize) || 1}
                                    onPageChange={(page) => setFilters(prev => ({ ...prev, pageNumber: page }))}
                                />
                            </div>
                        </>
                    )}
                </div>
            </div >

            {/* Quick View Modal */}
            {
                quickViewProduct && (
                    <QuickViewModal
                        product={quickViewProduct}
                        isOpen={isQuickViewOpen}
                        onClose={closeQuickView}
                    />
                )
            }
        </div >
    );
};

export default ProductListPage;
