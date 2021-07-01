import React from 'react'
import styled from 'styled-components'
import InvitedFriendsTablePagination from './InvitedFriendsTablePagination'

const Table = styled.table`
  border-collapse: collapse;
  box-shadow: 0px 8px 17px rgba(0, 0, 0, 0.18);
  border-radius: 15px;
`

const TableHead = styled.thead`
  height: 75px;
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.text6Sone};
`

const TableHeadRow = styled.tr`
  height: inherit;
  font-size: inherit;
  font-weight: inherit;
  color: inherit;
`

const TableRow = styled.tr`
  height: 50px;
  font-size: 16px;
  font-weight: 400;
  color: ${({ theme }) => theme.text4Sone};

  :nth-child(odd) {
    background-color: ${({ theme }) => theme.bg6Sone};
  }
`

const TableData = styled.td<{ align?: string }>`
  text-align: ${({ align }) => (align ? align : 'left')};
  padding: 0 15px;
`

const TableHeading = styled.th<{ align?: string }>`
  text-align: ${({ align }) => (align ? align : 'left')};
  padding: 0 15px;
`

export default function InvitedFriendsTable() {
  return (
    <>
      <Table>
        <TableHead>
          <TableHeadRow>
            <TableHeading align="center">#</TableHeading>
            <TableHeading>Address of Friend</TableHeading>
            <TableHeading>Date</TableHeading>
            <TableHeading>Transaction</TableHeading>
          </TableHeadRow>
        </TableHead>
        <tbody>
          <TableRow>
            <TableData align="center">12</TableData>
            <TableData>0xa671E8dcf92b...2dDB</TableData>
            <TableData>31-12-2020</TableData>
            <TableData>Etherscan</TableData>
          </TableRow>
          <TableRow>
            <TableData align="center">12</TableData>
            <TableData>0xa671E8dcf92b...2dDB</TableData>
            <TableData>31-12-2020</TableData>
            <TableData>Etherscan</TableData>
          </TableRow>
          <TableRow>
            <TableData align="center">12</TableData>
            <TableData>0xa671E8dcf92b...2dDB</TableData>
            <TableData>31-12-2020</TableData>
            <TableData>Etherscan</TableData>
          </TableRow>
          <TableRow>
            <TableData align="center">12</TableData>
            <TableData>0xa671E8dcf92b...2dDB</TableData>
            <TableData>31-12-2020</TableData>
            <TableData>Etherscan</TableData>
          </TableRow>
        </tbody>
      </Table>
      <InvitedFriendsTablePagination />
    </>
  )
}
