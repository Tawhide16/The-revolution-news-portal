import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        revolution: {
          red: "#B80000",
          redDark: "#950000",
          black: "#1A1A1A",
          charcoal: "#262626",
          lightGrey: "#F2F2F2",
          borderGrey: "#E2E2E2",
          mutedText: "#555555",
        },
      },
      fontFamily: {
        serif: ["Merriweather", "Georgia", "Cambria", "Times New Roman", "serif"],
        sans: ["Inter", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
