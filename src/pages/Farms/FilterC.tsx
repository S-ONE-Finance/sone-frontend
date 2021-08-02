import React, { useState, useRef } from 'react'
import styled from 'styled-components'
import iconArrowDown from '../../assets/images/icon-arrow-down.svg'
import { useOnClickOutside } from '../../hooks/useOnClickOutside'
import { pxToRem } from '../../utils/PxToRem'

interface Filter {
  options: Option[]
  value: string
  title: string
  icon: string
  handleOnchange: (e: any) => void
}

interface Option {
  label: string
  value: string
}

const FilterC: React.FC<Filter> = function({ options, icon, title, value, handleOnchange }): JSX.Element {
  const [toggleOpen, setToggleOpen] = useState(false)
  const node = useRef<HTMLDivElement>()

  const onClickItem = (value: string) => {
    setToggleOpen(!toggleOpen)
    handleOnchange(value)
    return
  }

  useOnClickOutside(node, toggleOpen ? () => setToggleOpen(!toggleOpen) : undefined)

  return (
    <>
      <WrapFilter ref={node as any}>
        <FilterLabel>
          <img src={icon} alt="icon" />
          <span>{title}:</span>
        </FilterLabel>
        <FilterItemsWrap>
          <FilterSelected onClick={() => setToggleOpen(!toggleOpen)}>
            {value} <img src={iconArrowDown} alt="icon-arrow-down" />
          </FilterSelected>
          {toggleOpen && (
            <FilterItems>
              <FilterItemDefault>
                {title}
                <img src={iconArrowDown} alt="icon-arrow-down" />
              </FilterItemDefault>
              {options.map((option, opKey) => (
                <FilterItem key={opKey} onClick={() => onClickItem(option.value)}>
                  {option.label}
                </FilterItem>
              ))}
            </FilterItems>
          )}
        </FilterItemsWrap>
      </WrapFilter>
    </>
  )
}

export default FilterC

const WrapFilter = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: ${pxToRem(52)};
  &:first-child {
    margin-right: ${pxToRem(80)};
    ${({ theme }) => theme.mediaWidth.upToMedium`
      margin-right: 0;
      margin-bottom: ${pxToRem(18)};
    `}
  }

  ${({ theme }) => theme.mediaWidth.upToMedium`
    width: 100%;
    margin-top: 0;
  `}
`

const FilterLabel = styled.div`
  display: flex;
  align-items: center;
  font-weight: 500;
  margin-right: ${pxToRem(10)};

  & > span {
    width: max-content;
    margin-left: ${pxToRem(5)};
    font-size: ${pxToRem(20)};
    color: ${({ theme }) => theme.text4Sone};
    ${({ theme }) => theme.mediaWidth.upToMedium`
      font-size: ${pxToRem(13)};
    `}
  }

  ${({ theme }) => theme.mediaWidth.upToMedium`
    flex-basis: ${pxToRem(135)};
    margin-right: ${pxToRem(14)};
  `}
`
const FilterItemsWrap = styled.div`
  position: relative;
  font-size: ${pxToRem(20)};
  color: #4f4f4f;
  font-weight: 500;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    width: 100%;
    font-size: ${pxToRem(13)};
  `}
`

const FilterItemDefault = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  min-width: ${pxToRem(200)};
  color: #c9c9c9;
  padding: ${pxToRem(15)} ${pxToRem(10)};
`

const FilterItems = styled.div`
  position: absolute;
  width: 100%;
  max-width: ${pxToRem(315)};
  top: ${pxToRem(-2)};
  padding: ${pxToRem(15)};
  z-index: 1000;
  background: #f8f8f8;
  border-radius: ${pxToRem(31)};
  box-shadow: 0 0 ${pxToRem(7)} ${pxToRem(5)} rgba(79, 79, 79, 0.42);

  ${({ theme }) => theme.mediaWidth.upToMedium`
    max-width: unset;
  `}
`

const FilterItem = styled.div`
  padding: ${pxToRem(15)} ${pxToRem(10)};

  &:hover,
  &:active,
  &:focus {
    background: #f05359;
  }
`

const FilterSelected = styled.div`
  color: #4f4f4f;
  display: flex;
  font-weight: 500;
  align-items: center;
  justify-content: space-between;
  width: ${pxToRem(315)};
  padding: ${pxToRem(17)} ${pxToRem(23)};
  background: #efefef;
  border: 1px solid #dfdfdf;
  border-radius: ${pxToRem(38)};
  ${({ theme }) => theme.mediaWidth.upToMedium`
    width: 100%;
  `}
`
