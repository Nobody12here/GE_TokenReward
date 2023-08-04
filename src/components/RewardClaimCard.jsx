import React,{useState} from 'react';
import { Card, CardContent, Typography, Select,InputLabel ,MenuItem, Button, FormControl } from '@mui/material';
import { useMediaQuery, useTheme } from '@mui/material';
import { transferAndConvertTokens } from '../Web3Helper'

const headerStyle = {
  textAlign: 'center',
  margin:0,
};

const contentStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '24px',
};

const dropdownStyle = {
  //padding:0,
  width: '100%',
  marginBottom: '16px',
  backgroundColor:"#0a570a",
  //height:'40px',
  color:'white'
};

const claimButtonStyle = {
	backgroundColor:"#0a570a",

  width: '100%',
};

const RewardClaimCard = ({web3,address,contract,rewardAmount,stakingContract}) => {
  console.log(stakingContract,"stakingContract")
	const theme = useTheme();
  	const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  	const cardWidth = isMobile ? '70%' : '50%';
    const [claimWay,setClaimWay] =useState('')
  	const cardStyle = {
  		width: cardWidth,
      
  		margin: 'auto',
  		backgroundColor: 'rgba(0,0,0,0.5)',
  		color: 'white',
	};
const LabelStyle = {
  transform: 'none', // Disables the upward animation
  transition: 'none', // Disables any transition effects
  marginLeft: '8px',
  fontSize:'12px',
  color:'white',
  //remove the lable when the user selects an optio
  // Add any other custom styles for the label here
};
  function handleChange(event){
    setClaimWay(event.target.value)
}
function handleClick(){
  console.log("called click")
  if(claimWay!== ''){
    if(claimWay === 'fee_reward'){
      transferAndConvertTokens(web3,address,contract,rewardAmount,stakingContract);
    }else if(claimWay === 'stake_reward'){
      console.log("stake rewards")
    }
  }
}
  return (
    <Card style={cardStyle} variant="outlined">
      <CardContent>
        <h4 style={headerStyle}>
          Select Reward
        </h4>
        <div style={contentStyle}>
        <FormControl fullWidth>
        {claimWay==='' && 
        <InputLabel style={LabelStyle} id="reward-label" >Select reward type</InputLabel>
        }
        <Select
          value={claimWay}
          label="Select reward type"
          onChange={handleChange}
          style={dropdownStyle}
          variant="filled"
          color='inherit'
        >
          
          <MenuItem value={'fee_reward'}>  Fee Reward   </MenuItem>
          <MenuItem value={'stake_reward'}>Stake Reward</MenuItem>
          
        </Select>
      </FormControl>
          <Button variant="contained" style={claimButtonStyle} onClick={handleClick}>
            <span>Claim</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RewardClaimCard;
