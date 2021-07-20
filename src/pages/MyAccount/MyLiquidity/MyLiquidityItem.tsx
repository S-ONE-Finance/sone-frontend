import React from 'react'
import { ETHER, JSBI, Pair, Percent } from '@s-one-finance/sdk-core'
import { Link } from 'react-router-dom'
import { Text } from 'rebass'
import { useTranslation } from 'react-i18next'
import Row, { RowFitContent } from '../../../components/Row'
import CurrencyLogoDouble from '../../../components/CurrencyLogoDouble'
import Column from '../../../components/Column'
import { useIsUpToExtraSmall, useIsUpToSmall } from '../../../hooks/useWindowSize'
import useTheme from '../../../hooks/useTheme'
import MoneyBagLight from '../../../assets/images/money-bag-light.svg'
import MoneyBagDark from '../../../assets/images/money-bag-dark.svg'
import { useIsDarkMode } from '../../../state/user/hooks'
import DetailedSectionItem from './DetailedSectionItem'
import { useActiveWeb3React } from '../../../hooks'
import { useTokenBalance } from '../../../state/wallet/hooks'
import { useTotalSupply } from '../../../data/TotalSupply'
import { unwrappedToken } from '../../../utils/wrappedCurrency'
import {
  ButtonAdd,
  ButtonRemove,
  MyLiquidityDetailedSection,
  DownIcon,
  FlexibleRow,
  Watermark,
  MyLiquidityAndStakingContainer,
  PairName,
  StakeLink,
  SummarySection,
  TextAPY,
  TextLpTokens,
  TextPercentage
} from '../components'

export default function MyLiquidityItem({
  pair,
  isShowDetailedSection,
  setDetailPair
}: {
  pair: Pair
  isShowDetailedSection: boolean
  setDetailPair: React.Dispatch<React.SetStateAction<string | undefined>>
}) {
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
              {t('your_total_lp_tokens')}
            </Text>
            <TextLpTokens>{userPoolBalance ? userPoolBalance.toSignificant(4) : '-'}</TextLpTokens>
          </Column>
          {/* TODO: Change proper link after code stake page. */}
          <StakeLink to="/stake">{t('Stake')}</StakeLink>
        </FlexibleRow>
        <Row gap="10px" justify="flex-end">
          <Column width="fit-content" justify="center" align="center">
            <TextPercentage onClick={() => alert('Not implemented yet!')}>88.88%</TextPercentage>
            <TextAPY>{t('APY')}</TextAPY>
          </Column>
          <DownIcon
            active={isShowDetailedSection ? 0 : 1}
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
              name={currency0?.symbol ? t('pooled_symbol', { symbol: currency0.symbol }) : '-'}
              explain="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sed, voluptates!"
              value={token0Deposited ? token0Deposited.toSignificant(6) : '-'}
            />
            <DetailedSectionItem
              name={currency1?.symbol ? t('pooled_symbol', { symbol: currency1.symbol }) : '-'}
              explain="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sed, voluptates!"
              value={token1Deposited ? token1Deposited.toSignificant(6) : '-'}
            />
            <DetailedSectionItem
              name={t('your_pool_share')}
              explain="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sed, voluptates!"
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
                {t('remove_account')}
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
