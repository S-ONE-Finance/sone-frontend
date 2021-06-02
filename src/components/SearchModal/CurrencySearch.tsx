import { Currency, ETHER, Token } from '@s-one-finance/sdk-core'
import React, { KeyboardEvent, RefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import ReactGA from 'react-ga'
import { FixedSizeList } from 'react-window'
import { Text } from 'rebass'
import { useActiveWeb3React } from '../../hooks'
import { useAllTokens, useToken, useIsUserAddedToken, useFoundOnInactiveList } from '../../hooks/Tokens'
import { TYPE, ButtonText } from '../../theme'
import { isAddress } from '../../utils'
import Column from '../Column'
import Row, { RowBetween, RowFixed } from '../Row'
import CommonBases from './CommonBases'
import CurrencyList from './CurrencyList'
import { filterTokens, useSortedTokensByQuery } from './filtering'
import { useTokenComparator } from './sorting'
import { PaddedColumn, SearchInput, SeparatorDark } from './styleds'
import AutoSizer from 'react-virtualized-auto-sizer'
import styled from 'styled-components'
import useToggle from 'hooks/useToggle'
import { useOnClickOutside } from 'hooks/useOnClickOutside'
import useTheme from 'hooks/useTheme'
import ImportRow from './ImportRow'
import useDebounce from 'hooks/useDebounce'
import { useIsUpToExtraSmall } from '../../hooks/useWindowSize'
import { QuestionHelper1416 } from '../QuestionHelper'
import { ReactComponent as SortDownIconSvg } from '../../assets/svg/sort_down_icon.svg'
import { ReactComponent as SortUpIconSvg } from '../../assets/svg/sort_up_icon.svg'
import { useActiveListUrls } from '../../state/lists/hooks'
import ListLogo from '../ListLogo'
import { useSelector } from 'react-redux'
import { AppState } from '../../state'
import { TokenList } from '@uniswap/token-lists/dist/types'
import { StyledCloseIcon } from '../../theme/components'

const SortDownIcon = styled(SortDownIconSvg)`
  cursor: pointer;
`

const SortUpIcon = styled(SortUpIconSvg)`
  cursor: pointer;
`

const ContentWrapper = styled(Column)`
  width: 100%;
  flex: 1 1;
  position: relative;
  background-color: ${({ theme }) => theme.bg1Sone};
`

const Footer = styled.div`
  width: 100%;
  padding: 2em;
  border-radius: 0 0 20px 20px;
  background-color: ${({ theme }) => theme.bg1Sone};
  border-top: 1px solid ${({ theme }) => theme.bg2};

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    padding: 1.25em;
  `}
