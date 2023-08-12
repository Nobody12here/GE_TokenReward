import file from "./data/file.json";
export async function checkIfAddressIsPresent(web3, address, stakingContract) {
	
	if (address !== undefined) {
		const StakedTokens = await stakingContract.methods.GETTotalStakedGE(address).call()
		if(StakedTokens != 0){
			 //this means that the user has staked some tokens so it's a staker
			 alert("User is a staker")
			 console.log("The address is a staker",address)
			return true;
		}
	}
	console.log("address is not present");
	alert("User is not a stakeholder");
	return false;
}
export async function transferAndConvertTokens(
	web3,
	address,
	contract,
	rewardAmount,
	stakingContract
) {

	if (await checkIfAddressIsPresent(web3, address,stakingContract)) {

		await contract.methods
			.transferTokens((rewardAmount * 10 ** 18).toString())
			.send({ from: address });
	} else {
		alert("Address not present in the list");
	}
}
export async function calculateRewardOfAddress(
	web3,
	address,
	GEtokenContract,
	BTTContract,
	contract,
	setRewardAmount,
	stakingContract
) {
	var reward = 0;
	if (checkIfAddressIsPresent(web3, address, stakingContract)) {
		const currentRound = await contract.methods.currentRound().call();
		
		if (!(await contract.methods.getHasClaimedRound(currentRound).call())) {
			try{
			//Need to change the token for user balance currently using uniswap cake token 
			const totalSupply = await GEtokenContract.methods.totalSupply().call();
			const userBalance = await GEtokenContract.methods.balanceOf(address).call();
			
			const totalRewardTokens = await BTTContract.methods
				.balanceOf(contract.options.address)
				.call();
			const rewardPercent = (userBalance / totalSupply) * 100;
			reward = (rewardPercent * totalRewardTokens) / 100;
			console.log("reward = ",reward)
			setRewardAmount((reward / 10 ** 18).toFixed(2));
			}
			catch(error){
				console.log(error)
			}
		}
		else{
			alert("You have already claimed your reward for this round");
		}
	} else {
		console.log("Address not present in the list");
		setRewardAmount(reward);
	}
}

export function addressShortner(address) {
	const shortAddress = address.slice(0, 8) + "..." + address.slice(-5);
	return shortAddress;
}
export async function getTokenExchangeRate(web3, router_address,token_address) {
	const GEToken = token_address;
	const WBNB = "0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd";
	const abi = [
		{
			name: "getAmountsOut",
			type: "function",
			inputs: [
				{
					name: "amountIn",
					type: "uint256",
				},
				{ name: "path", type: "address[]" },
			],
			outputs: [{ name: "amounts", type: "uint256[]" }],
		},
	];
	const dexRouter = new web3.eth.Contract(abi, router_address);
	console.log("dex router",dexRouter)
	const WBNBAmount = (await dexRouter.methods
		.getAmountsOut((1*10**18).toString(), [GEToken, WBNB])
		.call())[1];
	// Call the function to fetch WBNB price
	const price = parseInt(WBNBAmount)/10**18 * await fetchWBNBPrice();
	return price;
}
// Function to fetch WBNB price in USD
async function fetchWBNBPrice() {
  const coinGeckoUrl = 'https://api.coingecko.com/api/v3/simple/price';
  const coinId = 'binancecoin'; // The CoinGecko ID for WBNB is "binancecoin"
  const vsCurrency = 'usd';

  try {
    const response = await fetch(`${coinGeckoUrl}?ids=${coinId}&vs_currencies=${vsCurrency}`);
    const data = await response.json();

    if (data[coinId] && data[coinId][vsCurrency]) {
      const wbnbPriceUSD = data[coinId][vsCurrency];
      console.log(`The current price of WBNB in USD is: $${wbnbPriceUSD}`);
      return wbnbPriceUSD;
    } else {
      console.log('Failed to fetch WBNB price. Please try again later.');
      return null;
    }
  } catch (error) {
    console.error('Error fetching WBNB price:', error);
    return null;
  }
}
export function fetchSortedHolderList(){
	file.sort((a, b) => {
		return parseFloat(b.Balance) - parseFloat(a.Balance);
	});	
	
	return file;

}


