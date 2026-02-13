import React from 'react';
import { useTranslation } from 'react-i18next';
import { Shield, Zap, Users, Award } from 'lucide-react';

const AboutPage = () => {
    const { t } = useTranslation();

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4 font-orbitron">
                        {t('about.title')}
                    </h1>
                    <p className="text-xl text-gray-600">
                        {t('about.subtitle')}
                    </p>
                </div>

                {/* Story Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-12">
                    <h2 className="text-2xl font-bold mb-4">{t('about.story.title')}</h2>
                    <div className="space-y-4 text-gray-700 leading-relaxed">
                        <p>
                            {t('about.story.p1')}
                        </p>
                        <p>
                            {t('about.story.p2')}
                        </p>
                    </div>
                </div>

                {/* Values Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-gray-200">
                        <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mb-4">
                            <Shield className="text-white" size={24} />
                        </div>
                        <h3 className="text-xl font-bold mb-2">{t('about.values.reliability.title')}</h3>
                        <p className="text-gray-700">
                            {t('about.values.reliability.desc')}
                        </p>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-6 border border-gray-200">
                        <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mb-4">
                            <Zap className="text-white" size={24} />
                        </div>
                        <h3 className="text-xl font-bold mb-2">{t('about.values.delivery.title')}</h3>
                        <p className="text-gray-700">
                            {t('about.values.delivery.desc')}
                        </p>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-gray-200">
                        <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mb-4">
                            <Users className="text-white" size={24} />
                        </div>
                        <h3 className="text-xl font-bold mb-2">{t('about.values.satisfaction.title')}</h3>
                        <p className="text-gray-700">
                            {t('about.values.satisfaction.desc')}
                        </p>
                    </div>

                    <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 border border-gray-200">
                        <div className="w-12 h-12 bg-yellow-600 rounded-full flex items-center justify-center mb-4">
                            <Award className="text-white" size={24} />
                        </div>
                        <h3 className="text-xl font-bold mb-2">{t('about.values.quality.title')}</h3>
                        <p className="text-gray-700">
                            {t('about.values.quality.desc')}
                        </p>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="bg-gray-900 text-white rounded-xl p-8 text-center">
                    <h2 className="text-2xl font-bold mb-4">{t('about.cta.title')}</h2>
                    <p className="text-gray-300 mb-6">
                        {t('about.cta.desc')}
                    </p>
                    <a
                        href="/products"
                        className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition-all transform hover:scale-105"
                    >
                        {t('about.cta.button')}
                    </a>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;
