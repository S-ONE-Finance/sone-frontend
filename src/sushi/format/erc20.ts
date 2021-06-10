import Web3 from 'web3'
import { Contract } from 'web3-eth-contract'
// @ts-ignore
import { AbiItem } from 'web3-utils'
import ERC20ABI from '../../constants/abi/ERC20.json'

export const getContract = (provider: any, address: string) => {
  const web3 = new Web3((provider as any))
  const contract = new web3.eth.Contract((ERC20ABI.abi as unknown) as AbiItem, address)
  return contract
}

export const getAllowance = async (
  lpContract: Contract,
  masterChefContract: Contract,
  account: string
): Promise<string> => {
  try {
    const allowance: string = await lpContract.methods.allowance(account, masterChefContract.options.address).call()
    return allowance
  } catch (e) {
    return '0'
  }
}

export const getAllowanceStaking = async (contract: Contract, owner: string, spender: string): Promise<string> => {
  try {
    const allowance: string = await contract.methods.allowance(owner, spender).call()
    return allowance
  } catch (e) {
    return '0'
  }
}

export const getBalance = async (provider: any, tokenAddress: string, userAddress: string): Promise<string> => {
  const lpContract = getContract(provider, tokenAddress)
  try {
    const balance: string = await lpContract.methods.balanceOf(userAddress).call()
    return balance
  } catch (e) {
    return '0'
  }
}
