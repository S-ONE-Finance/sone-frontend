import { ChainId, Currency } from '@s-one-finance/sdk-core'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import Modal from '../Modal'
import { ExternalLink } from '../../theme'
import { Text } from 'rebass'
import { StyledCloseIcon } from '../../theme'
import Row, { RowBetween } from '../Row'
import { AlertTriangle, ArrowUpCircle } from 'react-feather'
import { ButtonPrimary } from '../Button'
import { AutoColumn, ColumnCenter } from '../Column'
import { getEtherscanLink } from '../../utils'
import { useActiveWeb3React } from '../../hooks'
import { useIsUpToExtraSmall } from '../../hooks/useWindowSize'
import SpinnerImage from '../../assets/svg/spinner.svg'
import { useHistory } from 'react-router-dom'
import useTheme from '../../hooks/useTheme'
import { TransactionType } from '../../state/transactions/types'
import AppVector from '../AppBodyTitleDescriptionSettings/AppVector'

const Wrapper = styled.div`
  width: 100%;
`
const Section = styled(AutoColumn)`
  padding: 30px 57px 25px;
  background-color: ${({ theme }) => theme.bg1Sone};

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    padding: 18px 22px 20px;
  `}
`

const BottomSection = styled(Section)`
  padding: 25px 57px 35px;
  border-top: ${({ theme }) => `1px solid ${theme.border3Sone}`};
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    padding: 20px 22px;
  `}
`

const ConfirmedIcon = styled(ColumnCenter)`
  padding: 30px 0;
`

const ModalTitle = styled.div`
  font-size: 28px;
  font-weight: 700;
  color: ${({ theme }) => theme.text1Sone};

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    font-size: 20px;
  `}
`

const AbsoluteVector = styled.div`
  position: absolute;
  top: 0;
  right: 2rem;
  width: 119.2px;
  height: 119.2px;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    width: 67.8px;
    height: 67.8px;
  `};
`

const Spinner = styled.img`
  width: 108px;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    width: 52px;
  `}
