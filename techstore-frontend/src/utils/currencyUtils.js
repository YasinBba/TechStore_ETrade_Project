import appConfig from '../config/app.config';

/**
 * Formats a price based on application configuration.
 * @param {number} amount - The numeric price to format.
 * @returns {string} - Formatted price string.
 */
export const formatPrice = (amount) => {
    if (amount === undefined || amount === null) return '';

    const { code, format, symbol } = appConfig.currency;

    try {
        const formatted = new Intl.NumberFormat(format, {
            style: 'currency',
            currency: code,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);

        return formatted;
    } catch (error) {
        // Fallback simple formatting
        return `${amount.toLocaleString(format)} ${symbol}`;
    }
};

/**
 * Converts price if multiple currencies are supported.
 * Currently returns the amount as is, but can be expanded with exchange rates.
 */
export const convertPrice = (amount, targetCurrency = 'TRY') => {
    // Logic for conversion can be added here
    return amount;
};
