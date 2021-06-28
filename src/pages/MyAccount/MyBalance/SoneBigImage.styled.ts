import styled from 'styled-components'
import { ReactComponent as SoneBigImageSvg } from '../../../assets/images/my-account-balance.svg'

export const StyledSoneBigImage = styled(SoneBigImageSvg)`
  width: 136.62px;
  min-width: 136.62px;
  height: auto;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    width: 71px;
    min-width: 71px;
  `}
`
