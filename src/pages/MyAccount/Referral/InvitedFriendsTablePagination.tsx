import React from 'react'
import styled from 'styled-components'
import Row from '../../../components/Row'
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'react-feather'
import { useIsUpToExtraSmall, useIsUpToSmall } from '../../../hooks/useWindowSize'

// "styled-components" version 5 trở lên mới hỗ trợ attr boolean.
const PaginationItem = styled.div<{ is_active?: 'yes'; no_border?: 'yes'; is_disabled?: 'yes' }>`
  font-size: 14px;
  height: 32px;
  width: 32px;
  display: flex;
  justify-content: center;
  user-select: none;

  align-items: center;
  color: ${({ theme, is_active }) => (is_active ? theme.red1Sone : theme.text8Sone)};
  border: ${({ theme, no_border, is_active, is_disabled }) =>
    is_disabled
      ? `1.5px solid ${theme.text8Sone}`
      : is_active
      ? `1.5px solid ${theme.red1Sone}`
      : no_border
      ? 'unset'
      : `1.5px solid ${theme.bg11Sone}`};
  border-radius: 8px;
  cursor: ${({ no_border, is_disabled }) => (is_disabled ? 'not-allowed' : no_border ? 'normal' : 'pointer')};

  :hover {
    border: ${({ theme, no_border, is_disabled }) =>
      is_disabled ? `1.5px solid ${theme.text8Sone}` : no_border ? 'unset' : `1.5px solid ${theme.red1Sone}`};
    color: ${({ theme, no_border, is_disabled }) => !is_disabled && !no_border && theme.red1Sone};

    > * {
      color: ${({ theme, no_border, is_disabled }) => !is_disabled && !no_border && theme.red1Sone};
    }
  }
`

const PaginationLastItem = styled(PaginationItem)`
  width: auto;
  padding: 0 8px;
`

export default function InvitedFriendsTablePagination({
  selectedPage,
  setSelectedPage,
  numberOfPages,
  limit,
  handleChangePaginationLimit
}: {
  selectedPage: number
  setSelectedPage: React.Dispatch<React.SetStateAction<number>>
  numberOfPages: number
  limit: number

  handleChangePaginationLimit: () => void
}) {
  const isUpToExtraSmall = useIsUpToExtraSmall()
  const isUpToSmall = useIsUpToSmall()

  if (numberOfPages === 0) return null

  const isPreviousButtonDisabled = selectedPage === 1
  const isNextButtonDisabled = selectedPage === numberOfPages
  const isShowMoreHorizontalLeft = selectedPage >= 5
  const isShowMoreHorizontalRight = selectedPage <= numberOfPages - 4

  let itemChain: Array<number> = []

  // sai logic tùm lum
  // - 3 + 3 thì ok nhưng design là +-2 cơ. phải sửa.
  itemChain = [selectedPage - 2, selectedPage - 1, selectedPage, selectedPage + 1, selectedPage + 2].filter(
    item => 1 <= item && item <= numberOfPages
  )
  if (selectedPage === 4) itemChain.unshift(1)
  if (selectedPage === numberOfPages - 3) itemChain.push(numberOfPages)
  const handlePreviousButtonClick = () => {
    if (isPreviousButtonDisabled) return
    setSelectedPage(prev => Math.max(1, prev - 1))
  }

  const handleNextButtonClick = () => {
    if (isNextButtonDisabled) return
    setSelectedPage(prev => Math.min(numberOfPages, prev + 1))
  }

  if (isUpToExtraSmall)
    return (
      <Row gap="10px" justify={isUpToSmall ? 'center' : 'flex-end'}>
        <PaginationItem is_disabled={isPreviousButtonDisabled ? 'yes' : undefined} onClick={handlePreviousButtonClick}>
          <ChevronLeft size={18} />
        </PaginationItem>
        <PaginationItem is_active="yes">{selectedPage}</PaginationItem>
        <PaginationItem is_disabled={isNextButtonDisabled ? 'yes' : undefined} onClick={handleNextButtonClick}>
          <ChevronRight size={18} />
        </PaginationItem>
        <PaginationLastItem onClick={handleChangePaginationLimit}>{limit} / page</PaginationLastItem>
      </Row>
    )

  return (
    <Row gap="10px" justify={isUpToSmall ? 'center' : 'flex-end'}>
      <PaginationItem is_disabled={isPreviousButtonDisabled ? 'yes' : undefined} onClick={handlePreviousButtonClick}>
        <ChevronLeft size={18} />
      </PaginationItem>
      {isShowMoreHorizontalLeft && (
        <>
          <PaginationItem is_active={selectedPage === 1 ? 'yes' : undefined} onClick={() => setSelectedPage(1)}>
            1
          </PaginationItem>
          <PaginationItem no_border="yes">
            <MoreHorizontal size={18} />
          </PaginationItem>
        </>
      )}
      {/* This list will never shuffle index, so key={index} is fine. */}
      {itemChain.map((item, index) => (
        <PaginationItem
          key={index}
          is_active={selectedPage === item ? 'yes' : undefined}
          onClick={() => setSelectedPage(item)}
        >
          {item}
        </PaginationItem>
      ))}
      {isShowMoreHorizontalRight && (
        <>
          <PaginationItem no_border="yes">
            <MoreHorizontal size={18} />
          </PaginationItem>
          <PaginationItem
            is_active={selectedPage === numberOfPages ? 'yes' : undefined}
            onClick={() => setSelectedPage(numberOfPages)}
          >
            {numberOfPages}
          </PaginationItem>
        </>
      )}
      <PaginationItem is_disabled={isNextButtonDisabled ? 'yes' : undefined} onClick={handleNextButtonClick}>
        <ChevronRight size={18} />
      </PaginationItem>
      <PaginationLastItem onClick={handleChangePaginationLimit}>{limit} / page</PaginationLastItem>
    </Row>
  )
}
