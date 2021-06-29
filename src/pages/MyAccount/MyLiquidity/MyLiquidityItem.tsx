import React from 'react'
import Row, { RowFitContent } from '../../../components/Row'
import CurrencyLogoDouble from '../../../components/CurrencyLogoDouble'
import { Currency, ETHER, JSBI, Pair, Percent } from '@s-one-finance/sdk-core'
import { Text } from 'rebass'
import Column from '../../../components/Column'
import { useIsUpToExtraSmall, useIsUpToSmall } from '../../../hooks/useWindowSize'
import useTheme from '../../../hooks/useTheme'
import useToggle from '../../../hooks/useToggle'
import MoneyBagLight from '../../../assets/images/money-bag-light.svg'
import MoneyBagDark from '../../../assets/images/money-bag-dark.svg'
import { useIsDarkMode } from '../../../state/user/hooks'
import {
  DownIcon,
  SummarySection,
  Container,
  PairName,
  FlexibleRow,
  TextLpTokens,
  TextPercentage,
  StakeLink,
  TextAPY,
  ButtonRemove,
  DetailedSection,
  MoneyBag,
  ButtonAdd
} from './MyLiquidityItem.styled'
import DetailedSectionItem from './DetailedSectionItem'
import { useActiveWeb3React } from '../../../hooks'
import { useTokenBalance } from '../../../state/wallet/hooks'
import { useTotalSupply } from '../../../data/TotalSupply'
import { unwrappedToken } from '../../../utils/wrappedCurrency'
import { Link } from 'react-router-dom'

export default function MyLiquidityItem({ pair }: { pair: Pair }) {
  // Style.
  const isUpToExtraSmall = useIsUpToExtraSmall()
  const isUpToSmall = useIsUpToSmall()
  const theme = useTheme()
  const isDark = useIsDarkMode()
  const [isShowDetailedSection, toggle] = useToggle(false)

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
    <Container>
      <SummarySection>
        <RowFitContent
          justify="flex-start"
          flexDirection={isUpToExtraSmall ? 'column' : 'row'}
          align={isUpToExtraSmall ? 'flex-start' : 'center'}
        >
          <CurrencyLogoDouble currency0={Currency.ETHER} currency1={Currency.ETHER} size={22} />
          <PairName
            style={{ marginLeft: isUpToExtraSmall ? '0' : '20px' }}
          >{`${pair.token0.symbol}-${pair.token1.symbol}`}</PairName>
        </RowFitContent>
        <FlexibleRow gap={isUpToExtraSmall ? '0' : '10px'} justify="center">
          <Column width="fit-content" align="center">
            {!isUpToExtraSmall && (
              <Text color={theme.text8Sone} fontSize={isUpToSmall ? '13px' : '16px'}>
                Your total LP tokens
              </Text>
            )}
            <TextLpTokens>{userPoolBalance ? userPoolBalance.toSignificant(4) : '-'}</TextLpTokens>
          </Column>
          {/* TODO: Change proper link after code stake page. */}
          <StakeLink to="/stake">Stake</StakeLink>
        </FlexibleRow>
        <Row gap="10px" justify="flex-end">
          <Column width="fit-content" justify="center" align="center">
            <TextPercentage onClick={() => alert('Not implemented yet!')}>88.88%</TextPercentage>
            <TextAPY>APY</TextAPY>
          </Column>
          <DownIcon active={isShowDetailedSection ? 1 : 0} onClick={toggle} />
        </Row>
      </SummarySection>

      {isShowDetailedSection && (
        <>
          <DetailedSection gap="15px">
            <DetailedSectionItem
              name={currency0?.symbol ? `Pooled ${currency0.symbol}` : '-'}
              explain="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sed, voluptates!"
              value={token0Deposited ? token0Deposited.toSignificant(6) : '-'}
            />
            <DetailedSectionItem
              name={currency1?.symbol ? `Pooled ${currency1.symbol}` : '-'}
              explain="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sed, voluptates!"
              value={token1Deposited ? token1Deposited.toSignificant(6) : '-'}
            />
            <DetailedSectionItem
              name="Your pool share"
              explain="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sed, voluptates!"
              value={
                poolTokenPercentage
                  ? (poolTokenPercentage.toFixed(2) === '0.00' ? '<0.01' : poolTokenPercentage.toFixed(2)) + '%'
                  : '-'
              }
            />
            <Row style={{ marginTop: isUpToSmall ? '0' : '25px', zIndex: 1 }} gap="2rem" justify="center">
              <ButtonRemove onClick={() => alert('Not implemented yet!')}>Remove</ButtonRemove>
              <ButtonAdd
                as={Link}
                to={
                  currency0 === ETHER
                    ? `/ETH/${pair.token1.address}`
                    : currency1 === ETHER
                    ? `/${pair.token0.address}/ETH`
                    : `/${pair.token0.address}/${pair.token1.address}`
                }
              >
                Add
              </ButtonAdd>
            </Row>
          </DetailedSection>
          <MoneyBag src={isDark ? MoneyBagDark : MoneyBagLight} alt="money-bag" />
        </>
      )}
    </Container>
  )
}
