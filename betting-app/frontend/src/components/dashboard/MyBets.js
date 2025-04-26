import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  CircularProgress,
  Alert,
  Tabs,
  Tab
} from '@mui/material';
import axios from 'axios';

const API_URL = 'http://localhost/betting-app/api';

const MyBets = ({ user }) => {
  const [bets, setBets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tabValue, setTabValue] = useState('all');
  
  useEffect(() => {
    fetchBets();
  }, []);
  
  const fetchBets = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/bets.php`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (res.data.success) {
        setBets(res.data.data || []);
      } else {
        setError(res.data.message || 'Failed to fetch bets');
      }
    } catch (err) {
      setError('Server error. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const getFilteredBets = () => {
    if (tabValue === 'all') {
      return bets;
    }
    return bets.filter(bet => bet.status === tabValue);
  };
  
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'won':
        return 'success';
      case 'lost':
        return 'error';
      case 'cancelled':
        return 'default';
      default:
        return 'default';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        My Bets
      </Typography>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          aria-label="bet status tabs"
        >
          <Tab label="All Bets" value="all" />
          <Tab label="Pending" value="pending" />
          <Tab label="Won" value="won" />
          <Tab label="Lost" value="lost" />
        </Tabs>
      </Box>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      ) : bets.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            You haven't placed any bets yet.
          </Typography>
          <Button 
            variant="contained" 
            component={RouterLink} 
            to="/"
          >
            Browse Events
          </Button>
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Event</TableCell>
                <TableCell>Selection</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell align="right">Potential Winnings</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {getFilteredBets().map((bet) => (
                <TableRow key={bet.id}>
                  <TableCell>{bet.event_title}</TableCell>
                  <TableCell>{bet.participant_name}</TableCell>
                  <TableCell align="right">${parseFloat(bet.amount).toFixed(2)}</TableCell>
                  <TableCell align="right">${parseFloat(bet.potential_winnings).toFixed(2)}</TableCell>
                  <TableCell>
                    <Chip 
                      label={bet.status.toUpperCase()} 
                      color={getStatusColor(bet.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{formatDate(bet.created_at)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
        <Button 
          variant="outlined" 
          component={RouterLink} 
          to="/dashboard"
        >
          Back to Dashboard
        </Button>
        <Button 
          variant="contained" 
          component={RouterLink} 
          to="/"
        >
          Place New Bet
        </Button>
      </Box>
    </Container>
  );
};

export default MyBets;
