import React from 'react'
import styled from 'styled-components'


const ModalActions: React.FC = ({ children }) => {
  const l = React.Children.toArray(children).length
  return (
    <StyledModalActions>
      {React.Children.map(children, (child, i) => (
        <>
          <StyledModalAction>{child}</StyledModalAction>
        </>
      ))}
    </StyledModalActions>
  )
}

const StyledModalActions = styled.div`
  align-items: center;
  background-color: ${props => props.theme.text2}00;
  display: flex;
  margin: 0;
  padding: 10px;
`

const StyledModalAction = styled.div`
  flex: 1;
`

export default ModalActions
