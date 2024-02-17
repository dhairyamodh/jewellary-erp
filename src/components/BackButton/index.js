import { ArrowBack } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const BackButton = ({ to = -1 }) => {
  const navigate = useNavigate();
  return (
    <IconButton onClick={() => navigate(to)}>
      <ArrowBack />
    </IconButton>
  );
};

export default BackButton;
