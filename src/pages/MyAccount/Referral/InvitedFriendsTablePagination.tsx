import React from 'react'
import styled from 'styled-components'
import Row from '../../../components/Row'
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'react-feather'

// "styled-components" version 5 trở lên mới hỗ trợ attr boolean.
const PaginationItem = styled.div<{ no_border?: 'yes' }>`
  font-size: 14px;
  height: 32px;
  width: 32px;
  display: flex;
  justify-content: center;

  align-items: center;
  color: ${({ theme }) => theme.text8Sone};
  border: ${({ theme, no_border }) => (no_border === 'yes' ? 'unset' : `1.5px solid ${theme.bg7Sone}`)};
  border-radius: 8px;
  cursor: ${({ no_border }) => (no_border === 'yes' ? 'normal' : 'pointer')};

  :hover,
  :focus {
    border: ${({ theme, no_border }) => (no_border === 'yes' ? 'unset' : `1.5px solid ${theme.red1Sone}`)};
    color: ${({ theme, no_border }) => !no_border && theme.red1Sone};

    > * {
      color: ${({ theme, no_border }) => !no_border && theme.red1Sone};
    }
  }
`

const PaginationLastItem = styled(PaginationItem)`
  width: auto;
  padding: 0 8px;
`

export default function InvitedFriendsTablePagination() {
  return (
    <Row gap="10px" justify="flex-end">
      <PaginationItem>
        <ChevronLeft size={18} />
      </PaginationItem>
      <PaginationItem>1</PaginationItem>
      <PaginationItem>2</PaginationItem>
      <PaginationItem>3</PaginationItem>
      <PaginationItem>4</PaginationItem>
      <PaginationItem>5</PaginationItem>
      <PaginationItem>6</PaginationItem>
      <PaginationItem no_border="yes">
        <MoreHorizontal size={18} />
      </PaginationItem>
      <PaginationItem>20</PaginationItem>
      <PaginationItem>
        <ChevronRight size={18} />
      </PaginationItem>
      <PaginationLastItem>10 / page</PaginationLastItem>
    </Row>
  )
}
