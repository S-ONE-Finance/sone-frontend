import React from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import LoaderSone from '../LoaderSone'
import useNoPendingTxs from '../../hooks/useNoPendingTxs'

const PendingBox = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  width: 100%;
  align-items: center;
  user-select: none;
  background: ${({ theme }) => theme.bg1Sone};
  color: ${({ theme }) => theme.text3Sone};
  font-weight: 500;

  :hover,
  :focus {
    outline: none;
  }
`

const Text = styled.p`
  flex: 1 1 auto;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin: 0 0 0 0.5rem;
  font-size: 1rem;
  width: fit-content;
  font-weight: 500;
`

export default function PendingStatus() {
  const { t } = useTranslation()
  const noPendingTxs = useNoPendingTxs()

  if (noPendingTxs) {
    return (
      <PendingBox>
        <LoaderSone size="19px" />
        <Text>
          {noPendingTxs} {t('pending')}
        </Text>
      </PendingBox>
    )
  }

  return null
}
