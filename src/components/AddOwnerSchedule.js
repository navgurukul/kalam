import { Box, Button, IconButton, makeStyles, Modal, Card, Typography } from '@material-ui/core'
import React, { useState } from 'react'
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import moment from "moment";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import axios from "axios";
import { useSnackbar } from 'notistack';

const baseUrl = process.env.API_URL

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 450,
    margin: "auto",
    marginTop: "20px",
    padding:"0.4rem 0.8rem"
  },
  container:{
    display:"flex",
    flexDirection:"column",
    padding:"0.4rem 1.2rem",
  },
  timePicker:{
    padding:"0.2rem 0.4rem"
  },
  addIcon: {
    position: "absolute",
    marginLeft: "60%",
    top: "9px",
  },
  text: {
    marginBottom: theme.spacing(1),
    marginTop: theme.spacing(2),
  },
  btn: {
    marginTop: theme.spacing(2),
  },
}))

const AddOwnerSchedule = ({isEdit, disabled, prevSchedule, ownerId, updateData}) => {
  const classes = useStyles();
  const snackbar = useSnackbar();
  const [schedule,setSchedule] = useState({
    from:isEdit?moment(prevSchedule.from,"hh:mm").toDate().getTime():moment("08:00","hh:mm").toDate().getTime(),
    to:isEdit?moment(prevSchedule.to,"hh:mm").toDate().getTime():moment("16:00","hh:mm").toDate().getTime(),
  });
  const [modalOpen, setModelOpen] = useState(false);

  const handleTimeChange = (id, time) => {
    setSchedule({...schedule, [id]:moment(time,"hh:mm a").toDate().getTime()});
  }
  
  const addSchedule = () => {
    const {from,to} = schedule;
    const diff = parseInt(moment.duration(moment(to).diff(moment(from))).asHours());  
    if(diff < 0){
      snackbar.enqueueSnackbar("Start Time should be before End Time",{variant:'error'})
      return;
    }else if(diff < 1){
      snackbar.enqueueSnackbar("Please select at least 1hr long schedule",{variant:'error'})
      return;
    }
    const Url = baseUrl + "ownershedule";
    const fromStr = moment(from).format("HH:mm");
    const toStr = moment(to).format("HH:mm");
    if(isEdit){
      axios.put(`${Url}/${ownerId}`,{
        "from": fromStr,
        "to": toStr
      }).then((res) => {
        const {data} = res.data
        if(data.error) {
          console.error(data.err);
          snackbar.enqueueSnackbar("Schedule Already Exists",{variant:"error"});
          return;
        }
        snackbar.enqueueSnackbar("Schedule Added!",{variant:'success'});
        updateData();
        setModelOpen(false);
      }).catch(err => {
        snackbar.enqueueSnackbar("ERROR : "+err.message,{variant:'error'})
      })
    }
    else{
      axios.post(Url,{
        owner_id:ownerId,
        "from": fromStr,
        "to": toStr
      })
      .then((res) => {
        const {data} = res.data
        if(data.error) {
          console.error(data.err);
          snackbar.enqueueSnackbar("Schedule Already Exists",{variant:"error"});
          return;
        }
        snackbar.enqueueSnackbar("Schedule Added!",{variant:'success'});
        updateData();
        setModelOpen(false);
      }).catch(err => {
        snackbar.enqueueSnackbar("ERROR : "+err.message,{variant:'error'})
      })
    }
  }

  const deleteSchedule = () => {
    let toDelete = window.confirm("Are you sure?");
    if(!toDelete) return;
    const Url = `${baseUrl}ownershedule/${ownerId}`;
    axios.delete(Url).then(res =>{
      if(res.data.data === 1){
        snackbar.enqueueSnackbar("Deleted Successfully!",{variant:'success'})
        updateData();
      }
    })
  }
  console.log(ownerId,isEdit);
  return (
    
    <div>
      {isEdit?
        (<Box>
          {moment(schedule.from).format('hh:mm A')} - {moment(schedule.to).format('hh:mm A')}
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",marginTop:"0.4rem",gap:"4px"}}>
          <IconButton color='primary' size='small' disabled={disabled} onClick={() => setModelOpen(true)}>
            <EditIcon/>
          </IconButton>
          <IconButton color='primary' size='small' disabled={disabled} onClick={() => deleteSchedule()}>
            <DeleteIcon/>
          </IconButton>
          </div>
        </Box>
        ):
        <Button
          disabled={disabled}
          variant="contained"
          color="primary"
          onClick={() => setModelOpen(true)}
          className={classes.btn}
        >
          Set Schedule
        </Button>
      }
      <Modal open={modalOpen} onClose={()=>setModelOpen(false)}>
        <Card className={classes.root}>
          <Typography className={classes.text} variant="h5">
            Select Schedule Timings
          </Typography>
          <form className={classes.container}>
            <MuiPickersUtilsProvider utils={DateFnsUtils} >
              <KeyboardTimePicker
                  margin="dense"
                  value={schedule.from}
                  id="from"
                  label="From"
                  fullWidth
                  onChange={(_,time) => handleTimeChange("from",time)}
                  KeyboardButtonProps={{
                    "aria-label": "change time",
                  }}
              />
            </MuiPickersUtilsProvider>
            <MuiPickersUtilsProvider utils={DateFnsUtils} >
              <KeyboardTimePicker
                  margin="dense"
                  value={schedule.to}
                  id="to"
                  label="To"
                  fullWidth
                  onChange={(_,time) => handleTimeChange("to",time)}
                  KeyboardButtonProps={{
                    "aria-label": "change time",
                  }}
              />
            </MuiPickersUtilsProvider>
            <Button
              variant="contained"
              color="primary"
              onClick={() => addSchedule()}
              className={classes.btn}
            >
              {isEdit ? "Update" : "Confirm"} Schedule
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setModelOpen(false)}
              className={classes.btn}
            >
              Cancel
            </Button> 
          </form>
        </Card>
      </Modal>
    </div>
  )
}

export default AddOwnerSchedule