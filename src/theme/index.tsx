import React, { useMemo } from 'react'
import styled, {
  createGlobalStyle,
  css,
  DefaultTheme,
  ThemeProvider as StyledComponentsThemeProvider
} from 'styled-components'
import { useIsDarkMode } from '../state/user/hooks'
import { Text, TextProps } from 'rebass'
import { Colors } from './styled'
import backgroundImage from '../assets/images/background-light.svg'
import backgroundImageDark from '../assets/images/background-dark.svg'
import backgroundImageUpToLarge from '../assets/images/background-light-uptolarge.svg'
import backgroundImageUpToLargeDark from '../assets/images/background-dark-uptolarge.svg'
import backgroundImageUpToSmall from '../assets/images/background-light-uptosmall.svg'
import backgroundImageUpToSmallDark from '../assets/images/background-dark-uptosmall.svg'
import backgroundImageUpToExtraSmall from '../assets/images/background-light-uptoextrasmall.svg'
import backgroundImageUpToExtraSmallDark from '../assets/images/background-dark-uptoextrasmall.svg'
import backgroundMyStaking from '../assets/images/background-my-staking-light.svg'
import backgroundMyStakingDark from '../assets/images/background-my-staking-dark.svg'
import backgroundMyStakingUpToExtraSmall from '../assets/images/background-my-staking-light-uptoextrasmall.svg'
import backgroundMyStakingUpToExtraSmallDark from '../assets/images/background-my-staking-dark-uptoextrasmall.svg'
import Party from '../assets/images/party-light.svg'
import PartyDark from '../assets/images/party-dark.svg'
import backgroundStakingPageDark from '../assets/images/background-staking-page-dark.svg'
import backgroundStakingPage from '../assets/images/background-staking-page-light.svg'

import { darken } from 'polished'

export * from './components'

export const MEDIA_WIDTHS = {
  upToExtraSmall: 500,
  upToSmall: 768,
  upToMedium: 992,
  upToLarge: 1400,
  upToExtraLarge: 1920
}

const mediaWidthTemplates: { [width in keyof typeof MEDIA_WIDTHS]: typeof css } = Object.keys(MEDIA_WIDTHS).reduce(
  (accumulator, size) => {
    ;(accumulator as any)[size] = (a: any, b: any, c: any) => css`
      @media (max-width: ${(MEDIA_WIDTHS as any)[size] - 1}px) {
        ${css(a, b, c)}
      }
    `
    return accumulator
  },
  {}
) as any

const white = '#FFFFFF'
const black = '#000000'

