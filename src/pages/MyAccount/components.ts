import styled from 'styled-components'

export const Card = styled.div`
  background-color: ${({ theme }) => theme.bg1Sone}
  box-shadow: 0px 8px 17px rgba(0, 0, 0, 0.18);
  border-radius: 40px;
  width: 100%;
  min-height: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
  
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    border-radius: 25px;
    min-height: 75px;
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
