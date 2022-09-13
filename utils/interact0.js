const { createAlchemyWeb3 } = require('@alch/alchemy-web3')

const collId=0;
if(process.env.PRODUCTION==1){
  var hlink='https://therscan.io/tx/'
} 
else{
  var hlink='https://rinkeby.etherscan.io/tx/'
}

const web3 = createAlchemyWeb3(process.env.PUBLIC_ALCHEMY_RPC_URL)
import { config } from '../dapp.config'

const contract = require('../artifacts/contracts/contract.sol/Elevated_Yacht_Club.json')
const nftContract = new web3.eth.Contract(contract.abi, config.contractAddress)

//Will need this for Minted Counter
export const getTotalMinted = async () => {
  const totalMinted = await nftContract.methods.totalSupply(collId).call()
  return totalMinted
}

export const getMaxSupply = async () => {
  const maxSupply = await nftContract.methods.maxSupply(collId).call()
  return maxSupply
}

export const getMaxMintAmount = async () => {
  const mintAmount = await nftContract.methods.maxMintAmount().call()
  return mintAmount
}

export const getMintPrice = async () => {
  const Presale=await nftContract.methods.presale(collId).call()
  if(Presale) var mintPrice = await nftContract.methods.presalePrice(collId).call()
  else var mintPrice = await nftContract.methods.mintPrice(collId).call()
  
  return mintPrice
}



export const mintedOut = async () => {
  if(await getTotalMinted() >= await getMaxSupply()) {
    return {
      success: false,
      status: 'Minted Out!'
    }
  }
}

export const isPausedState = async () => {
  const paused = await nftContract.methods.paused(collId).call()
  //return paused
  if(paused) {
    return {
      success: false,
      status: 'Mint is Paused!'
    }
  }
}

export const StartMint = async (mintAmount) => {

  if (!window.ethereum.selectedAddress) {
    
    return {
      success: false,
      status: 'Please connect your wallet'
    }
  }

   //Already Claimed
   const claimed = await nftContract.methods.addressClaimedFounder(window.ethereum.selectedAddress).call()
   if (claimed >= 2) {
     return {
       success: false,
       status: 'Address Already Claimed!'
     }
   }
  //Bypassing Mint Limit
     if ((parseInt(claimed)+parseInt(mintAmount)) > 2) {
     return {
       success: false,
       status: 'Bypassing the Maximum Limit!'
     }
   }

   //get wallet
   const currWallet=window.ethereum.selectedAddress;

   //check Eth balance
    const ethBalance = await window.ethereum.request({ method: 'eth_getBalance', params: [currWallet, "latest" ] }).catch((err) =>{ console.log(err); })
    ethBalance=parseInt(ethBalance);

    if(ethBalance <= await getMintPrice()*mintAmount){
      return {
        success: false,
        status: 'Not enough Eth!'
      }
    }

  const nonce = await web3.eth.getTransactionCount(
    window.ethereum.selectedAddress,
    'latest'
  )
  
  // Set up our Ethereum transaction
  const tx = {
    to: config.contractAddress,
    from: window.ethereum.selectedAddress,
    value: parseInt(
      web3.utils.toWei(String((await getMintPrice()/10**18)*mintAmount), 'ether')
    ).toString(16), // hex
    gasLimit: null,
    maxFee: null,
    maxPriority: null,
    data: nftContract.methods
      .Mint(window.ethereum.selectedAddress,collId,mintAmount)
      .encodeABI(),
    nonce: nonce.toString(16)
  }

  try {
    const txHash = await window.ethereum.request({
      method: 'eth_sendTransaction',
      params: [tx]
    })

    return {
      success: true,
      status: (
        <a href={`${hlink}${txHash}`} target="_blank">
	  <p>Congratulations, you have minted {`${mintAmount}`} Founder Pass!</p>	  
          <p>Etherscan TXN: {`${hlink}${txHash}`}</p>
        </a>      )
    }
  } catch (error) {
    return {
      success: false,
      status: '😞 Something went wrong:' + error.message
    }
  }
}
