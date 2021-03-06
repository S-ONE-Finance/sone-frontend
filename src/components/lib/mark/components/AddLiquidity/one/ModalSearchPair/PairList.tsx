import { Pair } from '@s-one-finance/sdk-core'
import React, { CSSProperties, MutableRefObject, useCallback } from 'react'
import { FixedSizeList } from 'react-window'
import { Text } from 'rebass'
import Column from '../../../../../../Column'
import { MenuItem } from '../../../../../../SearchModal/styleds'
import CurrencyLogoDouble from 'components/CurrencyLogoDouble'
import { unwrappedToken } from 'utils/wrappedCurrency'
import { useDarkModeManager } from '../../../../../../../state/user/hooks'

function pairKey(pair: Pair): string {
  // This should be unique!
  return Pair.getAddress(pair.token0, pair.token1)
}

function PairRow({
  pair,
  onSelect,
  isSelected,
  style
}: {
  pair: Pair
  onSelect: () => void
  isSelected: boolean
  style: CSSProperties
}) {
  const key = pairKey(pair)
  const currency0 = unwrappedToken(pair.token0)
  const currency1 = unwrappedToken(pair.token1)
  const [darkMode] = useDarkModeManager()

  if (key === '0xDA3A20aaD0C34fA742BD9813d45Bbf67c787aE0b') {
    style = { ...style, zIndex: 1001, backgroundColor: darkMode ? '#888' : '#fff' }
  } else {
    style = { ...style, zIndex: 1001, backgroundColor: 'transperent', opacity: 0.5 }
  }

  return (
    <>
      <MenuItem
        style={{ ...style }}
        className={`token-item-${key}`}
        onClick={() => (isSelected ? null : onSelect())}
        disabled={isSelected}
      >
        <CurrencyLogoDouble currency0={currency0} currency1={currency1} size={24} />
        <Column>
          <Text fontWeight={500}>
            {currency0.symbol} - {currency1.symbol}
          </Text>
        </Column>
      </MenuItem>
    </>
  )
}

type PairListProps = {
  height: number
  pairs: Pair[]
  selectedPair?: Pair | null
  onPairSelect: (pair: Pair) => void
  fixedListRef?: MutableRefObject<FixedSizeList | undefined>
}

export default function PairList({ height, pairs, selectedPair, onPairSelect, fixedListRef }: PairListProps) {
  const Row = useCallback(
    ({ data, index, style }) => {
      const pair: Pair = data[index]
      const isSelected = Boolean(
        selectedPair &&
          Pair.getAddress(selectedPair.token0, selectedPair.token1) === Pair.getAddress(pair.token0, pair.token1)
      )
      const handleSelect = () => onPairSelect(pair)

      return <PairRow style={style} pair={pair} isSelected={isSelected} onSelect={handleSelect} />
    },
    [selectedPair, onPairSelect]
  )

  const itemKey = useCallback((index: number, data: any) => pairKey(data[index]), [])

  return (
    <FixedSizeList
      height={height}
      ref={fixedListRef as any}
      width="100%"
      itemData={pairs}
      itemCount={pairs.length}
      itemSize={56}
      itemKey={itemKey}
    >
      {Row}
    </FixedSizeList>
  )
}
