import React, { memo, useCallback, useMemo, useRef, useState, useEffect } from 'react'
import { CheckCircle } from 'react-feather'
import ReactGA from 'react-ga'
import { usePopper } from 'react-popper'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { useFetchListCallback } from '../../hooks/useFetchListCallback'
import { useOnClickOutside } from '../../hooks/useOnClickOutside'
import { TokenList } from '@uniswap/token-lists'
import { Text } from 'rebass'
import { ReactComponent as DropDown } from '../../assets/images/dropdown.svg'

import useToggle from '../../hooks/useToggle'
import { AppDispatch, AppState } from '../../state'
import { acceptListUpdate, removeList, enableList } from '../../state/lists/actions'
import { useIsListActive, useAllLists, useActiveListUrls } from '../../state/lists/hooks'
import { ExternalLink, LinkStyledButton, TYPE, IconWrapper } from '../../theme'
import listVersionLabel from '../../utils/listVersionLabel'
import { parseENSAddress } from '../../utils/parseENSAddress'
import uriToHttp from '../../utils/uriToHttp'
import { ButtonOutlined, ButtonPrimary } from '../Button'

import Column, { AutoColumn } from '../Column'
import ListLogo from '../ListLogo'
import Row, { RowFixed, RowBetween } from '../Row'
import { PaddedColumn, SearchInput, SeparatorDark } from './styleds'
import useTheme from '../../hooks/useTheme'
import Card from 'components/Card'
import { CurrencyModalView } from './CurrencySearchModal'
import { UNSUPPORTED_LIST_URLS } from 'constants/lists'
import { useIsUpToExtraSmall } from '../../hooks/useWindowSize'
import { QuestionHelper1416 } from '../QuestionHelper'
import { ButtonMainRed } from '../Web3Status'

const Wrapper = styled(Column)`
  width: 100%;
  flex: 1;
  overflow: auto;
`

const UnpaddedLinkStyledButton = styled(LinkStyledButton)`
  padding: 0;
  font-size: 1rem;
  opacity: ${({ disabled }) => (disabled ? '0.4' : '1')};
`

const PopoverContainer = styled.div<{ show: boolean }>`
  z-index: 100;
  visibility: ${props => (props.show ? 'visible' : 'hidden')};
  opacity: ${props => (props.show ? 1 : 0)};
  transition: visibility 150ms linear, opacity 150ms linear;
  background: ${({ theme }) => theme.bg1Sone};
  border: 1px solid ${({ theme }) => theme.bg3};
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04),
    0px 24px 32px rgba(0, 0, 0, 0.01);
  color: ${({ theme }) => theme.text1Sone};
  border-radius: 0.5rem;
  padding: 1rem;
  display: grid;
  grid-template-rows: 1fr;
  grid-gap: 8px;
  font-size: 1rem;
  text-align: left;
`

const StyledMenu = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  border: none;
`

const StyledListUrlText = styled(TYPE.main)`
  font-size: 12px;
  color: ${({ theme }) => theme.text4Sone};
`

const ButtonAdd = styled(ButtonMainRed)`
  height: 55px;
  width: 64px;
  min-width: unset;
  border-radius: 10px;
  margin-left: 1rem;
  box-shadow: none;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    height: 40px;
    width: 58px;
  `}
`

function ListOrigin({ listUrl }: { listUrl: string }) {
  const ensName = useMemo(() => parseENSAddress(listUrl)?.ensName, [listUrl])
  const host = useMemo(() => {
    if (ensName) return undefined
    const lowerListUrl = listUrl.toLowerCase()
    if (lowerListUrl.startsWith('ipfs://') || lowerListUrl.startsWith('ipns://')) {
      return listUrl
    }
    try {
      const url = new URL(listUrl)
      return url.host
    } catch (error) {
      return undefined
    }
  }, [listUrl, ensName])
  return <>{ensName ?? host}</>
}

function listUrlRowHTMLId(listUrl: string) {
  return `list-row-${listUrl.replace(/\./g, '-')}`
}

