import React from 'react'
import styled, { keyframes } from 'styled-components'

import { useDarkModeManager } from '../../state/user/hooks'

import LoaderLight from '../../assets/svg/loader.svg'
import LoaderDark from '../../assets/svg/loader_dark.svg'

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`

const StyledLoader = styled.img<{ size: string }>`
  animation: 2s ${rotate} linear infinite;
  height: ${({ size }) => size};
  width: ${({ size }) => size};
`

/**
 * Takes in custom size and stroke for circle color, default to primary color as fill,
 * need ...rest for layered styles on top
 */
export default function LoaderSone({ size = '16px', ...rest }: { size?: string; [k: string]: any }) {
  const [darkMode] = useDarkModeManager()

  return <StyledLoader src={darkMode ? LoaderDark : LoaderLight} alt="loader" size={size} {...rest} />
}
