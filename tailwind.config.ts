import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    colors: {
      transparent: 'transparent',
      baseGray: '#252322',
      lighterGray: '#2f2c2b',
      darkerGray: '#1b1a19',
      greenStatus: '#6DB158',
      redStatus: '#D84A4A',
      socialBaseColor: '#EDEDED',
      socialHoverColor: '#DE3986',
      navbarGradientStart: '#1B1A19CC',
      navbarGradientVia1: '#1B1A1943',
      navbarGradientVia2: '#1B1A190D',
      navbarGradientEnd: '#1B1A1900',
      textColor: '#EDEDED',
      textColorSecondary: '#a8a8a8',
      voteButtonBorder: '#e25697',
      voteButtonBorderHover: '#a32179',
    },
    extend: {
      backgroundImage: ({ theme }) => ({
        navbarGradient: `linear-gradient(to bottom, ${theme('colors.navbarGradientStart')} 0%, ${theme('colors.navbarGradientVia1')} 36%, ${theme('colors.navbarGradientVia2')} 75%, ${theme('colors.navbarGradientEnd')} 100%)`,
        discord: 'url(/images/discord.svg)',
        discordHover: 'url(/images/discord-hover.svg)',
        github: 'url(/images/github.svg)',
        githubHover: 'url(/images/github-hover.svg)',
      }),
      fontFamily: {
        monocraft: ['Monocraft', 'sans-serif'],
      },
      textShadow: {
        default: '0px 2px 4px rgba(0, 0, 0, 0.5)',
      },
      boxShadow: {
        underline: '0 3px 0 #12100f',
      }
    }
  },
  plugins: [],
}
export default config
