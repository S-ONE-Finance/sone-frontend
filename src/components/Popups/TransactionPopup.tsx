import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { AlertCircle, CheckCircle } from 'react-feather'
import styled, { ThemeContext } from 'styled-components'
import { useActiveWeb3React } from '../../hooks'
import { ExternalLink, TYPE } from '../../theme'
import { getEtherscanLink } from '../../utils'
import { AutoColumn } from '../Column'
import Row, { AutoRow } from '../Row'
import { SummaryType, TransactionSummary } from '../../state/transactions/types'
import StyledSummary from '../StyledSummary'
import { ButtonMainRed } from '../Web3Status'

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
  // NOTE: Để đây chỉ để cho thằng StyledSummary nó được render lại khi thay đổi ngôn ngữ.
  useTranslation()
  const { chainId } = useActiveWeb3React()

  const theme = useContext(ThemeContext)

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
        {success && typeof summary !== 'string' && summary?.type === SummaryType.ADD && (
          <Row justify={'flex-end'}>
            <ButtonMainRed>Stake now!</ButtonMainRed>
          </Row>
        )}
      </AutoColumn>
    </RowNoFlex>
  )
}
