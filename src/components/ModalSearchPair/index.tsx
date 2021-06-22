import { Pair } from '@s-one-finance/sdk-core'
import Modal from 'components/Modal'
import useDebounce from 'hooks/useDebounce'
import useTheme from 'hooks/useTheme'
import React, { KeyboardEvent, RefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import AutoSizer from 'react-virtualized-auto-sizer'
import { FixedSizeList } from 'react-window'
import { Text } from 'rebass'
import { useIsUpToExtraSmall } from '../../hooks/useWindowSize'
import { TYPE } from '../../theme'
import { StyledCloseIcon } from '../../theme/components'
import Column from '../Column'
import { QuestionHelper1416 } from '../QuestionHelper'
import Row, { RowBetween, RowFixed } from '../Row'
import { filterPairs } from '../SearchModal/filtering'
import { PaddedColumn, SearchInput } from '../SearchModal/styleds'
import { PanelSearchContentWrapper, SortDownIcon, SortUpIcon } from 'theme'
import PairList from './PairList'
import { useGetPairFromSubgraphAndParse } from 'subgraph'

type ModalSearchPairProps = {
  isOpen: boolean
  onDismiss: () => void
  selectedPair?: Pair | null
  onPairSelect: (pair: Pair) => void
}

export default function ModalSearchPair({ isOpen, onDismiss, selectedPair, onPairSelect }: ModalSearchPairProps) {
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

  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss} maxHeight={80} minHeight={80} maxWidth={470}>
      <PanelSearchContentWrapper>
        <PaddedColumn gap="16px" style={{ padding: isUpToExtraSmall ? '2em 1em 0 1em' : '2.5em 2em 0 2em' }}>
          <RowBetween>
            <RowFixed>
              <Text fontWeight={700} fontSize={isUpToExtraSmall ? 20 : 28}>
                Select a pair
              </Text>
              <QuestionHelper1416 text="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Officiis, quisquam!" />
            </RowFixed>
            <StyledCloseIcon onClick={onDismiss} />
          </RowBetween>
          <Row>
            <SearchInput
              type="text"
              id="pair-search-input"
              placeholder="Search pair"
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
              Loading...
            </TYPE.main>
          </Column>
        ) : sortedPairs?.length > 0 ? (
          <>
            <RowBetween style={{ padding: isUpToExtraSmall ? '20px 1.25rem 0' : '20px 2rem 0' }}>
              <Text fontWeight={500} fontSize={16}>
                Pair Name
              </Text>
              {invertSearchOrder === false ? (
                <SortDownIcon onClick={handleSort} />
              ) : (
                <SortUpIcon onClick={handleSort} />
              )}
            </RowBetween>
            <div style={{ flex: '1' }}>
              <AutoSizer disableWidth>
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
            </div>
          </>
        ) : (
          <Column width="unset" style={{ margin: '20px', height: '100%' }}>
            <TYPE.main color={theme.text3} textAlign="center" mb="20px">
              No results found.
            </TYPE.main>
          </Column>
        )}
      </PanelSearchContentWrapper>
    </Modal>
  )
}
