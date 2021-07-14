import React from 'react'

interface Filter {
  options: Option[]
  value: string
  title: string
  handleOnchange: () => void
}

interface Option {
  label: string
  value: string
}

const FilterC: React.FC<Filter> = function({ options, title, value, handleOnchange }): JSX.Element {
  return (
    <>
      <span>{title}</span>
      <select value={value} onChange={handleOnchange}>
        {options.map((option, opKey) => (
          <option key={opKey} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </>
  )
}

export default FilterC
