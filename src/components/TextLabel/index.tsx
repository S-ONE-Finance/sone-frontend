import styled from 'styled-components'

const TextLabel = styled.div`
  color: ${({ theme }) => theme.text8Sone};
  font-size: 16px;
  font-weight: 500;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    font-size: 13px;
  `};
`

export default TextLabel
