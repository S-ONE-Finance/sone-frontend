import BigNumber from 'bignumber.js'
import useUnstake from 'hooks/masterfarmer/useUnstake'
import React, { useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'
import TokenInput from '../../../components/TokenInput'
import { getFullDisplayBalance } from '../../../sushi/format/formatBalance'

interface UnstakeProps {
  amountStaked: string | undefined
  pid: number
  symbol: string
  val: string
  setVal: React.Dispatch<React.SetStateAction<string>>
}

const Unstake: React.FC<UnstakeProps> = ({ amountStaked, pid, symbol, val, setVal }) => {
  const [pendingUnstakeTx, setPendingUnstakeTx] = useState(false)

  const { onUnstake } = useUnstake(pid)

  const fullBalance = useMemo(() => {
    return getFullDisplayBalance(new BigNumber(amountStaked || '0'))
  }, [amountStaked])

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
            <button
              disabled={pendingUnstakeTx}
              onClick={async () => {
                if (val && parseFloat(val) > 0) {
                  setPendingUnstakeTx(true)
                  await onUnstake(val, symbol)
                  setPendingUnstakeTx(false)
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
