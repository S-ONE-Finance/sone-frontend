import { ChainId, Currency, ETHER, WETH, Token } from '@s-one-finance/sdk-core'
import { PairState, usePair } from '../data/Reserves'
import { useActiveWeb3React } from './index'
import { SONE } from '../constants'

/**
 * Kiểm tra xem với cặp pair này thì có nhận được 0.05% SONE không.
 * Hook này dùng trong màn add liquidity.
 * https://vgate.vnext.vn/issues/53267
 * @param currencyA là ETH thì return true luôn, còn không thì kiểm tra.
 * @param currencyB là ETH thì return true luôn, còn không thì kiểm tra.
 * @return true
 */
export default function useCanRewardSone(currencyA?: Currency, currencyB?: Currency): boolean | undefined {
  const { chainId = ChainId.MAINNET } = useActiveWeb3React()
  const [AETHPairState, AETHPair] = usePair(currencyA, WETH[chainId])
  const [BETHPairState, BETHPair] = usePair(currencyB, WETH[chainId])
  const [ASONEPairState, ASONEPair] = usePair(currencyA, SONE[chainId])
  const [BSONEPairState, BSONEPair] = usePair(currencyB, SONE[chainId])

  if (currencyA === undefined || currencyB === undefined) return undefined

  const isExistAETH = AETHPairState === PairState.EXISTS && AETHPair !== null
  const isExistBETH = BETHPairState === PairState.EXISTS && BETHPair !== null
  const isExistASONE = ASONEPairState === PairState.EXISTS && ASONEPair !== null
  const isExistBSONE = BSONEPairState === PairState.EXISTS && BSONEPair !== null

  if (currencyA === ETHER) return isExistBETH
  if (currencyB === ETHER) return isExistAETH
  if ((currencyA as Token).equals(SONE[chainId])) return isExistBSONE
  if ((currencyB as Token).equals(SONE[chainId])) return isExistASONE

  return (isExistAETH || isExistASONE) && (isExistBETH || isExistBSONE)
}
