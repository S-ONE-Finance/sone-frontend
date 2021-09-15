import { Currency } from '@s-one-finance/sdk-core'
import { useTranslation } from 'react-i18next'
import { ButtonError, ButtonPrimary } from 'components/Button'
import { AutoColumn } from 'components/Column'
import { RowBetween } from 'components/Row'
import { useActiveWeb3React } from 'hooks'
import { useIsTransactionUnsupported } from 'hooks/Trades'
import useAddLiquidityTwoTokensHandler from 'hooks/useAddLiquidityTwoTokensHandler'
import { ApprovalState, useApproveCallback } from 'hooks/useApproveCallback'
import { Dots } from 'pages/Pool/styleds'
import React from 'react'
import { useWalletModalToggle } from 'state/application/hooks'
import { useDerivedMintInfo } from 'state/mint/hooks'
import { useIsExpertMode } from 'state/user/hooks'
import { TYPE } from 'theme'
import { ButtonWrapper } from '..'
import { ROUTER_ADDRESS } from '../../../constants'
import { Field } from '../../../state/mint/actions'
import { useGuideStepManager } from '../../../state/user/hooks'
import { TowStep2, ConnectButton } from '../../../components/lib/mark/components'
import iconCheck from '../../../assets/images/check-icon-guide-popup-white.svg'

type ButtonGroupingProps = {
  currencyA?: Currency
  currencyB?: Currency
  setAttemptingTxn: React.Dispatch<React.SetStateAction<boolean>>
  setTxHash: React.Dispatch<React.SetStateAction<string>>
  setShowConfirm: React.Dispatch<React.SetStateAction<boolean>>
}

export default function ButtonGrouping({
  currencyA,
  currencyB,
  setAttemptingTxn,
  setTxHash,
  setShowConfirm
}: ButtonGroupingProps) {
  const { t } = useTranslation()
  const { currencies, parsedAmounts, error } = useDerivedMintInfo(currencyA, currencyB)
  const [guideStep] = useGuideStepManager()

  const isValid = !error

  const addIsUnsupported = useIsTransactionUnsupported(currencies?.CURRENCY_A, currencies?.CURRENCY_B)

  const { account, chainId = 1 } = useActiveWeb3React()

  const toggleWalletModal = useWalletModalToggle() // toggle wallet when disconnected

  // check whether the user has approved the router on the tokens
  const [approvalA, approveACallback] = useApproveCallback(parsedAmounts[Field.CURRENCY_A], ROUTER_ADDRESS[chainId])
  const [approvalB, approveBCallback] = useApproveCallback(parsedAmounts[Field.CURRENCY_B], ROUTER_ADDRESS[chainId])

  const expertMode = useIsExpertMode()

  const onAdd = useAddLiquidityTwoTokensHandler({ currencyA, currencyB, setAttemptingTxn, setTxHash })

  return (
    <ButtonWrapper>
      {addIsUnsupported ? (
        <ButtonPrimary disabled={true}>
          <TYPE.main mb="4px">Unsupported Asset</TYPE.main>
        </ButtonPrimary>
      ) : !account ? (
        <>
          {guideStep.isGuide && Number(guideStep.step) === 1 ? (
            <ConnectButton>
              <ButtonPrimary>{t('connect_wallet')}</ButtonPrimary>
            </ConnectButton>
          ) : (
            <TowStep2>
              {Number(guideStep.step) > 4 && guideStep.screen === 'liquidity' ? (
                <ButtonPrimary onClick={toggleWalletModal}>
                  <img src={iconCheck} alt="iconCheck" />
                </ButtonPrimary>
              ) : (
                <ButtonPrimary onClick={toggleWalletModal}>
                  {Number(guideStep.step) === 3 || Number(guideStep.step) === 4
                    ? t('add_liquidity')
                    : t('connect_wallet')}
                </ButtonPrimary>
              )}
            </TowStep2>
          )}
        </>
      ) : (
        <AutoColumn gap={'md'}>
          {(approvalA === ApprovalState.NOT_APPROVED ||
            approvalA === ApprovalState.PENDING ||
            approvalB === ApprovalState.NOT_APPROVED ||
            approvalB === ApprovalState.PENDING) &&
            isValid && (
              <RowBetween>
                {approvalA !== ApprovalState.APPROVED && (
                  <ButtonPrimary
                    onClick={approveACallback}
                    disabled={approvalA === ApprovalState.PENDING}
                    width={approvalB !== ApprovalState.APPROVED ? '48%' : '100%'}
                  >
                    {approvalA === ApprovalState.PENDING ? (
                      <Dots>Approving {currencies[Field.CURRENCY_A]?.symbol}</Dots>
                    ) : (
                      'Approve ' + currencies[Field.CURRENCY_A]?.symbol
                    )}
                  </ButtonPrimary>
                )}
                {approvalB !== ApprovalState.APPROVED && (
                  <ButtonPrimary
                    onClick={approveBCallback}
                    disabled={approvalB === ApprovalState.PENDING}
                    width={approvalA !== ApprovalState.APPROVED ? '48%' : '100%'}
                  >
                    {approvalB === ApprovalState.PENDING ? (
                      <Dots>Approving {currencies[Field.CURRENCY_B]?.symbol}</Dots>
                    ) : (
                      'Approve ' + currencies[Field.CURRENCY_B]?.symbol
                    )}
                  </ButtonPrimary>
                )}
              </RowBetween>
            )}

          <ButtonError
            onClick={() => {
              expertMode ? onAdd() : setShowConfirm(true)
            }}
            disabled={!isValid || approvalA !== ApprovalState.APPROVED || approvalB !== ApprovalState.APPROVED}
            error={!isValid && !!parsedAmounts[Field.CURRENCY_A] && !!parsedAmounts[Field.CURRENCY_B]}
          >
            {error ?? t('add_liquidity')}
          </ButtonError>
        </AutoColumn>
      )}
    </ButtonWrapper>
  )
}
