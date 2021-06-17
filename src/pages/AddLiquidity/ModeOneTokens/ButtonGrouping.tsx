import { Currency, Pair } from '@s-one-finance/sdk-core'
import { ButtonError, ButtonPrimary } from 'components/Button'
import { AutoColumn } from 'components/Column'
import { RowBetween } from 'components/Row'
import { PairState } from 'data/Reserves'
import { useActiveWeb3React } from 'hooks'
import { useIsTransactionUnsupported } from 'hooks/Trades'
import useAddLiquidityOneTokenHandler from 'hooks/useAddLiquidityOneTokenHandler'
import { ApprovalState, useApproveCallback } from 'hooks/useApproveCallback'
import { Dots } from 'pages/Pool/styleds'
import React from 'react'
import { useWalletModalToggle } from 'state/application/hooks'
import { useDerivedMintSimpleInfo } from 'state/mintSimple/hooks'
import { useIsExpertMode } from 'state/user/hooks'
import { TYPE } from 'theme'
import { ButtonWrapper } from '..'
import { ROUTER_ADDRESS } from '../../../constants'

type ButtonGroupingProps = {
  selectedPairState: PairState
  selectedPair: Pair | null
  selectedCurrency?: Currency
  setAttemptingTxn: React.Dispatch<React.SetStateAction<boolean>>
  setTxHash: React.Dispatch<React.SetStateAction<string>>
  setShowConfirm: React.Dispatch<React.SetStateAction<boolean>>
}

export default function ButtonGroupping({
  selectedPairState,
  selectedPair,
  selectedCurrency,
  setAttemptingTxn,
  setTxHash,
  setShowConfirm
}: ButtonGroupingProps) {
  const { token0, token1 } = selectedPair ?? {}
  const { error, token0ParsedAmount, token1ParsedAmount } = useDerivedMintSimpleInfo(
    selectedPairState,
    selectedPair,
    selectedCurrency
  )

  const isValid = !error

  const addIsUnsupported = useIsTransactionUnsupported(selectedPair?.token0, selectedPair?.token1)

  const { account } = useActiveWeb3React()

  const toggleWalletModal = useWalletModalToggle() // toggle wallet when disconnected

  // check whether the user has approved the router on the token
  const [approvalT0, approvalT0Callback] = useApproveCallback(token0ParsedAmount, ROUTER_ADDRESS)
  const [approvalT1, approvalT1Callback] = useApproveCallback(token1ParsedAmount, ROUTER_ADDRESS)

  const expertMode = useIsExpertMode()

  const onAdd = useAddLiquidityOneTokenHandler({
    selectedPairState,
    selectedPair,
    selectedCurrency,
    setAttemptingTxn,
    setTxHash
  })

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
          {/* FIXME: Có thể sẽ bug user auto click ở đây. */}
          {/* FIXME: Có thể sẽ bug user auto click ở đây. */}
          {(approvalT0 === ApprovalState.NOT_APPROVED ||
            approvalT0 === ApprovalState.PENDING ||
            approvalT1 === ApprovalState.NOT_APPROVED ||
            approvalT1 === ApprovalState.PENDING) &&
            isValid && (
              <RowBetween>
                {approvalT0 !== ApprovalState.APPROVED && (
                  <ButtonPrimary
                    onClick={approvalT0Callback}
                    disabled={approvalT0 === ApprovalState.PENDING}
                    width={approvalT1 !== ApprovalState.APPROVED ? '48%' : '100%'}
                  >
                    {approvalT0 === ApprovalState.PENDING ? (
                      <Dots>Approving {token0?.symbol}</Dots>
                    ) : (
                      'Approve ' + token0?.symbol
                    )}
                  </ButtonPrimary>
                )}
                {approvalT1 !== ApprovalState.APPROVED && (
                  <ButtonPrimary
                    onClick={approvalT1Callback}
                    disabled={approvalT1 === ApprovalState.PENDING}
                    width={approvalT0 !== ApprovalState.APPROVED ? '48%' : '100%'}
                  >
                    {approvalT1 === ApprovalState.PENDING ? (
                      <Dots>Approving {token1?.symbol}</Dots>
                    ) : (
                      'Approve ' + token1?.symbol
                    )}
                  </ButtonPrimary>
                )}
              </RowBetween>
            )}

          <ButtonError
            onClick={() => {
              expertMode ? onAdd() : setShowConfirm(true)
            }}
            disabled={!isValid || approvalT0 !== ApprovalState.APPROVED || approvalT1 !== ApprovalState.APPROVED}
            error={!isValid && !!token0ParsedAmount && !!token1ParsedAmount}
          >
            {error ?? 'Add Liquidity'}
          </ButtonError>
        </AutoColumn>
      )}
    </ButtonWrapper>
  )
}
