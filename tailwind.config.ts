import type { Config } from "tailwindcss";
import theme from "tailwindcss/defaultTheme";

const config: Config = {
    darkMode: ["class"],
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
    	extend: {
    		colors: {
    			background: 'var(--background)',
    			foreground: 'var(--foreground)',
    			amber: {
    				'100': '#ffeacc',
    				'200': '#ffc97e',
    				'300': '#ffa831',
    				'400': '#e28300',
    				'500': '#945600',
    				'600': '#754400',
    				'700': '#573200',
    				'800': '#382100',
    				'900': '#190f00'
    			},
    			amethyst: {
    				'100': '#edc5ea',
    				'200': '#db99d7',
    				'300': '#c86fc3',
    				'400': '#b04aa9',
    				'500': '#813b7d',
    				'600': '#682c64',
    				'700': '#4d1e4a',
    				'800': '#31112f',
    				'900': '#130613'
    			},
    			emerald: {
    				'100': '#ccffcc',
    				'200': '#7eff7e',
    				'300': '#31ff31',
    				'400': '#00e200',
    				'500': '#009400',
    				'600': '#007500',
    				'700': '#005700',
    				'800': '#003800',
    				'900': '#001900'
    			},
    			ruby: {
    				'100': '#ffb3c1',
    				'200': '#ff7d95',
    				'300': '#ff476a',
    				'400': '#ff123e',
    				'500': '#d2092f',
    				'600': '#ab0020',
    				'700': '#7a0017',
    				'800': '#4a000e',
    				'900': '#190005'
    			},
    			sapphire: {
    				'100': '#ccefff',
    				'200': '#7ecfff',
    				'300': '#31afff',
    				'400': '#0082e2',
    				'500': '#005094',
    				'600': '#003c75',
    				'700': '#002957',
    				'800': '#001638',
    				'900': '#000b19'
    			},
    			steel: {
    				'100': '#f0f1f4',
    				'200': '#cdcfd8',
    				'300': '#a9aebb',
    				'400': '#878c9e',
    				'500': '#676d7e',
    				'600': '#4f5463',
    				'700': '#383c47',
    				'800': '#21242b',
    				'900': '#0b0c0f'
    			}
    		},
    		borderRadius: {
    			lg: 'var(--radius)',
    			md: 'calc(var(--radius) - 2px)',
    			sm: 'calc(var(--radius) - 4px)'
    		},
    		fontFamily: {
    			sans: ['Proxima Nova"', ...theme.fontFamily.sans],
    			manrope: ["var(--font-manrope)"]
    		}
    	}
    },
    plugins: [
        require("tailwindcss-animate"),
        require("@tailwindcss/container-queries"),
    ],
};
export default config;
