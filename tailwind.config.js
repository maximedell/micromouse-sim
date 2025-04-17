/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
				primary: "#3C3D37",
				"primary-light": "#697565",
				"primary-dark": "#181C14",
				secondary: "#697565",
				accent: "#ECDFCC",
			},
			fontFamily: {
				sans: ["Roboto", "sans-serif"],
			},
			border: {
				xs: "1px",
			},
		},
	},
	plugins: [],
};