const ListRow = memo(function ListRow({ listUrl }: { listUrl: string }) {
  const { t } = useTranslation()
  const theme = useTheme()
  const isUpToExtraSmall = useIsUpToExtraSmall()
  const listsByUrl = useSelector<AppState, AppState['lists']['byUrl']>(state => state.lists.byUrl)
  const dispatch = useDispatch<AppDispatch>()
  const { current: list, pendingUpdate: pending } = listsByUrl[listUrl]

  const isSelected = useIsListActive(listUrl)

  const [open, toggle] = useToggle(false)
  const node = useRef<HTMLDivElement>()
  const [referenceElement, setReferenceElement] = useState<HTMLDivElement>()
  const [popperElement, setPopperElement] = useState<HTMLDivElement>()

  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: 'auto',
    strategy: 'fixed',
    modifiers: [{ name: 'offset', options: { offset: [8, 8] } }]
  })

  useOnClickOutside(node, open ? toggle : undefined)

  const handleAcceptListUpdate = useCallback(() => {
    if (!pending) return
    ReactGA.event({
      category: 'Lists',
      action: 'Update List from List Select',
      label: listUrl
    })
    dispatch(acceptListUpdate(listUrl))
  }, [dispatch, listUrl, pending])

  const handleRemoveList = useCallback(() => {
    ReactGA.event({
      category: 'Lists',
      action: 'Start Remove List',
      label: listUrl
    })
    if (window.prompt(`Please confirm you would like to remove this list by typing REMOVE`) === `REMOVE`) {
      ReactGA.event({
        category: 'Lists',
        action: 'Confirm Remove List',
        label: listUrl
      })
      dispatch(removeList(listUrl))
    }
  }, [dispatch, listUrl])

  const handleEnableList = useCallback(() => {
    ReactGA.event({
      category: 'Lists',
      action: 'Enable List',
      label: listUrl
    })
    dispatch(enableList(listUrl))
  }, [dispatch, listUrl])

  if (!list) return null

  return (
    <Row
      key={listUrl}
      align="center"
      padding={isUpToExtraSmall ? '0.5rem 1rem' : '0.5rem 2rem'}
      id={listUrlRowHTMLId(listUrl)}
    >
      {list.logoURI ? (
        <ListLogo style={{ marginRight: '1rem' }} logoURI={list.logoURI} alt={`${list.name} list logo`} />
      ) : (
        <div style={{ width: '24px', height: '24px', marginRight: '1rem' }} />
      )}
      <Column style={{ flex: '1' }}>
        <Row>
          <Text
            fontWeight={isSelected ? 500 : 400}
            fontSize={16}
            style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}
          >
            {list.name}
          </Text>
        </Row>
        <Row
          style={{
            marginTop: '4px'
          }}
        >
          <StyledListUrlText>
            <ListOrigin listUrl={listUrl} />
          </StyledListUrlText>
        </Row>
      </Column>
      <StyledMenu ref={node as any}>
        <ButtonOutlined
          style={{
            width: '2rem',
            padding: '.8rem .35rem',
            borderRadius: '12px',
            fontSize: '14px',
            marginRight: '0.5rem',
            boxShadow: '0 0 0 1px #565a69'
          }}
          onClick={toggle}
          ref={setReferenceElement}
        >
          <DropDown />
        </ButtonOutlined>

        {open && (
          <PopoverContainer show={true} ref={setPopperElement as any} style={styles.popper} {...attributes.popper}>
            <div>{list && listVersionLabel(list.version)}</div>
            <SeparatorDark />
            <UnpaddedLinkStyledButton
              as={ExternalLink}
              style={{ color: theme.text10Sone, textAlign: 'start' }}
              href={`https://tokenlists.org/token-list?url=${listUrl}`}
            >
              {t('view')}
            </UnpaddedLinkStyledButton>
            {pending && (
              <UnpaddedLinkStyledButton
                style={{ color: theme.text10Sone, textAlign: 'start' }}
                onClick={handleAcceptListUpdate}
              >
                {t('update')}
              </UnpaddedLinkStyledButton>
            )}
            <UnpaddedLinkStyledButton
              style={{ color: theme.text10Sone, textAlign: 'start' }}
              onClick={handleRemoveList}
              disabled={Object.keys(listsByUrl).length === 1}
            >
              {t('remove')}
            </UnpaddedLinkStyledButton>
          </PopoverContainer>
        )}
      </StyledMenu>
      {isSelected ? (
        <ButtonPrimary
          disabled={true}
          className="select-button"
          style={{ width: '5rem', minWidth: '5rem', padding: '0.5rem .35rem', borderRadius: '12px', fontSize: '14px' }}
        >
          {t('selected')}
        </ButtonPrimary>
      ) : (
        <>
          <ButtonPrimary
            className="select-button"
            style={{
              width: '5rem',
              minWidth: '4.5rem',
              padding: '0.5rem .35rem',
              borderRadius: '12px',
              fontSize: '14px'
            }}
            onClick={handleEnableList}
          >
            {t('select')}
          </ButtonPrimary>
        </>
      )}
    </Row>
  )
})

const ListContainer = styled.div`
  height: 100%;
  overflow: auto;
`

const Footer = styled.div`
  padding: 2em;
`

