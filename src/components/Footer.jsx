import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  footer: {
    backgroundColor: '#000',
    color: '#fff',
    padding: theme.spacing(2),
    textAlign: 'center',
    position: 'sticky',
    bottom: 0,
    left: 0,
    right: 0,
    transform: 'translateY(100%)', // Move the footer below the screen by default
    transition: 'transform 0.3s', // Add a transition effect for a smoother appearance
  },
}));

const Footer = () => {
  const classes = useStyles();
  const [showFooter, setShowFooter] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Calculate the scroll position and the height of the viewport
      const scrollY = window.scrollY || window.pageYOffset;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // Check if the user has scrolled near the bottom of the page
      const scrollNearBottom = scrollY + windowHeight >= documentHeight - 150;

      // Show/hide the footer based on the scroll position
      setShowFooter(scrollNearBottom);
    };

    // Add scroll event listener when the component mounts
    window.addEventListener('scroll', handleScroll);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    // Use the showFooter state variable to conditionally render the footer
    showFooter && (
      <footer className={classes.footer}>
        <Typography variant="body1" align="center">
          &copy; {new Date().getFullYear()} Decentralized Green Energy Token
        </Typography>
      </footer>
    )
  );
};

export default Footer;
