import React from 'react'
import styled from 'styled-components'
import MyBalance from './MyBalance'

const Wrapper = styled.div`
  width: 773px;
  max-width: 100%;
`

const PageTitle = styled.h1`
  text-align: center;
  font-size: 20px;
  font-weight: 700;
  margin: 0 0 1em 0;
  display: none;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    display: block;
  `}
`

export default function MyAccount() {
  return (
    <Wrapper>
      <PageTitle>My Account</PageTitle>
      <MyBalance />
    </Wrapper>
  )
}
