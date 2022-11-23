import React from "react";
import Sidebar from "./Sidebar";
import Feed from "./Feed";
import Widgets from './Widgets';
import PostBox from "./PostBox";
import "./App.css";
import { useState, useEffect } from "react";


function App() {

  const [currentAccount, setCurrentAccount] = useState('');
  const [correctNetwork, setCorrectNetwork] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");

  // Calls Metamask to connect wallet on clicking Connect Wallet button
  const connectWallet = async () => {
    try {
      const { ethereum } = window

      if (!ethereum) {
        console.log('Metamask not detected')
        return
      }
      let chainId = await ethereum.request({ method: 'eth_chainId'})
      console.log('Connected to chain:' + chainId)

      const goerliChainId = '0x5'

      if (chainId !== goerliChainId) {
        alert('You are not connected to the Goerli Testnet!')
        return
      }

      const accounts = await ethereum.request({ method: 'eth_requestAccounts' })
      setWalletAddress(accounts[0]);

      console.log('Found account', accounts[0])
      setCurrentAccount(accounts[0])
    } catch (error) {
      console.log('Error connecting to metamask', error)
    }
  }

  // Checks if wallet is connected to the correct network
  const checkCorrectNetwork = async () => {
    const { ethereum } = window
    let chainId = await ethereum.request({ method: 'eth_chainId' })
    console.log('Connected to chain:' + chainId)

    const blockchainId = '0x5'

    if (chainId !== blockchainId) {
      setCorrectNetwork(false)
    } else {
      setCorrectNetwork(true)
    }
  }

  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    connectWallet();
    checkCorrectNetwork();
  });


  return (
    // BEM
    <div>
    {currentAccount === '' ? (
      <button
      className='page'
      onClick={connectWallet}
      >
      Connect Wallet
      </button>
      ) : correctNetwork ? (
        <div className="app">
          <Sidebar walletAddress={walletAddress} />
          <Feed />
          <Widgets />
        </div>
        
        
      ) : (
      <div className=''>
      <div>----------------------------------------</div>
      <div>Please connect to your Wallet address</div>
      <div>----------------------------------------</div>
      </div>
    )}
    </div>

  );
}

export default App;