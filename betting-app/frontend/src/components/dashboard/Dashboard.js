import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import SportsIcon from '@mui/icons-material/Sports';
import HistoryIcon from '@mui/icons-material/History';
import Wallet from './Wallet';

const Dashboard = ({ user }) => {
  const [updatedUser, setUpdatedUser] = useState(user);

  const updateUser = (newUserData) => {
    setUpdatedUser(newUserData);
    // Update localStorage to persist the balance change
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData) {
      userData.balance = newUserData.balance;
      localStorage.setItem('user', JSON.stringify(userData));
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        {/* Welcome Card */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h5" gutterBottom>
              Welcome back, {updatedUser?.username}!
            </Typography>
            <Typography variant="body1">
              Manage your bets and account from this dashboard.
            </Typography>
          </Paper>
        </Grid>
        
        {/* Balance Card */}
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              height: 200,
              bgcolor: 'primary.main',
              color: 'white'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <AccountBalanceWalletIcon sx={{ mr: 1 }} />
              <Typography variant="h6">Your Balance</Typography>
            </Box>
            <Typography variant="h3" component="div" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              ${updatedUser?.balance || '0.00'}
            </Typography>
            <Button 
              variant="contained" 
              color="secondary"
              disabled
              sx={{ mt: 2 }}
            >
              Deposit Funds
            </Button>
          </Paper>
        </Grid>
        
        {/* Quick Actions */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', height: 200 }}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<SportsIcon />}
                  component={RouterLink}
                  to="/"
                  sx={{ mb: 2 }}
                >
                  Browse Events
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<HistoryIcon />}
                  component={RouterLink}
                  to="/my-bets"
                >
                  View My Bets
                </Button>
              </Grid>
              <Grid item xs={12} sm={6}>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <SportsIcon />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Upcoming Events" 
                      secondary="Check out the latest events to bet on"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <HistoryIcon />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Betting History" 
                      secondary="View your past and active bets"
                    />
                  </ListItem>
                </List>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        
        {/* Wallet Component */}
        <Wallet user={updatedUser} updateUser={updateUser} />
        
        {/* Recent Activity */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom>
              Recent Activity
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
              Your recent betting activity will appear here.
            </Typography>
            <Button
              variant="contained"
              component={RouterLink}
              to="/my-bets"
              sx={{ alignSelf: 'flex-start', mt: 2 }}
            >
              View All Bets
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
