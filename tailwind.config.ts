import plugin from 'tailwindcss/plugin'
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter var', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        alert: {
          blur: {
            xs: '2px',
          },
          borderWidth: {
            '3': '3px',
          },
          spacing: {
            '18': '4.5rem',
            '22': '5.5rem',
          },
          opacity: {
            '15': '0.15',
            '85': '0.85',
          },
          transitionDuration: {
            '400': '400ms',
          },
          rotate: {
            '360': '360deg',
          },
          scale: {
            '102': '1.02',
          },
          DEFAULT: 'hsl(var(--alert))',
          foreground: 'hsl(var(--alert-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
      },

      strokeWidth: {
        0: '0',
        base: 'var(--stroke-width)',
        1: 'calc(var(--stroke-width) + 1px)',
        2: 'calc(var(--stroke-width) + 2px)',
      },
      animation: {
        'warm-pulse': 'warm-pulse 3s ease-in-out infinite',
        float: 'float 6s ease-in-out infinite',
        shine: 'shine 1.5s ease-in-out infinite',
        'slide-up': 'slide-up 0.5s ease-out',
        'slide-down': 'slide-down 0.5s ease-out',
        'accordion-down': 'collapsible-down 0.2s ease-out 0s 1 normal forwards',
      },
      keyframes: {
        'warm-pulse': {
          '0%, 100%': { opacity: 0.7 },
          '50%': { opacity: 0.9 },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shine: {
          '0%': { opacity: 0, transform: 'translateX(-100%)' },
          '50%': { opacity: 0.5 },
          '100%': { opacity: 0, transform: 'translateX(100%)' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(10px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        'slide-down': {
          '0%': { transform: 'translateY(-10px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        'collapsible-up': {
          from: { height: 'var(--qwikui-collapsible-content-height)' },
          to: { height: '0' },
        },
      },
      backgroundImage: {
        'hero-bg':
          "url('https://cdn.pixabay.com/photo/2017/05/09/13/33/laptop-2298286_1280.png')",
        'footer-texture': "url('/img/footer-texture.png')",
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    plugin(({ addUtilities }) => {
      addUtilities({
        '.press': {
          transform: 'var(--transform-press)',
        },
      })
    }),
  ],
}
