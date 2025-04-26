import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Divider,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip
} from '@mui/material';
import axios from 'axios';

const API_URL = 'http://localhost/betting-app/api';

const Wallet = ({ user, updateUser }) => {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [tabValue, setTabValue] = useState('deposit');
  const [transactions, setTransactions] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    fetchTransactionHistory();
  }, []);

  const fetchTransactionHistory = async () => {
    setLoadingHistory(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/wallet.php?action=history`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (res.data.success) {
        setTransactions(res.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching transaction history:', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleAmountChange = (e) => {
    // Only allow numbers and decimals
    const value = e.target.value;
    if (value === '' || /^\d+(\.\d{0,2})?$/.test(value)) {
      setAmount(value);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setAmount('');
    setError('');
    setSuccess('');
  };

  const handleSubmit = async () => {
    // Validate amount
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    // For withdraw, check if user has enough balance
    if (tabValue === 'withdraw' && parseFloat(amount) > user.balance) {
      setError('Insufficient balance');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `${API_URL}/wallet.php?action=${tabValue}`,
        {
          amount: parseFloat(amount)
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (res.data.success) {
        setSuccess(`${tabValue === 'deposit' ? 'Deposit' : 'Withdrawal'} successful!`);
        setAmount('');
        
        // Update user balance
        if (updateUser && res.data.data) {
          updateUser({ ...user, balance: res.data.data.balance });
        }
        
        // Refresh transaction history
        fetchTransactionHistory();
      } else {
        setError(res.data.message || `Failed to ${tabValue}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Server error. Please try again.');
    } finally {
      setLoading(false);
    }
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

  const getTransactionTypeColor = (type) => {
    switch (type) {
      case 'deposit':
        return 'success';
      case 'withdrawal':
        return 'warning';
      case 'bet':
        return 'info';
      case 'win':
        return 'success';
      default:
        return 'default';
    }
  };

  const formatAmount = (amount) => {
    const num = parseFloat(amount);
    return `${num >= 0 ? '+' : ''}$${Math.abs(num).toFixed(2)}`;
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Wallet Management
      </Typography>
      <Divider sx={{ mb: 2 }} />

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          aria-label="wallet tabs"
        >
          <Tab label="Deposit" value="deposit" />
          <Tab label="Withdraw" value="withdraw" />
          <Tab label="History" value="history" />
        </Tabs>
      </Box>

      {tabValue === 'history' ? (
        loadingHistory ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
            <CircularProgress size={24} />
          </Box>
        ) : transactions.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
            No transaction history found
          </Typography>
        ) : (
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{formatDate(transaction.created_at)}</TableCell>
                    <TableCell>
                      <Chip 
                        label={transaction.type.toUpperCase()} 
                        color={getTransactionTypeColor(transaction.type)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right" sx={{ 
                      color: parseFloat(transaction.amount) >= 0 ? 'success.main' : 'error.main',
                      fontWeight: 'bold'
                    }}>
                      {formatAmount(transaction.amount)}
                    </TableCell>
                    <TableCell>{transaction.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )
      ) : (
        <>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <TextField
              label={`${tabValue === 'deposit' ? 'Deposit' : 'Withdraw'} Amount`}
              variant="outlined"
              size="small"
              value={amount}
              onChange={handleAmountChange}
              disabled={loading}
              sx={{ mr: 2, flexGrow: 1 }}
              InputProps={{
                startAdornment: <Typography sx={{ mr: 0.5 }}>$</Typography>,
              }}
            />
            <Button
              variant="contained"
              color={tabValue === 'deposit' ? 'success' : 'warning'}
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} />
              ) : (
                tabValue === 'deposit' ? 'Deposit' : 'Withdraw'
              )}
            </Button>
          </Box>
          
          <Typography variant="body2" color="text.secondary">
            Current Balance: <strong>${user?.balance || '0.00'}</strong>
          </Typography>
          
          {tabValue === 'deposit' && (
            <Alert severity="info" sx={{ mt: 2 }}>
              Note: This is a demo application. No real money is involved.
            </Alert>
          )}
        </>
      )}
    </Paper>
  );
};

export default Wallet;
