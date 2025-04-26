import React, { useState, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Alert,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Chip
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import axios from 'axios';

const API_URL = 'http://localhost/betting-app/api';

const EventDetails = ({ isAuthenticated, user }) => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [betAmount, setBetAmount] = useState('');
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [openBetDialog, setOpenBetDialog] = useState(false);
  const [placingBet, setPlacingBet] = useState(false);
  const [betSuccess, setBetSuccess] = useState(false);
  const [betError, setBetError] = useState('');

  useEffect(() => {
    fetchEventDetails();
  }, [id]);

  const fetchEventDetails = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/events.php?id=${id}`);
      if (res.data.success) {
        setEvent(res.data.data);
      } else {
        setError(res.data.message || 'Failed to fetch event details');
      }
    } catch (err) {
      setError('Server error. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBetClick = (participant) => {
    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      return;
    }
    setSelectedParticipant(participant);
    setBetAmount('');
    setBetError('');
    setOpenBetDialog(true);
  };

  const handleCloseBetDialog = () => {
    setOpenBetDialog(false);
  };

  const handleBetAmountChange = (e) => {
    // Only allow numbers and decimals
    const value = e.target.value;
    if (value === '' || /^\d+(\.\d{0,2})?$/.test(value)) {
      setBetAmount(value);
    }
  };

  const handlePlaceBet = async () => {
    // Validate bet amount
    if (!betAmount || parseFloat(betAmount) <= 0) {
      setBetError('Please enter a valid bet amount');
      return;
    }

    if (parseFloat(betAmount) > user.balance) {
      setBetError('Insufficient balance');
      return;
    }

    setPlacingBet(true);
    setBetError('');

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `${API_URL}/bets.php?action=place`,
        {
          participant_id: selectedParticipant.id,
          amount: parseFloat(betAmount)
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (res.data.success) {
        setBetSuccess(true);
        setTimeout(() => {
          setOpenBetDialog(false);
          setBetSuccess(false);
          // Update user balance in parent component
          // This would typically be handled by context or Redux
        }, 2000);
      } else {
        setBetError(res.data.message || 'Failed to place bet');
      }
    } catch (err) {
      setBetError(err.response?.data?.message || 'Server error. Please try again.');
    } finally {
      setPlacingBet(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button component={RouterLink} to="/" variant="contained">
          Back to Home
        </Button>
      </Container>
    );
  }

  if (!event) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="info" sx={{ mb: 3 }}>
          Event not found
        </Alert>
        <Button component={RouterLink} to="/" variant="contained">
          Back to Home
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {event.title}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <AccessTimeIcon sx={{ mr: 1 }} color="action" />
          <Typography variant="body1" color="text.secondary">
            {formatDate(event.event_date)}
          </Typography>
        </Box>
        <Chip 
          label={event.status.toUpperCase()} 
          color={
            event.status === 'upcoming' ? 'primary' : 
            event.status === 'live' ? 'error' : 
            event.status === 'completed' ? 'success' : 'default'
          }
          sx={{ mb: 2 }}
        />
        <Typography variant="body1" paragraph>
          {event.description}
        </Typography>
      </Box>

      <Typography variant="h5" gutterBottom>
        Participants
      </Typography>
      <Grid container spacing={3}>
        {event.participants.map((participant) => (
          <Grid item xs={12} sm={6} md={4} key={participant.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" component="h2">
                  {participant.name}
                </Typography>
                <Typography variant="h5" color="primary" sx={{ my: 2 }}>
                  Odds: {participant.odds}
                </Typography>
                {event.status === 'upcoming' && isAuthenticated && (
                  <Button
                    variant="contained"
                    color="secondary"
                    fullWidth
                    onClick={() => handleBetClick(participant)}
                  >
                    Place Bet
                  </Button>
                )}
                {event.status === 'upcoming' && !isAuthenticated && (
                  <Button
                    variant="contained"
                    color="secondary"
                    fullWidth
                    component={RouterLink}
                    to="/login"
                  >
                    Login to Bet
                  </Button>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Button
        component={RouterLink}
        to="/"
        variant="outlined"
        sx={{ mt: 4 }}
      >
        Back to Events
      </Button>

      {/* Bet Dialog */}
      <Dialog open={openBetDialog} onClose={handleCloseBetDialog}>
        <DialogTitle>Place Bet</DialogTitle>
        <DialogContent>
          {betSuccess ? (
            <Alert severity="success" sx={{ mb: 2 }}>
              Bet placed successfully!
            </Alert>
          ) : (
            <>
              <DialogContentText>
                You are betting on: <strong>{selectedParticipant?.name}</strong>
                <br />
                Odds: <strong>{selectedParticipant?.odds}</strong>
                <br />
                Your balance: <strong>${user?.balance}</strong>
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                id="amount"
                label="Bet Amount ($)"
                type="text"
                fullWidth
                variant="outlined"
                value={betAmount}
                onChange={handleBetAmountChange}
                error={!!betError}
                helperText={betError}
                disabled={placingBet}
              />
              {betAmount && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Potential winnings: ${(parseFloat(betAmount || 0) * (selectedParticipant?.odds || 0)).toFixed(2)}
                </Typography>
              )}
            </>
          )}
        </DialogContent>
        {!betSuccess && (
          <DialogActions>
            <Button onClick={handleCloseBetDialog} disabled={placingBet}>
              Cancel
            </Button>
            <Button 
              onClick={handlePlaceBet} 
              variant="contained" 
              color="primary"
              disabled={placingBet}
            >
              {placingBet ? 'Placing Bet...' : 'Place Bet'}
            </Button>
          </DialogActions>
        )}
      </Dialog>
    </Container>
  );
};

export default EventDetails;
