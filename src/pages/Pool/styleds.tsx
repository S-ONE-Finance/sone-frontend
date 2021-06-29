import { Text } from 'rebass'
import styled from 'styled-components'
import { darken } from 'polished'

export const StyledPadding = styled.div`
  position: relative;
  padding: 0 30px 35px;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    padding: 0 10px 25px;
  `}
`

export const ClickableText = styled(Text)<{ color?: string }>`
  color: ${({ color }) => color && color};

  :hover {
    cursor: pointer;
    ${({ color }) => color && `color: ${darken(0.1, color)}`};
  }
`
export const MaxButton = styled.button<{ width: string }>`
  padding: 0.5rem 1rem;
  background-color: ${({ theme }) => theme.primary5};
  border: 1px solid ${({ theme }) => theme.primary5};
  border-radius: 0.5rem;
  font-size: 1rem;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding: 0.25rem 0.5rem;
  `};
  font-weight: 500;
  cursor: pointer;
  margin: 0.25rem;
  overflow: hidden;
  color: ${({ theme }) => theme.primary1};
  :hover {
    border: 1px solid ${({ theme }) => theme.primary1};
  }
  :focus {
    border: 1px solid ${({ theme }) => theme.primary1};
    outline: none;
  }
`

export const Dots = styled.span`
  &::after {
    display: inline-block;
    animation: ellipsis 1.25s infinite;
    content: '.';
    width: 1em;
    text-align: left;
  }
  @keyframes ellipsis {
    0% {
      content: '.';
    }
    33% {
      content: '..';
    }
    66% {
      content: '...';
    }
  }
`
