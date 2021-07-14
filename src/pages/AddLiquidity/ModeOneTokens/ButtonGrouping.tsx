import { Currency, Pair } from '@s-one-finance/sdk-core'
import { ButtonError, ButtonPrimary } from 'components/Button'
import { AutoColumn } from 'components/Column'
import { RowBetween } from 'components/Row'
import { PairState } from 'data/Reserves'
import { useActiveWeb3React } from 'hooks'
import { useIsTransactionUnsupported } from 'hooks/Trades'
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
  selectedCurrency: Currency | undefined
  setShowConfirm: React.Dispatch<React.SetStateAction<boolean>>
  onAdd: () => void
}

export default function ButtonGrouping({
  selectedPairState,
  selectedPair,
  selectedCurrency,
  setShowConfirm,
  onAdd
}: ButtonGroupingProps) {
  const { token0, token1 } = selectedPair ?? {}
  const { error, selectedTokenParsedAmount, theOtherTokenParsedAmount } = useDerivedMintSimpleInfo(
    selectedPairState,
    selectedPair,
    selectedCurrency
  )

  const isValid = !error

  const addIsUnsupported = useIsTransactionUnsupported(selectedPair?.token0, selectedPair?.token1)

  const { account } = useActiveWeb3React()

  const toggleWalletModal = useWalletModalToggle() // toggle wallet when disconnected

  // check whether the user has approved the router on the token
  const [approvalSelectedToken, approvalSelectedTokenCallback] = useApproveCallback(
    selectedTokenParsedAmount,
    ROUTER_ADDRESS
  )
  const [approvalTheOtherToken, approvalTheOtherTokenCallback] = useApproveCallback(
    theOtherTokenParsedAmount,
    ROUTER_ADDRESS
  )

  const expertMode = useIsExpertMode()

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
          {(approvalSelectedToken === ApprovalState.NOT_APPROVED ||
            approvalSelectedToken === ApprovalState.PENDING ||
            approvalTheOtherToken === ApprovalState.NOT_APPROVED ||
            approvalTheOtherToken === ApprovalState.PENDING) &&
            isValid && (
              <RowBetween>
                {approvalSelectedToken !== ApprovalState.APPROVED && (
                  <ButtonPrimary
                    onClick={approvalSelectedTokenCallback}
                    disabled={approvalSelectedToken === ApprovalState.PENDING}
                    width={approvalTheOtherToken !== ApprovalState.APPROVED ? '48%' : '100%'}
                  >
                    {approvalSelectedToken === ApprovalState.PENDING ? (
                      <Dots>Approving {token0?.symbol}</Dots>
                    ) : (
                      'Approve ' + token0?.symbol
                    )}
                  </ButtonPrimary>
                )}
                {approvalTheOtherToken !== ApprovalState.APPROVED && (
                  <ButtonPrimary
                    onClick={approvalTheOtherTokenCallback}
                    disabled={approvalTheOtherToken === ApprovalState.PENDING}
                    width={approvalSelectedToken !== ApprovalState.APPROVED ? '48%' : '100%'}
                  >
                    {approvalTheOtherToken === ApprovalState.PENDING ? (
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
            disabled={
              !isValid ||
              approvalSelectedToken !== ApprovalState.APPROVED ||
              approvalTheOtherToken !== ApprovalState.APPROVED
            }
            error={!isValid && !!selectedTokenParsedAmount && !!theOtherTokenParsedAmount}
          >
            {error ?? 'Add Liquidity'}
          </ButtonError>
        </AutoColumn>
      )}
    </ButtonWrapper>
  )
}
