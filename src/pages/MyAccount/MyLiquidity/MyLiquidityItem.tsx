import React from 'react'
import { ETHER, JSBI, Pair, Percent } from '@s-one-finance/sdk-core'
import { Link } from 'react-router-dom'
import { Text } from 'rebass'
import { useTranslation } from 'react-i18next'
import Row, { RowFitContent } from '../../../components/Row'
import CurrencyLogoDouble from '../../../components/CurrencyLogoDouble'
import Column from '../../../components/Column'
import { useIsUpToExtraSmall, useIsUpToSmall } from 'hooks/useWindowSize'
import useTheme from '../../../hooks/useTheme'
import MoneyBagLight from '../../../assets/images/money-bag-light.svg'
import MoneyBagDark from '../../../assets/images/money-bag-dark.svg'
import { useIsDarkMode } from 'state/user/hooks'
import DetailedSectionItem from './DetailedSectionItem'
import { useActiveWeb3React } from 'hooks'
import { useTokenBalance } from 'state/wallet/hooks'
import { useTotalSupply } from 'data/TotalSupply'
import { unwrappedToken } from 'utils/wrappedCurrency'
import {
  ButtonAdd,
  ButtonRemove,
  DownIcon,
  FlexibleRow,
  MyLiquidityAndStakingContainer,
  MyLiquidityDetailedSection,
  PairName,
  StakeLink,
  SummarySection,
  TextAPY,
  TextLpTokens,
  TextPercentage,
  Watermark
} from '../components'
import usePoolIdByPairAddress from 'hooks/staking/usePoolIdByPairAddress'
import useMyLiquidityApy from '../../../hooks/useMyLiquidityApy'
import { formatTwoDigits, formatTwoDigitsFromString, getFixedNumberCommas } from 'utils/formatNumber'
import BigNumber from 'bignumber.js'

export default function MyLiquidityItem({
  pair,
  isShowDetailedSection,
  setDetailPair
}: {
  pair: Pair
  isShowDetailedSection: boolean
  setDetailPair: React.Dispatch<React.SetStateAction<string | undefined>>
}) {
  const poolId = usePoolIdByPairAddress(pair.liquidityToken.address)
  const { t } = useTranslation()
  // Style.
  const isUpToExtraSmall = useIsUpToExtraSmall()
  const isUpToSmall = useIsUpToSmall()
  const theme = useTheme()
  const isDark = useIsDarkMode()

  // Data.
  const currency0 = unwrappedToken(pair.token0)
  const currency1 = unwrappedToken(pair.token1)

  const { account } = useActiveWeb3React()
  const totalPoolTokens = useTotalSupply(pair.liquidityToken)
  const userPoolBalance = useTokenBalance(account ?? undefined, pair.liquidityToken)
  const poolTokenPercentage =
    !!userPoolBalance && !!totalPoolTokens && JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolBalance.raw)
      ? new Percent(userPoolBalance.raw, totalPoolTokens.raw)
      : undefined
  const [token0Deposited, token1Deposited] =
    !!pair &&
    !!totalPoolTokens &&
    !!userPoolBalance &&
    // this condition is a short-circuit in the case where useTokenBalance updates sooner than useTotalSupply
    JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolBalance.raw)
      ? [
          pair.getLiquidityValue(pair.token0, totalPoolTokens, userPoolBalance, false),
          pair.getLiquidityValue(pair.token1, totalPoolTokens, userPoolBalance, false)
        ]
      : [undefined, undefined]
  const apy = useMyLiquidityApy(pair.liquidityToken.address)
  const apyRender = apy === undefined ? '0%' : `${getFixedNumberCommas(new BigNumber(apy * 100).toString(), 6)}%`

  return (
    <MyLiquidityAndStakingContainer>
      <SummarySection>
        <RowFitContent
          justify="flex-start"
          flexDirection={isUpToExtraSmall ? 'column' : 'row'}
          align={isUpToExtraSmall ? 'flex-start' : 'center'}
        >
          <CurrencyLogoDouble currency0={currency0} currency1={currency1} size={22} />
          <PairName
            style={{
              marginLeft: isUpToExtraSmall ? '0' : '20px'
            }}
            text={t('pair')}
          >{`${currency0.symbol}-${currency1.symbol}`}</PairName>
        </RowFitContent>
        <FlexibleRow gap={isUpToExtraSmall ? '0' : '10px'} justify="center">
          <Column width="fit-content" align="center">
            <Text color={theme.text8Sone} fontSize={isUpToSmall ? '13px' : '16px'}>
              {t('total_lp_token')}
            </Text>
            <TextLpTokens>
              {userPoolBalance ? formatTwoDigitsFromString(userPoolBalance.raw.toString(), true, true) : '-'}
            </TextLpTokens>
          </Column>
          {poolId !== undefined && <StakeLink to={`/staking/${poolId}`}>{t('Stake')}</StakeLink>}
        </FlexibleRow>
        <Row gap="10px" justify="flex-end">
          <Column width="fit-content" justify="center" align="flex-end">
            <TextPercentage>{apyRender}</TextPercentage>
            <TextAPY>{t('apy')}</TextAPY>
          </Column>
          <DownIcon
            active={isShowDetailedSection ? 1 : 0}
            onClick={() =>
              setDetailPair(prev => (prev === pair.liquidityToken.address ? undefined : pair.liquidityToken.address))
            }
          />
        </Row>
      </SummarySection>

      {isShowDetailedSection && (
        <>
          <MyLiquidityDetailedSection gap="15px">
            <DetailedSectionItem
              name={currency0?.symbol ? t('pooled_currency', { symbol: currency0.symbol }) : '-'}
              explain={t('question_helper_pooled_currency')}
              value={token0Deposited ? formatTwoDigits(token0Deposited) : '-'}
            />
            <DetailedSectionItem
              name={currency1?.symbol ? t('pooled_currency', { symbol: currency1.symbol }) : '-'}
              explain={t('question_helper_pooled_currency')}
              value={token1Deposited ? formatTwoDigits(token1Deposited) : '-'}
            />
            <DetailedSectionItem
              name={t('your_pool_share')}
              explain={t('question_helper_your_pool_share')}
              value={
                poolTokenPercentage
                  ? (poolTokenPercentage.toFixed(2) === '0.00' ? '<0.01' : poolTokenPercentage.toFixed(2)) + '%'
                  : '-'
              }
            />
            <Row style={{ marginTop: isUpToSmall ? '0' : '25px', zIndex: 1 }} gap="2rem" justify="center">
              <ButtonRemove
                as={Link}
                to={
                  currency0 === ETHER
                    ? `/my-account/withdraw/ETH/${pair.token1.address}`
                    : currency1 === ETHER
                    ? `/my-account/withdraw/${pair.token0.address}/ETH`
                    : `/my-account/withdraw/${pair.token0.address}/${pair.token1.address}`
                }
              >
                {t('remove')}
              </ButtonRemove>
              <ButtonAdd
                as={Link}
                to={
                  currency0 === ETHER
                    ? `/add/ETH/${pair.token1.address}`
                    : currency1 === ETHER
                    ? `/add/${pair.token0.address}/ETH`
                    : `/add/${pair.token0.address}/${pair.token1.address}`
                }
              >
                {t('add_account')}
              </ButtonAdd>
            </Row>
          </MyLiquidityDetailedSection>
          <Watermark src={isDark ? MoneyBagDark : MoneyBagLight} alt="money-bag" />
        </>
      )}
    </MyLiquidityAndStakingContainer>
  )
}