export function colors(darkMode: boolean): Colors {
  return {
    // base
    white,
    black,

    // text
    text1: darkMode ? '#FFFFFF' : '#000000',
    text2: darkMode ? '#C3C5CB' : '#565A69',
    text3: darkMode ? '#6C7284' : '#888D9B',
    text4: darkMode ? '#565A69' : '#C3C5CB',
    text5: darkMode ? '#2C2F36' : '#EDEEF2',

    // backgrounds / greys
    bg1: darkMode ? '#212429' : '#FFFFFF',
    bg2: darkMode ? '#2C2F36' : '#F7F8FA',
    bg3: darkMode ? '#40444F' : '#EDEEF2',
    bg4: darkMode ? '#565A69' : '#CED0D9',
    bg5: darkMode ? '#6C7284' : '#888D9B',

    //specialty colors
    modalBG: darkMode ? 'rgba(0,0,0,.425)' : 'rgba(0,0,0,0.3)',
    advancedBG: darkMode ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.6)',

    //primary colors
    primary1: darkMode ? '#2172E5' : '#ff007a',
    primary2: darkMode ? '#3680E7' : '#FF8CC3',
    primary3: darkMode ? '#4D8FEA' : '#FF99C9',
    primary4: darkMode ? '#376bad70' : '#F6DDE8',
    primary5: darkMode ? '#153d6f70' : '#FDEAF1',

    // color text
    primaryText1: darkMode ? '#6da8ff' : '#ff007a',

    // secondary colors
    secondary1: darkMode ? '#2172E5' : '#ff007a',
    secondary2: darkMode ? '#17000b26' : '#F6DDE8',
    secondary3: darkMode ? '#17000b26' : '#FDEAF1',

    // other
    red1: '#FD4040',
    red2: '#F82D3A',
    red3: '#D60000',
    green1: '#27AE60',
    yellow1: '#FFE270',
    yellow2: '#F3841E',
    blue1: '#2172E5',

    // dont wanna forget these blue yet
    // blue4: darkMode ? '#153d6f70' : '#C4D9F8',
    // blue5: darkMode ? '#153d6f70' : '#EBF4FF',

    // S-ONE
    textBlack: '#333333',
    text1Sone: darkMode ? '#FFFFFF' : '#111111',
    text2Sone: darkMode ? '#7AA3E5' : '#111111',
    text3Sone: darkMode ? '#FFFFFF' : '#767676',
    text4Sone: darkMode ? '#AAAAAA' : '#767676',
    text5Sone: '#3FAAB0',
    text6Sone: darkMode ? '#FFFFFF' : '#333333',
    text7Sone: darkMode ? '#56CFD6' : '#65BAC5',
    text8Sone: '#767676',
    text9Sone: '#C9C9C9',
    text10Sone: darkMode ? '#AAAAAA' : '#333333',
    text11Sone: darkMode ? '#FFFFFF' : '#000000',
    text12Sone: darkMode ? '#263F59' : '#F2F2F2',
    text13Sone: '#AAAAAA',

    red1Sone: '#F05359',
    green1Sone: '#7AC51B',

    bg1Sone: darkMode ? '#0E2B4A' : '#FFFFFF',
    bg2Sone: darkMode ? '#3B5183' : '#FAEDED',
    bg3Sone: darkMode ? '#3B5183' : '#FFFFFF',
    bg4Sone: darkMode ? '#111111' : '#F3F3F3',
    bg5Sone: '#DFDFDF',
    bg6Sone: darkMode ? '#05243B' : '#F2F2F2',
    bg7Sone: darkMode ? '#0A1C29' : 'linear-gradient(30.5deg, #fcf0f0 8.77%, #ffffff 32.67%), #ffffff',
    bg8Sone: darkMode ? '#0A1C29' : '#fff',
    bg9Sone: darkMode ? '#3B5183' : 'linear-gradient(180deg, #ffefef 48.7%, #f8f8f8 100%)',
    bg10Sone: darkMode ? '#0E2B4A' : 'linear-gradient(359.3deg, #ededed 26.78%, #ffffff 66.23%)',
    bg11Sone: '#C4C4C4',
    bg12Sone: darkMode ? '#212429' : '#FAFAFA',
    bg13Sone: darkMode ? '#0E2B4A' : 'linear-gradient(180deg, #F3F3F3 0%, rgba(243, 243, 243, 0) 100%)',
    bg14Sone: darkMode
      ? 'linear-gradient(180deg, #204A76 0%, #0A1C29 100%)'
      : 'linear-gradient(180deg, #F3F3F3 0%, rgba(243, 243, 243, 0) 100%)',
    bg15Sone: darkMode ? '#0A1C29' : 'linear-gradient(0deg, #FFFFFF, #FFFFFF), #FFF2EF;',
    bgPanels: darkMode ? 'transparent' : '#F3F3F3',

    border1Sone: darkMode ? '#AAAAAA' : '#C9C9C9',
    border2Sone: darkMode ? '#AAAAAA' : 'transparent',
    border3Sone: darkMode ? '#FFFFFF' : '#DFDFDF',
    stroke1Sone: darkMode ? '#3FAAB0' : '#F05359',
    divider1Sone: darkMode ? '#AAAAAA' : 'rgba(0, 0, 0, 0.25)',
    scrollbarThumb: darkMode ? '#3B5183' : '#808080',
    closeIcon: darkMode ? '#AAAAAA' : '#000000',

    // Tab
    tabBg: darkMode ? '#3B5183' : '#F3F3F3',
    tabBgActive: darkMode ? '#ECECEC' : '#3FAAB0',
    tabText: darkMode ? '#7AA3E5' : '#C9C9C9',
    tabTextActive: darkMode ? '#4F4F4F' : '#FFFFFF',

    // Others
    f3f3f3: '#F3F3F3'
  }
}

