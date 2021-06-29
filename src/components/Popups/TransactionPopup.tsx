import React from 'react'
import { AlertCircle, CheckCircle } from 'react-feather'
import styled from 'styled-components'
import { useActiveWeb3React } from '../../hooks'
import { ExternalLink, TYPE } from '../../theme'
import { getEtherscanLink } from '../../utils'
import { AutoColumn } from '../Column'
import Row, { AutoRow } from '../Row'
import { TransactionType, TransactionSummary } from '../../state/transactions/types'
import StyledSummary from '../StyledSummary'
import { ButtonMainRed } from '../Web3Status'
import useTheme from '../../hooks/useTheme'

const RowNoFlex = styled(AutoRow)`
  flex-wrap: nowrap;
`

export default function TransactionPopup({
  hash,
  success,
  summary
}: {
  hash: string
  success?: boolean
  summary?: string | TransactionSummary
}) {
  const { chainId } = useActiveWeb3React()

  const theme = useTheme()

  return (
    <RowNoFlex>
      <div style={{ paddingRight: 16 }}>
        {success ? <CheckCircle color={theme.green1} size={24} /> : <AlertCircle color={theme.red1} size={24} />}
      </div>
      <AutoColumn gap="8px" style={{ width: '100%' }}>
        {/* <TYPE.body fontWeight={500}>{summary ?? 'Hash: ' + hash.slice(0, 8) + '...' + hash.slice(58, 65)}</TYPE.body> */}
        <TYPE.body fontWeight={500}>
          {typeof summary === 'string' || typeof summary === 'undefined' ? (
            summary ?? 'Hash: ' + hash.slice(0, 8) + '...' + hash.slice(58, 65)
          ) : (
            <StyledSummary summary={summary} />
          )}
        </TYPE.body>
        {chainId && (
          <ExternalLink href={getEtherscanLink(chainId, hash, 'transaction')}>View on Etherscan</ExternalLink>
        )}
        {success &&
          typeof summary !== 'string' &&
          (summary?.type === TransactionType.ADD_TWO_TOKENS || summary?.type === TransactionType.ADD_ONE_TOKEN) && (
            <Row justify={'flex-end'}>
              <ButtonMainRed>Stake now!</ButtonMainRed>
            </Row>
          )}
      </AutoColumn>
    </RowNoFlex>
  )
}
