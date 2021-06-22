import React from 'react'
import styled from 'styled-components'
import MyBalance from './MyBalance'
import MyLiquidity from './MyLiquidity'
import { AutoColumn } from '../../components/Column'
import { useIsUpToExtraSmall } from '../../hooks/useWindowSize'
import { useActiveWeb3React } from '../../hooks'
import { Redirect } from 'react-router'

const Wrapper = styled.div`
  width: 773px;
  max-width: 100%;
  margin-top: 30px;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    margin-top: 0;
  `}
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
  const { account } = useActiveWeb3React()

  const isUpToExtraSmall = useIsUpToExtraSmall()
  const _2em5em = isUpToExtraSmall ? '2em' : '5em'

  if (account) {
    return (
      <Wrapper>
        <PageTitle>My Account</PageTitle>
        <AutoColumn gap={_2em5em}>
          <MyBalance />
          <MyLiquidity />
        </AutoColumn>
      </Wrapper>
    )
  }

  return <Redirect to={{ pathname: '/swap' }} />
}