export function theme(darkMode: boolean): DefaultTheme {
  return {
    ...colors(darkMode),

    grids: {
      sm: 8,
      md: 12,
      lg: 24
    },
    //shadows
    shadow1: darkMode ? '#000' : '#2F80ED',

    // media queries
    mediaWidth: mediaWidthTemplates,

    // css snippets
    flexColumnNoWrap: css`
      display: flex;
      flex-flow: column nowrap;
    `,
    flexRowNoWrap: css`
      display: flex;
      flex-flow: row nowrap;
    `,

    // Background image
    bgImage: darkMode ? backgroundImageDark : backgroundImage,
    bgImageUpToLarge: darkMode ? backgroundImageUpToLargeDark : backgroundImageUpToLarge,
    bgImageUpToSmall: darkMode ? backgroundImageUpToSmallDark : backgroundImageUpToSmall,
    bgImageUpToExtraSmall: darkMode ? backgroundImageUpToExtraSmallDark : backgroundImageUpToExtraSmall,

    bgMyStaking: darkMode ? backgroundMyStakingDark : backgroundMyStaking,
    bgMyStakingUpToExtraSmall: darkMode ? backgroundMyStakingUpToExtraSmallDark : backgroundMyStakingUpToExtraSmall,

    bgStakingPage: darkMode ? backgroundStakingPageDark : backgroundStakingPage,

    bgParty: darkMode ? PartyDark : Party
  }
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const darkMode = useIsDarkMode()

  const themeObject = useMemo(() => theme(darkMode), [darkMode])

  return <StyledComponentsThemeProvider theme={themeObject}>{children}</StyledComponentsThemeProvider>
}

const TextWrapper = styled(Text)<{ color: keyof Colors }>`
  color: ${({ color, theme }) => (theme as any)[color]};
`

export const TYPE = {
  main(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'text2'} {...props} />
  },
  link(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'primary1'} {...props} />
  },
  black(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'text1'} {...props} />
  },
  white(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'white'} {...props} />
  },
  body(props: TextProps) {
    return <TextWrapper fontWeight={400} fontSize={16} color={'text1'} {...props} />
  },
  largeHeader(props: TextProps) {
    return <TextWrapper fontWeight={600} fontSize={24} {...props} />
  },
  mediumHeader(props: TextProps) {
    return <TextWrapper fontWeight={500} fontSize={20} {...props} />
  },
  subHeader(props: TextProps) {
    return <TextWrapper fontWeight={400} fontSize={14} {...props} />
  },
  small(props: TextProps) {
    return <TextWrapper fontWeight={500} fontSize={11} {...props} />
  },
  blue(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'blue1'} {...props} />
  },
  yellow(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'yellow1'} {...props} />
  },
  darkGray(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'text3'} {...props} />
  },
  gray(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'bg3'} {...props} />
  },
  italic(props: TextProps) {
    return <TextWrapper fontWeight={500} fontSize={12} fontStyle={'italic'} color={'text2'} {...props} />
  },
  error({ error, ...props }: { error: boolean } & TextProps) {
    return <TextWrapper fontWeight={500} color={error ? 'red1' : 'text2'} {...props} />
  },
  red1Sone(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'red1Sone'} {...props} />
  },
  green1Sone(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'green1Sone'} {...props} />
  },
  language(props: TextProps) {
    return <TextWrapper fontWeight={500} color={'text2Sone'} {...props} />
  },
  subText(props: TextProps) {
    return <TextWrapper fontWeight={400} fontSize={16} color={'text4Sone'} {...props} />
  }
}

export const FixedGlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap');

  html, input, textarea, button {
    font-family: 'Roboto', sans-serif;
  }

  html,
  body {
    margin: 0;
    padding: 0;
  }

  a {
    color: ${colors(false).blue1};
  }

  * {
    box-sizing: border-box;
  }

  button {
    user-select: none;
  }

  html {
    font-variant: none;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    font-feature-settings: 'ss01' on, 'ss02' on, 'cv01' on, 'cv03' on;
  }
`

export const ThemedGlobalStyle = createGlobalStyle`
  html {
    color: ${({ theme }) => theme.text1};
    background-color: ${({ theme }) => theme.bg2};
  }
  
  body {
    min-height: 100vh;
    min-width: 100vw; // Bỏ qua width của scrollbar, đảm bảo modal center.
    overflow-x: hidden;
  }

  ::-webkit-scrollbar {
    width: 10px;
  }

  ::-webkit-scrollbar-track {
    background-color: ${({ theme }) => theme.divider1Sone};
  }

  ::-webkit-scrollbar-thumb {
    background-color: ${({ theme }) => theme.scrollbarThumb};
  }

  ::-webkit-scrollbar-thumb:hover {
    background-color: ${({ theme }) => `${darken(0.05, theme.scrollbarThumb)}`};
  }
`
