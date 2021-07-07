import styled from 'styled-components'
import { Text } from 'rebass'
import { Button } from 'rebass/styled-components'
import { darken } from 'polished'

export const MyAccountWrapper = styled.div`
  width: 773px;
  max-width: 100%;
  margin-top: 30px;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    margin-top: 0;
  `}
`

export const PageTitle = styled.h1`
  text-align: center;
  font-size: 20px;
  font-weight: 700;
  margin: 0 0 1em 0;
  display: none;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    display: block;
  `}
`

export const Sections = styled.div`
  display: grid;
  grid-auto-rows: auto;
  grid-row-gap: 5em;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    grid-row-gap: 2em;  
  `}
`

export const Section = styled.div`
  display: grid;
  grid-auto-rows: auto;
  grid-row-gap: 2rem;
  justify-items: center;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    grid-row-gap: 10px;
  `}
`

export const Card = styled.div`
  background-color: ${({ theme }) => theme.bg1Sone};
  box-shadow: 0px 8px 17px rgba(0, 0, 0, 0.18);
  border-radius: 40px;
  width: 100%;
  min-height: 75px;
  display: flex;
  justify-content: center;
  align-items: center;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    border-radius: 25px;
  `}
`

export const Heading = styled.h2`
  justify-self: flex-start;
  font-size: 40px;
  font-weight: 700;
  color: ${({ theme }) => theme.text6Sone};
  margin: 0;
  padding: 0;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    font-size: 16px;    
  `}
`

export const SectionText = styled(Text)`
  font-size: 20px;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    font-size: 18px;
  `}

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    font-size: 13px;  
  `}
`

export const SectionButton = styled(Button)<{ is_disabled?: 'yes' }>`
  font-size: 20px;
  font-weight: 500;
  color: ${({ theme }) => theme.white};
  height: 60px;
  width: 192px;
  border-radius: 40px;
  background-color: ${({ theme, is_disabled }) => (is_disabled ? theme.text9Sone : theme.red1Sone)};
  box-shadow: 0 4px 39px rgba(0, 0, 0, 0.15);
  cursor: ${({ is_disabled }) => (is_disabled ? 'normal' : 'pointer')};
  display: flex;
  justify-content: center;
  align-items: center;
  text-decoration: none;

  :hover {
    background-color: ${({ theme, is_disabled }) => !is_disabled && darken(0.15, theme.red1Sone)};
  }

  :active {
    background-color: ${({ theme, is_disabled }) => !is_disabled && darken(0.2, theme.red1Sone)};
  }

  ${({ theme }) => theme.mediaWidth.upToSmall`
    height: 45px;
    width: 172px;
    font-size: 18px;
  `}

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    height: 35px;
    max-width: 142px;
    font-size: 13px;
  `}
`
