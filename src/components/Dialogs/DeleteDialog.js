import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Typography
} from '@mui/material';
import React from 'react';

const DeleteDialog = ({ open, msg, onClose, onAccept }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogContent>
        <Typography variant="h4" mb={2}>
          {'Are you sure?' || msg}
        </Typography>
        <DialogContentText id="alert-dialog-description">
          You won't be able to revert this!
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Disagree</Button>
        <Button autoFocus variant="contained" onClick={onAccept}>
          Agree
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteDialog;
