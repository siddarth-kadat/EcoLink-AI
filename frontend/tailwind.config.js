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
                    DEFAULT: '#064E3B', // Deep Emerald
                    light: '#0D9488',   // Teal
                    soft: '#ECFDF5',    // Soft Mint
                },
                surface: {
                    DEFAULT: '#FBF8FE',
                    dim: '#DBD9DF',
                    bright: '#FBF8FE',
                    container: '#F5F2F8',
                }
            },
            borderRadius: {
                'xl': '16px',
                '2xl': '20px',
            },
            fontFamily: {
                sans: ['Outfit', 'sans-serif'],
                display: ['Outfit', 'sans-serif'],
            },
            maxWidth: {
                'container-max': '1440px',
            },
            padding: {
                'margin-desktop': '2.5rem',
            }
        },
    },
    plugins: [
        require('@tailwindcss/forms'),
        require('@tailwindcss/container-queries'),
    ],
}