export function ManageLists({
  setModalView,
  setImportList,
  setListUrl
}: {
  setModalView: (view: CurrencyModalView) => void
  setImportList: (list: TokenList) => void
  setListUrl: (url: string) => void
}) {
  const { t } = useTranslation()
  const theme = useTheme()
  const isUpToExtraSmall = useIsUpToExtraSmall()

  const [listUrlInput, setListUrlInput] = useState<string>('')

  const lists = useAllLists()

  // sort by active but only if not visible
  const activeListUrls = useActiveListUrls()
  const [activeCopy, setActiveCopy] = useState<string[] | undefined>()
  useEffect(() => {
    if (!activeCopy && activeListUrls) {
      setActiveCopy(activeListUrls)
    }
  }, [activeCopy, activeListUrls])

  const handleInput = useCallback(e => {
    setListUrlInput(e.target.value)
  }, [])

  const fetchList = useFetchListCallback()

  const validUrl: boolean = useMemo(() => {
    return uriToHttp(listUrlInput).length > 0 || Boolean(parseENSAddress(listUrlInput))
  }, [listUrlInput])

  const sortedLists = useMemo(() => {
    const listUrls = Object.keys(lists)
    return listUrls
      .filter(listUrl => {
        // only show loaded lists, hide unsupported lists
        return Boolean(lists[listUrl].current) && !Boolean(UNSUPPORTED_LIST_URLS.includes(listUrl))
      })
      .sort((u1, u2) => {
        const { current: l1 } = lists[u1]
        const { current: l2 } = lists[u2]

        // first filter on active lists
        if (activeCopy?.includes(u1) && !activeCopy?.includes(u2)) {
          return -1
        }
        if (!activeCopy?.includes(u1) && activeCopy?.includes(u2)) {
          return 1
        }

        if (l1 && l2) {
          return l1.name.toLowerCase() < l2.name.toLowerCase()
            ? -1
            : l1.name.toLowerCase() === l2.name.toLowerCase()
            ? 0
            : 1
        }
        if (l1) return -1
        if (l2) return 1
        return 0
      })
  }, [lists, activeCopy])

  // temporary fetched list for import flow
  const [tempList, setTempList] = useState<TokenList>()
  const [addError, setAddError] = useState<string | undefined>()
  const { t } = useTranslation()

  const handleAddList = useCallback(() => {
    async function fetchTempList() {
      fetchList(listUrlInput, false)
        .then(list => setTempList(list))
        .catch(() => setAddError(t('error_importing_list')))
    }
    // if valid url, fetch details for card
    if (validUrl) {
      fetchTempList()
    } else {
      setTempList(undefined)
      listUrlInput !== '' && setAddError(t('enter_valid_list_location'))
    }

    // reset error
    if (listUrlInput === '') {
      setAddError(undefined)
    }
  }, [t, fetchList, listUrlInput, validUrl])

  // check if list is already imported
  const isImported = Object.keys(lists).includes(listUrlInput)

  // set list values and have parent modal switch to import list view
  const handleImport = useCallback(() => {
    if (!tempList) return
    setImportList(tempList)
    setModalView(CurrencyModalView.importList)
    setListUrl(listUrlInput)
  }, [listUrlInput, setImportList, setListUrl, setModalView, tempList])

  return (
    <Wrapper>
      <PaddedColumn gap="10px" style={{ padding: isUpToExtraSmall ? '20px 1rem' : '20px 2rem' }}>
        <RowFixed>
          <Text fontWeight={500} fontSize={16} color={theme.text10Sone}>
            {t('add_a_list')}
          </Text>
          <QuestionHelper1416 text={t('question_helper_add_a_list')} />
        </RowFixed>
        <Row>
          <SearchInput
            type="text"
            id="list-add-input"
            placeholder="https:// or ipfs:// or ENS name"
            value={listUrlInput}
            onChange={handleInput}
          />
          <ButtonAdd onClick={handleAddList}>{t('add')}</ButtonAdd>
        </Row>
        {addError ? (
          <TYPE.error title={addError} style={{ textOverflow: 'ellipsis', overflow: 'hidden' }} error>
            {addError}
          </TYPE.error>
        ) : null}
      </PaddedColumn>
      {tempList && (
        <PaddedColumn style={{ paddingTop: 0 }}>
          <Card backgroundColor={theme.bg2} padding="12px 20px">
            <RowBetween>
              <RowFixed>
                {tempList.logoURI && <ListLogo logoURI={tempList.logoURI} size="40px" />}
                <AutoColumn gap="4px" style={{ marginLeft: '20px' }}>
                  <TYPE.body fontWeight={600}>{tempList.name}</TYPE.body>
                  <TYPE.main fontSize={'12px'}>{tempList.tokens.length} tokens</TYPE.main>
                </AutoColumn>
              </RowFixed>
              {isImported ? (
                <RowFixed>
                  <IconWrapper stroke={theme.text2} size="16px" marginRight={'10px'}>
                    <CheckCircle />
                  </IconWrapper>
                  <TYPE.body color={theme.text2}>Loaded</TYPE.body>
                </RowFixed>
              ) : (
                <ButtonPrimary
                  style={{ fontSize: '14px' }}
                  padding="6px 8px"
                  width="fit-content"
                  onClick={handleImport}
                >
                  Import
                </ButtonPrimary>
              )}
            </RowBetween>
          </Card>
        </PaddedColumn>
      )}
      <ListContainer>
        <AutoColumn gap="md">
          {sortedLists.map(listUrl => (
            <ListRow key={listUrl} listUrl={listUrl} />
          ))}
        </AutoColumn>
      </ListContainer>
      <SeparatorDark />
      <Footer>
        <ExternalLink href="https://tokenlists.org/" style={{ textDecoration: 'none' }}>
          <TYPE.main color={theme.text5Sone} textAlign={'center'}>
            {t('browse_lists')}
          </TYPE.main>
        </ExternalLink>
      </Footer>
    </Wrapper>
  )
}
