import React from 'react';
import { Package, ShoppingCart, Search, FileQuestion } from 'lucide-react';

const EmptyState = ({
    type = 'products',
    title,
    message,
    action,
    actionLabel
}) => {
    const icons = {
        products: Package,
        cart: ShoppingCart,
        search: Search,
        notfound: FileQuestion
    };

    const Icon = icons[type] || icons.products;

    return (
        <div className="flex flex-col items-center justify-center p-12 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <Icon className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
                {title || 'Hiçbir Sonuç Bulunamadı'}
            </h3>
            <p className="text-gray-500 mb-6 max-w-md">
                {message || 'Aradığınız kriterlere uygun sonuç bulunamadı.'}
            </p>
            {action && (
                <button
                    onClick={action}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition-all hover:shadow-lg"
                >
                    {actionLabel || 'Geri Dön'}
                </button>
            )}
        </div>
    );
};

export default EmptyState;
