import { Currency, Pair } from '@s-one-finance/sdk-core'
import { AutoColumn, ColumnCenter } from 'components/Column'
import { QuestionHelper1416 } from 'components/QuestionHelper'
import { RowBetween, RowFixed } from 'components/Row'
import TradePrice from 'components/swap/TradePrice'
import { PairState } from 'data/Reserves'
import useTheme from 'hooks/useTheme'
import { useIsUpToExtraSmall } from 'hooks/useWindowSize'
import { ClickableText } from 'pages/Pool/styleds'
import React, { useMemo, useState } from 'react'
import { ChevronDown, ChevronUp } from 'react-feather'
import { Text } from 'rebass'
import { useTranslation } from 'react-i18next'
import { useDerivedMintSimpleInfo } from 'state/mintSimple/hooks'
import { useShowTransactionDetailsManager, useUserSlippageTolerance } from 'state/user/hooks'
import { INITIAL_ALLOWED_SLIPPAGE, ONE_BIPS } from '../../../constants'
import ViewPairAnalytics from '../../../components/ViewPairAnalytics'
import useCanRewardSone from '../../../hooks/useCanRewardSone'

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
  const { t } = useTranslation()
  const theme = useTheme()
  const isUpToExtraSmall = useIsUpToExtraSmall()
  const mobile13Desktop16 = isUpToExtraSmall ? 13 : 16

  const {
    selectedTokenUserInputAmount,
    selectedTokenParsedAmount,
    theOtherCurrency,
    theOtherTokenParsedAmount,
    noLiquidity,
    price,
    poolTokenPercentage
  } = useDerivedMintSimpleInfo(selectedPairState, selectedPair, selectedCurrency)

  // Show transaction details.
  const [isShowTransactionDetails, toggleIsShowTransactionDetails] = useShowTransactionDetailsManager()

  // Show price invert or not.
  const [showInverted, setShowInverted] = useState<boolean>(false)

  // txn values
  const [allowedSlippage] = useUserSlippageTolerance() // custom from users

  const parseSuccessfully = useMemo(
    () => !!(selectedTokenUserInputAmount && selectedTokenParsedAmount && theOtherTokenParsedAmount),
    [selectedTokenUserInputAmount, selectedTokenParsedAmount, theOtherTokenParsedAmount]
  )

  const canRewardSone = useCanRewardSone(selectedCurrency, theOtherCurrency)

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
            {t('show_more_information')} <ChevronDown size={12} />
          </ClickableText>
        </ColumnCenter>
      )}
      {parseSuccessfully && isShowTransactionDetails ? (
        <>
          <AutoColumn
            gap={'15px'}
            style={{ width: '100%', padding: isUpToExtraSmall ? '17.5px 8px 0' : '17.5px 14px 0' }}
          >
            <RowBetween>
              <RowFixed>
                <Text fontWeight={500} fontSize={mobile13Desktop16} color={theme.text4Sone}>
                  {t('price')}
                </Text>
                <QuestionHelper1416 text={t('question_helper_price')} />
              </RowFixed>
              <TradePrice price={price} showInverted={showInverted} setShowInverted={setShowInverted} />
            </RowBetween>
            <RowBetween>
              <RowFixed>
                <Text fontWeight={500} fontSize={mobile13Desktop16} color={theme.text4Sone}>
                  {t('share_of_pair')}
                </Text>
                <QuestionHelper1416 text={t('question_helper_share_of_pair')} />
              </RowFixed>
              <Text fontWeight={700} fontSize={mobile13Desktop16} color={theme.text6Sone}>
                {noLiquidity && price
                  ? '100'
                  : (poolTokenPercentage?.lessThan(ONE_BIPS) ? '<0.01' : poolTokenPercentage?.toFixed(2)) ?? '0'}
                %
              </Text>
            </RowBetween>
            {allowedSlippage !== INITIAL_ALLOWED_SLIPPAGE && (
              <RowBetween align="center">
                <RowFixed>
                  <Text fontWeight={500} fontSize={mobile13Desktop16} color={theme.text4Sone}>
                    {t('slippage_tolerance')}
                  </Text>
                  <QuestionHelper1416 text={t('question_helper_slippage_tolerance')} />
                </RowFixed>
                <Text fontWeight={700} fontSize={mobile13Desktop16} color={theme.text6Sone}>
                  {allowedSlippage / 100}%
                </Text>
              </RowBetween>
            )}
            <RowBetween>
              <RowFixed>
                <Text fontWeight={500} fontSize={mobile13Desktop16} color={theme.text4Sone}>
                  {t('reward_xxx_percent_by_sone')}
                </Text>
                <QuestionHelper1416 text={t('question_helper_reward_xxx_percent_by_sone')} color={theme.text4Sone} />
              </RowFixed>
              <Text fontWeight={700} fontSize={mobile13Desktop16} color={theme.text6Sone}>
                {canRewardSone === true ? t('yes') : canRewardSone === false ? t('no') : '--'}
              </Text>
            </RowBetween>
          </AutoColumn>
          {selectedPair?.liquidityToken.address && (
            <ColumnCenter style={{ marginTop: isUpToExtraSmall ? '25px' : '2.1875rem' }}>
              <ViewPairAnalytics
                pairAddress={selectedPair.liquidityToken.address}
                tokenA={selectedPair.token0}
                tokenB={selectedPair.token1}
              />
            </ColumnCenter>
          )}
        </>
      ) : (
        isShowTransactionDetails &&
        allowedSlippage !== INITIAL_ALLOWED_SLIPPAGE && (
          <RowBetween align="center" padding={isUpToExtraSmall ? '17.5px 8px 0' : '17.5px 14px 0'}>
            <RowFixed>
              <Text fontWeight={500} fontSize={mobile13Desktop16} color={theme.text4Sone}>
                {t('slippage_tolerance')}
              </Text>
              <QuestionHelper1416 text={t('question_helper_slippage_tolerance')} />
            </RowFixed>
            <Text fontWeight={700} fontSize={mobile13Desktop16} color={theme.text6Sone}>
              {allowedSlippage / 100}%
            </Text>
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
            {t('show_less')} <ChevronUp size={12} />
          </ClickableText>
        </ColumnCenter>
      )}
    </>
  )
}
