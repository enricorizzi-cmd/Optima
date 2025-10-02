import { fontFamily } from 'tailwindcss/defaultTheme';
import tailwindForms from '@tailwindcss/forms';
import tailwindTypography from '@tailwindcss/typography';

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx,html}'],
  theme: {
    extend: {
      colors: {
        background: '#ffffff',
        primary: '#2563eb',
        accent: '#7c3aed',
        success: '#16a34a',
        warning: '#d97706',
        danger: '#dc2626',
      },
      fontFamily: {
        sans: ['Inter', ...fontFamily.sans],
        display: ['Orbitron', ...fontFamily.sans],
      },
      borderRadius: {
        xl: '1.25rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        neon: '0 10px 40px -10px rgba(0, 229, 255, 0.6)',
      },
    },
  },
  plugins: [tailwindForms, tailwindTypography],
};
