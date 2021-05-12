import React, { useCallback, useMemo, useState } from 'react'
import { ColumnCenter } from '../Column'
import CurrencyLogo from '../CurrencyLogo'
import { getFormatNumber } from '../../subgraph/utils/formatter'
import styled from 'styled-components'
import Row from '../Row'
import { ExternalLink } from '../../theme'
import Tooltip from '../Tooltip'

const TextChange = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.text7Sone};

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    font-size: 13px;
  `}
`

const CurrencyLogoContainer = styled(Row)`
  width: fit-content;
  margin-bottom: 11px;
`

const StyledExternalLink = styled(ExternalLink)`
  :focus,
  :active,
  :hover {
    text-decoration: none;
    outline: none;
  }
`

export default function WeeklyRankingItem({
  id,
  address0,
  address1,
  symbol0,
  symbol1,
  volume
}: {
  id?: string
  address0?: string
  address1?: string
  symbol0?: string
  symbol1?: string
  volume?: number
}) {
  const [show, setShow] = useState<boolean>(false)

  const open = useCallback(() => setShow(true), [setShow])
  const close = useCallback(() => setShow(false), [setShow])

  const isPairLoaded = useMemo(() => id?.length === 42, [id])

  return (
    <Tooltip text={isPairLoaded ? `${symbol0}-${symbol1}` : `--`} show={Boolean(isPairLoaded && show)} placement="top">
      {/* TODO: Sau này đổi thành link của sone info. */}
      <StyledExternalLink
        href={`https://v2.info.uniswap.org/pair/${id}`}
        style={{ pointerEvents: isPairLoaded ? 'auto' : 'none' }}
        onMouseEnter={open}
        onMouseLeave={close}
      >
        <ColumnCenter>
          <CurrencyLogoContainer>
            <CurrencyLogo address={address0} style={{ marginRight: '3px' }} />
            <CurrencyLogo address={address1} />
          </CurrencyLogoContainer>
          <TextChange>{getFormatNumber(volume || 0, 3)}</TextChange>
        </ColumnCenter>
      </StyledExternalLink>
    </Tooltip>
  )
}
