import styled from 'styled-components'
import { Box } from 'rebass/styled-components'

const Row = styled(Box)<{
  width?: string
  align?: string
  justify?: string
  padding?: string
  border?: string
  borderRadius?: string
  gap?: string
  wrap?: string
}>`
  width: ${({ width }) => width ?? '100%'};
  display: flex;
  align-items: ${({ align }) => align ?? 'center'};
  justify-content: ${({ justify }) => justify ?? 'flex-start'};
  padding: ${({ padding }) => (padding ? padding : '0')};
  flex-wrap: ${({ wrap }) => wrap};
  border: ${({ border }) => border};
  border-radius: ${({ borderRadius }) => borderRadius};

  ${({ gap }) =>
    gap
      ? `
    > * + * {
      margin-left: ${gap} !important;
    }
  `
      : ''};
`

export const RowBetween = styled(Row)`
  justify-content: space-between;
`

export const RowFlat = styled.div`
  display: flex;
  align-items: flex-end;
`

export const AutoRow = styled(Row)`
  flex-wrap: wrap;
`

export const RowFixed = styled(Row)<{ gap?: string; justify?: string }>`
  width: fit-content;
`

export const RowFitContent = styled(Row)`
  width: fit-content;
`

export default Row
