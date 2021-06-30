import BigNumber from 'bignumber.js'

BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80
})

const MaxUint256 = '999999999900000000000000000000000000000'

export const getMasterChefAddress = sushi => {
  return sushi && sushi.masterChefAddress
}
export const getSushiAddress = sushi => {
  return sushi && sushi.sushiAddress
}

export const getMasterChefContract = sushi => {
  return sushi && sushi.contracts && sushi.contracts.masterChef
}
export const getSushiContract = sushi => {
  return sushi && sushi.contracts && sushi.contracts.sushi
}
export const getFarms = sushi => {
  return sushi
    ? sushi.contracts.pools.map(
        ({
          pid,
          name,
          symbol,
          icon,
          icon2,
          description,
          tokenAddress,
          tokenSymbol,
          token2Symbol,
          token2Address,
          symbolShort,
          tokenContract,
          token2Contract,
          lpAddress,
          lpContract,
          protocal,
          iconProtocal,
          pairLink,
          addLiquidityLink
        }) => ({
          pid,
          id: symbol,
          name,
          lpToken: symbol,
          lpTokenAddress: lpAddress,
          lpContract,
          tokenAddress,
          token2Address,
          tokenSymbol,
          token2Symbol,
          token2Contract,
          symbol,
          symbolShort,
          tokenContract,
          earnToken: 'lua',
          earnTokenAddress: sushi.contracts.sushi.options.address,
          icon,
          icon2,
          description,
          protocal,
          iconProtocal,
          pairLink,
          addLiquidityLink
        })
      )
    : []
}

export const approve = async (lpContract, masterChefContract, account, chainId, addTransaction, { tokenName }) => {
  const gasLimit = chainId === 3 ? { from: account, gasLimit: '0x7A120' } : { from: account }
  return lpContract.methods
    .approve(masterChefContract.options.address, MaxUint256)
    .send(gasLimit)
    .on('transactionHash', function(hash) {
      addTransaction(
        {
          hash,
          confirmations: 0,
          from: account
        },
        {
          summary: 'Approve ' + tokenName
        }
      )
    })
    .on('receipt', function(receipt) {
      return receipt
    })
}

export const approveAddress = async (lpContract, address, account) => {
  return lpContract.methods.approve(address, MaxUint256).send({ from: account })
}

export const stake = async (masterChefContract, pid, amount, account, chainId, addTransaction, { tokenName }) => {
  const gasLimit = chainId === 3 ? { from: account, gasLimit: '0x7A120' } : { from: account }
  return masterChefContract.methods
    .deposit(pid, new BigNumber(amount).times(new BigNumber(10).pow(18)).toString())
    .send(gasLimit)
    .on('transactionHash', hash => {
      addTransaction(
        {
          hash,
          confirmations: 0,
          from: account
        },
        {
          summary: `Stake ${amount} ${tokenName}`
        }
      )
    })
}

export const unstake = async (masterChefContract, pid, amount, account, chainId) => {
  const gasLimit = chainId === 3 ? { from: account, gasLimit: '0x7A120' } : { from: account }
  return masterChefContract.methods
    .withdraw(pid, new BigNumber(amount).times(new BigNumber(10).pow(18)).toString())
    .send(gasLimit)
    .on('transactionHash', tx => {
      return tx.transactionHash
    })
}
export const harvest = async (masterChefContract, pid, account, chainId, addTransaction) => {
  const gasLimit = chainId === 3 ? { from: account, gasLimit: '0x7A120' } : { from: account }
  return masterChefContract.methods
    .claimReward(pid)
    .send(gasLimit)
    .on('transactionHash', tx => {
      return tx.transactionHash
    })
    .on('transactionHash', hash => {
      addTransaction(
        {
          hash,
          confirmations: 0,
          from: account
        },
        {
          summary: `Claim reward success`
        }
      )
    })
}

export const getStaked = async (masterChefContract, pid, account) => {
  try {
    const { amount } = await masterChefContract.methods.userInfo(pid, account).call({ from: account })
    return new BigNumber(amount)
  } catch {
    return new BigNumber(0)
  }
}

export const unlock = async (sushi, account) => {
  const lua = getSushiContract(sushi)
  return lua.methods
    .unlock()
    .send({ from: account })
    .on('transactionHash', tx => {
      return tx.transactionHash
    })
}
