import * as React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  IconButton,
  Typography,
  Box,
  Divider,
  Button,
} from "@mui/material";
import CancelSharpIcon from "@mui/icons-material/CancelSharp";
import QuizIcon from "@mui/icons-material/Quiz";
import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL;

const StageMarks = ({ value, name, marks }) => {
  const [open, setOpen] = React.useState(false);
  const [DBdata, setDBdata] = React.useState(null);

  const handleClickOpen = async () => {
    try {
      const { data } = await axios.get(
        `${baseURL}/questions/attempts/${value.id}`
      );
      setDBdata(data);
    } catch {
      setDBdata(null);
    }
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  return (
    <>
      <Button
        onClick={handleClickOpen}
        variant="outlined"
        size="small"
        sx={{
          minWidth: "fit-content",
          padding: "4px 8px",
          fontSize: "0.8rem",
          marginX: "0.4rem",
        }}
      >
        {name} Attempt: {marks ?? "N/A"}
      </Button>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        aria-labelledby="stage-marks-dialog"
      >
        <Box sx={{ display: "flex", alignItems: "center", p: 2 }}>
          <IconButton onClick={handleClose}>
            <CancelSharpIcon />
          </IconButton>
          <QuizIcon sx={{ fontSize: 36, ml: 2, color: "#3f51b5" }} />
          <Typography variant="h6" sx={{ ml: 2 }}>
            Questions and Answers
          </Typography>
        </Box>
        <Divider />

        <DialogContent sx={{ p: 4 }}>
          {DBdata && DBdata.length > 0 ? (
            DBdata.map((el, index) => (
              <Box key={index} sx={{ mb: 4 }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Question {index + 1}){" "}
                  {el[1][0].en_text
                    ?.replace(/\<p>/gi, "")
                    .replace("</p>", "")}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ mb: 1 }}
                  dangerouslySetInnerHTML={{
                    __html: el[1][0].common_text,
                  }}
                />
                <Typography variant="body1">
                  <strong>Answer:</strong>{" "}
                  {el[0].text_answer || el[0].selected_option_id || "N/A"}
                </Typography>
                <Divider sx={{ mt: 2 }} />
              </Box>
            ))
          ) : (
            <Typography align="center" variant="h6">
              No Data Found
            </Typography>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default StageMarks;
