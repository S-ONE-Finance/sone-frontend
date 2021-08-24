import React, { useState } from 'react'
import styled from 'styled-components'
import InvitedFriendsTablePagination from './InvitedFriendsTablePagination'
import useFriendList from './hooks/useFriendList'
import { ExternalLink } from '../../../theme'
import { shortenAddress } from '../../../utils'
import { useIsUpToExtraSmall } from '../../../hooks/useWindowSize'
import useNumberOfPages from './hooks/useNumberOfPages'
import { useTranslation } from 'react-i18next'
import { useActiveWeb3React } from '../../../hooks'

const Table = styled.table`
  border-collapse: collapse;
  box-shadow: 0 8px 17px rgba(0, 0, 0, 0.18);
  border-radius: 15px;
  overflow: hidden;
`

const TableHead = styled.thead`
  height: 75px;
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.text6Sone};

  ${({ theme }) => theme.mediaWidth.upToSmall`
    font-size: 18px;
  `}

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    font-size: 13px;
  `}
`

const TableHeadRow = styled.tr`
  height: inherit;
  font-size: inherit;
  font-weight: inherit;
  color: inherit;
  background-color: ${({ theme }) => theme.bg6Sone};
`

const TableRow = styled.tr`
  height: 50px;
  font-size: 16px;
  font-weight: 400;
  color: ${({ theme }) => theme.text4Sone};

  :nth-child(even) {
    background-color: ${({ theme }) => theme.bg6Sone};
  }

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    font-size: 13px;
  `}
`

const TableData = styled.td<{ align?: string; breakk?: string }>`
  text-align: ${({ align }) => (align ? align : 'left')};
  word-break: ${({ breakk }) => (breakk ? breakk : 'normal')};
  padding: 0 15px;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    text-align: center;
    padding: 0;
  `}
`

const TableHeading = styled.th<{ align?: string }>`
  text-align: ${({ align }) => (align ? align : 'left')};
  padding: 0 15px;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    text-align: center;
  `}
`

export default function InvitedFriendsTable() {
  const { t } = useTranslation()
  const { chainId } = useActiveWeb3React()
  const isUpToExtraSmall = useIsUpToExtraSmall()
  const [limit, setLimit] = useState<5 | 10 | 100>(5)
  const [selectedPage, setSelectedPage] = useState(1)

  const friendList = useFriendList(limit, selectedPage)

  const numberOfPages = useNumberOfPages(limit)

  const handleChangePaginationLimit = () => {
    setLimit(prev => (prev === 5 ? 10 : prev === 10 ? 100 : prev === 100 ? 5 : 5))
    setSelectedPage(1)
  }

  return (
    <>
      <Table>
        <TableHead>
          <TableHeadRow>
            <TableHeading align="center">#</TableHeading>
            <TableHeading>{t('address_of_friend')}</TableHeading>
            <TableHeading>{t('date')}</TableHeading>
            <TableHeading>{t('transaction')}</TableHeading>
          </TableHeadRow>
        </TableHead>
        <tbody>
          {friendList.map((friend, index) => (
            <TableRow key={friend.id}>
              <TableData align="center">{limit * (selectedPage - 1) + index + 1}</TableData>
              <TableData breakk="break-all">{shortenAddress(friend.address, isUpToExtraSmall ? 6 : 14)}</TableData>
              {/* Thằng Date chuẩn ISO thì cứ đẩy substr(0, 10) là ăn :D. */}
              <TableData>{friend.updatedAt.substr(0, 10)}</TableData>
              <TableData>
                <ExternalLink href={`https://${chainId === 1 ? '' : 'ropsten.'}etherscan.io/tx/` + friend.transaction}>
                  Etherscan
                </ExternalLink>
              </TableData>
            </TableRow>
          ))}
        </tbody>
      </Table>
      <InvitedFriendsTablePagination
        numberOfPages={numberOfPages}
        selectedPage={selectedPage}
        setSelectedPage={setSelectedPage}
        limit={limit}
        handleChangePaginationLimit={handleChangePaginationLimit}
      />
    </>
  )
}
