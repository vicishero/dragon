/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-dark': '#0d1117',
        'bg-secondary': '#161b22',
        'bg-card': 'rgba(22, 27, 34, 0.8)',
        'primary': '#6366f1',
        'secondary': '#8b5cf6',
        'accent': '#06b6d4',
        'success': '#10b981',
        'warning': '#f59e0b',
        'error': '#ef4444',
        'text-primary': '#f9fafb',
        'text-secondary': '#d1d5db',
        'text-muted': '#9ca3af',
      },
      borderRadius: {
        'btn': '12px',
        'card': '16px',
        'input': '10px',
      },
      boxShadow: {
        'card': '0 4px 20px rgba(0, 0, 0, 0.3)',
        'btn': '0 4px 15px rgba(99, 102, 241, 0.4)',
      }
    },
  },
  plugins: [],
}
