import { ethers } from 'ethers'

export default function getCaseSensitiveAddress(address: string): string | undefined {
  try {
    return ethers.utils.getAddress(address.toLowerCase())
  } catch {
    return undefined
  }
}
