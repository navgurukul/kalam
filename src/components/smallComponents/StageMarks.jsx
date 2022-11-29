import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import axios from "axios";
import { IconButton } from "@mui/material";
import CancelSharpIcon from "@mui/icons-material/CancelSharp";
import InfoIcon from "@mui/icons-material/Info";

const baseURL = import.meta.env.VITE_API_URL;

const StageMarks = ({ value }) => {
  const [open, setOpen] = React.useState(false);
  const [DBdata, setDBdata] = React.useState(null);

  const handleClickOpen = async () => {
    try {
      const { data } = await axios.get(
        `${baseURL}/questions/attempts/${value.id.id}`
      );
      // console.log(data, ">>>>>>>>>>>>>>>>>");
      setDBdata(data);
      setOpen(true);
    } catch (err) {
      // console.log(err);
      setDBdata(null);
      setOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <>
      {!open ? (
        <InfoIcon
          onClick={handleClickOpen}
          style={{ width: "2rem", marginLeft: ".2rem", cursor: "pointer" }}
        />
      ) : (
        <div>
          <Dialog
            sx={{ pt: 6, m: 15, w: 72 }}
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
              <CancelSharpIcon />
            </IconButton>
            <span style={{ display: "flex", alignItems: "center" }}>
              <img
                style={{ marginLeft: "2rem" }}
                src="https://emojipedia-us.s3.amazonaws.com/source/microsoft-teams/337/brain_1f9e0.png"
                alt="brainIcon"
                width={100}
              />
              <h1 style={{ marginLeft: "2rem" }}>Questions and Answers</h1>
            </span>
            <DialogContent>
              {DBdata ? (
                <>
                  {DBdata.map((el, index) => {
                    return (
                      <div key={index} >
                        <DialogContentText  mt={8}>
                          <strong>
                            Question {index + 1}) &nbsp;{" "}
                            {el[1][0].en_text
                              .replace(/\<p>/gi, "")
                              .replace("</p>", "")}
                          </strong>

                          <p
                            dangerouslySetInnerHTML={{
                              __html: el[1][0].common_text,
                            }}
                          ></p>
                          <p>
                            <strong>Answer - </strong> {el[0].text_answer || el[0].selected_option_id}
                          </p>
                        </DialogContentText>
                      </div>
                    );
                  })}
                </>
              ) : (
                <DialogContentText >
                  <h1 align="center" > No Data Found</h1>
                  </DialogContentText>
              )}
            </DialogContent>
          </Dialog>

        </div>
      )}
    </>
  );
};

export default StageMarks;
