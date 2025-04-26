'use client';

import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Box,
  IconButton,
  Divider,
} from '@mui/material';
import {
  Search as SearchIcon,
  Delete as DeleteIcon,
  ClearAll as ClearAllIcon
} from '@mui/icons-material';
import Notification from './Notification';
import EmployeeForm from './EmployeeForm';

type CacheEntry = {
  key: string;
  value: {
    name: string;
    department: string;
    title?: string;
  };
};

const API_URL = 'http://localhost:8080/api/cache';

const departments = [
  'Engineering',
  'Product',
  'Design',
  'Marketing',
  'Sales',
  'HR',
  'Finance'
];

export default function CacheDemo() {
  const [employeeId, setEmployeeId] = useState('');
  const [employeeName, setEmployeeName] = useState('');
  const [department, setDepartment] = useState('');
  const [title, setTitle] = useState('');
  const [searchId, setSearchId] = useState('');
  const [cacheSize, setCacheSize] = useState(0);
  const [entries, setEntries] = useState<CacheEntry[]>([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const fetchCacheSize = async () => {
    try {
      const response = await fetch(`${API_URL}/size`);
      const size = await response.json();
      setCacheSize(size);
    } catch (error) {
      console.error('Error fetching cache size:', error);
    }
  };

  const fetchEntries = async () => {
    try {
      const response = await fetch(`${API_URL}/entries`);
      const data = await response.json();
      // Ensure data is an array before setting it
      setEntries(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching entries:', error);
      setEntries([]);
    }
  };

  useEffect(() => {
    fetchCacheSize();
    fetchEntries();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/put`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          key: employeeId,
          value: {
            name: employeeName,
            department,
            ...(title && { title }),
          },
        }),
      });

      if (response.ok) {
        setSnackbar({
          open: true,
          message: 'Employee added successfully',
          severity: 'success',
        });
        setEmployeeId('');
        setEmployeeName('');
        setDepartment('');
        setTitle('');
        fetchCacheSize();
        fetchEntries();
      } else {
        setSnackbar({
          open: true,
          message: 'Failed to add employee',
          severity: 'error',
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error adding employee',
        severity: 'error',
      });
    }
  };

  const handleSearch = async () => {
    try {
      const response = await fetch(`${API_URL}/get?key=${searchId}`);
      if (response.ok) {
        const data = await response.json();
        if (data && data.name && data.department) {
          setSnackbar({
            open: true,
            message: `Found: ${data.name} (${data.department})${
              data.title ? ` - ${data.title}` : ''
            }`,
            severity: 'success',
          });
        } else {
          setSnackbar({
            open: true,
            message: 'Invalid employee data format',
            severity: 'error',
          });
        }
      } else {
        setSnackbar({
          open: true,
          message: 'Employee not found',
          severity: 'error',
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error searching for employee',
        severity: 'error',
      });
    }
  };

  const handleClear = async () => {
    try {
      const response = await fetch(`${API_URL}/clear`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setSnackbar({
          open: true,
          message: 'Cache cleared successfully',
          severity: 'success',
        });
        fetchCacheSize();
        fetchEntries();
      } else {
        setSnackbar({
          open: true,
          message: 'Failed to clear cache',
          severity: 'error',
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error clearing cache',
        severity: 'error',
      });
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center" color="primary">
          Employee Cache Demo (LRU)
        </Typography>
        <Typography variant="subtitle1" align="center" color="text.secondary" gutterBottom>
          Current Cache Size: {cacheSize}
        </Typography>
        <Divider sx={{ my: 3 }} />
        
        <EmployeeForm
          employeeId={employeeId}
          setEmployeeId={setEmployeeId}
          employeeName={employeeName}
          setEmployeeName={setEmployeeName}
          department={department}
          setDepartment={setDepartment}
          title={title}
          setTitle={setTitle}
          onSubmit={handleSubmit}
        />

        <Box sx={{ mt: 4, display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            label="Search Employee ID"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            sx={{ flexGrow: 1 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSearch}
            startIcon={<SearchIcon />}
          >
            Search
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleClear}
            startIcon={<ClearAllIcon />}
          >
            Clear Cache
          </Button>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Current Entries
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            {entries.map((entry) => (
              <Card key={entry.key} sx={{ minWidth: 275, flexGrow: 1 }}>
                <CardContent>
                  <Typography variant="h6" component="div">
                    ID: {entry.key}
                  </Typography>
                  <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    {entry.value?.department || 'No Department'}
                  </Typography>
                  <Typography variant="body2">
                    Name: {entry.value?.name || 'No Name'}
                    {entry.value?.title && (
                      <>
                        <br />
                        Title: {entry.value.title}
                      </>
                    )}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>
      </Paper>
      <Notification
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={handleCloseSnackbar}
      />
    </Container>
  );
}
