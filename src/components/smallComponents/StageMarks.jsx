import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import { useTheme } from "@mui/material/styles";
import axios from "axios";
import { IconButton } from "@mui/material";
import FeedOutlinedIcon from "@mui/icons-material/FeedOutlined";
import CancelSharpIcon from '@mui/icons-material/CancelSharp';

const baseURL = import.meta.env.VITE_API_URL;

const StageMarks = ({ value }) => {
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const [DBdata, setDBdata] = React.useState(null);

  const handleClickOpen = async () => {
    try {
      const { data } = await axios.get(
        `${baseURL}/questions/attempts/${value.id.id}`
      );
      // console.log(data, ">>>>>>>>>>>>>>>>>");
      // console.log(data);
      setDBdata(data);
      setOpen(true);
    } catch (err) {
      console.log(err);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      {!open ? (
        <button onClick={handleClickOpen}>
          <FeedOutlinedIcon />
        </button>
      ) : (
        <div >
          <Dialog
          sx={{ pt: 6 , m:7 ,w:72 }}
            size="small"
            fullScreen
            open={open}
            onClose={handleClose}
            aria-labelledby="responsive-dialog-title"
          >
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CancelSharpIcon/>
            </IconButton>
            <h1
            sx={{ px:7 }}
            >Questions and Answers</h1>
            <DialogContent 
            >
              {DBdata.map((el) => {
                return (
                  <>
                    <DialogContentText>
                      <p><strong>  {el[1][0].en_text.replace(/\<p>/gi,"")}</strong></p>
                    </DialogContentText>
                      <p>{el[0].text_answer}</p>
                  </>
                );
              })}
            </DialogContent>
          </Dialog>
        </div>
      )}
    </>
  );
};

export default StageMarks;
