import { Fraction, Percent, Token, TokenAmount } from '@s-one-finance/sdk-core'
import React, { useMemo, useState } from 'react'
import { Text } from 'rebass'
import { unwrappedToken } from 'utils/wrappedCurrency'
import { ButtonPrimary } from '../../../components/Button'
import { AutoColumn } from '../../../components/Column'
import { RowBetween, RowFixed } from '../../../components/Row'
import { StyledBalanceMaxMini } from '../../../components/swap/styleds'
import { RepeatIcon } from '../../../components/swap/TradePrice'
import useTheme from '../../../hooks/useTheme'
import { useIsUpToExtraSmall } from '../../../hooks/useWindowSize'
import { formatExecutionPriceWithCurrencies2 } from '../../../utils/prices'

export default function ModalFooter({
  price,
  token0,
  token1,
  noLiquidity,
  token0ParsedAmount,
  token1ParsedAmount,
  poolTokenPercentage,
  onAdd
}: {
  price?: Fraction
  token0?: Token
  token1?: Token
  noLiquidity: boolean
  token0ParsedAmount?: TokenAmount
  token1ParsedAmount?: TokenAmount
  poolTokenPercentage?: Percent
  onAdd: () => void
}) {
  const isUpToExtraSmall = useIsUpToExtraSmall()
  const mobile13Desktop16 = useMemo(() => (isUpToExtraSmall ? 13 : 16), [isUpToExtraSmall])
  const theme = useTheme()

  const [showInverted, setShowInverted] = useState<boolean>(false)

  const currency0 = token0 && unwrappedToken(token0)
  const currency1 = token1 && unwrappedToken(token1)

  return (
    <>
      <AutoColumn gap={isUpToExtraSmall ? '10px' : '15px'}>
        <RowBetween align="center">
          <Text fontWeight={500} fontSize={mobile13Desktop16} color={theme.text4Sone}>
            Price
          </Text>
          <Text
            fontWeight={700}
            fontSize={isUpToExtraSmall ? 13 : 16}
            color={theme.text6Sone}
            style={{ justifyContent: 'center', alignItems: 'center', display: 'flex' }}
          >
            <>
              {/*{showInverted ? price?.invert().toSignificant(4) : price?.toSignificant(4)}*/}
              {formatExecutionPriceWithCurrencies2(currency0, currency1, price, showInverted)}
              <StyledBalanceMaxMini onClick={() => setShowInverted(prev => !prev)} style={{ margin: '0 0 0 0.5rem' }}>
                <RepeatIcon />
              </StyledBalanceMaxMini>
            </>
          </Text>
        </RowBetween>

        <RowBetween>
          <RowFixed>
            <Text fontWeight={500} fontSize={mobile13Desktop16} color={theme.text4Sone}>
              Share of pair
            </Text>
          </RowFixed>
          <Text fontWeight={700} fontSize={mobile13Desktop16} color={theme.text6Sone}>
            {noLiquidity ? '100' : poolTokenPercentage?.toSignificant(4)}%
          </Text>
        </RowBetween>
      </AutoColumn>

      <ButtonPrimary onClick={onAdd}>
        <Text fontSize={isUpToExtraSmall ? 16 : 20} fontWeight={700}>
          Add Liquidity
        </Text>
      </ButtonPrimary>
    </>
  )
}
