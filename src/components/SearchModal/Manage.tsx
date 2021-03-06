import React from 'react'
import { useTranslation } from 'react-i18next'
import { PaddedColumn } from './styleds'
import { RowBetween, RowFixed } from 'components/Row'
import { ArrowLeft } from 'react-feather'
import { Text } from 'rebass'
import { StyledCloseIcon } from 'theme'
import styled from 'styled-components'
import { ManageLists } from './ManageLists'
import { TokenList } from '@uniswap/token-lists'
import { CurrencyModalView } from './CurrencySearchModal'
import useTheme from '../../hooks/useTheme'
import { useIsUpToExtraSmall } from '../../hooks/useWindowSize'
import { QuestionHelper1416 } from '../QuestionHelper'

const Wrapper = styled.div`
  width: 100%;
  position: relative;
  background-color: ${({ theme }) => theme.bg1Sone};
  display: flex;
  flex-direction: column;
`

export default function Manage({
  onDismiss,
  setModalView,
  setImportList,
  setListUrl
}: {
  onDismiss: () => void
  setModalView: (view: CurrencyModalView) => void
  setImportList: (list: TokenList) => void
  setListUrl: (url: string) => void
}) {
  const { t } = useTranslation()
  const isUpToExtraSmall = useIsUpToExtraSmall()
  const theme = useTheme()

  return (
    <Wrapper>
      <PaddedColumn gap="16px" style={{ padding: isUpToExtraSmall ? '2em 1em 0 1em' : '2.5em 2em 0 2em' }}>
        <RowBetween>
          <ArrowLeft
            style={{ cursor: 'pointer' }}
            size={isUpToExtraSmall ? 24 : 36}
            color={theme.closeIcon}
            onClick={() => setModalView(CurrencyModalView.search)}
          />
          <RowFixed>
            <Text fontWeight={700} fontSize={isUpToExtraSmall ? 20 : 28}>
              {t('manage_lists')}
            </Text>
            <QuestionHelper1416 text={t('question_helper_manage_lists')} />
          </RowFixed>
          <StyledCloseIcon onClick={onDismiss} />
        </RowBetween>
      </PaddedColumn>
      <ManageLists setModalView={setModalView} setImportList={setImportList} setListUrl={setListUrl} />
    </Wrapper>
  )
}
