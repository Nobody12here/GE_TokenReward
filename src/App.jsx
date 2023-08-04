import { useState, useEffect } from "react";
import { useWeb3 } from "./components/connetWallet";
import StatCard from "./components/StatCard";
import CustomAppBar from "./components/Header";
import ParticleComponent from "./components/ParticleComponent";
import RewardClaimCard from "./components/RewardClaimCard";
import Footer from "./components/Footer";
import TokenHolderCard from "./components/TokenHolderCard";
import erc20ABI from "./contracts/erc20.json";
import rewardABI from "./contracts/reward.json";
import stakingABI from "./contracts/stakingABI.json";
import {
  calculateRewardOfAddress,
  getTokenExchangeRate,
  fetchSortedHolderList,
} from "./Web3Helper.js";
import { useMediaQuery, useTheme } from "@mui/material";
import {Timer} from "./components/timer";
import HandsImage from "./assets/hands.png";
import globeImage from "./assets/globe-1.png";
import "./App.css";

function App() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { web3, connectMetamask, connectTrustWallet } = useWeb3();
  const [tokenContract, setTokenContract] = useState(null);
  const [stakingContract, setStakingContract] = useState(null);
  const [contract, setContract] = useState(null);
  const [address, setAddress] = useState("");
  const [tokens, setTokens] = useState(0);
  const [totalRewards, setTotalRewards] = useState(0);
  const [unclaimedRewards, setUnclaimedRewards] = useState(0);
  const [tokensPrice, setTokensPrice] = useState(0);
  const [isMetamaskConnected, setIsMetamaskConnected] = useState(false);
  const [time, setTime] = useState(0);
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
          const stakingContract = await new web3.eth.Contract(
            stakingABI,
            "0xaC377e9e8c2198709B97474eEf9F9163fA121A4c"
          );
          setStakingContract(stakingContract);
          const tokens =
            (await tokenContract.methods.balanceOf(walletAddress[0]).call()) /
            10 ** 18;
          setTokens(tokens.toFixed(2));
          const totalRewards =
            (await tokenContract.methods
              .balanceOf("0xFb7BB8Be3777384760e6c20B58f44Ef360bB53ae")
              .call()) /
            10 ** 18;
          setTokensPrice(
            await getTokenExchangeRate(
              web3,
              "0xd99d1c33f9fc3444f8101754abc46c52416550d1"
            )

          );
          setTime(1691132621)
          setTotalRewards(totalRewards.toFixed(2));
          fetchSortedHolderList();

          calculateRewardOfAddress(
            web3,
            walletAddress[0],
            tokenContract,
            contract,
            setUnclaimedRewards,
            stakingContract
          );
          //checking if wallet is connected
          if (walletAddress[0]) {
            setIsMetamaskConnected(true);
          }
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
      <CustomAppBar isMetamaskConnected={isMetamaskConnected} />
      <div>
        <h2 className="bold-and-3d">Decentralized GE Token...</h2>
        <p className="bold-and-3d">
          <b>
            GE token dedicated to giving rewards upon token holding and staking.
          </b>
        </p>
        <div sx={{textAlign:"center"}}>
          <Timer endTime={time}/>
        </div>
      </div>
      {/*<div className="particle-container">
        <ParticleComponent className="ParticleComponent" />
      </div>*/}

      <div className={isMobile ? "div" : "div2"}>
        <div className={isMobile ? "mobile-globe" : "desktop-globe"}>
          <img src={HandsImage} className="hands" alt="hands" />
          <img src={globeImage} className="globe" alt="globe" />
        </div>
        <StatCard
          tokens={tokens}
          tokensPrice={tokensPrice}
          totalRewards={totalRewards}
          unclaimedRewards={unclaimedRewards}
        />
      </div>
      <RewardClaimCard
        web3={web3}
        contract={contract}
        address={address}
        rewardAmount={unclaimedRewards}
        stakingContract={stakingContract}
      />
      <TokenHolderCard />

      <Footer />
    </>
  );
}

export default App;