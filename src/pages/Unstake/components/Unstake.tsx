import React, { useCallback, useState, useMemo } from 'react'
import styled from 'styled-components'
import TokenInput from '../../../components/TokenInput'
import { getFullDisplayBalance } from '../../../sushi/format/formatBalance'
import useStakedBalance from 'hooks/farms/useStakedBalance'
import useUnstake from 'hooks/farms/useUnstake'
interface UnstakeProps {
  lpContract: any
  pid: number
  tokenName: string
  tokenSymbol: string
  token2Symbol: string
  val: string
  setVal: React.Dispatch<React.SetStateAction<string>>
}

const Unstake: React.FC<UnstakeProps> = ({ lpContract, pid, tokenName, tokenSymbol, token2Symbol, val, setVal }) => {
  const [pendingUnstakeTx, setPendingUnstakeTx] = useState(false)

  const stakedValue = useStakedBalance(1)

  const { onUnstake } = useUnstake(pid)

  const fullBalance = useMemo(() => {
    return getFullDisplayBalance(stakedValue)
  }, [stakedValue])

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
            <button
              disabled={pendingUnstakeTx}
              onClick={async () => {
                if (val && parseFloat(val) > 0) {
                  setPendingUnstakeTx(true)
                  const tx: any = await onUnstake(val)
                  if (tx) {
                    setPendingUnstakeTx(false)
                  }
                }
              }}
            >
              {pendingUnstakeTx ? 'Pending Confirmation' : 'Confirm'}
            </button>
            <StyledActionSpacer />
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

export default Unstake
