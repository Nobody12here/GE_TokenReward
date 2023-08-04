import React from 'react';
import { Card, CardContent, IconButton } from '@mui/material';
import { useMediaQuery, useTheme } from '@mui/material';
import { fetchSortedHolderList, addressShortner } from '../Web3Helper.js';
import { Button } from '@mui/material';

const TokenHolderCard = ({ tokens, totalRewards, unclaimedRewards, tokensPrice }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const cardWidth = isMobile ? '70%' : '50%';

  return (
    <Card
      variant="outlined"
      style={{
        width: cardWidth,
        margin: 'auto',
        marginTop: '1.5em',
        marginBottom: '1.5em',
        backgroundColor: 'rgba(0,0,0,0.5)',
        color: 'white',
      }}
    >
      <CardContent>
        <div style={{ textAlign: 'center' }}>
          <h3>Top 5 Holders</h3>
        </div>
        <div>
          {fetchSortedHolderList().map((holder, index) => {
            if (index < 5) {
              return (
                <div key={index}>
                  {index + 1}. {addressShortner(holder.HolderAddress)} -{' '}
                  {parseFloat(holder.Balance).toFixed(2)}
                </div>
              );
            }
          })}
        </div>
        <Button
          color="primary"
          onClick={() => {
            // Redirect to BscScan here
            window.location.href = 'https://bscscan.com/token/0x0d9028f9f14a8ca47b5d4e1c6ccfc7cb363ff4fd#balances'; // Replace this URL with the BscScan URL for the specific token
          }}
          style={{ marginTop: '1em', alignSelf: 'center' }}
          variant="contained"
        >
          More
        </Button>
      </CardContent>
    </Card>
  );
};

export default TokenHolderCard;
