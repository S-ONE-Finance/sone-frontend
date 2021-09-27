import React, { memo, ReactNode } from 'react'
import styled from 'styled-components'
import { Text } from 'rebass'
import { useTranslation } from 'react-i18next'

import ChibiSrc from 'assets/svg/chibi_2.svg'

import useLanguage from 'hooks/useLanguage'
import { useIsUpToExtraSmall } from 'hooks/useWindowSize'

import { ButtonStake, ButtonUnstake } from 'pages/MyAccount/components'

import Modal from 'components/Modal'
import Column, { ColumnCenter } from '../Column'
import Row from 'components/Row'
import { Link } from 'react-router-dom'

const Chibi = styled.img`
  width: 150px;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    width: 109px;
  `}
`

const ModalContent = styled(Column)`
  padding: 40px 40px 60px;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    padding: 20px 40px 32px;
  `}
`

const TextDefault = styled(Text)`
  width: fit-content;
  color: ${({ theme }) => theme.text3Sone};
  font-size: 20px;
  font-weight: 400;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    font-size: 13px;
  `}
`

const TextPrimary = styled(TextDefault)`
  display: inline;
  color: ${({ theme }) => theme.red1Sone};
  font-weight: 700;
`

function RowDesktopColumnMobile({ gaps, children }: { gaps: [string, string]; children: ReactNode }) {
  const isUpToExtraSmall = useIsUpToExtraSmall()

  if (isUpToExtraSmall) {
    return <ColumnCenter gap={gaps[0]}>{children}</ColumnCenter>
  }

  return (
    <Row align="center" gap={gaps[1]}>
      {children}
    </Row>
  )
}

const ButtonUnstakeAnyway = styled(ButtonUnstake)`
  min-width: 240px;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    width: 100%;
  `}
`

const ButtonStayTuned = styled(ButtonStake)`
  min-width: 240px;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    width: 100%;
  `}
`

function I18Text({ amount = '0' }: { amount?: string }) {
  const [language] = useLanguage()
  const isUpToExtraSmall = useIsUpToExtraSmall()

  let content = null

  if (language?.startsWith('jp')) {
    content = (
      <>
        <TextDefault>現時点で受け取れる報酬は</TextDefault>
        <TextDefault>
          <TextPrimary>{amount} SONE</TextPrimary> のみです。
        </TextDefault>
        <TextDefault>運用を継続するとさらに多くの報酬を受け取れます。</TextDefault>
      </>
    )
  } else if (language?.startsWith('zh')) {
    content = (
      <>
        <TextDefault>如果现在解套，</TextDefault>
        <TextDefault>
          您只能获得<TextPrimary>{amount}SONE</TextPrimary>
        </TextDefault>
        <TextDefault>请继续质押，即可获得更多SONE！</TextDefault>
      </>
    )
  } else {
    content = (
      <>
        <TextDefault>
          You will only earn <TextPrimary>{amount} SONE</TextPrimary>
        </TextDefault>
        <TextDefault>if you unstake now.</TextDefault>
        <TextDefault>Stay tuned to get more SONE from us!</TextDefault>
      </>
    )
  }

  return <Column align={isUpToExtraSmall ? 'center' : undefined}>{content}</Column>
}

export default memo(function ModalUnstakeWarning({
  url,
  formattedAvailableSONE,
  isOpen,
  onDismiss
}: {
  url: string
  formattedAvailableSONE: string
  isOpen: boolean
  onDismiss: () => void
}) {
  const isUpToExtraSmall = useIsUpToExtraSmall()
  const { t } = useTranslation()

  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss}>
      <ModalContent gap={isUpToExtraSmall ? '23px' : '32px'}>
        <RowDesktopColumnMobile gaps={['22px', '27px']}>
          <Chibi src={ChibiSrc} alt="chibi" />
          <I18Text amount={formattedAvailableSONE} />
        </RowDesktopColumnMobile>
        <RowDesktopColumnMobile gaps={['15px', '20px']}>
          {isUpToExtraSmall ? (
            <>
              <ButtonStayTuned onClick={onDismiss}>{t('stay_tuned')}</ButtonStayTuned>
              <ButtonUnstakeAnyway as={Link} to={url}>
                {t('unstake_anyway')}
              </ButtonUnstakeAnyway>
            </>
          ) : (
            <>
              <ButtonUnstakeAnyway as={Link} to={url}>
                {t('unstake_anyway')}
              </ButtonUnstakeAnyway>
              <ButtonStayTuned onClick={onDismiss}>{t('stay_tuned')}</ButtonStayTuned>
            </>
          )}
        </RowDesktopColumnMobile>
      </ModalContent>
    </Modal>
  )
})
