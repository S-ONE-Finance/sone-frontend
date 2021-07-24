import React, { useState, useRef } from 'react'
import styled from 'styled-components'
import iconArrowDown from '../../../assets/images/icon-arrow-down.svg'
import { useOnClickOutside } from '../../../hooks/useOnClickOutside'

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
  margin-bottom: 18px;
  @media (min-width: 1024px) {
    flex: 1;
    padding: 0 15px;
  }
`

const FilterLabel = styled.div`
  display: flex;
  align-items: center;
  flex-basis: 130px;
  & > span {
    margin-left: 5px;
    font-size: 13px;
    color: ${({ theme }) => theme.text4Sone};
  }
  @media (min-width: 1200px) {
    & > span {
      font-size: 20px;
    }
  }
`
const FilterItemsWrap = styled.div`
  position: relative;
  width: 100%;
  font-size: 13px;
  color: #4f4f4f;
  @media (min-width: 1200px) {
    font-size: 20px;
  }
`
const FilterItemDefault = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  min-width: 220px;
  color: #c9c9c9;
  padding: 15px 10px;
`

const FilterItems = styled.div`
  position: absolute;
  width: 100%;
  top: -2px;
  right: 0px;
  padding: 15px;
  z-index: 1000;
  background: #f8f8f8;
  border-radius: 31px;
  box-shadow: 0px 0px 7px 5px rgba(79, 79, 79, 0.42);
`

const FilterItem = styled.div`
  padding: 15px 10px;
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
  padding: 18px 25px;
  background: #efefef;
  border: 1px solid #dfdfdf;
  border-radius: 38px;
`
