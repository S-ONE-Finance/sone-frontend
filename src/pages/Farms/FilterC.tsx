import React, { useState, useRef } from 'react'
import styled from 'styled-components'
import iconArrowDown from '../../assets/images/icon-arrow-down.svg'
import { useOnClickOutside } from '../../hooks/useOnClickOutside'
import { PxToRem } from '../../utils/PxToRem'

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
  margin-bottom: ${PxToRem(18)};

  @media (min-width: 1024px) {
    flex: 1;
    padding: 0 ${PxToRem(15)};
  }

  @media (min-width: 1200px) {
    margin-top: ${PxToRem(52)};
    margin-bottom: 0;
    padding: 0;
    &:first-child {
      margin-right: ${PxToRem(80)};
    }
  }
`

const FilterLabel = styled.div`
  display: flex;
  align-items: center;
  flex-basis: ${PxToRem(145)};
  font-weight: 500;
  margin-right: ${PxToRem(14)};
  & > span {
    width: max-content;
    margin-left: ${PxToRem(5)};
    font-size: ${PxToRem(13)};
    color: ${({ theme }) => theme.text4Sone};
  }
  @media (min-width: 1024px) {
    flex-basis: unset;
    margin-right: ${PxToRem(10)};
    & > span {
      font-size: ${PxToRem(20)};
    }
  }
`
const FilterItemsWrap = styled.div`
  position: relative;
  width: 100%;
  font-size: ${PxToRem(13)};
  color: #4f4f4f;

  @media (min-width: 1200px) {
    font-size: ${PxToRem(20)};
  }
`

const FilterItemDefault = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  min-width: ${PxToRem(220)};
  color: #c9c9c9;
  padding: ${PxToRem(15)} ${PxToRem(10)};
`

const FilterItems = styled.div`
  position: absolute;
  width: 100%;
  top: ${PxToRem(-2)};
  right: 0;
  padding: ${PxToRem(15)};
  z-index: 1000;
  background: #f8f8f8;
  border-radius: ${PxToRem(31)};
  box-shadow: 0 0 ${PxToRem(7)} ${PxToRem(5)} rgba(79, 79, 79, 0.42);
`

const FilterItem = styled.div`
  padding: ${PxToRem(15)} ${PxToRem(10)};

  &:hover,
  &:active,
  &:focus {
    background: #f05359;
  }
`

const FilterSelected = styled.div`
  color: #4f4f4f;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: ${PxToRem(17)} ${PxToRem(23)};
  background: #efefef;
  border: 1px solid #dfdfdf;
  border-radius: ${PxToRem(38)};
  @media (min-width: 1200px) {
    width: ${PxToRem(315)};
  }
`
