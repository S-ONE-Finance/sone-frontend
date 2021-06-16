import { Currency } from '@s-one-finance/sdk-core'
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

type ButtonGroupingProps = {
  currencyA?: Currency
  currencyB?: Currency
  setAttemptingTxn: React.Dispatch<React.SetStateAction<boolean>>
  setTxHash: React.Dispatch<React.SetStateAction<string>>
  setShowConfirm: React.Dispatch<React.SetStateAction<boolean>>
}

export default function ButtonGroupping({
  currencyA,
  currencyB,
  setAttemptingTxn,
  setTxHash,
  setShowConfirm
}: ButtonGroupingProps) {
  const { currencies, parsedAmounts, error } = useDerivedMintInfo(currencyA ?? undefined, currencyB ?? undefined)

  const isValid = !error

  const addIsUnsupported = useIsTransactionUnsupported(currencies?.CURRENCY_A, currencies?.CURRENCY_B)

  const { account } = useActiveWeb3React()

  const toggleWalletModal = useWalletModalToggle() // toggle wallet when disconnected

  // check whether the user has approved the router on the tokens
  const [approvalA, approveACallback] = useApproveCallback(parsedAmounts[Field.CURRENCY_A], ROUTER_ADDRESS)
  const [approvalB, approveBCallback] = useApproveCallback(parsedAmounts[Field.CURRENCY_B], ROUTER_ADDRESS)

  const expertMode = useIsExpertMode()

  const onAdd = useAddLiquidityTwoTokensHandler({ currencyA, currencyB, setAttemptingTxn, setTxHash })

  return (
    <ButtonWrapper>
      {addIsUnsupported ? (
        <ButtonPrimary disabled={true}>
          <TYPE.main mb="4px">Unsupported Asset</TYPE.main>
        </ButtonPrimary>
      ) : !account ? (
        <ButtonPrimary onClick={toggleWalletModal}>Connect Wallet</ButtonPrimary>
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
            {error ?? 'Add Liquidity'}
          </ButtonError>
        </AutoColumn>
      )}
    </ButtonWrapper>
  )
}
