# TechStore White-Label Customization Guide

Welcome to your customizable E-commerce template! This guide will walk you through the steps to rebrand and configure this application for your specific industry.

---

## 🏗️ 1. Core Branding
All global settings are managed in `src/config/app.config.js`.

### Brand Identity
Update the `brand` object to change your site name, slogan, and logo icon:
```javascript
brand: {
    name: 'MyAwesomeStore',
    slogan: 'Quality you can trust',
    logo: {
        text: 'MyStore',
        icon: 'ShoppingBag', // Any Lucide icon name
    },
}
```

### Contact & Socials
Update `contact` and `social` objects to reflect your business details.

---

## 🎨 2. Visual Style (Theming)
The application uses a dynamic theming system powered by Tailwind CSS and CSS Variables.

### Primary Colors
Change the site's primary color palette in `app.config.js` under the `theme` section:
```javascript
theme: {
    colors: {
        primary: {
            50: '#f0fdf4',  // Lightest (Backgrounds)
            500: '#22c55e', // Base (Buttons, Primary elements)
            700: '#15803d', // Darkest (Hover states, Titles)
        }
    }
}
```
*The `ThemeConnector` component will automatically inject these into the site.*

---

## 🌍 3. Localization & Content
We support Multi-language out of the box. Key content strings are moved to translation files.

### Translating Static Text
Edit files in `src/locales/` (e.g., `tr.json`, `en.json`) to change UI labels like:
- "Add to Cart"
- "Checkout"
- Trust Badges (Warranty, Delivery, etc.)

### Config-Driven Strings
In `app.config.js`, you'll notice `titleKey` or `descKey`. These map directly to the JSON files above. If you want to change the text of a Trust Badge, update it in the `locales` files.

---

## 🧩 4. Feature Management
Enable or disable features based on your requirements in `app.config.js`:
```javascript
features: {
    blog: true,      // Turn off blogs if not needed
    wishlist: true,  // Toggle customer wishlist
    comparison: false // Experimental features
}
```

---

## 🖼️ 5. Image Management
If a product or category doesn't have an image, the system uses a smart fallback.
Customize these in `app.config.js` -> `images.categoryMappings`. You can add keywords that trigger specific high-quality Unsplash images for your industry.

---

## 🚀 6. Next Steps
1. **Set up .env**: Ensure your API URL is correct.
2. **Database Seed**: Run your migration and seed scripts to populate initial categories.
3. **Deploy**: Push to your preferred hosting (Vercel, Netlify, etc.).

*Happy Selling!*
