/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#eff6ff',
                    100: '#dbeafe',
                    500: '#3b82f6',
                    600: '#2563eb',
                    700: '#1d4ed8',
                },
                gaming: {
                    dark: '#0a0e1a',
                    purple: '#8b5cf6',
                    cyan: '#06b6d4',
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                gaming: ['Orbitron', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
