/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
    "./src/pages/**/*.{js,jsx}",
    "./src/components/**/*.{js,jsx}",
    "./src/app/**/*.{js,jsx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			dark: '#1E293B',
  			light: '#F8FAFC',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		fontFamily: {
  			sans: [
  				'Mulish',
  				'sans-serif'
  			]
  		},
  		screens: {
  			xs: '475px',
  			'2xl': '1536px',
  			'3xl': '1920px',
  			'4xl': '2560px',
  			'5xl': '3840px',
  			'6xl': '5120px'
  		},
  		spacing: {
  			'screen-padding': 'clamp(1rem, 2vw, 4rem)',
  			'section-padding': 'clamp(2rem, 4vw, 6rem)'
  		},
  		maxWidth: {
  			'container-sm': '1280px',
  			'container-md': '1440px',
  			'container-lg': '1600px',
  			'container-xl': '1920px',
  			'container-2xl': '2560px',
  			'container-3xl': '3200px'
  		},
		borderRadius: {
			lg: 'var(--radius)',
			md: 'calc(var(--radius) - 2px)',
			sm: 'calc(var(--radius) - 4px)'
		},
		keyframes: {
			fadeInUp: {
				'0%': {
					opacity: '0',
					transform: 'translateY(20px) scale(0.95)'
				},
				'100%': {
					opacity: '1',
					transform: 'translateY(0) scale(1)'
				}
			}
		},
		animation: {
			fadeInUp: 'fadeInUp 0.7s ease-out both'
		}
	}
  },
  plugins: [require("tailwindcss-animate")],
}
