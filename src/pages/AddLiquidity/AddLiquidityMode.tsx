import React, { useCallback } from 'react'
import { useAddLiquidityModeManager } from '../../state/user/hooks'
import Row from '../../components/Row'
import { QuestionHelper1416 } from '../../components/QuestionHelper'
import { Text } from 'rebass'
import { useIsUpToExtraSmall } from '../../hooks/useWindowSize'
import useTheme from '../../hooks/useTheme'
import styled from 'styled-components'
import { ColumnCenter } from '../../components/Column'
import { AddLiquidityModeEnum } from '../../state/user/actions'

const Container = styled.div`
  margin: -9px 34px 26px;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    margin: 0 24px 17px;
  `}
`

const ToggleWrapper = styled(Row)`
  background: #f3f3f3;
  width: 350px;
  height: 53px;
  border-radius: 39px;
  margin-left: 16px;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    width: 160px;
    height: 28px; 
  `}
`

const ToggleItem = styled(ColumnCenter)<{ active: boolean }>`
  justify-content: center;
  cursor: pointer;
  background: ${({ theme, active }) => (active ? theme.text5Sone : 'transparent')};
  color: ${({ theme, active }) => (active ? theme.white : theme.text9Sone)};
  width: ${({ active }) => (active ? '52%' : '48%')};
  height: 100%;
  border-radius: inherit;
  user-select: none;
`

const ToggleItemTitle = styled(Text)`
  margin-top: -4px !important;
  font-size: 18px;
  color: inherit;
  font-weight: 500;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    margin-top: 0 !important;
    font-size: 13px; 
  `}
`

const ToggleItemDescription = styled(Text)`
  font-size: 13px;
  color: inherit;
  font-weight: 400;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    display: none; 
  `}
`

export default function AddLiquidityMode() {
  const [addLiquidityMode, updateAddLiquidityMode] = useAddLiquidityModeManager()
  const isUpToExtraSmall = useIsUpToExtraSmall()
  const theme = useTheme()

  const toggleMode = useCallback(() => {
    updateAddLiquidityMode(
      addLiquidityMode === AddLiquidityModeEnum.OneToken ? AddLiquidityModeEnum.TwoToken : AddLiquidityModeEnum.OneToken
    )
  }, [addLiquidityMode, updateAddLiquidityMode])

  return (
    <Container>
      <Row>
        <Text fontSize={isUpToExtraSmall ? 13 : 16} color={theme.text10Sone}>
          Mode
        </Text>
        <QuestionHelper1416 text="Lorem ipsum dolor sit amet." />
        <ToggleWrapper onClick={toggleMode}>
          <ToggleItem active={addLiquidityMode === AddLiquidityModeEnum.OneToken}>
            <ToggleItemTitle>Simple</ToggleItemTitle>
            <ToggleItemDescription>One token mode</ToggleItemDescription>
          </ToggleItem>
          <ToggleItem active={addLiquidityMode === AddLiquidityModeEnum.TwoToken}>
            <ToggleItemTitle>Advanced</ToggleItemTitle>
            <ToggleItemDescription>Two tokens mode</ToggleItemDescription>
          </ToggleItem>
        </ToggleWrapper>
      </Row>
    </Container>
  )
}
