import moment from 'moment';
import common from '@/assets/js/common'

import {getNetworkConfig} from '@/assets/js/config'

/**
 * Get the address from XinPay wallet
 * 
 * @param {*} vm - Component with web3 instance
 * @returns - Address from XinPay wallet
 */
async function getAddress(vm) {
    const accounts = await vm.$web3js.eth.getAccounts();
    return accounts[0]
}

/**
 * Retrieves the balance of the given address
 * 
 * @param {*} vm - Component with web3 instance
 * @param {*} addr - Address to get the XDC balance 
 * 
 * @returns - Balance converted XDC
 */
async function getBalance(vm, addr) {
  try {
    let balance = await vm.$web3js.eth.getBalance(addr);
    balance = vm.$web3js.utils.fromWei(balance, 'ether');
    balance = parseFloat(balance).toFixed(3)
    return balance
  }catch(err) {
    console.log(err)
    vm.rpcInProgress = false
    common.notifyError('Error processing request')
  }
}

/**
 * Retrieves the LINK token balance of the given address
 * 
 * @param {*} vm - Component with web3 instance
 * @param {*} addr - Address to get the LINK token balance 
 * 
 * @returns - LINK token Balance 
 */
async function getLINKBalance(vm, addr) {
  try {
    const linkContract = await new vm.$web3js.eth.Contract(getNetworkConfig(vm).LINK_TOKEN_ABI, getNetworkConfig(vm).LINK_TOKEN_CONTRACT_ADDR);
    let balance = await linkContract.methods.balanceOf(addr).call();
    balance = balance / (10**18)
    balance = parseFloat(balance).toFixed(3)
    return balance
  }catch(err) {
    console.log(err)
    vm.rpcInProgress = false
    // common.notifyError('Error processing request')
  }
   
}

/**
 * Method to prepare and retrieve Time locked Wallet factory's newTimeLockedContract method instance
 * 
 * @param {*} vm - Component with web3 instance
 * @param {*} config - Receivers and corresponding funds
 * 
 * @returns - Time locked Wallet factory's newTimeLockedContract method instance, which will be used to create a new contract/wallet and transfer XDC
 */
async function transferXDC(vm, config) {
  try {
    const tlwFactoryContract = await new vm.$web3js.eth.Contract(getNetworkConfig(vm).TLW_FACTORY_CONTRACT_ABI, getNetworkConfig(vm).TLW_FACTORY_CONTRACT_ADDR);
    let receivers = []
    let funds = []
    for(let target of config.targets) {
       receivers.push(target.receiver)
       /**
        * Convert the value in XDC to wei
        */
       funds.push(parseInt(vm.$web3js.utils.toWei(target.xdc+'', 'ether')))
    }
    return await tlwFactoryContract.methods.newTimeLockedContract(receivers, funds, getNetworkConfig(vm).ORACLE_CONTRACT_ADDR, vm.$web3js.utils.fromAscii(getNetworkConfig(vm).CHAIN_LINK_JOB_ID), getNetworkConfig(vm).LINK_TOKEN_CONTRACT_ADDR, getNetworkConfig(vm).CHAIN_LINK_FEE+'', config.duration);
  }catch(err) {
    console.log(err)
    vm.rpcInProgress = false
    common.notifyError('Error processing request')
  }
}

/**
 * Method to initiate Time Locked Contract, which inturn triggers the respective job in Chainlink oracle node
 * 
 * @param {*} vm - Component with web3 instance
 * @param {*} config - Lockup Duration 
 * 
 * @returns - Execution status 
 */
async function initiateTimeLockedWallet(vm, config) {
  try {
    const tlwContract = await new vm.$web3js.eth.Contract(getNetworkConfig(vm).TLW_CONTRACT_ABI, config.walletContractAddress);
    return await tlwContract.methods.initiateAlarm(config.duration, getNetworkConfig(vm).CHAIN_LINK_FEE+'');
  }catch(err) {
    console.log(err)
    vm.rpcInProgress = false
    common.notifyError('Error processing request')
  }
}

/**
 * 
 */
async function withdrawConract(vm, walletAddress) {
  try {
    const tlwContract = await new vm.$web3js.eth.Contract(getNetworkConfig(vm).TLW_CONTRACT_ABI, walletAddress);
    return await tlwContract.methods.withdraw();
  }catch(err) {
    console.log(err)
    vm.rpcInProgress = false
    common.notifyError('Error processing request')
  }
}

