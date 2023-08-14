import { useState, useEffect } from "react";
import { useWeb3 } from "./components/connetWallet";
import StatCard from "./components/StatCard";
import CustomAppBar from "./components/Header";
import RewardClaimCard from "./components/RewardClaimCard";
import Footer from "./components/Footer";
import erc20ABI from "./contracts/erc20.json";
import rewardABI from "./contracts/reward.json";
import stakingABI from "./contracts/stakingABI.json";
import {
  calculateRewardOfAddress,
  getTokenExchangeRate,
} from "./Web3Helper.js";
import { useMediaQuery, useTheme } from "@mui/material";
import { Timer } from "./components/timer";
import HandsImage from "./assets/hands.png";
import globeImage from "./assets/globe-1.png";
import "./App.css";
import {
  GE_TOKEN_ADDRESS,
  BIT_TORRENT_TOKEN_ADDRESS,
  STAKING_ADDRESS,
  REWARD_CONTRACT_ADDRESS,
  PANCAKE_ROUTER_V2
} from "./constants";

function App() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { web3, connectMetamask, connectTrustWallet } = useWeb3();
  const [tokenContract, setTokenContract] = useState(null);
  const [BTTContract, setBTTContract] = useState(null);
  const [stakingContract, setStakingContract] = useState(null);
  const [contract, setContract] = useState(null);
  const [address, setAddress] = useState("");
  const [tokens, setTokens] = useState(0);
  const [totalRewards, setTotalRewards] = useState(0);
  const [unclaimedRewards, setUnclaimedRewards] = useState(0);
  const [GETokensPrice, setGETokensPrice] = useState(0);
  const [BitTorrentPrice, setBitTorrentTokensPrice] = useState(0);
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
            GE_TOKEN_ADDRESS,
          );

          const RewardContract = await new web3.eth.Contract(
            rewardABI,
            REWARD_CONTRACT_ADDRESS,
          );

          const stakingContract = await new web3.eth.Contract(
            stakingABI,
            STAKING_ADDRESS,
          );

          const tokens =
            (await tokenContract.methods.balanceOf(walletAddress[0]).call()) /
            10 ** 18;
          const BTTContract = await new web3.eth.Contract(
            erc20ABI,
            BIT_TORRENT_TOKEN_ADDRESS
          )
          setBTTContract(BTTContract);
          const totalRewards =
            (await BTTContract.methods
              .balanceOf(REWARD_CONTRACT_ADDRESS)
              .call()) /
            10 ** 18;

          setTokenContract(tokenContract);
          setStakingContract(stakingContract);
          setContract(RewardContract);
          console.log(RewardContract)
          setTokens(tokens.toFixed(2));

          setGETokensPrice(
            await getTokenExchangeRate(
              web3,
              PANCAKE_ROUTER_V2, //pancake routerv2 address
              GE_TOKEN_ADDRESS, //GE TEST Token
            ),
          );
          setBitTorrentTokensPrice(
            await getTokenExchangeRate(
              web3,
              PANCAKE_ROUTER_V2, //pancake routerv2 address
              BIT_TORRENT_TOKEN_ADDRESS, //GE TEST Token
            ),
          );
          const time = await RewardContract.methods.claimDeadline().call();
          setTime(time);
          setTotalRewards(totalRewards.toFixed(2));
          

          calculateRewardOfAddress(
            web3,
            walletAddress[0],
            tokenContract,
            BTTContract,
            RewardContract,
            setUnclaimedRewards,
            stakingContract,
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
        <div sx={{ textAlign: "center" }}>
          <Timer endTime={time} />
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
          GEtokensPrice={GETokensPrice}
          BTTPrice={BitTorrentPrice}
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


      <Footer />
    </>
  );
}

export default App;