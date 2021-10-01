import { Fraction, Percent, Token } from '@s-one-finance/sdk-core'
import React, { useMemo, useState } from 'react'
import { Text } from 'rebass'
import { useTranslation } from 'react-i18next'
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
  selectedToken,
  theOtherToken,
  noLiquidity,
  poolTokenPercentage,
  onAdd
}: {
  price?: Fraction
  selectedToken?: Token
  theOtherToken?: Token
  noLiquidity: boolean
  poolTokenPercentage?: Percent
  onAdd: () => void
}) {
  const { t } = useTranslation()
  const isUpToExtraSmall = useIsUpToExtraSmall()
  const mobile13Desktop16 = useMemo(() => (isUpToExtraSmall ? 13 : 16), [isUpToExtraSmall])
  const theme = useTheme()

  const [showInverted, setShowInverted] = useState<boolean>(false)

  const selectedCurrency = selectedToken && unwrappedToken(selectedToken)
  const theOtherCurrency = theOtherToken && unwrappedToken(theOtherToken)

  return (
    <>
      <AutoColumn gap={isUpToExtraSmall ? '10px' : '15px'}>
        <RowBetween align="center">
          <Text fontWeight={500} fontSize={mobile13Desktop16} color={theme.text4Sone}>
            {t('price')}
          </Text>
          <Text
            fontWeight={700}
            fontSize={isUpToExtraSmall ? 13 : 16}
            color={theme.text6Sone}
            style={{ justifyContent: 'center', alignItems: 'center', display: 'flex' }}
          >
            <>
              {/*{showInverted ? price?.invert().toSignificant(4) : price?.toSignificant(4)}*/}
              <StyledBalanceMaxMini onClick={() => setShowInverted(prev => !prev)} style={{ margin: '0 0.5rem 0 0' }}>
                <RepeatIcon />
              </StyledBalanceMaxMini>
              {formatExecutionPriceWithCurrencies2(selectedCurrency, theOtherCurrency, price, showInverted)}
            </>
          </Text>
        </RowBetween>

        <RowBetween>
          <RowFixed>
            <Text fontWeight={500} fontSize={mobile13Desktop16} color={theme.text4Sone}>
              {t('share_of_pair')}
            </Text>
          </RowFixed>
          <Text fontWeight={700} fontSize={mobile13Desktop16} color={theme.text6Sone}>
            {noLiquidity ? '100' : poolTokenPercentage?.toSignificant(4)}%
          </Text>
        </RowBetween>
      </AutoColumn>

      <ButtonPrimary onClick={onAdd}>
        <Text fontSize={isUpToExtraSmall ? 16 : 20} fontWeight={700}>
          {t('add_liquidity')}
        </Text>
      </ButtonPrimary>
    </>
  )
}
