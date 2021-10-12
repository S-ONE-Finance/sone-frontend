import { Pair } from '@s-one-finance/sdk-core'
import useDebounce from 'hooks/useDebounce'
import useTheme from 'hooks/useTheme'
import { useTranslation } from 'react-i18next'
import React, { KeyboardEvent, RefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import AutoSizer from 'react-virtualized-auto-sizer'
import { FixedSizeList } from 'react-window'
import { Text } from 'rebass'
import styled from 'styled-components'
import { useIsUpToExtraSmall } from '../../../../../../../hooks/useWindowSize'
import { PanelSearchContentWrapper, SortDownIcon, SortUpIcon, StyledCloseIcon, TYPE } from '../../../../../../../theme'
import Column from '../../../../../../Column'
import { QuestionHelper1416 } from '../../../../../../QuestionHelper'
import Row, { RowBetween, RowFixed } from '../../../../../../Row'
import { filterPairs } from '../../../../../../SearchModal/filtering'
import { PaddedColumn, SearchInput } from '../../../../../../SearchModal/styleds'
import PairList from './PairList'
import { useDarkModeManager } from '../../../../../../../state/user/hooks'
import { useGetPairFromSubgraphAndParse } from 'graphql/hooks'

type ModalSearchPairProps = {
  isOpen: boolean
  onDismiss: () => void
  selectedPair?: Pair | null
  onPairSelect: (pair: Pair) => void
}

const ModalCustom = styled.div`
  width: 470px;
  max-width: calc(100vw - 32px);
  padding: 0;
  margin: 0;
  overflow-y: hidden;
  overflow-x: hidden;
  align-self: center;
  max-height: 80vh;
  min-height: 80vh;
  display: flex;
  border-radius: 25px;
`

const MarkRow = styled.div<{ background: string }>`
  position: absolute;
  left: 0;
  top: 112px;
  width: 470px;
  max-width: calc(100vw - 32px);
  background: ${({ background }) => background};
  min-height: 56px;
  z-index: 0;
`

export default function ModalSearchPair({ isOpen, onDismiss, selectedPair, onPairSelect }: ModalSearchPairProps) {
  const { t } = useTranslation()
  const isUpToExtraSmall = useIsUpToExtraSmall()
  const theme = useTheme()

  // refs for fixed size lists
  const fixedList = useRef<FixedSizeList>()

  const [searchQuery, setSearchQuery] = useState<string>('')
  const debouncedQuery = useDebounce(searchQuery, 200)

  const [invertSearchOrder, setInvertSearchOrder] = useState<boolean>(false)

  const [isLoading, allPairs] = useGetPairFromSubgraphAndParse()

  const filteredPairs: Pair[] = useMemo(() => {
    return filterPairs(allPairs, debouncedQuery)
  }, [allPairs, debouncedQuery])

  const sortedPairs: Pair[] = useMemo(() => {
    return invertSearchOrder ? filteredPairs.slice().reverse() : filteredPairs
  }, [filteredPairs, invertSearchOrder])

  const handlePairSelect = useCallback(
    (pair: Pair) => {
      onPairSelect(pair)
      onDismiss()
    },
    [onDismiss, onPairSelect]
  )

  // clear the input on open
  useEffect(() => {
    if (isOpen) setSearchQuery('')
  }, [isOpen])

  // manage focus on modal show
  const inputRef = useRef<HTMLInputElement>()
  const handleInput = useCallback(event => {
    const input = event.target.value
    setSearchQuery(input)
    fixedList.current?.scrollTo(0)
  }, [])

  const handleEnter = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && sortedPairs.length === 1) {
        handlePairSelect(sortedPairs[0])
      }
    },
    [sortedPairs, handlePairSelect]
  )

  const handleSort = useCallback(() => {
    setInvertSearchOrder(prev => !prev)
  }, [])

  const [darkMode] = useDarkModeManager()

  return (
    <ModalCustom>
      <PanelSearchContentWrapper>
        <PaddedColumn gap="16px" style={{ padding: isUpToExtraSmall ? '2em 1em 0 1em' : '2.5em 2em 0 2em' }}>
          <RowBetween>
            <RowFixed>
              <Text fontWeight={700} fontSize={isUpToExtraSmall ? 20 : 28}>
                {t('select_a_pair')}
              </Text>
              <QuestionHelper1416 text={t('question_helper_select_a_pair')} />
            </RowFixed>
            <StyledCloseIcon onClick={onDismiss} />
          </RowBetween>
          <Row>
            <SearchInput
              type="text"
              id="pair-search-input"
              placeholder={t('search')}
              autoComplete="off"
              value={searchQuery}
              ref={inputRef as RefObject<HTMLInputElement>}
              onChange={handleInput}
              onKeyDown={handleEnter}
              borderRadius={'27px'}
            />
          </Row>
        </PaddedColumn>
        {isLoading ? (
          <Column width="unset" style={{ margin: '20px', height: '100%' }}>
            <TYPE.main color={theme.text3} textAlign="center" mb="20px">
              {t('Loading...')}
            </TYPE.main>
          </Column>
        ) : sortedPairs?.length > 0 ? (
          <>
            <RowBetween style={{ padding: isUpToExtraSmall ? '20px 1.25rem 0' : '20px 2rem 0' }}>
              <Text fontWeight={500} fontSize={16}>
                {t('pair_name')}
              </Text>
              {invertSearchOrder === false ? (
                <SortDownIcon onClick={handleSort} />
              ) : (
                <SortUpIcon onClick={handleSort} />
              )}
            </RowBetween>
            <div style={{ flex: '1', zIndex: 1 }}>
              <AutoSizer style={{}} disableWidth>
                {({ height }) => (
                  <PairList
                    height={height}
                    pairs={sortedPairs}
                    onPairSelect={handlePairSelect}
                    selectedPair={selectedPair}
                    fixedListRef={fixedList}
                  />
                )}
              </AutoSizer>
              <MarkRow background={darkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)'} />
            </div>
          </>
        ) : (
          <Column width="unset" style={{ margin: '20px', height: '100%' }}>
            <TYPE.main color={theme.text3} textAlign="center" mb="20px">
              {t('No results found.')}
            </TYPE.main>
          </Column>
        )}
      </PanelSearchContentWrapper>
    </ModalCustom>
  )
}
