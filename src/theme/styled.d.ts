import { FlattenSimpleInterpolation, ThemedCssFunction } from 'styled-components'

export type Color = string
export interface Colors {
  // base
  white: Color
  black: Color

  // text
  text1: Color
  text2: Color
  text3: Color
  text4: Color
  text5: Color

  // backgrounds / greys
  bg1: Color
  bg2: Color
  bg3: Color
  bg4: Color
  bg5: Color

  modalBG: Color
  advancedBG: Color

  //blues
  primary1: Color
  primary2: Color
  primary3: Color
  primary4: Color
  primary5: Color

  primaryText1: Color

  // pinks
  secondary1: Color
  secondary2: Color
  secondary3: Color

  // other
  red1: Color
  red2: Color
  red3: Color
  green1: Color
  yellow1: Color
  yellow2: Color
  blue1: Color

  // S-ONE

  /* Text */
  textBlack: Color
  text1Sone: Color
  text2Sone: Color
  text3Sone: Color
  text4Sone: Color
  text5Sone: Color
  text6Sone: Color
  text7Sone: Color
  text8Sone: Color
  text9Sone: Color
  text10Sone: Color
  text11Sone: Color
  text12Sone: Color
  text13Sone: Color

  /* Background */
  bg1Sone: Color
  bg2Sone: Color
  bg3Sone: Color
  bg4Sone: Color
  bg5Sone: Color
  bg6Sone: Color
  bg7Sone: Color
  bg8Sone: Color
  bg9Sone: Color
  bg10Sone: Color
  bg11Sone: Color
  bg12Sone: Color
  bg13Sone: Color
  bg14Sone: Color
  bg15Sone: Color
  bgPanels: Color

  /* Others */
  red1Sone: Color
  green1Sone: Color
  border1Sone: Color
  border2Sone: Color
  border3Sone: Color
  stroke1Sone: Color
  divider1Sone: Color
  scrollbarThumb: Color
  closeIcon: Color

  /* Tab */
  tabBg: Color
  tabBgActive: Color
  tabText: Color
  tabTextActive: Color

  f3f3f3: Color
}

export interface Grids {
  sm: number
  md: number
  lg: number
}

declare module 'styled-components' {
  export interface DefaultTheme extends Colors {
    grids: Grids
    // shadows
    shadow1: string

    // media queries
    mediaWidth: {
      upToExtraSmall: ThemedCssFunction<DefaultTheme>
      upToSmall: ThemedCssFunction<DefaultTheme>
      upToMedium: ThemedCssFunction<DefaultTheme>
      upToLarge: ThemedCssFunction<DefaultTheme>
      upToExtraLarge: ThemedCssFunction<DefaultTheme>
    }

    // css snippets
    flexColumnNoWrap: FlattenSimpleInterpolation
    flexRowNoWrap: FlattenSimpleInterpolation

    bgImage: string
    bgImageUpToLarge: string
    bgImageUpToSmall: string
    bgImageUpToExtraSmall: string

    bgMyStaking: string
    bgMyStakingUpToExtraSmall: string

    bgStakingPage: string

    bgParty: string
  }
}
