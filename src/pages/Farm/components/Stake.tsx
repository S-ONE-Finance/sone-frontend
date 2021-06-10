import React, { useCallback, useState, useMemo } from 'react'
import styled from 'styled-components'
import useAllowance from '../../../hooks/farms/useAllowance'
import useApprove from '../../../hooks/farms/useApprove'
import useStake from '../../../hooks/farms/useStake'
import useTokenBalance from '../../../hooks/farms/useTokenBalance'
import TokenInput from '../../../components/TokenInput'
import { getFullDisplayBalance } from '../../../sushi/format/formatBalance'
interface StakeProps {
  lpContract: any
  pid: number
  tokenName: string
  tokenSymbol: string
  token2Symbol: string
  val: string
  setVal: React.Dispatch<React.SetStateAction<string>>
}

const Stake: React.FC<StakeProps> = ({ lpContract, pid, tokenName, tokenSymbol, token2Symbol, val, setVal }) => {
  const [requestedApproval, setRequestedApproval] = useState(false)
  const [requestedApprovalSuccess, setRequestedApprovalSuccess] = useState(false)
  const [pendingStakeTx, setPendingStakeTx] = useState(false)
  const [successStakeTx, setSuccessStakeTx] = useState(false)

  const allowance = useAllowance(lpContract)
  const { onApprove } = useApprove(lpContract)

  const tokenBalance = useTokenBalance(lpContract.options.address)

  const { onStake } = useStake(pid)

  const handleApprove = useCallback(async (tokenName) => {
    try {
      setRequestedApproval(true)
      const txHash = await onApprove(tokenName)
      // user rejected tx or didn't go thru
      if (!txHash) {
        setRequestedApproval(false)
      }else{
        setRequestedApprovalSuccess(true)
      }
    } catch (e) {
      console.log(e)
    }
  }, [onApprove, setRequestedApproval])


  const fullBalance = useMemo(() => {
    return getFullDisplayBalance(tokenBalance)
  }, [tokenBalance])

  const handleSelectMax = useCallback(() => {
    setVal(fullBalance)
  }, [fullBalance, setVal])

  const handleChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
       console.log('111', 111)
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
              symbol={tokenName}
            />
            {(!allowance.toNumber() && !requestedApprovalSuccess) ? (
              <button
                disabled={requestedApproval}
                onClick={() => handleApprove(tokenName)}
              >
                {requestedApproval ? 'Approving' : `Approve ${tokenName}`}
              </button>
            ) : (
              <>
               <button
                  disabled={pendingStakeTx}
                  onClick={async () => {
                    if (val && parseFloat(val) > 0) {
                      setPendingStakeTx(true)
                      const tx: any = await onStake(val, tokenName)
                      if (tx) {
                        setPendingStakeTx(false)
                        setSuccessStakeTx(true)
                      }
                    }
                  }} >
                    {pendingStakeTx ? 'Pending Confirmation' : 'Confirm'}</button>
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
