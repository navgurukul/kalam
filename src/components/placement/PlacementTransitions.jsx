import { Box, IconButton } from "@mui/material";
import ChangeHistoryIcon from "@mui/icons-material/ChangeHistory";
import React from "react";

const PlacementTransitions = () => {
  const [modelOpen, setModelOpen] = React.useState(false);
  return (
    <Box>
      <IconButton color="primary">
        <ChangeHistoryIcon />
      </IconButton>
    </Box>
  );
};

export default PlacementTransitions;
