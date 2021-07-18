import React from 'react'
import styled, { keyframes } from 'styled-components'

import { useDarkModeManager } from '../../state/user/hooks'

import LoaderLight from '../../assets/svg/loader.svg'
import LoaderDark from '../../assets/svg/loader_dark.svg'
import { Text } from 'rebass'

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

const StyledLoadWrapper = styled.div<{ size: string }>`
  position: relative;
  height: ${({ size }) => size};
  width: ${({ size }) => size};
`

const AbsoluteText = styled(Text)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 13px;
  line-height: 1.6;
`

/**
 * Takes in custom size and stroke for circle color, default to primary color as fill,
 * need ...rest for layered styles on top
 */
export default function LoaderSone({
  size = '16px',
  valueInside,
  ...rest
}: {
  size: string
  valueInside?: number
  [k: string]: any
}) {
  const [darkMode] = useDarkModeManager()

  return (
    <StyledLoadWrapper size={size}>
      <StyledLoader src={darkMode ? LoaderDark : LoaderLight} alt="loader" size={size} {...rest} />
      {valueInside && <AbsoluteText>{valueInside}</AbsoluteText>}
    </StyledLoadWrapper>
  )
}
