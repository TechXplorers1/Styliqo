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
                    DEFAULT: '#F43397', // Styliqo Pink
                    hover: '#D62D86',
                    light: '#fdecf4', // Light pink for backgrounds
                },
                secondary: '#333333',
                background: '#f8f8fb', // Slightly blue-ish grey for modern feel
                surface: '#ffffff',
                text: {
                    main: '#1f2937', // Gray-800
                    light: '#6b7280', // Gray-500
                }
            },
            fontFamily: {
                sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
            },
            boxShadow: {
                'soft': '0 2px 10px rgba(0, 0, 0, 0.03)',
                'card': '0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.1)',
                'card-hover': '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                'nav': '0 -2px 10px rgba(0,0,0,0.05)',
            }
        },
    },
    plugins: [],
}
