import { Trade } from '@s-one-finance/sdk-core'
import React, { Fragment, memo } from 'react'
import { ChevronRight } from 'react-feather'
import { Flex } from 'rebass'
import { TYPE } from '../../theme'
import CurrencyLogo from '../CurrencyLogo'
import useTheme from '../../hooks/useTheme'

export default memo(function SwapRoute({ trade }: { trade: Trade }) {
  const theme = useTheme()
  return (
    <Flex
      px="1rem"
      py="0.25rem"
      style={{ background: theme.f3f3f3, borderRadius: '10px' }}
      flexWrap="wrap"
      width="100%"
      justifyContent="space-evenly"
      alignItems="center"
    >
      {trade.route.path.map((token, i, path) => {
        const isLastItem: boolean = i === path.length - 1
        return (
          <Fragment key={i}>
            <Flex my="0.5rem" alignItems="center" style={{ flexShrink: 0 }}>
              <CurrencyLogo currency={token} size="1.5rem" />
              <TYPE.black fontSize={16} fontWeight={500} color={theme.textBlack} ml="0.5rem">
                {token.symbol}
              </TYPE.black>
            </Flex>
            {isLastItem ? null : <ChevronRight color={theme.text2} />}
          </Fragment>
        )
      })}
    </Flex>
  )
})
