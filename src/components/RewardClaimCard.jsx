import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Select,
  InputLabel,
  MenuItem,
  Button,
  FormControl,
} from '@mui/material';
import { useMediaQuery, useTheme } from '@mui/material';
import { transferAndConvertTokens } from '../Web3Helper';

const headerStyle = {
  textAlign: 'center',
  margin: 0,
};

const contentStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '24px',
};

const dropdownStyle = {
  width: '100%',
  marginBottom: '16px',
  backgroundColor: '#0a570a',
  color: 'white',
};

const claimButtonStyle = {
  backgroundColor: '#0a570a',
  width: '100%',
};

const RewardClaimCard = ({ web3, address, contract, rewardAmount, stakingContract }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const cardWidth = isMobile ? '70%' : '50%';
  const [claimWay, setClaimWay] = useState('');
  const [selectedTier, setSelectedTier] = useState(''); // Added state for selected tier

  const cardStyle = {
    width: cardWidth,
    margin: 'auto',
    backgroundColor: 'rgba(0,0,0,0.5)',
    color: 'white',
  };

  const LabelStyle = {
    transform: 'none',
    transition: 'none',
    marginLeft: '8px',
    fontSize: '12px',
    color: 'white',
  };

  function handleChange(event) {
    setClaimWay(event.target.value);
    setSelectedTier(''); // Reset selected tier when changing claim way
  }

  function handleTierChange(event) {
    setSelectedTier(event.target.value);
  }

  function handleClick() {
    if (claimWay !== '') {
      if (claimWay === 'fee_reward') {
        transferAndConvertTokens(web3, address, contract, rewardAmount, stakingContract);
      } else if (claimWay === 'stake_reward') {
        if (selectedTier === 'tier1') {
          stakingContract.methods._RewardWithdrawal(0).send({from:address});
        } else if (selectedTier === 'tier2') {
          stakingContract.methods._RewardWithdrawal(1).send({from:address});
        } else if (selectedTier === 'tier3') {
          stakingContract.methods._RewardWithdrawal(2).send({from:address});
        } else {
          alert("Please select a tier and try again!")
          console.log('No tier selected');
        }
      }
    }
  }

  return (
    <Card style={cardStyle} variant="outlined">
      <CardContent>
        <h4 style={headerStyle}>Select Reward</h4>
        <div style={contentStyle}>
          <FormControl fullWidth>
            {claimWay === '' && (
              <InputLabel style={LabelStyle} id="reward-label">
                Select reward type
              </InputLabel>
            )}
            <Select
              value={claimWay}
              
              onChange={handleChange}
              style={dropdownStyle}
              variant="filled"
              color="inherit"
            >
              <MenuItem value={'fee_reward'}>Fee Reward</MenuItem>
              <MenuItem value={'stake_reward'}>Stake Reward</MenuItem>
            </Select>
          </FormControl>
          {claimWay === 'stake_reward' && (
            <FormControl fullWidth>
              <InputLabel style={LabelStyle} id="tier-label">
                Select tier
              </InputLabel>
              <Select
                value={selectedTier}
                label="Select tier"
                onChange={handleTierChange}
                style={dropdownStyle}
                variant="filled"
                color="inherit"
              >
                <MenuItem value={'tier1'}>Tier 1</MenuItem>
                <MenuItem value={'tier2'}>Tier 2</MenuItem>
                <MenuItem value={'tier3'}>Tier 3</MenuItem>
              </Select>
            </FormControl>
          )}
          <Button variant="contained" style={claimButtonStyle} onClick={handleClick}>
            <span>Claim</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RewardClaimCard;
