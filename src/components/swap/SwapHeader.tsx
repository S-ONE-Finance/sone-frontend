import React from 'react'
import styled from 'styled-components'
import Settings from '../Settings'
import { RowBetween } from '../Row'
import SwapVectorLight from '../../assets/images/swap-vector-light.svg'
import SwapVectorDark from '../../assets/images/swap-vector-dark.svg'
import { useIsDarkMode } from '../../state/user/hooks'
import Column from '../Column'
import { useTranslation } from 'react-i18next'

const StyledSwapHeader = styled.div`
  padding: 23px 30px 26px;
  width: 100%;
  max-width: 602px;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    padding: 23px 20px 17px;
  `};
`

const SwapVector = styled.img`
  width: 83.11px;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    width: 39.59px;
  `};
`

const Title = styled.div`
  color: ${({ theme }) => theme.text6Sone};
  font-weight: 700;
  font-size: 40px;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    font-size: 20px;
  `};
`

const Description = styled.div`
  color: ${({ theme }) => theme.text4Sone};
  font-weight: 500;
  font-size: 16px;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    font-size: 13px;
  `};
`

const TitleDescWrapper = styled(Column)`
  margin-left: 20px;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    margin-left: 7px;
  `};
`

export default function SwapHeader() {
  const isDarkMode = useIsDarkMode()
  const { t } = useTranslation()

  return (
    <StyledSwapHeader>
      <RowBetween>
        <SwapVector src={isDarkMode ? SwapVectorDark : SwapVectorLight} alt="swap-vector" />
        <TitleDescWrapper>
          <Title>{t('swap')}</Title>
          <Description>{t('swap_description')}</Description>
        </TitleDescWrapper>
        <Settings />
      </RowBetween>
    </StyledSwapHeader>
  )
}
