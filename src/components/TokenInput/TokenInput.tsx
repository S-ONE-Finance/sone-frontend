import React from 'react'
import styled from 'styled-components'

import Input, { InputProps } from '../Input'

interface TokenInputProps extends InputProps {
  max: number | string
  symbol: string
  onSelectMax?: () => void
}

const TokenInput: React.FC<TokenInputProps> = ({ max, symbol, onChange, onSelectMax, value }) => {
  return (
    <StyledTokenInput>
      <Box>
        <StyleBox>
          <StyleLabel>Amount</StyleLabel>
          <StyledMaxText>{max.toLocaleString('en-US')}</StyledMaxText>
        </StyleBox>
        <BoxInput>
          <Input
            endAdornment={
              <StyledTokenAdornmentWrapper>
                <StyledSpacer />
                <div>
                  <button onClick={onSelectMax}>Max</button>
                </div>
              </StyledTokenAdornmentWrapper>
            }
            onChange={onChange}
            placeholder="0"
            value={value}
          />
        </BoxInput>
      </Box>
    </StyledTokenInput>
  )
}

const StyleBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-right: 20px;
  padding-left: 20px;
`
const StyleLabel = styled.div`
  color: ${props => props.theme.text2};
  font-weight: bold;
  width: 40%;
`
const StyledTokenInput = styled.div`
  padding: 24px;
`
const Box = styled.div`
  background-color: ${props => props.theme.bg2};
  border-radius: 12px;
  padding: 10px 0;
`
const StyledSpacer = styled.div`
  width: 12px;
`

const StyledTokenAdornmentWrapper = styled.div`
  align-items: center;
  display: flex;
  width: 60%;
`

const StyledMaxText = styled.div`
  align-items: center;
  color: ${props => props.theme.text2};
  display: flex;
  font-size: 14px;
  font-weight: 700;
  height: 44px;
  width: 60%;
`

const BoxInput = styled.div`
  input {
    width: 40%;
  }
`

export default TokenInput
