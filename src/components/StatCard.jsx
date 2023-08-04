import React from 'react';
import { Card, CardContent } from '@mui/material';
import { useMediaQuery, useTheme } from '@mui/material';

const StatCard = ({ tokens, totalRewards, unclaimedRewards,tokensPrice }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const cardWidth = isMobile ? '70%' : '50%';

  return (
    <Card variant="outlined" style={{ width: cardWidth,margin:'auto',height:'100%',marginTop:'1.5em',marginBottom:'1.5em', backgroundColor: 'rgba(0,0,0,0.5)', color: 'white' }}>
      <CardContent>
        <div style={{display: 'flex', justifyContent: 'space-between',fontSize:'12px'}}>
          <div>
          <h3>User Tokens:</h3>
          <p>Total Rewards:</p>
          <p>Unclaimed Rewards:</p>
          </div>
          <div>
          <h3>{tokens} GE ({(tokensPrice*tokens).toFixed(2)}$)</h3>
          <p>{totalRewards} BTT ({(tokensPrice*totalRewards).toFixed(2)}$)</p>
          <p>{unclaimedRewards}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
