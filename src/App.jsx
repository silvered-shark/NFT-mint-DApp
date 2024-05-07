import './styles/App.css';
import React, { useEffect, useState } from "react";
import bgdnft from './utils/bgdnft.json';
import bgdimg from './assets/bdg-tu-main.png';

const App = () => {
  const CONTRACT_ADDRESS = "0xD958bC042f41602c0236E8006bAe54Cb2B6c744f";

  const ethers = require("ethers")

  const [currentAccount, setCurrentAccount] = useState("");

  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      alert("Make sure you have metamask!");
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
    }

    const accounts = await ethereum.request({ method: 'eth_accounts' });

    if (accounts.length !== 0) {
      const account = accounts[0];
      alert("Found an authorized account:", account);
      setCurrentAccount(account);
      setupEventListener();

    } else {
      alert("No authorized account found");
    }
  }

  async function switchNetwork(chainId) {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      });
    } catch (err) {
      // Handle errors
      if (err.code === 4902) {
        alert("Network not found in MetaMask, attempting to add...");
      } else {
        console.error("Failed to switch network:", err.message);
      }
    }
  }

  const connectWallet = async () => {
    const { ethereum } = window;

    if (!ethereum){
      alert("You do not have metamask. Get https//:metamask.io");
      return;
    }

    try {
      const  { ethereum } = window;

      if(!ethereum){
        alert("Get Metamask!");
        return;
      }

      const accounts = await ethereum.request({method: "eth_requestAccounts"});
      const account = accounts[0];
      setCurrentAccount(account);
      alert("Connected", account);
      setupEventListener();

      let chainId = await ethereum.request({ method: 'eth_chainId' });
      console.log("Connected to chain " + chainId);

      // String, hex code of the chainId of the Ethereum mainnet
      const ethMainChainId = "0x1"; 
      if (chainId !== ethMainChainId) {
        // Attempt to switch network
        await switchNetwork(parseInt(ethMainChainId, 16)); // Convert hex to number
        alert("Switched to Ethereum mainnet");
      }
    } catch(error){
      console.log(error);
    }
  }

  const setupEventListener = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
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
        const provider = new ethers.providers.Web3Provider(ethereum);
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

  // renders if we are not connected to any account
  const renderNotConnectedContainer = () => (
    <button className="cta-button connect-wallet-button" onClick={connectWallet}>
      Connect to Wallet
    </button>
  );

  const renderMintButton = () => (
    <div className='btn-container'>
      <button onClick={mintNFTFromContract} className="cta-button connect-wallet-button">
        Mint NFT
      </button>
      <button onClick={()=> window.open("https://opensea.io/collection/akaynft-mswlm7xcfx", "_blank")} className="cta-button connect-wallet-button">
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
        <div className="header-container">
          <p className="header gradient-text">Big Green Dildo NFT Collection</p>
          <div className="img-ctn">
            <img className="dildo-image" src={bgdimg} alt='Green dildo with smiley face showing thumbs up'/>
          </div>
          {currentAccount === "" ? (
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
