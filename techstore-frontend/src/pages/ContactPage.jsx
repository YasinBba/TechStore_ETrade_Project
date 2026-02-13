import React from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, Phone, MapPin } from 'lucide-react';
import appConfig from '../config/app.config';

const ContactPage = () => {
    const { t } = useTranslation();
    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4 font-orbitron">
                        {t('contact.title')}
                    </h1>
                    <p className="text-gray-600">
                        {t('contact.subtitle')}
                    </p>
                </div>

                {/* Contact Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Email Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <Mail className="text-blue-600" size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg mb-2">{t('contact.email')}</h3>
                                <a
                                    href={`mailto:${appConfig.contact.email}`}
                                    className="text-blue-600 hover:text-blue-800 transition-colors"
                                >
                                    {appConfig.contact.email}
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Phone Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <Phone className="text-green-600" size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg mb-2">{t('contact.phone')}</h3>
                                <a
                                    href={`tel:${appConfig.contact.phone.replace(/\s+/g, '')}`}
                                    className="text-green-600 hover:text-green-800 transition-colors"
                                >
                                    {appConfig.contact.phone}
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Address Card (Optional - added for completeness based on config) */}
                <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <MapPin className="text-purple-600" size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg mb-2">{t('contact.address')}</h3>
                            <p className="text-gray-600">
                                {appConfig.contact.address}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Additional Info */}
                <div className="mt-12 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-8 border border-gray-200">
                    <h3 className="text-xl font-bold mb-4">{t('contact.workingHours')}</h3>
                    <div className="space-y-2 text-gray-700">
                        <p><strong>{t('contact.weekdays')}:</strong> 09:00 - 18:00</p>
                        <p><strong>{t('contact.saturday')}:</strong> 10:00 - 16:00</p>
                        <p><strong>{t('contact.sunday')}:</strong> {t('contact.closed')}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
