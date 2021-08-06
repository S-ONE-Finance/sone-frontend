import React, { useState } from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { useGuideStepManager } from '../../../../../state/user/hooks'

import { girlIcon, closeIcon } from '../assets'

const SwapStep7 = ({ screen }: { screen: string }) => {
  const { t } = useTranslation()
  const [guideStep, updateStepGuide] = useGuideStepManager()
  const [hide, setHide] = useState(false)

  const handleRestartGuide = () => {
    updateStepGuide({ ...guideStep, step: 1, oldStep: 0, isGuide: true, screen })
  }

  const handleSkip = () => {
    setHide(true)
    updateStepGuide({ ...guideStep, step: 1, oldStep: 0, isGuide: false, screen: '' })
  }

  return (
    <>
      {!hide && (
        <StyledStep7Wrapper>
          <StyledStep7>
            <StyledGirlIcon>
              <img src={girlIcon} alt="hand" />
            </StyledGirlIcon>
            <StyledStep7Content>
              <StyledStep7ButtonClose onClick={() => setHide(true)}>
                <img src={closeIcon} alt="close" />
              </StyledStep7ButtonClose>
              <StyledStep7Button onClick={handleRestartGuide}>{t('see_tutorial_now')}</StyledStep7Button>
              <StyledStep7Text onClick={handleSkip}>{t('dont_show_again')}</StyledStep7Text>
            </StyledStep7Content>
          </StyledStep7>
        </StyledStep7Wrapper>
      )}
    </>
  )
}

export default SwapStep7

const StyledStep7Wrapper = styled.div`
  position: absolute;
  bottom: 203px;
  left: 54px;
  ${({ theme }) => theme.mediaWidth.upToLarge`
    display: none
  `};
`
const StyledStep7 = styled.div`
  display: flex;
  align-items: flex-end;
`

const StyledGirlIcon = styled.div``

const StyledStep7Content = styled.div`
  background: #fef8f8;
  box-shadow: 0px 8px 17px rgb(0 0 0 / 18%);
  border-radius: 25px;
  padding: 32px 54px 15px;
  position: relative;
`

const StyledStep7Button = styled.div`
  padding: 18px 30px;
  font-size: 22px;
  color: #fff;
  font-weight: 700;
  background: #f05359;
  border-radius: 30px;
  cursor: pointer;
`

const StyledStep7ButtonClose = styled.div`
  position: absolute;
  right: 20px;
  top: 16px;
  cursor: pointer;
`

const StyledStep7Text = styled.div`
  font-size: 16px;
  color: #c9c9c9;
  margin-top: 18px;
  font-weight: 500;
  text-align: center;
  cursor: pointer;
`