`

function ConfirmationPendingContent({ onDismiss, pendingText }: { onDismiss: () => void; pendingText: string }) {
  const { t } = useTranslation()
  return (
    <Wrapper>
      <Section>
        <RowBetween>
          <div />
          <StyledCloseIcon onClick={onDismiss} />
        </RowBetween>
        <ConfirmedIcon>
          <Spinner src={SpinnerImage} alt="spinner" />
        </ConfirmedIcon>
        <AutoColumn gap="20px" justify={'center'}>
          <Text fontWeight={700} fontSize={20}>
            {t('waiting_for_confirmation')}
          </Text>
          <AutoColumn gap="12px" justify={'center'}>
            <Text fontWeight={700} fontSize={16} color="" textAlign="center">
              {pendingText}
            </Text>
          </AutoColumn>
          <Text fontWeight={400} fontSize={16} color="#565A69" textAlign="center">
            {t('confirm_this_transaction_in_your_wallet')}
          </Text>
        </AutoColumn>
      </Section>
    </Wrapper>
  )
}

function TransactionSubmittedContent({
  onDismiss,
  chainId,
  hash,
  // Dùng để "Add UNI to MetaMask".
  currencyToAdd
}: {
  onDismiss: () => void
  hash: string | undefined
  chainId: ChainId
  currencyToAdd?: Currency | undefined
}) {
  const { t } = useTranslation()
  const isUpToExtraSmall = useIsUpToExtraSmall()
  const theme = useTheme()
  const history = useHistory()
  const showAddLiquidity = useMemo(() => history.location.pathname.includes('/swap'), [history.location.pathname])

  return (
    <Wrapper>
      <Section>
        <RowBetween>
          <div />
          <StyledCloseIcon onClick={onDismiss} />
        </RowBetween>
        <ConfirmedIcon>
          <ArrowUpCircle strokeWidth={1.5} size={90} color={theme.red1Sone} />
        </ConfirmedIcon>
        <AutoColumn gap="20px" justify={'center'}>
          <Text fontWeight={700} fontSize={isUpToExtraSmall ? 16 : 18}>
            {t('transaction_submitted')}
          </Text>
          {chainId && hash && (
            <ExternalLink href={getEtherscanLink(chainId, hash, 'transaction')}>
              <Text fontWeight={700} fontSize={16} color={theme.text5Sone}>
                {t('view_on_etherscan')}
              </Text>
            </ExternalLink>
          )}
          {showAddLiquidity && (
            <ButtonPrimary
              onClick={() => {
                onDismiss()
                history.push('/add')
              }}
              style={{ margin: '10px 0 0 0' }}
            >
              <Text fontWeight={700} fontSize={20}>
                {t('add_liquidity')}
              </Text>
            </ButtonPrimary>
          )}
        </AutoColumn>
      </Section>
    </Wrapper>
  )
}

export function ConfirmationModalContent({
  title,
  onDismiss,
  topContent,
  bottomContent,
  transactionType
}: {
  title: string
  onDismiss: () => void
  topContent: () => React.ReactNode
  bottomContent: () => React.ReactNode
  transactionType: TransactionType | undefined
}) {
  const isUpToExtraSmall = useIsUpToExtraSmall()

  return (
    <Wrapper>
      <Section>
        <RowBetween style={{ position: 'relative' }}>
          <AbsoluteVector>
            <AppVector transactionType={transactionType} size="119.2px" sizeMobile="67.8px" />
          </AbsoluteVector>
          <ModalTitle>{title}</ModalTitle>
          <StyledCloseIcon onClick={onDismiss} />
        </RowBetween>
        {topContent()}
      </Section>
      <BottomSection gap={isUpToExtraSmall ? '25px' : '35px'}>{bottomContent()}</BottomSection>
    </Wrapper>
  )
}

export function TransactionErrorContent({ message, onDismiss }: { message: string; onDismiss: () => void }) {
  const { t } = useTranslation()
  const theme = useTheme()
  return (
    <Wrapper>
      <Section>
        <Row justify={'flex-end'}>
          <StyledCloseIcon onClick={onDismiss} />
        </Row>
        <AutoColumn style={{ padding: '2rem 0' }} gap="24px" justify="center">
          <AlertTriangle color={theme.red1} style={{ strokeWidth: 1.5 }} size={64} />
          <Text fontWeight={500} fontSize={16} color={theme.red1} style={{ textAlign: 'center', width: '85%' }}>
            {message}
          </Text>
        </AutoColumn>
        <ButtonPrimary onClick={onDismiss}>{t('Dismiss')}</ButtonPrimary>
      </Section>
    </Wrapper>
  )
}

interface ConfirmationModalProps {
  isOpen: boolean
  onDismiss: () => void
  hash: string | undefined
  content: () => React.ReactNode
  attemptingTxn: boolean
  pendingText: string
  currencyToAdd?: Currency | undefined
}

export default function TransactionConfirmationModal({
  isOpen,
  onDismiss,
  attemptingTxn,
  hash,
  pendingText,
  content,
  currencyToAdd
}: ConfirmationModalProps) {
  const { chainId } = useActiveWeb3React()

  if (!chainId) return null

  return (
    // Nếu là modal pending hoặc submitted thì width là 462.
    <Modal isOpen={isOpen} onDismiss={onDismiss} maxHeight={90} maxWidth={attemptingTxn || hash ? 462 : undefined}>
      {attemptingTxn ? (
        <ConfirmationPendingContent onDismiss={onDismiss} pendingText={pendingText} />
      ) : hash ? (
        <TransactionSubmittedContent
          chainId={chainId}
          hash={hash}
          onDismiss={onDismiss}
          currencyToAdd={currencyToAdd}
        />
      ) : (
        content()
      )}
    </Modal>
  )
}
