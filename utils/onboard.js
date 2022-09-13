import { init } from '@web3-onboard/react'
import injectedModule from '@web3-onboard/injected-wallets'
import walletConnectModule from '@web3-onboard/walletconnect'
//import coinbaseModule from '@web3-onboard/coinbase'
//import fortmaticModule from '@web3-onboard/fortmatic'

import UWAIcon from '../UWA'

if(process.env.PRODUCTION==1){
  var cid='0x1'
  var ctoken='ETH'
  var clabel='Ethereum Mainnet'
} 
else{
  var cid='0x4'
  var ctoken='rETH'
  var clabel='Ethereum Rinkeby Testnet'
} 
const RPC_URL = process.env.PUBLIC_ALCHEMY_RPC_URL

//const fortmatic = fortmaticModule({
//  apiKey: process.env.NEXT_PUBLIC_FORTMATIC_KEY
//})

const injected = injectedModule()
const walletConnect = walletConnectModule()
//const coinbaseWallet = coinbaseModule()

const initOnboard = init({
  wallets: [injected,walletConnect],
  chains: [
    {
      id: cid,
      token: ctoken,
      label: clabel,
      rpcUrl: RPC_URL
    }
    // {
    //   id: '0x89',
    //   token: 'MATIC',
    //   label: 'Matic Mainnet',
    //   rpcUrl: 'https://matic-mainnet.chainstacklabs.com'
    // }
  ],
  appMetadata: {
    name: 'Elevated Yacht Club',
    icon: UWAIcon,
    description: 'EYC',
    recommendedInjectedWallets: [
      { name: 'MetaMask', url: 'https://metamask.io' },
    ],
    agreement: {
      version: '1.0.0',
      termsUrl: 'https://www.blocknative.com/terms-conditions',
      privacyUrl: 'https://www.blocknative.com/privacy-policy'
    },
  }
})

export { initOnboard }
