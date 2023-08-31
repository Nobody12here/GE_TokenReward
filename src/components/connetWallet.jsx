import React, { createContext, useContext, useState } from 'react';
import Web3 from 'web3';

const Web3Context = createContext();

export function Web3Provider({ children }) {
  const [web3, setWeb3] = useState(null);

  const connectMetamask = async () => {
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      try {
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        if(!chainId){
          try{
            await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: '0x38' }],
            })}
          catch(error){
            console.log("Error in switching to Binance Smart Chain",error)
            }

      }
        await window.ethereum.request({ method: 'eth_chainId', params: [chainId] });
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        console.log(accounts)
        setWeb3(web3);
      
      } catch (error) {
        console.log('Error connecting to Metamask:', error);
      }
    } else {
      console.log('Install Metamask');
    }
  };

  const connectTrustWallet = async () => {
    if (window.trustwallet) {
      const web3 = new Web3(window.trustwallet);
      try {
        const accounts = await window.trustwallet.request({ method: 'eth_requestAccounts' });
        console.log(accounts)
        setWeb3(web3);
      } catch (error) {
        console.log('Error connecting to Trust Wallet:', error);
      }
    } else {
      console.log('Install Trust Wallet');
    }
  };

  return (
    <Web3Context.Provider value={{ web3, connectMetamask, connectTrustWallet }}>
      {children}
    </Web3Context.Provider>
  );
}

export function useWeb3() {
  return useContext(Web3Context);
}
