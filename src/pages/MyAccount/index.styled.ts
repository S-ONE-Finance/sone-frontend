import styled from 'styled-components'

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
