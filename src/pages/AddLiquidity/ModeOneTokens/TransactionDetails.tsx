import { Currency, Pair } from '@s-one-finance/sdk-core'
import { AutoColumn, ColumnCenter } from 'components/Column'
import { QuestionHelper1416 } from 'components/QuestionHelper'
import { RowBetween, RowFixed } from 'components/Row'
import { InfoLink } from 'components/swap/AdvancedSwapDetailsContent'
import TradePrice from 'components/swap/TradePrice'
import { PairState } from 'data/Reserves'
import useTheme from 'hooks/useTheme'
import { useIsUpToExtraSmall } from 'hooks/useWindowSize'
import { ClickableText } from 'pages/Pool/styleds'
import React, { useMemo, useState } from 'react'
import { ChevronDown, ChevronUp } from 'react-feather'
import { Text } from 'rebass'
import { useToggleSettingsMenu } from 'state/application/hooks'
import { useDerivedMintSimpleInfo } from 'state/mintSimple/hooks'
import { useShowTransactionDetailsManager, useUserSlippageTolerance } from 'state/user/hooks'
import { unwrappedToken } from 'utils/wrappedCurrency'
import { INITIAL_ALLOWED_SLIPPAGE, ONE_BIPS } from '../../../constants'

type TransactionDetailsProps = {
  selectedPairState: PairState
  selectedPair: Pair | null
  selectedCurrency?: Currency
}

export default function TransactionDetails({
  selectedPairState,
  selectedPair,
  selectedCurrency
}: TransactionDetailsProps) {
  const theme = useTheme()
  const isUpToExtraSmall = useIsUpToExtraSmall()
  const mobile13Desktop16 = isUpToExtraSmall ? 13 : 16

  const {
    selectedTokenUserInputAmount,
    selectedTokenParsedAmount,
    theOtherTokenParsedAmount,
    noLiquidity,
    price,
    poolTokenPercentage
  } = useDerivedMintSimpleInfo(selectedPairState, selectedPair, selectedCurrency)

  // Show transaction details.
  const [isShowTransactionDetails, toggleIsShowTransactionDetails] = useShowTransactionDetailsManager()

  // Show price invert or not.
  const [showInverted, setShowInverted] = useState<boolean>(false)

  const toggleSettings = useToggleSettingsMenu()

  // txn values
  const [allowedSlippage] = useUserSlippageTolerance() // custom from users

  const parseSuccessfully = useMemo(
    () => !!(selectedTokenUserInputAmount && selectedTokenParsedAmount && theOtherTokenParsedAmount),
    [selectedTokenUserInputAmount, selectedTokenParsedAmount, theOtherTokenParsedAmount]
  )

  return (
    <>
      {parseSuccessfully && !isShowTransactionDetails && (
        <ColumnCenter style={{ marginTop: '17.5px' }}>
          <ClickableText
            fontSize={mobile13Desktop16}
            fontWeight={500}
            color={theme.text5Sone}
            onClick={toggleIsShowTransactionDetails}
          >
            Show more information <ChevronDown size={12} />
          </ClickableText>
        </ColumnCenter>
      )}
      {parseSuccessfully && isShowTransactionDetails ? (
        <>
          <AutoColumn gap={'15px'} style={{ width: '100%', padding: '17.5px 8px 0' }}>
            <RowBetween>
              <RowFixed>
                <Text fontWeight={500} fontSize={mobile13Desktop16} color={theme.text4Sone}>
                  Price
                </Text>
                <QuestionHelper1416 text="Lorem ipsum dolor sit amet." />
              </RowFixed>
              <TradePrice price={price} showInverted={showInverted} setShowInverted={setShowInverted} />
            </RowBetween>
            {allowedSlippage !== INITIAL_ALLOWED_SLIPPAGE && (
              <RowBetween align="center">
                <RowFixed>
                  <ClickableText
                    fontWeight={500}
                    fontSize={mobile13Desktop16}
                    color={theme.text4Sone}
                    onClick={toggleSettings}
                  >
                    Slippage Tolerance
                  </ClickableText>
                  <QuestionHelper1416 text="Lorem ipsum" />
                </RowFixed>
                <ClickableText
                  fontWeight={700}
                  fontSize={mobile13Desktop16}
                  color={theme.text6Sone}
                  onClick={toggleSettings}
                >
                  {allowedSlippage / 100}%
                </ClickableText>
              </RowBetween>
            )}
            <RowBetween>
              <RowFixed>
                <Text fontWeight={500} fontSize={mobile13Desktop16} color={theme.text4Sone}>
                  Share of Pair
                </Text>
                <QuestionHelper1416 text="Lorem ipsum dolor sit amet." />
              </RowFixed>
              <Text fontWeight={700} fontSize={mobile13Desktop16} color={theme.text6Sone}>
                {noLiquidity && price
                  ? '100'
                  : (poolTokenPercentage?.lessThan(ONE_BIPS) ? '<0.01' : poolTokenPercentage?.toFixed(2)) ?? '0'}
                %
              </Text>
            </RowBetween>
          </AutoColumn>
          {selectedPair?.liquidityToken.address && (
            <ColumnCenter style={{ marginTop: isUpToExtraSmall ? '25px' : '35px' }}>
              <InfoLink href={'https://info.uniswap.org/pair/' + selectedPair.liquidityToken.address} target="_blank">
                View {unwrappedToken(selectedPair.token0).symbol} - {unwrappedToken(selectedPair.token1).symbol}{' '}
                analytics
              </InfoLink>
            </ColumnCenter>
          )}
        </>
      ) : (
        isShowTransactionDetails &&
        allowedSlippage !== INITIAL_ALLOWED_SLIPPAGE && (
          <RowBetween align="center" padding="17.5px 8px 0">
            <RowFixed>
              <ClickableText
                fontWeight={500}
                fontSize={mobile13Desktop16}
                color={theme.text4Sone}
                onClick={toggleSettings}
              >
                Slippage Tolerance
              </ClickableText>
              <QuestionHelper1416 text="Lorem ipsum" />
            </RowFixed>
            <ClickableText
              fontWeight={700}
              fontSize={mobile13Desktop16}
              color={theme.text6Sone}
              onClick={toggleSettings}
            >
              {allowedSlippage / 100}%
            </ClickableText>
          </RowBetween>
        )
      )}
      {parseSuccessfully && isShowTransactionDetails && (
        <ColumnCenter>
          <ClickableText
            marginTop="17.5px"
            fontSize={mobile13Desktop16}
            fontWeight={500}
            color={theme.text5Sone}
            onClick={toggleIsShowTransactionDetails}
          >
            Show less <ChevronUp size={12} />
          </ClickableText>
        </ColumnCenter>
      )}
    </>
  )
}
