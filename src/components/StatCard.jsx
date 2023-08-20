import React from 'react';
import { Card, CardContent } from '@mui/material';
import { useMediaQuery, useTheme } from '@mui/material';

const StatCard = ({ tokens, totalRewards, unclaimedRewards, GEtokensPrice, BTTPrice,claimPercentage }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const cardWidth = isMobile ? '90%' : '50%';
  const flexDirection = isMobile ? 'row' : 'row';
  const rewardPercent = (unclaimedRewards / totalRewards) * 100;
  return (
    <Card variant="outlined" style={{ width: cardWidth, margin: 'auto', height: '100%', marginTop: '1.5em', marginBottom: '1.5em', backgroundColor: 'rgba(0,0,0,0.5)', color: 'white' }}>
      <CardContent>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexDirection: flexDirection, fontSize: '12px' }}>
          <div>
            <h3>Total Staked Tokens:</h3>
            <h3>Total Rewards:</h3>
            <h3>Claim Rewards %:</h3>
            <h3>Unclaimed Rewards:</h3>
          </div>
          <div>
            <h3>{tokens} GE ({(GEtokensPrice * tokens).toFixed(6)}$)</h3>
            <h3>{totalRewards} BTT ({(BTTPrice * totalRewards).toFixed(6)}$)</h3>
            <h3>{claimPercentage}%</h3>
            <h3>{unclaimedRewards}</h3>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
