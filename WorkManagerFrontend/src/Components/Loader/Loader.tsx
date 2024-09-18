import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import "./Loader.css"

export default function CircularIndeterminate() {
  const boxStyle = {
    marginTop: "48vh",
  };
  return (
    <Box style={boxStyle}>
      <CircularProgress />
    </Box>
  );
}