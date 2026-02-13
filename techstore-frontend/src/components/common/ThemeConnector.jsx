import { useEffect } from 'react';
import appConfig from '../../config/app.config';

const ThemeConnector = () => {
    useEffect(() => {
        const { colors } = appConfig.theme;
        const root = document.documentElement;

        // Apply primary colors to CSS variables
        if (colors && colors.primary) {
            Object.entries(colors.primary).forEach(([shade, value]) => {
                root.style.setProperty(`--color-primary-${shade}`, value);
            });
        }
    }, []);

    return null; // This component doesn't render anything UI-wise
};

export default ThemeConnector;
