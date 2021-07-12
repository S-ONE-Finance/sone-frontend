import React from 'react'
import Row, { RowFitContent } from '../../../components/Row'
import CurrencyLogoDouble from '../../../components/CurrencyLogoDouble'
import { ETHER, JSBI, Pair, Percent } from '@s-one-finance/sdk-core'
import { Text } from 'rebass'
import Column, { AutoColumn } from '../../../components/Column'
import { useIsUpToExtraSmall, useIsUpToSmall } from '../../../hooks/useWindowSize'
import useTheme from '../../../hooks/useTheme'
import useToggle from '../../../hooks/useToggle'
import MoneyBagLight from '../../../assets/images/money-bag-light.svg'
import MoneyBagDark from '../../../assets/images/money-bag-dark.svg'
import { useIsDarkMode } from '../../../state/user/hooks'
import DetailedSectionItem from './DetailedSectionItem'
import { useActiveWeb3React } from '../../../hooks'
import { useTokenBalance } from '../../../state/wallet/hooks'
import { useTotalSupply } from '../../../data/TotalSupply'
import { unwrappedToken } from '../../../utils/wrappedCurrency'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { ChevronDown } from 'react-feather'
import { darken } from 'polished'
import { Button } from 'rebass/styled-components'

const Container = styled.div`
  position: relative;
  width: 100%;
  padding: 20px 30px;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    padding: 16px 16px;    
  `}
`

const SummarySection = styled(AutoColumn)`
  grid-template-columns: 40% auto 20%;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    grid-template-columns: 30% auto 30%;    
  `}
`

const PairName = styled(Text)`
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.text6Sone};
  margin-left: 1rem;

  &::after {
    content: 'Pair';
    margin-left: 5px;
    color: ${({ theme }) => theme.text8Sone};
  }

  ${({ theme }) => theme.mediaWidth.upToSmall`
    font-size: 18px;    
  `}

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    font-size: 13px;    
  `}
`

// `style-components` không hoạt động với boolean, nên phải để `active: 0 | 1`.
const DownIcon = styled(ChevronDown)<{ active: 0 | 1 }>`
  width: 22px;
  min-width: 22px;
  height: 22px;
  min-height: 22px;
  transform: ${({ active }) => active && 'rotate(-90deg)'};
  transform-style: flat;
  color: ${({ theme }) => theme.text5Sone};
  cursor: pointer;
  user-select: none;
  z-index: 1;

  :hover,
  :focus {
    color: ${({ theme }) => darken(0.05, theme.text5Sone)};
  }
`

const StakeLink = styled(Link)`
  color: ${({ theme }) => theme.red1Sone};
  font-size: 16px;
  font-weight: 500;
  z-index: 1;

  :hover,
  :focus {
    color: ${({ theme }) => darken(0.05, theme.red1Sone)};
  }

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    font-size: 13px;    
  `}
`

const TextLpTokens = styled(Text)`
  font-size: 20px;
  font-weight: 700;
  word-break: break-all;
  color: ${({ theme }) => theme.text6Sone};

  ${({ theme }) => theme.mediaWidth.upToSmall`
    font-size: 18px;    
  `}

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    font-size: 13px;    
  `}
`

const TextPercentage = styled(Text)`
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.text5Sone};

  ${({ theme }) => theme.mediaWidth.upToSmall`
    font-size: 18px;    
  `}

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    font-size: 13px;    
  `}
`

const TextAPY = styled(Text)`
  font-size: 14px;
  font-weight: 400;
  color: ${({ theme }) => theme.text4Sone};

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    font-size: 13px;    
  `}
`

const DetailedSection = styled(AutoColumn)`
  padding: 40px min(160px, 15vw) 20px;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding: 20px min(160px, 15vw) 10px;
  `}
`

const ButtonRemove = styled(Button)`
  font-size: 20px;
  font-weight: 500;
  color: ${({ theme }) => theme.text5Sone};
  height: 60px;
  width: 45%;
  max-width: 192px;
  border-radius: 40px;
  background-color: ${({ theme }) => theme.white};
  box-shadow: 0 4px 39px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  text-decoration: none;

  :hover,
  :focus {
    background-color: ${({ theme }) => darken(0.15, theme.white)};
  }

  ${({ theme }) => theme.mediaWidth.upToSmall`
    height: 45px;
    max-width: 122px;
    font-size: 18px;
  `}

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    height: 35px;
    max-width: 122px;
    font-size: 13px;
  `}
`

const ButtonAdd = styled(ButtonRemove)`
  color: ${({ theme }) => theme.white};
  background-color: ${({ theme }) => theme.red1Sone};

  :hover,
  :focus {
    background-color: ${({ theme }) => darken(0.05, theme.red1Sone)};
  }
`

const MoneyBag = styled.img`
  position: absolute;
  width: 180.46px;
  min-width: 180.46px;
  height: auto;
  right: 20px;
  bottom: 40px;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    width: 120px;
    min-width: 120px;
  `}
`

const FlexibleRow = styled(Row)`
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    flex-direction: column;
  `}
`

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
          <CurrencyLogoDouble currency0={currency0} currency1={currency1} size={22} />
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
