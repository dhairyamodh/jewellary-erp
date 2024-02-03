import { Close } from '@mui/icons-material';
import {
  AppBar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
  Toolbar,
  Typography
} from '@mui/material';
import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

const PrintDialog = ({ open, children, onClose }) => {
  const componentRef = useRef(null);

  const printBill = useReactToPrint({
    content: () => componentRef.current
  });
  return (
    <Dialog open={open} onClose={onClose} fullScreen>
      <AppBar sx={{ position: 'relative', p: 2 }}>
        <Toolbar>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h4" component="div">
            Print Bill
          </Typography>
          <IconButton
            edge="start"
            color="inherit"
            onClick={onClose}
            aria-label="close"
          >
            <Close />
          </IconButton>
        </Toolbar>
      </AppBar>
      <DialogContent>
        <Box ref={componentRef}>{children}</Box>
      </DialogContent>
      <DialogActions>
        <Button autoFocus variant="contained" onClick={printBill}>
          Print
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PrintDialog;
