/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{html,js,ts}'],
	theme: {
		extend: {
			colors: {
				bkg: 'hsl(var(--color-bkg) / <alpha-value>)'
			}
		}
	},
	plugins: [require('rippleui')]
};
