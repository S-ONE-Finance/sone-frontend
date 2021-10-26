import React from 'react'
import styled from 'styled-components'

interface PageHeaderProps {
  icon: string
  title?: string
}

const PageHeader: React.FC<PageHeaderProps> = ({ icon, title }) => {
  return (
    <div>
      <StyledPageHeader>
        <StyledIcon>
          <img src={icon} alt="" />
        </StyledIcon>
        <StyledTitle>{title}</StyledTitle>
      </StyledPageHeader>
    </div>
  )
}

const StyledPageHeader = styled.div`
  align-items: center;
  box-sizing: border-box;
  flex-direction: column;
  padding-bottom: 10px;
  margin: 0 auto;
`

const StyledIcon = styled.span`
  font-size: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
`

const StyledTitle = styled.span`
  font-family: 'Kaushan Script', sans-serif;
  color: black;
  font-size: 36px;
  font-weight: 700;
  margin: 0;
  padding: 0;
`
export default PageHeader
