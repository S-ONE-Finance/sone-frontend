import styled from 'styled-components'

export const Card = styled.div`
  background-color: ${({ theme }) => theme.bg1Sone}
  box-shadow: 0px 8px 17px rgba(0, 0, 0, 0.18);
  border-radius: 40px;
  width: 100%;
  
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    border-radius: 25px;
  `}
`
