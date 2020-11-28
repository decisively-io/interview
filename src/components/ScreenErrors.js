import React from 'react';
import {
  Grid
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';

const ScreenErrors = ({errors, type}) => {
  // TODO: Fix on server
  if (!errors || errors.length === 0) return null; 
  return (
    <Grid item xs={12}>
      { errors.map((error, index) => (
        <Alert key={index} severity={type}>{error}</Alert>
      ))}
    </Grid>
  );
}

export default ScreenErrors;