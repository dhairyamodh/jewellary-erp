import { LocalizationProvider, MobileDatePicker } from '@mui/lab';
import React from 'react';
import AdapterMoment from '@mui/lab/AdapterMoment';
import { Stack, TextField, Typography } from '@mui/material';

const DateRange = ({
  startDate,
  endDate,
  handleStartDateChange,
  handleEndDateChange
}) => {
  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        gap={2}
      >
        <MobileDatePicker
          label="Start Date"
          value={startDate}
          onChange={(date) => {
            handleStartDateChange(date);
          }}
          format="dd/MM/yyyy"
          renderInput={(props) => {
            return (
              <TextField
                {...props}
                fullWidth
                label=""
                placeholder="Select start date"
                inputProps={{
                  ...props.inputProps,
                  placeholder: 'Select start date'
                }}
              />
            );
          }}
        />
        <Typography>to</Typography>
        <MobileDatePicker
          label="End Date"
          value={endDate}
          onChange={handleEndDateChange}
          format="dd/MM/yyyy"
          renderInput={(props) => {
            return (
              <TextField
                {...props}
                fullWidth
                label=""
                placeholder="Select start date"
                inputProps={{
                  ...props.inputProps,
                  placeholder: 'Select start date'
                }}
              />
            );
          }}
        />
      </Stack>
    </LocalizationProvider>
  );
};

export default DateRange;
