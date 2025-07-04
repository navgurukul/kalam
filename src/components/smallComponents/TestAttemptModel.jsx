import * as React from "react";
import {
  Box,
  Modal,
  Typography,
  IconButton,
  Stack,
  Paper,
  Divider,
} from "@mui/material";
import CancelSharpIcon from "@mui/icons-material/CancelSharp";
import QuizIcon from "@mui/icons-material/Quiz";
import StageMarks from "./StageMarks";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 2,
  p: 4,
};

export default function TestAttemptModel({ value }) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // ✅ Remove duplicates by 'stage_name' (or use 'id' if available)
  const uniqueAttempts = React.useMemo(() => {
    const seen = new Set();
    return value.filter((attempt) => {
      const key = attempt.stage_name; // Replace with 'attempt.id' if exists
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [value]);

  return (
    <>
      <IconButton onClick={handleOpen} color="primary">
        <QuizIcon />
        <Typography ml={1} fontSize={14}>
          {uniqueAttempts.length} Attempt{uniqueAttempts.length > 1 ? "s" : ""}
        </Typography>
      </IconButton>

      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <IconButton
            onClick={handleClose}
            sx={{ position: "absolute", right: 12, top: 12 }}
          >
            <CancelSharpIcon />
          </IconButton>

          <Typography variant="h6" mb={3}>
            {uniqueAttempts.length} Attempt{uniqueAttempts.length > 1 ? "s" : ""} Found
          </Typography>

          {uniqueAttempts.length === 0 ? (
            <Typography>No Attempts Available</Typography>
          ) : (
            <Stack spacing={2}>
              {uniqueAttempts.map((el, i) => (
                <Paper
                  key={i}
                  elevation={3}
                  sx={{
                    p: 2,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    bgcolor: "#f9f9f9",
                    borderRadius: 2,
                  }}
                >
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    width="100%"
                  >
                    <StageMarks value={el} marks={el.total_marks} />
                  </Box>
                </Paper>
              ))}
            </Stack>
          )}
        </Box>
      </Modal>
    </>
  );
}
