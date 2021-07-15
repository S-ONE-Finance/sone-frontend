import React, { useCallback, useState, useMemo } from 'react'
import styled from 'styled-components'
import useAllowance from '../../../hooks/masterfarmer/useAllowance'
import useApprove from '../../../hooks/masterfarmer/useApprove'
import useStake from '../../../hooks/masterfarmer/useStake'
import useTokenBalance from '../../../hooks/masterfarmer/useTokenBalance'
import TokenInput from '../../../components/TokenInput'
import { getFullDisplayBalance } from '../../../hooks/masterfarmer/utils'
interface StakeProps {
  pairAddress: string
  pid: number
  symbol: string
  val: string
  setVal: React.Dispatch<React.SetStateAction<string>>
}

const Stake: React.FC<StakeProps> = ({ pairAddress, pid, symbol, val, setVal }) => {
  const [requestedApproval, setRequestedApproval] = useState(false)
  const [requestedApprovalSuccess, setRequestedApprovalSuccess] = useState(false)
  const [pendingStakeTx, setPendingStakeTx] = useState(false)
  const [successStakeTx, setSuccessStakeTx] = useState(false)

  const allowance = useAllowance(pairAddress)
  const { onApprove } = useApprove(pairAddress)

  const tokenBalance = useTokenBalance(pairAddress)

  const { onStake } = useStake(pid)

  const handleApprove = useCallback(
    async symbol => {
      try {
        setRequestedApproval(true)
        const txHash = await onApprove(symbol)
        if (!txHash) {
          setRequestedApproval(false)
        } else {
          setRequestedApprovalSuccess(true)
        }
      } catch (e) {
        console.log(e)
      }
    },
    [onApprove, setRequestedApproval]
  )

  const fullBalance = useMemo(() => {
    return getFullDisplayBalance(tokenBalance.toString())
  }, [tokenBalance])

  const handleSelectMax = useCallback(() => {
    setVal(fullBalance)
  }, [fullBalance, setVal])

  const handleChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      setVal(e.currentTarget.value)
    },
    [setVal]
  )
  return (
    <div>
      <div>
        <StyledCardContentInner>
          <StyledCardActions>
            <TokenInput
              value={val}
              onSelectMax={handleSelectMax}
              onChange={handleChange}
              max={fullBalance}
              symbol={symbol}
            />
            {!allowance.toString() && !requestedApprovalSuccess ? (
              <button disabled={requestedApproval} onClick={() => handleApprove(symbol)}>
                {requestedApproval ? 'Approving' : `Approve ${symbol} LP Token`}
              </button>
            ) : (
              <>
                <button
                  disabled={pendingStakeTx}
                  onClick={async () => {
                    if (val && parseFloat(val) > 0) {
                      setPendingStakeTx(true)
                      const tx: any = await onStake(val, symbol)
                      console.log('tx', tx)
                      if (tx) {
                        setPendingStakeTx(false)
                        setSuccessStakeTx(true)
                      }
                    }
                  }}
                >
                  {pendingStakeTx ? 'Pending Confirmation' : 'Confirm'}
                </button>
                <StyledActionSpacer />
              </>
            )}
          </StyledCardActions>
        </StyledCardContentInner>
      </div>
    </div>
  )
}

const StyledCardActions = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 10px;
  width: 100%;
`

const StyledActionSpacer = styled.div`
  height: 10px;
  width: 10px;
`

const StyledCardContentInner = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
`

export default Stake
