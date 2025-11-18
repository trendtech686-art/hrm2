// This file is not directly used by the browser in the current setup,
// but it represents the standard configuration for a Tailwind CSS project
// with shadcn/ui. The configuration object from this file is embedded
// in index.html to be used by the Tailwind Play CDN.

/** @type {import('tailwindcss').Config} */
const config = {
  darkMode: ["class"],
  content: [
    './*.html',
    './*.tsx',
    './components/**/*.tsx',
    './features/**/*.tsx',
    './lib/**/*.ts',
  ],
  theme: {
  	container: {
  		center: true,
  		padding: {
        DEFAULT: "1rem",
        sm: "1.5rem", 
        lg: "2rem",
        xl: "2.5rem",
        "2xl": "3rem"
      },
  		screens: {
        sm: "640px",
        md: "768px", 
        lg: "1024px",
        xl: "1280px",
  			'2xl': '1400px'
  		}
  	},
    // Mobile-first breakpoints
    screens: {
      'xs': '475px',   // Extra small devices
      'sm': '640px',   // Small devices (landscape phones)
      'md': '768px',   // Medium devices (tablets)
      'lg': '1024px',  // Large devices (laptops)
      'xl': '1280px',  // Extra large devices (desktops)
      '2xl': '1536px', // 2X large devices (large desktops)
    },
  	extend: {
      // Mobile-specific spacing
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
        '15': '3.75rem',   // 60px - good for mobile touch targets
        '18': '4.5rem',    // 72px - larger touch targets
      },
      // Mobile-friendly font sizes
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],      // 12px
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],   // 14px
        'base': ['1rem', { lineHeight: '1.5rem' }],      // 16px (mobile base)
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],   // 18px
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],    // 20px
        '2xl': ['1.5rem', { lineHeight: '2rem' }],       // 24px
      },
      // Touch-friendly minimum sizes
      minHeight: {
        'touch': '44px',     // Minimum touch target
        'touch-lg': '48px',  // Large touch target
      },
      minWidth: {
        'touch': '44px',     // Minimum touch target
        'touch-lg': '48px',  // Large touch target
      },
  		colors: {
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			},
  			'caret-blink': {
  				'0%,70%,100%': {
  					opacity: '1'
  				},
  				'20%,50%': {
  					opacity: '0'
  				}
  			},
        'fade-in': {
          from: {
            opacity: '0'
          },
          to: {
            opacity: '1'
          }
        },
        'fade-out': {
          from: {
            opacity: '1'
          },
          to: {
            opacity: '0'
          }
        },
        'zoom-in-95': {
          from: {
            transform: 'scale(0.95)'
          },
          to: {
            transform: 'scale(1)'
          }
        },
        'zoom-out-95': {
          from: {
            transform: 'scale(1)'
          },
          to: {
            transform: 'scale(0.95)'
          }
        },
        'slide-in-from-top-48': {
          from: {
            transform: 'translateY(-48%)'
          },
          to: {
            transform: 'translateY(0)'
          }
        },
        'slide-out-to-top-48': {
          from: {
            transform: 'translateY(0)'
          },
          to: {
            transform: 'translateY(-48%)'
          }
        }
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out',
  			'caret-blink': 'caret-blink 1.25s ease-out infinite',
        'fade-in': 'fade-in 0.2s ease-out',
        'fade-out': 'fade-out 0.2s ease-out',
        'zoom-in-95': 'zoom-in-95 0.2s ease-out',
        'zoom-out-95': 'zoom-out-95 0.2s ease-out',
        'in': 'fade-in 0.2s ease-out, zoom-in-95 0.2s ease-out',
        'out': 'fade-out 0.2s ease-out, zoom-out-95 0.2s ease-out'
  		}
  	}
  },
  plugins: [],
};

// In a project with a build step, you would use:
// module.exports = config;