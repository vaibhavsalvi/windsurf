'use client';

import { Snackbar, Alert } from '@mui/material';

type NotificationProps = {
  open: boolean;
  message: string;
  severity: 'success' | 'error';
  onClose: () => void;
};

export default function Notification({ open, message, severity, onClose }: NotificationProps) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Alert onClose={onClose} severity={severity}>
        {message}
      </Alert>
    </Snackbar>
  );
}