`

interface CurrencySearchProps {
  isOpen: boolean
  onDismiss: () => void
  selectedCurrency?: Currency | null
  onCurrencySelect: (currency: Currency) => void
  otherSelectedCurrency?: Currency | null
  showCommonBases?: boolean
  showManageView: () => void
  showImportView: () => void
  setImportToken: (token: Token) => void
}

export function CurrencySearch({
  selectedCurrency,
  onCurrencySelect,
  otherSelectedCurrency,
  showCommonBases,
  onDismiss,
  isOpen,
  showManageView,
  showImportView,
  setImportToken
}: CurrencySearchProps) {
  const isUpToExtraSmall = useIsUpToExtraSmall()
  const theme = useTheme()

  const { chainId } = useActiveWeb3React()

  // refs for fixed size lists
  const fixedList = useRef<FixedSizeList>()

  const [searchQuery, setSearchQuery] = useState<string>('')
  const debouncedQuery = useDebounce(searchQuery, 200)

  const [invertSearchOrder, setInvertSearchOrder] = useState<boolean>(false)

  const allTokens = useAllTokens()

  // if they input an address, use it
  const isAddressSearch = isAddress(debouncedQuery)
  const searchToken = useToken(debouncedQuery)
  const searchTokenIsAdded = useIsUserAddedToken(searchToken)

  const activeListUrls = useActiveListUrls()

  const listsByUrl = useSelector<AppState, AppState['lists']['byUrl']>(state => state.lists.byUrl)
  const [currentList, setCurrentList] = useState<TokenList | null>(null)

  useEffect(() => {
    if (activeListUrls?.length === 1) {
      setCurrentList(listsByUrl[activeListUrls[0]].current)
    }
  }, [activeListUrls, listsByUrl])

  useEffect(() => {
    if (isAddressSearch) {
      ReactGA.event({
        category: 'Currency Select',
        action: 'Search by address',
        label: isAddressSearch
      })
    }
  }, [isAddressSearch])

  const showETH: boolean = useMemo(() => {
    const s = debouncedQuery.toLowerCase().trim()
    return s === '' || s === 'e' || s === 'et' || s === 'eth'
  }, [debouncedQuery])

  const tokenComparator = useTokenComparator(invertSearchOrder)

  const filteredTokens: Token[] = useMemo(() => {
    return filterTokens(Object.values(allTokens), debouncedQuery)
  }, [allTokens, debouncedQuery])

  const sortedTokens: Token[] = useMemo(() => {
    return filteredTokens.sort(tokenComparator)
  }, [filteredTokens, tokenComparator])

  const filteredSortedTokens = useSortedTokensByQuery(sortedTokens, debouncedQuery)

  const handleCurrencySelect = useCallback(
    (currency: Currency) => {
      onCurrencySelect(currency)
      onDismiss()
    },
    [onDismiss, onCurrencySelect]
  )

  // clear the input on open
  useEffect(() => {
    if (isOpen) setSearchQuery('')
  }, [isOpen])

  // manage focus on modal show
  const inputRef = useRef<HTMLInputElement>()
  const handleInput = useCallback(event => {
    const input = event.target.value
    const checksummedInput = isAddress(input)
    setSearchQuery(checksummedInput || input)
    fixedList.current?.scrollTo(0)
  }, [])

  const handleEnter = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        const s = debouncedQuery.toLowerCase().trim()
        if (s === 'eth') {
          handleCurrencySelect(ETHER)
        } else if (filteredSortedTokens.length > 0) {
          if (
            filteredSortedTokens[0].symbol?.toLowerCase() === debouncedQuery.trim().toLowerCase() ||
            filteredSortedTokens.length === 1
          ) {
            handleCurrencySelect(filteredSortedTokens[0])
          }
        }
      }
    },
    [filteredSortedTokens, handleCurrencySelect, debouncedQuery]
  )

  // menu ui
  const [open, toggle] = useToggle(false)
  const node = useRef<HTMLDivElement>()
  useOnClickOutside(node, open ? toggle : undefined)

  // if no results on main list, show option to expand into inactive
  const inactiveTokens = useFoundOnInactiveList(debouncedQuery)
  const filteredInactiveTokens: Token[] = useSortedTokensByQuery(inactiveTokens, debouncedQuery)

  const handleSort = useCallback(() => {
    setInvertSearchOrder(prev => !prev)
  }, [])

  return (
    <ContentWrapper>
      <PaddedColumn gap="16px" style={{ padding: isUpToExtraSmall ? '2em 1em 0 1em' : '2.5em 2em 0 2em' }}>
        <RowBetween>
          <RowFixed>
            <Text fontWeight={700} fontSize={isUpToExtraSmall ? 20 : 28}>
              Select a token
            </Text>
            <QuestionHelper1416 text="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Officiis, quisquam!" />
          </RowFixed>
          <StyledCloseIcon onClick={onDismiss} />
          {/*<CloseIcon onClick={onDismiss} size={isUpToExtraSmall ? 24 : 36} color={theme.closeIcon} />*/}
        </RowBetween>
        <Row>
          <SearchInput
            type="text"
            id="token-search-input"
            placeholder="Search name or paste address"
            autoComplete="off"
            value={searchQuery}
            ref={inputRef as RefObject<HTMLInputElement>}
            onChange={handleInput}
            onKeyDown={handleEnter}
            borderRadius={'27px'}
          />
        </Row>
        {showCommonBases && (
          <CommonBases chainId={chainId} onSelect={handleCurrencySelect} selectedCurrency={selectedCurrency} />
        )}
      </PaddedColumn>
      {searchToken && !searchTokenIsAdded ? (
        <Column style={{ margin: '20px 0', height: '100%' }}>
          <ImportRow token={searchToken} showImportView={showImportView} setImportToken={setImportToken} />
        </Column>
      ) : filteredSortedTokens?.length > 0 || filteredInactiveTokens?.length > 0 ? (
        <>
          <RowBetween style={{ padding: isUpToExtraSmall ? '20px 1.25rem 0' : '20px 2rem 0' }}>
            <Text fontWeight={500} fontSize={16}>
              Token Name
            </Text>
            {invertSearchOrder === false ? <SortDownIcon onClick={handleSort} /> : <SortUpIcon onClick={handleSort} />}
          </RowBetween>
          <div style={{ flex: '1' }}>
            <AutoSizer disableWidth>
              {({ height }) => (
                <CurrencyList
                  height={height}
                  showETH={showETH}
                  currencies={
                    filteredInactiveTokens ? filteredSortedTokens.concat(filteredInactiveTokens) : filteredSortedTokens
                  }
                  breakIndex={inactiveTokens && filteredSortedTokens ? filteredSortedTokens.length : undefined}
                  onCurrencySelect={handleCurrencySelect}
                  otherCurrency={otherSelectedCurrency}
                  selectedCurrency={selectedCurrency}
                  fixedListRef={fixedList}
                  showImportView={showImportView}
                  setImportToken={setImportToken}
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
      <SeparatorDark />
      <Footer>
        <RowBetween>
          {currentList ? (
            <RowFixed>
              {currentList.logoURI && (
                <ListLogo
                  size="24px"
                  style={{ marginRight: '0.5em' }}
                  logoURI={currentList.logoURI}
                  alt={`${currentList.name} list logo`}
                />
              )}
              <TYPE.main color={theme.text8Sone}>{currentList.name}</TYPE.main>
            </RowFixed>
          ) : (
            <TYPE.main color={theme.text8Sone}></TYPE.main>
          )}
          <ButtonText onClick={showManageView} color={theme.text5Sone} className="list-token-manage-button">
            <TYPE.main color={theme.text5Sone}>Change List</TYPE.main>
          </ButtonText>
        </RowBetween>
      </Footer>
    </ContentWrapper>
  )
}
