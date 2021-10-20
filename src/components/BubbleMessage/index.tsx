import React, { Dispatch, memo, SetStateAction } from 'react'
import Row from 'components/Row'
import styled from 'styled-components'
import ChibiSvg from 'assets/svg/chibi_1.svg'
import { Check } from 'react-feather'
import { StyledCloseIcon } from '../../theme'
import { useIsUpToExtraSmall } from '../../hooks/useWindowSize'
import { Trans, useTranslation } from 'react-i18next'

const Bubble = styled.div`
  position: relative;
  border-radius: 17px;
  flex: 1;
  background-color: #faeded;
  padding: 24px;
  margin-bottom: 25px;
  box-shadow: 0 8px 28px rgb(0 0 0 / 20%);

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    padding: 12px;
  `};
`

const BubbleText = styled.div`
  font-size: 20px;
  font-weight: 400;
  color: #767676;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    font-size: 13px;
  `}
`

const BubbleTextHighlight = styled(BubbleText)`
  display: inline;
  color: ${({ theme }) => theme.red1Sone};
  font-weight: 700;
`

export const Chibi = styled.img`
  width: 104px;
  align-self: flex-end;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    width: 69px;
  `}
`

const CheckIcon = styled(Check)<{ size: string }>`
  min-width: ${({ size }) => size};
  min-height: ${({ size }) => size};
  background: ${({ theme }) => theme.text5Sone};
  padding: 6px;
  border-radius: 50%;
  stroke-width: 3.5;
`

const TriangleWrapper = styled.div<{ size: number }>`
  position: absolute;
  bottom: ${({ size }) => `-${size / 7.5}px`};
  right: ${({ size }) => `-${size / 7.5}px`};
`

// https://stackoverflow.com/questions/14446677/how-to-make-3-corner-rounded-triangle-in-css
const Triangle = styled.div<{ size: string }>`
  transform: rotate(75deg) skewX(-30deg) scale(1, 0.866);
  position: relative;
  background-color: #faeded;
  text-align: left;

  &,
  ::before,
  ::after {
    width: ${({ size }) => size};
    height: ${({ size }) => size};
    border-top-right-radius: 30%;
  }

  ::before,
  ::after {
    content: '';
    position: absolute;
    background-color: inherit;
  }

  ::before {
    transform: rotate(-135deg) skewX(-45deg) scale(1.414, 0.707) translate(0, -50%);
  }

  ::after {
    transform: rotate(135deg) skewY(-45deg) scale(0.707, 1.414) translate(50%);
  }
`

export default memo(function BubbleMessage({
  setShow,
  bonus
}: {
  setShow: Dispatch<SetStateAction<boolean>>
  bonus: any
}) {
  const isUpToExtraSmall = useIsUpToExtraSmall()
  // Trigger re-render "You will get..."
  useTranslation()

  return (
    <Row gap={isUpToExtraSmall ? '10px' : '20px'}>
      <Bubble>
        <Row gap={isUpToExtraSmall ? '8px' : '16px'}>
          <CheckIcon size={isUpToExtraSmall ? '24px' : '32px'} color="#ffffff" />
          <BubbleText>
            <Trans
              i18nKey="you_will_get_x123_sone_during_this_period"
              values={{ amount: bonus }}
              components={[<BubbleTextHighlight key="1" />]}
            />
          </BubbleText>
          <StyledCloseIcon
            size="16px"
            sizeMobile="13px"
            color="#767676"
            style={{ alignSelf: 'flex-start' }}
            onClick={() => setShow(false)}
          />
        </Row>
        <TriangleWrapper size={20}>
          <Triangle size="20px" />
        </TriangleWrapper>
      </Bubble>
      <Chibi src={ChibiSvg} alt="chibi" />
    </Row>
  )
})
