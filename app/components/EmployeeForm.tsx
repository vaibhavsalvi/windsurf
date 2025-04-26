'use client';

import React from 'react';
import {
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

type EmployeeFormProps = {
  employeeId: string;
  setEmployeeId: (value: string) => void;
  employeeName: string;
  setEmployeeName: (value: string) => void;
  department: string;
  setDepartment: (value: string) => void;
  title: string;
  setTitle: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
};

export default function EmployeeForm({
  employeeId,
  setEmployeeId,
  employeeName,
  setEmployeeName,
  department,
  setDepartment,
  title,
  setTitle,
  onSubmit,
}: EmployeeFormProps) {
  return (
    <Box component="form" onSubmit={onSubmit} sx={{ mt: 2 }}>
      <TextField
        fullWidth
        label="Employee ID"
        value={employeeId}
        onChange={(e) => setEmployeeId(e.target.value)}
        margin="normal"
        required
      />
      <TextField
        fullWidth
        label="Name"
        value={employeeName}
        onChange={(e) => setEmployeeName(e.target.value)}
        margin="normal"
        required
      />
      <FormControl fullWidth margin="normal" required>
        <InputLabel>Department</InputLabel>
        <Select
          value={department}
          label="Department"
          onChange={(e) => setDepartment(e.target.value)}
        >
          <MenuItem value="Engineering">Engineering</MenuItem>
          <MenuItem value="HR">HR</MenuItem>
          <MenuItem value="Sales">Sales</MenuItem>
          <MenuItem value="Marketing">Marketing</MenuItem>
        </Select>
      </FormControl>
      <TextField
        fullWidth
        label="Title (Optional)"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        margin="normal"
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        sx={{ mt: 2 }}
      >
        Add Employee
      </Button>
    </Box>
  );
}
