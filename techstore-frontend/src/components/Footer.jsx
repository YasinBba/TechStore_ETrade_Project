import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { categoryService } from '../services/categoryService';
import appConfig from '../config/app.config';

const Footer = () => {
    const { t } = useTranslation();
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const result = await categoryService.getAll();
                if (result.success && Array.isArray(result.data)) {
                    setCategories(result.data.slice(0, 6)); // Top 6 categories
                } else {
                    console.error('Category content malformed:', result);
                }
            } catch (error) {
                console.error('Failed to fetch categories', error);
            }
        };
        fetchCategories();
    }, []);

    return (
        <footer className="bg-gray-900 text-white py-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="text-xl font-bold mb-4 font-orbitron">{appConfig.brand.name}</h3>
                        <p className="text-gray-400">
                            {appConfig.brand.slogan}. {t('footer.sloganSuffix')}
                        </p>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">{t('footer.quickLinks')}</h4>
                        <ul className="space-y-2 text-gray-400">
                            <li><Link to="/" className="hover:text-blue-400 transition-colors">{t('common.home')}</Link></li>
                            <li><Link to="/products" className="hover:text-blue-400 transition-colors">{t('common.products')}</Link></li>
                            <li><Link to="/about" className="hover:text-blue-400 transition-colors">{t('common.about')}</Link></li>
                            <li><Link to="/contact" className="hover:text-blue-400 transition-colors">{t('common.contact')}</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">{t('footer.categories')}</h4>
                        <ul className="space-y-2 text-gray-400">
                            {categories.map((cat) => (
                                <li key={cat.id}>
                                    <Link
                                        to={`/products?categories=${cat.id}`}
                                        className="hover:text-blue-400 transition-colors"
                                    >
                                        {cat.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">{t('common.contact')}</h4>
                        <p className="text-gray-400">{appConfig.contact.email}</p>
                        <p className="text-gray-400">{appConfig.contact.phone}</p>
                        <p className="text-gray-400 mt-2 text-sm">{appConfig.contact.address}</p>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                    <p>&copy; {new Date().getFullYear()} {appConfig.brand.name}. {t('footer.rightsReserved')}</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
