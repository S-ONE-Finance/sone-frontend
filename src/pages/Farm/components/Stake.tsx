import BigNumber from 'bignumber.js'
import React, { useCallback, useEffect, useState, useMemo } from 'react'
import { useWeb3React } from '@web3-react/core'
import styled from 'styled-components'
import useAllowance from '../../../hooks/farms/useAllowance'
import useApprove from '../../../hooks/farms/useApprove'
import useModal from '../../../hooks/farms/useModal'
import useStake from '../../../hooks/farms/useStake'
import useStakedBalance from '../../../hooks/farms/useStakedBalance'
import useTokenBalance from '../../../hooks/farms/useTokenBalance'
import useUnstake from '../../../hooks/farms/useUnstake'
import WithdrawModal from './WithdrawModal'
import { getLPTokenStaked } from '../../../sushi/utils'
import useSushi from '../../../hooks/farms/useSushi'
import useBlock from '../../../hooks/farms/useBlock'
import useStakedValue from '../../../hooks/farms/useStakedValue'
import usePoolActive from '../../../hooks/farms/usePoolActive'
import TokenInput from '../../../components/TokenInput'
import { getFullDisplayBalance } from '../../../sushi/format/formatBalance'

interface StakeProps {
  lpContract: any
  pid: number
  tokenName: string
  tokenSymbol: string
  token2Symbol: string
}

const Stake: React.FC<StakeProps> = ({ lpContract, pid, tokenName, tokenSymbol, token2Symbol }) => {
  const {chainId} = useWeb3React()
  const [requestedApproval, setRequestedApproval] = useState(false)
  const [val, setVal] = useState('')
  const [pendingTx, setPendingTx] = useState(false)
  const [successTx, setSuccessTx] = useState(false)

  const allowance = useAllowance(lpContract)
  const { onApprove } = useApprove(lpContract)

  const tokenBalance = useTokenBalance(lpContract.options.address)
  const stakedBalance = useStakedBalance(pid)
  const poolActive = usePoolActive(pid)

  const [totalStake, setTotalStake] = useState<BigNumber>()
  const sushi = useSushi()
  const block = useBlock()
  const stakedValue = useStakedValue(pid)

  useEffect(() => {
    async function fetchData() {
      const data = await getLPTokenStaked(sushi, lpContract, chainId)
      setTotalStake(data)
    }
    if (sushi && lpContract) {
      fetchData()
    }
  }, [sushi, setTotalStake, lpContract, block])

  const { onStake } = useStake(pid)
  const { onUnstake } = useUnstake(pid)

  const [onPresentWithdraw] = useModal(
    <WithdrawModal max={stakedBalance} onConfirm={onUnstake} tokenName={tokenName} />
  )

  const handleApprove = useCallback(async () => {
    try {
      setRequestedApproval(true)
      const txHash = await onApprove()
      // user rejected tx or didn't go thru
      if (!txHash) {
        setRequestedApproval(false)
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
            {!allowance.toNumber() ? (
              <button
                disabled={requestedApproval}
                onClick={handleApprove}
              >
                {requestedApproval ? 'Approving' : `Approve ${tokenName}`}
              </button>
              // <Button
              //   disabled={requestedApproval}
              //   onClick={handleApprove}
              //   text={requestedApproval ? 'Approving' : `Approve ${tokenName}`}
              // />
            ) : (
              <>
               <button 
                  onClick={async () => {
                    if (val && parseFloat(val) > 0) {
                      setPendingTx(true)
                      const tx: any = await onStake(val)
                      setPendingTx(false)
                      if (tx) {
                        setSuccessTx(true)
                      }
                    }
                  }} >
                    {pendingTx ? 'Pending Confirmation' : 'Confirm'}</button>
                {/* <Button
                  disabled={pendingTx}
                  text={pendingTx ? 'Pending Confirmation' : 'Confirm'}
                  onClick={async () => {
                    if (val && parseFloat(val) > 0) {
                      setPendingTx(true)
                      const tx: any = await onConfirm(val)
                      setPendingTx(false)
                      if (tx) {
                        setSuccessTx(true)
                      } else {
                        if (onDismiss) onDismiss()
                      }
                    }
                  }}
                /> */}
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