/**
 * 
 * Method to transfer LINK token to the contract. LINK token is required for Chainlink oracle node to execute the configured job.
 * Once the link token is transferred,  
 * 
 * @param {*} vm - Component with web3 instance
 * @param {*} config - Timelocked wallet contract address, LINK token value
 * 
 * @returns - Execution status 
 */
async function transferLinkToken(vm, config) {
  try {
    const tlwFactoryContract = await new vm.$web3js.eth.Contract(getNetworkConfig(vm).LINK_TOKEN_ABI, getNetworkConfig(vm).LINK_TOKEN_CONTRACT_ADDR);
    let link = config.link * (10**18)
    return await tlwFactoryContract.methods.transferAndCall(config.walletContractAddress, link+'', vm.$web3js.utils.asciiToHex('nodata'));
  }catch(err) {
    console.log(err)
    vm.rpcInProgress = false
    common.notifyError('Error processing request')
  }
}

/**
 * Retrieve all the Timelocked contracts created by the specified address
 * 
 * @param {*} vm - Component with web3 instance
 * @param {*} addr - Address of the contract creator
 * 
 * @returns - List of Timelocked contracts created by the specified address
 */
async function getWallets(vm, addr) {
  try{
    const tlwFactoryContract = await new vm.$web3js.eth.Contract(getNetworkConfig(vm).TLW_FACTORY_CONTRACT_ABI, getNetworkConfig(vm).TLW_FACTORY_CONTRACT_ADDR);
    return await tlwFactoryContract.methods.getWallets(addr).call({from: addr});
  }catch(err) {
    console.log(err)
    vm.rpcInProgress = false
    common.notifyError('Error processing request')
  }
}

/**
 * Function to wait till the block is created in the chain and retrieves the receipt 
 * 
 * @param {*} vm - Component with web3 instance
 * @param {*} hash - Transaction hash
 * @param {*} cb - Callback function to be called once the block is created 
 */
async function waitForReceipt(vm, hash, cb) {
    vm.$web3js.eth.getTransactionReceipt(hash, function (err, receipt) {
      if (err) {
        cb({
            error: err
        });
      }

      if (receipt !== null) {
        // Transaction went through
        if (cb) {
          cb(receipt);
        }
      } else {
        // Try again in 1 second
        window.setTimeout(function () {
          waitForReceipt(vm, hash, cb);
        }, 1000);
      }
    });
}


/**
 * Retrieves the Time Locked Contract details for the specified contract address
 * 
 * @param {*} vm - Component with web3 instance
 * @param {*} address - Address from which the call is being made
 * @param {*} walletAddress - Timelocked contract address
 * 
 * @returns -
 * - Receivers 
 * - Alloted XDC against each receiver
 * - Sender / Creator of Timelocked contract
 * - Contract creation date
 * - XDC release date
 * - Total XDC alloted to transfer
 * - Available LINK token balance
 * - Statis of contract. i.e. Indicating if the funds are released 
 */
async function getContractDetails(vm, address, walletAddress) {
  try {
    const tlwContract = await new vm.$web3js.eth.Contract(getNetworkConfig(vm).TLW_CONTRACT_ABI, walletAddress);
    let info = await tlwContract.methods.info().call({from: address})
    let linkBalance = info[8] / (10**18)
    // let offset = (new Date().getTimezoneOffset())

    let funds = []
    for(let fund of info[2]) {
        funds.push(vm.$web3js.utils.fromWei(fund, 'ether'))
    }

    let resp = {
      sender: info[0],
      receivers: info[1],
      funds: funds,
      unlockDate: ((info[3] && info[3] != '0') ? moment(info[3]*1000).format("DD-MMM-YYYY HH:mm:ss") : '-'),
      createdDate: moment(info[4]*1000).format("DD-MMM-YYYY HH:mm:ss"),
      xdc: vm.$web3js.utils.fromWei(info[5], 'ether'),
      link: linkBalance,
      isReleased: info[6],
      isLinkTransferred: info[7],
      isWithdrawn: info[9]
    }

    return resp
  }catch(err) {
    console.log(err)
    vm.rpcInProgress = false
    common.notifyError('Invalid time locked smart contract')
  }
}

export default {
  getAddress,
  getBalance,
  getLINKBalance,
  transferXDC,
  initiateTimeLockedWallet,
  transferLinkToken,
  getWallets,
  waitForReceipt,
  getContractDetails,
  withdrawConract
}