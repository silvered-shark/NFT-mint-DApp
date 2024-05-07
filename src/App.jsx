import './styles/App.css';
import React, { useEffect, useState } from "react";
import bgdnft from './utils/bgdnft.json';
import bgdimg from './assets/bdg-tu-main.png';
import ethlogo from './assets/eth-logo.png';
import { useWeb3ModalProvider, useWeb3ModalAccount } from '@web3modal/ethers5/react'

const App = () => {
  const { address, chainId, isConnected } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();

  const CONTRACT_ADDRESS = "0xD958bC042f41602c0236E8006bAe54Cb2B6c744f";

  const ethers = require("ethers")

  const [currentAccount, setCurrentAccount] = useState("");

  const checkIfWalletIsConnected = async () => {
    if (!isConnected) {
      alert('Please connect your wallet')
    } else {
      setCurrentAccount(address);
      alert("Connected", address);
      setupEventListener();
    }
  }

  const connectWallet = async () => {
    try {
     if (isConnected) {
      setCurrentAccount(address);
      alert("Connected", address);
      setupEventListener();
     }
    } catch(error){
      console.log(error);
    }
  }

  const setupEventListener = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(walletProvider);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, bgdnft.abi, signer);

        // capture the event from the smart contract 
        // console.log and alert when the event is emitted
        connectedContract.on("MintedNft", (from, tokenId) => {
          console.log(from, tokenId.toNumber())
          alert(`Hey there! We've minted your NFT and sent it to your wallet. It may be blank right now. It can take a max of 10 min to show up on OpenSea. Here's the link: https://opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`)
        });

        console.log("Setup event listener!")

      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }

  const mintNFTFromContract = async () => {
    const mintPrice = ethers.utils.parseEther("0.0015");

    try {
      const { ethereum } = window;
  
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(walletProvider);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, bgdnft.abi, signer);
  
        console.log("Going to pop wallet now to pay gas...")
        let nftTxn = await connectedContract.mint({value: mintPrice});
  
        alert("Minting...please wait.")
        await nftTxn.wait();
        
        alert(`Mined, see transaction: https://etherscan.io/tx/${nftTxn.hash}`);
  
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      alert(error.error.message);
    }
  }

  function sliceWalletAddress(address) {
    // Check if address is a string and has a valid length (greater than or equal to 32)
    if (typeof address !== 'string' || address.length < 32) {
      return 'Invalid Address';
    }
    // Extract the first 5 characters
    const firstPart = address.slice(0, 6);
    // Extract the last 3 characters
    const lastPart = address.slice(-4);
    // Combine the parts with "..." in between
    return `${firstPart}...${lastPart}`;
  }

  // renders if we are not connected to any account
  const renderNotConnectedContainer = () => (
    <div className='walletConnect'>
      <w3m-button onClick={connectWallet}/>
    </div>
  );

  const renderMintButton = () => (
    <div className='btn-container'>
      <button onClick={mintNFTFromContract} className="cta-button connect-wallet-button">
        Mint NFT
      </button>
      <button onClick={()=> window.open("https://opensea.io/collection/0xD958bC042f41602c0236E8006bAe54Cb2B6c744f", "_blank")} className="cta-button connect-wallet-button">
        Show Collection
      </button>
    </div>
  );

  useEffect(() => {
    checkIfWalletIsConnected();
  })

  return (
    <div className="App">
      <div className="container">
        <div className="statusContainer">
          {currentAccount === "" ? (
            <p>Not Connected</p>
          ) : (
            <div className="connected">
              <img src={ethlogo} alt="eth logo" className="ethLogo"/>
              <p>{sliceWalletAddress(currentAccount)}</p>
            </div>
          )}
        </div>
        <div className="header-container">
          <p className="header gradient-text">Big Green Dildo NFT Collection</p>
          <div className="img-ctn">
            <img className="dildo-image" src={bgdimg} alt='Green dildo with smiley face showing thumbs up'/>
          </div>
          {!isConnected ? (
            renderNotConnectedContainer()
          ) : ( renderMintButton())}
          <p className="sub-text">
            BGD (Big Green Dildo), the legendary crypto token that's sticking it where the Sun doesn't shine in the SEC with the grace of a dog with two dicks.
          </p>
          <p className="sub-text">
            Born from the fiery depths of crypto Twitter (we don't like X) , BGD is not just a token; it's a movement, a statement, a digital dildo to the overreach of regulatory bodies like the SEC. In a world where suits and ties try to choke the life out of innovation with red butt plugs and fearmongering, BGD stands tall, proud, and erect, symbolizing the unyielding spirit ofthe crypto community. It's the rallying cry for every degen who's tired of being toldwhat they can and cannot do with their assets.
          </p>
          <p className="sub-text">
            BGD's creators, a band of perverts, launched this token with one mission: to prove that in the decentralized brothel of crypto, the community calls the shots, not some outdated institution. With a smart contract as tight as a newb and a liquidity pool deeperthan a wizards sleeve, BGD is not just surviving; it's thriving, slapping compliance fears away with the force of a thousand green candles.So, here's to BGD, proving that when it comes to crypto, the only permission we need is from the blockchain itself. Let's stick it to the SEC, one green dildo at a time.
          </p>
        </div>
      </div>
    </div>
  );
};

export default App;

