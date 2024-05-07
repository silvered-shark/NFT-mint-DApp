import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import App from './App';

import { createWeb3Modal, defaultConfig } from '@web3modal/ethers5/react'

// 1. Get projectId
const projectId = 'b5799ffa92098eced73b5efabb2c4ed5'

// 2. Set chains
const mainnet = {
  chainId: 1,
  name: 'Ethereum',
  currency: 'ETH',
  explorerUrl: 'https://etherscan.io',
  rpcUrl: 'https://cloudflare-eth.com'
}

const metadata = {
  name: 'Big Green Dildo',
  description: 'Big Green Dildo NFT Minting Site',
  url: 'https://biggreendildo.org',
  icons: ['']
}

const ethersConfig = defaultConfig({
  metadata
})

createWeb3Modal({
  ethersConfig,
  chains: [mainnet],
  projectId
})

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);