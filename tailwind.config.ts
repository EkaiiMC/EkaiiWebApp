import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    'hover:border-darkPink',
    'hover:border-bgDarkGray',
  ],
  theme: {
    extend: {
      screens: {
        navbar: '982px',
        login: '400px'
      },
      colors: {
        transparent: "transparent",
        baseText: "#ededed",
        grayText: "#a8a8a8",
        hoverText: '#6d6b6a',
        pinkText: "#de3986",
        greenText: "#6db158",
        redText: "#d84a4a",
        bgGray: "#252322",
        bgLightGray: "#2f2c2b",
        bgLighterGray: "#3a3736",
        bgDarkGray: "#1b1a19",
        topBorder: "#12100f",
        basePink: "#e25697",
        selectedPink: "#f06ba0",
        darkPink: "#a32179",
        navbarGradientStart: "#1b1a19cc",
        navbarGradientVia1: "#1b1a1943",
        navbarGradientVia2: "#1b1a190d",
        navbarGradientEnd: "#1b1a1900",
      },
      backgroundImage: ({ theme }) => ({
        navbarGradient: `linear-gradient(to bottom, ${theme('colors.navbarGradientStart')} 0%, ${theme('colors.navbarGradientVia1')} 36%, ${theme('colors.navbarGradientVia2')} 75%, ${theme('colors.navbarGradientEnd')} 100%)`,
        navbarMobileGradient: `linear-gradient(to bottom, black 0%, transparent 100%)`,
        galleryGradientTop: `linear-gradient(to top, ${theme('colors.navbarGradientStart')} 0%, ${theme('colors.navbarGradientVia1')} 36%, ${theme('colors.navbarGradientVia2')} 75%, ${theme('colors.navbarGradientEnd')} 100%)`,
        galleryGradientBottom: `linear-gradient(to bottom, ${theme('colors.navbarGradientStart')} 0%, ${theme('colors.navbarGradientVia1')} 36%, ${theme('colors.navbarGradientVia2')} 75%, ${theme('colors.navbarGradientEnd')} 100%)`,
        homeBackground: 'url(/images/background-main.webp)',
        defaultBackground: 'url(/images/background.webp)',
        discord: 'url(/images/discord.svg)',
        discordHover: 'url(/images/discord-hover.svg)',
        github: 'url(/images/github.svg)',
        githubHover: 'url(/images/github-hover.svg)',
        logout: 'url(/images/logout.svg)',
        logoutHover: 'url(/images/logout-hover.svg)',
      }),
      fontFamily: {
        monocraft: ['var(--font-monocraft)', 'sans-serif'],
        rubik: ['var(--font-rubik)', 'sans-serif'],
      },
      textShadow: {
        default: '0px 2px 4px rgba(0, 0, 0, 0.5)',
      },
      boxShadow: {
        underline: '0 3px 0 #12100f',
      },
    },
  },
  plugins: [],
};
export default config;
