import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import { FormControl, MenuItem } from "@mui/material";
import StageMarks from "./StageMarks";
import InfoIcon from "@mui/icons-material/Info";
import CancelSharpIcon from "@mui/icons-material/CancelSharp";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

export default function TestAttemptModel({ value }) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const Close = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button onClick={handleOpen}>
        <InfoIcon />
      </Button>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <CancelSharpIcon onClick={Close} sx={{ mt: -1, cursor: "Pointer" }} />
          <FormControl sx={{ m: 1, minWidth: 180, ml: 12 }}>
            {value.map((el, i) => {
              return (
                <MenuItem key={i} value={el}>
                  <Button>
                    <StageMarks
                      value={el}
                      name={i + 1}
                      marks={el.total_marks}
                    />
                  </Button>
                </MenuItem>
              );
            })}
          </FormControl>
        </Box>
      </Modal>
    </div>
  );
}
