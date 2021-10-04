import { Currency } from '@s-one-finance/sdk-core'
import { useTranslation } from 'react-i18next'
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
import { Field } from 'state/mint/actions'
import { useDerivedMintInfo } from 'state/mint/hooks'
import { useShowTransactionDetailsManager, useUserSlippageTolerance } from 'state/user/hooks'
import { INITIAL_ALLOWED_SLIPPAGE, ONE_BIPS } from '../../../constants'
import ViewPairAnalytics from '../../../components/ViewPairAnalytics'
import useCanRewardSone from '../../../hooks/useCanRewardSone'

type TransactionDetailsProps = {
  currencyA?: Currency
  currencyB?: Currency
}

export default function TransactionDetails({ currencyA, currencyB }: TransactionDetailsProps) {
  const { t } = useTranslation()
  const theme = useTheme()
  const isUpToExtraSmall = useIsUpToExtraSmall()
  const mobile13Desktop16 = isUpToExtraSmall ? 13 : 16

  const { noLiquidity, pair, pairState, price, poolTokenPercentage, parsedAmounts } = useDerivedMintInfo(
    currencyA,
    currencyB
  )

  // Show transaction details.
  const [isShowTransactionDetails, toggleIsShowTransactionDetails] = useShowTransactionDetailsManager()

  // Show price invert or not.
  const [showInverted, setShowInverted] = useState<boolean>(false)

  // txn values
  const [allowedSlippage] = useUserSlippageTolerance() // custom from users

  const isPairFilledAndValid = useMemo(
    () => parsedAmounts[Field.CURRENCY_A] && parsedAmounts[Field.CURRENCY_B] && pairState !== PairState.INVALID,
    [parsedAmounts, pairState]
  )

  const canRewardSone = useCanRewardSone(currencyA, currencyB)

  return (
    <>
      {isPairFilledAndValid && !isShowTransactionDetails && (
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
      {isPairFilledAndValid && isShowTransactionDetails ? (
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
                <QuestionHelper1416 text={t('question_helper_price')} color={theme.text4Sone} />
              </RowFixed>
              <TradePrice price={price} showInverted={showInverted} setShowInverted={setShowInverted} />
            </RowBetween>
            {allowedSlippage !== INITIAL_ALLOWED_SLIPPAGE && (
              <RowBetween align="center">
                <RowFixed>
                  <Text fontWeight={500} fontSize={mobile13Desktop16} color={theme.text4Sone}>
                    {t('slippage_tolerance')}
                  </Text>
                  <QuestionHelper1416 text={t('question_helper_slippage_tolerance')} color={theme.text4Sone} />
                </RowFixed>
                <Text fontWeight={700} fontSize={mobile13Desktop16} color={theme.text6Sone}>
                  {allowedSlippage / 100}%
                </Text>
              </RowBetween>
            )}
            <RowBetween>
              <RowFixed>
                <Text fontWeight={500} fontSize={mobile13Desktop16} color={theme.text4Sone}>
                  {t('share_of_pair')}
                </Text>
                <QuestionHelper1416 text={t('question_helper_share_of_pair')} color={theme.text4Sone} />
              </RowFixed>
              <Text fontWeight={700} fontSize={mobile13Desktop16} color={theme.text6Sone}>
                {noLiquidity && price
                  ? '100'
                  : (poolTokenPercentage?.lessThan(ONE_BIPS) ? '<0.01' : poolTokenPercentage?.toFixed(2)) ?? '0'}
                %
              </Text>
            </RowBetween>
            <RowBetween>
              <RowFixed>
                <Text fontWeight={500} fontSize={mobile13Desktop16} color={theme.text4Sone}>
                  {t('reward_0.05%_by_sone')}
                </Text>
                <QuestionHelper1416 text={t('question_helper_reward_0.05%_by_sone')} color={theme.text4Sone} />
              </RowFixed>
              <Text fontWeight={700} fontSize={mobile13Desktop16} color={theme.text6Sone}>
                {canRewardSone === true ? t('yes') : canRewardSone === false ? t('no') : '--'}
              </Text>
            </RowBetween>
          </AutoColumn>
          {pair?.liquidityToken.address && (
            <ColumnCenter style={{ marginTop: isUpToExtraSmall ? '25px' : '2.1875rem' }}>
              <ViewPairAnalytics pairAddress={pair.liquidityToken.address} tokenA={pair.token0} tokenB={pair.token1} />
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
              <QuestionHelper1416 text={t('question_helper_slippage_tolerance')} color={theme.text4Sone} />
            </RowFixed>
            <Text fontWeight={700} fontSize={mobile13Desktop16} color={theme.text6Sone}>
              {allowedSlippage / 100}%
            </Text>
          </RowBetween>
        )
      )}
      {isPairFilledAndValid && isShowTransactionDetails && (
        <ColumnCenter style={{ marginTop: '17.5px' }}>
          <ClickableText
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
