import React, { useState } from 'react'
import { HelpCircle } from 'react-feather'
import { ImageProps } from 'rebass'
import styled from 'styled-components'
import { useIsUpToExtraSmall } from '../../hooks/useWindowSize'
import { useDarkModeManager } from '../../state/user/hooks'

const BAD_SRCS: { [tokenAddress: string]: true } = {}

export interface LogoProps extends Pick<ImageProps, 'style' | 'alt' | 'className'> {
  srcs: string[]
  size: string
  sizeMobile: string
}

const StyledLogo = styled.img<{ size: string }>`
  width: ${({ size }) => size};
  min-width: ${({ size }) => size};
  height: ${({ size }) => size};
  min-height: ${({ size }) => size};
  border-radius: ${({ size }) => size};
  background-color: ${({ theme }) => theme.white};
`

/**
 * Renders an image by sequentially trying a list of URIs, and then eventually a fallback triangle alert
 */
export default function Logo({ size, sizeMobile, srcs, alt, ...rest }: LogoProps) {
  const isUpToExtraSmall = useIsUpToExtraSmall()
  const [isDarkMode] = useDarkModeManager()
  const [, refresh] = useState<number>(0)

  const src: string | undefined = srcs.find(src => !BAD_SRCS[src])

  if (src) {
    return (
      <StyledLogo
        {...rest}
        size={isUpToExtraSmall ? sizeMobile : size}
        alt={alt}
        src={src}
        onError={() => {
          if (src) BAD_SRCS[src] = true
          refresh(i => i + 1)
        }}
      />
    )
  }

  return <HelpCircle color={isDarkMode ? '#ffffff' : '#333333'} size={isUpToExtraSmall ? sizeMobile : size} {...rest} />
}
