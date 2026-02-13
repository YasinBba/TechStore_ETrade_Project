import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import SEO from '../components/SEO';

const NotFoundPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 px-4">
            <SEO
                title="Sayfa Bulunamadı - 404 | TechStore"
                description="Aradığınız sayfa bulunamadı. TechStore ana sayfasına dönün."
            />

            <div className="text-center">
                {/* 404 Animation */}
                <div className="mb-8 relative">
                    <h1 className="text-9xl font-bold text-blue-600/20 font-orbitron select-none">
                        404
                    </h1>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <AlertCircle className="w-24 h-24 text-blue-600 animate-bounce" />
                    </div>
                </div>

                {/* Error Message */}
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                    Sayfa Bulunamadı
                </h2>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    Aradığınız sayfa mevcut değil veya taşınmış olabilir.
                    Ana sayfaya dönerek alışverişe devam edebilirsiniz.
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        to="/"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition-all transform hover:scale-105 shadow-lg"
                    >
                        Ana Sayfaya Dön
                    </Link>
                    <Link
                        to="/products"
                        className="bg-white hover:bg-gray-50 text-blue-600 font-bold py-3 px-8 rounded-full transition-all border-2 border-blue-600 transform hover:scale-105 shadow-lg"
                    >
                        Ürünlere Göz At
                    </Link>
                </div>

                {/* Additional Links */}
                <div className="mt-12 text-sm text-gray-500">
                    <p>Yardıma mı ihtiyacınız var?</p>
                    <Link to="/contact" className="text-blue-600 hover:text-blue-700 font-medium">
                        Bizimle iletişime geçin
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default NotFoundPage;
