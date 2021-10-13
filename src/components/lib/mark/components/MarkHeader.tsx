import React from 'react'
import styled from 'styled-components'
import { useGuideStepManager } from 'state/user/hooks'

import { handIcon } from './assets'
import { ChildrenProp } from './styled'

const MarkHeader = ({ children }: ChildrenProp) => {
  const [guideStep] = useGuideStepManager()

  return (
    <>
      <StyledStep1Header className="step-1">
        {children}
        {guideStep.step === 1 && (
          <StyledHandIcon>
            <img src={handIcon} alt="hand" />
          </StyledHandIcon>
        )}
      </StyledStep1Header>
    </>
  )
}

export default MarkHeader

const StyledStep1Header = styled.div`
  position: relative;
  z-index: 1001;
  pointer-events: none;
`

const StyledHandIcon = styled.div`
  position: absolute;
  left: 25px;
  top: 73px;

  ${({ theme }) => theme.mediaWidth.upToLarge`
    left: 120%;
    top: -55%;
    transform: rotate(-90deg);
    
    & > img {
      width: 60px;
    }
  `};

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    & > img {
      width: 50px;
    }
  `};
`
