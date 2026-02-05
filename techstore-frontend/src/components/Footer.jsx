import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white py-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="text-xl font-bold mb-4 font-orbitron">TechStore</h3>
                        <p className="text-gray-400">
                            En yeni teknolojik ürünler, en uygun fiyatlarla.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Hızlı Bağlantılar</h4>
                        <ul className="space-y-2 text-gray-400">
                            <li><a href="/" className="hover:text-blue-400">Ana Sayfa</a></li>
                            <li><a href="/products" className="hover:text-blue-400">Ürünler</a></li>
                            <li><a href="/about" className="hover:text-blue-400">Hakkımızda</a></li>
                            <li><a href="/contact" className="hover:text-blue-400">İletişim</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Kategoriler</h4>
                        <ul className="space-y-2 text-gray-400">
                            <li>Bilgisayar</li>
                            <li>Telefon</li>
                            <li>Oyun Konsolları</li>
                            <li>Aksesuarlar</li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">İletişim</h4>
                        <p className="text-gray-400">support@techstore.com</p>
                        <p className="text-gray-400">+90 212 123 45 67</p>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                    <p>&copy; 2026 TechStore. Tüm hakları saklıdır.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
