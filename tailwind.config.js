module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"], // Adjust based on your project structure
  darkMode: 'class', // Enables class-based dark mode
  theme: {
    extend: {
      colors: {
        'gray-500': '#6B7280',
        'red-600': '#EF4444',
        'red-400': '#F87171',
      },
      keyframes: {
        'notification-enter': {
          '0%': {
            transform: 'translate(100%, -50%)',
            opacity: '0',
          },
          '60%': {
            transform: 'translate(-10%, 0%)',
            opacity: '0.8',
          },
          '100%': {
            transform: 'translate(0)',
            opacity: '1',
          },
        },
        'progress-bar': {
          '0%': {
            width: '100%',
          },
          '100%': {
            width: '0%',
          },
        },
        'notification-slide-in': {
          '0%': {
            transform: 'translateX(100%)',
            opacity: '0',
          },
          '100%': {
            transform: 'translateX(0)',
            opacity: '1',
          },
        },
        'fadeInOut': {
          '0%, 100%': {
            opacity: '0',
          },
          '50%': {
            opacity: '1',
          },
        },
      },
      animation: {
        'notification-enter': 'notification-enter 0.5s ease-out forwards',
        'progress-bar': 'progress-bar 5s linear forwards',
        'notification-slide-in': 'notification-slide-in 0.5s ease-out forwards',
        'fadeInOut': 'fadeInOut 2s ease-in-out infinite', // New animation added
      },
    },
  },
  plugins: [],
};
