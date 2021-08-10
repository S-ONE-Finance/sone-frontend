import React from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { RowFixed } from '../Row'
import { useIsUpToExtraSmall } from '../../hooks/useWindowSize'
import { getNumberCommas } from '../../subgraph/utils/formatter'

const MyRewardContainer = styled.div`
  padding: 1.5rem 0 1.5rem 2.5rem;
  max-width: 602px;
  width: 100%;
  border-radius: 25px;
  box-shadow: 0 4px 40px rgba(0, 0, 0, 0.15);
  background-color: ${({ theme }) => theme.bg1Sone};
  margin-top: 2.1875rem;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    margin-top: 1.25rem;
    padding: 1.25rem 0 1rem 1.25rem;
  `}
`

const MyRewardTitle = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${({ theme }) => theme.text6Sone};

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    font-size: 1.25rem;
  `}
`

const MyRewardDesc = styled.div`
  font-size: 1rem;
  font-weight: 400;
  color: ${({ theme }) => theme.text4Sone};

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    font-size: 13px;
  `}
`

const MyRewardValue = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.red1Sone};
  word-break: break-all;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    font-size: 30px;
  `}
`

const MyRewardUnit = styled.div`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text4Sone};
`

const PartyBackground = styled.div`
  width: 6.75rem;
  height: 6.75rem;
  position: absolute;
  top: 50%;
  right: 2.5rem;
  transform: translateY(-50%);
  background-position: center;
  background-repeat: no-repeat;
  background-image: url(${({ theme }) => theme.bgParty});
  background-size: contain;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    width: 4rem;
    height: 4rem;
    right: 1.25rem;
  `}
`

export default function MyReward({ myReward }: { myReward?: number }) {
  const { t } = useTranslation()
  const isUpToExtraSmall = useIsUpToExtraSmall()

  const myRewardFormatted = myReward === undefined ? '--' : getNumberCommas(myReward)

  return (
    <MyRewardContainer style={{ position: 'relative' }}>
      <MyRewardTitle>{t('my_reward')}</MyRewardTitle>
      <MyRewardDesc style={{ marginTop: '0.25rem' }}>{t('you_have_rewarded_from_this_lp_token')}</MyRewardDesc>
      <RowFixed
        gap="0.5rem"
        align="baseline"
        style={{
          marginTop: isUpToExtraSmall ? '0.5rem' : '1rem',
          maxWidth: `calc(100% - 1rem - ${isUpToExtraSmall ? '4rem' : '6.75rem'} - ${
            isUpToExtraSmall ? '1rem' : '2rem'
          })`
        }}
      >
        <MyRewardValue>{myRewardFormatted}</MyRewardValue>
        <MyRewardUnit>SONE</MyRewardUnit>
      </RowFixed>
      <PartyBackground />
    </MyRewardContainer>
  )
}
