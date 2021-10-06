import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { Text } from 'rebass'
import { useAddLiquidityModeManager } from '../../state/user/hooks'
import Row from '../../components/Row'
import { QuestionHelper1416 } from '../../components/QuestionHelper'
import { useIsUpToExtraSmall } from '../../hooks/useWindowSize'
import useTheme from '../../hooks/useTheme'
import { ColumnCenter } from '../../components/Column'
import { AddLiquidityModeEnum } from '../../state/user/actions'
import { AddLiquidityStep2 } from '../../components/lib/mark/components'

const Container = styled.div`
  margin: -9px 34px 26px;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    margin: 0 24px 17px;
  `}
`

const ButtonGroup = styled(Row)`
  background: #f3f3f3;
  width: 350px;
  height: 53px;
  border-radius: 39px;
  margin-left: 16px;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    width: 220px;
    height: 43px;
  `}
`

const Item = styled(ColumnCenter)<{ active: boolean }>`
  justify-content: center;
  cursor: pointer;
  background: ${({ theme, active }) => (active ? theme.text5Sone : 'transparent')};
  color: ${({ theme, active }) => (active ? theme.white : theme.text9Sone)};
  width: ${({ active }) => (active ? '52%' : '48%')};
  height: 100%;
  border-radius: inherit;
  user-select: none;
`

const ItemTitle = styled(Text)`
  margin-top: -4px !important;
  font-size: 18px;
  color: inherit;
  font-weight: 500;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    margin-top: 0 !important;
    font-size: 13px;
  `}
`

const ItemDescription = styled(Text)`
  font-size: 13px;
  color: inherit;
  font-weight: 400;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    font-size: 11px;
  `}
`

export default function ModeToggle() {
  const { t } = useTranslation()
  const [addLiquidityMode, updateAddLiquidityMode] = useAddLiquidityModeManager()
  const isUpToExtraSmall = useIsUpToExtraSmall()
  const theme = useTheme()

  const setModeOneToken = useCallback(() => {
    if (addLiquidityMode === AddLiquidityModeEnum.OneToken) return
    updateAddLiquidityMode(AddLiquidityModeEnum.OneToken)
  }, [addLiquidityMode, updateAddLiquidityMode])

  const setModeTwoToken = useCallback(() => {
    if (addLiquidityMode === AddLiquidityModeEnum.TwoToken) return
    updateAddLiquidityMode(AddLiquidityModeEnum.TwoToken)
  }, [addLiquidityMode, updateAddLiquidityMode])

  return (
    <Container>
      <Row>
        <Text fontSize={isUpToExtraSmall ? 13 : 16} color={theme.text10Sone}>
          {t('mode')}
        </Text>
        <QuestionHelper1416 text={t('question_helper_mode')} />
        <AddLiquidityStep2>
          <ButtonGroup>
            <Item onClick={setModeOneToken} active={addLiquidityMode === AddLiquidityModeEnum.OneToken}>
              <ItemTitle>{t('simple')}</ItemTitle>
              <ItemDescription>{t('one_token_mode')}</ItemDescription>
            </Item>
            <Item onClick={setModeTwoToken} active={addLiquidityMode === AddLiquidityModeEnum.TwoToken}>
              <ItemTitle>{t('advance')}</ItemTitle>
              <ItemDescription>{t('two_tokens_mode')}</ItemDescription>
            </Item>
          </ButtonGroup>
        </AddLiquidityStep2>
      </Row>
    </Container>
  )
}
