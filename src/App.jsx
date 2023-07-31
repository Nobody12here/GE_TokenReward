import { useState, useEffect } from "react";
import { useWeb3 } from "./components/connetWallet";
import StatCard from "./components/StatCard";
import CustomAppBar from "./components/Header";
import ParticleComponent from "./components/ParticleComponent";
import RewardClaimCard from "./components/RewardClaimCard";
import Footer from "./components/Footer"
import TokenHolderCard from "./components/TokenHolderCard"
import erc20ABI from "./contracts/erc20.json";
import rewardABI from "./contracts/reward.json";
import {calculateRewardOfAddress, getTokenExchangeRate,fetchSortedHolderList} from './Web3Helper.js'
import { useMediaQuery, useTheme } from '@mui/material';
import CoinImage from './assets/coin.png'
import './App.css'


function App() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { web3, connectMetamask, connectTrustWallet } = useWeb3();
  const [tokenContract, setTokenContract] = useState(null);
  const [contract, setContract] = useState(null);
  const [address, setAddress] = useState("");
  const [tokens,setTokens] = useState(0)
  const [totalRewards,setTotalRewards] = useState(0)
  const [unclaimedRewards,setUnclaimedRewards] = useState(0)
  const [tokensPrice,setTokensPrice] = useState(0)
  //Load the token contract and the reward smart contract when web3 is loaded
  useEffect(() => {
    async function loadData() {
      if (web3) {
        // Load token contract and wallet address
        try {
          const walletAddress = await web3.eth.getAccounts();
          setAddress(walletAddress[0]);
          const tokenContract = await new web3.eth.Contract(
            erc20ABI,
            "0xC0413e59e251AF96ce1c0e46A3820Ce57e03291C"
          );
          setTokenContract(tokenContract);
          const contract = await new web3.eth.Contract(
            rewardABI,
            "0xFb7BB8Be3777384760e6c20B58f44Ef360bB53ae"
          );
          setContract(contract);
          const tokens = (await tokenContract.methods.balanceOf(walletAddress[0]).call())/10**18
          setTokens(tokens.toFixed(2))
          const totalRewards = (await tokenContract.methods.balanceOf('0xFb7BB8Be3777384760e6c20B58f44Ef360bB53ae').call())/10**18
          setTokensPrice(await getTokenExchangeRate(web3,'0xd99d1c33f9fc3444f8101754abc46c52416550d1'))
          setTotalRewards(totalRewards.toFixed(2))
          fetchSortedHolderList();
          calculateRewardOfAddress(web3,walletAddress[0],tokenContract,contract,setUnclaimedRewards)
         } catch (error) {
          alert("Error while loading Data\nTry Again");
          console.log(error);
        } 
      }
    }
    loadData();
  }, [web3]);
  return (
    <>
      <CustomAppBar />
      <h2 className='bold-and-3d'>
        Decentralized GE Token...
      </h2>
      <p className='bold-and-3d'>
        <b>GE token dedicated to giving rewards upon token holding and staking.</b>
      </p>
       <div className="particle-container">
        <ParticleComponent className="ParticleComponent" />
        
      </div>
      <div className={isMobile ? 'div':'div2'}>


         <img src={CoinImage} style={{height:200}} className={isMobile ? 'mobileImage':'desktopImage'} alt='Coin'/>
        <StatCard tokens={tokens} tokensPrice={tokensPrice} totalRewards={totalRewards} unclaimedRewards={unclaimedRewards} />
      </div>
        <RewardClaimCard contract={contract} tokenContract={tokenContract} address={address} setUnclaimedRewards={setUnclaimedRewards} />
        <TokenHolderCard />
        
      <Footer/>
    </>
  );
}

export default App;