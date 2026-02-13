import appConfig from '../config/app.config';

/**
 * Returns a valid image URL for a product.
 * If the product has a valid image URL, it returns it.
 * Otherwise, it returns a high-quality Unsplash image based on the category or name,
 * defined in app.config.js.
 * 
 * @param {string|null} imageUrl - The specific image URL from the product
 * @param {string} categoryName - The category name for fallback selection
 * @param {string} productName - The product name for granular fallback (optional)
 * @returns {string} The resolved image URL
 */
export const getProductImage = (imageUrl, categoryName, productName = '') => {
    // Check if imageUrl exists and is not a placeholder/empty
    if (imageUrl &&
        imageUrl.trim() !== '' &&
        !imageUrl.includes('via.placeholder.com') &&
        !imageUrl.includes('example.com')) {
        return imageUrl;
    }

    // Normalized strings for matching
    const category = (categoryName || '').toLowerCase();
    const name = (productName || '').toLowerCase();

    // Iterate through mappings in app.config.js
    const mapping = appConfig.images.categoryMappings.find(m =>
        m.keywords.some(keyword =>
            category.includes(keyword.toLowerCase()) ||
            name.includes(keyword.toLowerCase())
        )
    );

    if (mapping) {
        return mapping.imageUrl;
    }

    // Default Fallback from config
    return appConfig.images.defaultFallback;
};
