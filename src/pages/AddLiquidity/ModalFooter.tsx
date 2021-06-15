import { Currency, CurrencyAmount, Fraction, Percent } from '@s-one-finance/sdk-core'
import React, { useMemo, useState } from 'react'
import { Text } from 'rebass'
import { ButtonPrimary } from '../../components/Button'
import { RowBetween, RowFixed } from '../../components/Row'
import { Field } from '../../state/mint/actions'
import { useIsUpToExtraSmall } from '../../hooks/useWindowSize'
import { AutoColumn } from '../../components/Column'
import { StyledBalanceMaxMini } from '../../components/swap/styleds'
import { RepeatIcon } from '../../components/swap/TradePrice'
import useTheme from '../../hooks/useTheme'
import { formatExecutionPriceWithCurrencies } from '../../utils/prices'

export default function ModalFooter({
  noLiquidity,
  price,
  currencies,
  parsedAmounts,
  poolTokenPercentage,
  onAdd
}: {
  noLiquidity?: boolean
  price?: Fraction
  currencies: { [field in Field]?: Currency }
  parsedAmounts: { [field in Field]?: CurrencyAmount }
  poolTokenPercentage?: Percent
  onAdd: () => void
}) {
  const isUpToExtraSmall = useIsUpToExtraSmall()
  const mobile13Desktop16 = useMemo(() => (isUpToExtraSmall ? 13 : 16), [isUpToExtraSmall])
  const [showInverted, setShowInverted] = useState<boolean>(false)
  const theme = useTheme()
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
              {formatExecutionPriceWithCurrencies(currencies, price, showInverted)}
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
