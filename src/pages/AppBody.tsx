import React from 'react'
import styled from 'styled-components'

export const BodyWrapper = styled.div`
  position: relative;
  max-width: 602px;
  width: 100%;
  background: ${({ theme }) => theme.bg1Sone};
  box-shadow: 0 4px 40px rgba(0, 0, 0, 0.15);
  border-radius: 30px;
`

/**
 * The styled container element that wraps the content of most pages and the tabs.
 */
export default function AppBody({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <BodyWrapper style={style}>{children}</BodyWrapper>
}
