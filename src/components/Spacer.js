import React from 'react';
import { Box } from '@material-ui/core';

const Spacer = ({ height = 8 }) => {
  const style = { width: '100%', height };
  return <Box style={style} />;
};

export default Spacer;
