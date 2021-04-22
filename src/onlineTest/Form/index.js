import React, { useState } from 'react'
import axios from "axios";
import TextField from "@material-ui/core/TextField";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Button from "@material-ui/core/Button";
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Date from './Date'
import Typography from '@material-ui/core/Typography';
import { Link } from "react-router-dom";
import history from '../../utils/history';


const baseUrl = process.env.API_URL;

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 400,
    paddingTop: theme.spacing(6),
    paddingBottom: theme.spacing(3),
  },
  container: {
    maxWidth: 500,
    backgroundColor: theme.palette.background.default,
  },
  spacing: {
    paddingBottom: theme.spacing(2),
  },
  text: {
    paddingBottom: theme.spacing(3),
  },
  date: {
    maxWidth: 400,
    paddingTop: theme.spacing(-2),
    paddingBottom: theme.spacing(1),
  }
}));

function Form(props) {
    const classes = useStyles();

    const [date, setDate] = useState()
    const [values, setValues] = useState({
        name: "",
        whatsapp: "",
        gender: "",
        dob: "",
        gps_lat: "-1",
        gps_long: "-1"
    })   

    const changeHandler = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value, dob: date});

    }
    // console.log("Date", selectedDate)

    const submitHandler = () => {
        console.log("Okay!")
        axios.post(`${baseUrl}on_assessment/details/${props.location.enrolment_key}`, values)
        .then(res => {
            console.log('res', res)
        })
        .catch(err => {
            console.log('err', err)
        })
        console.log(values)
        history.push({ pathname: "/ekAurBaat", enrolment_key: props.location.enrolment_key })
    }

    const wantDate = (date) => {
        // console.log("This is date from form", a)
        setDate(date)
    }

    // console.log("This is form props", props)

    return (
        <Container maxWidth="lg" align='center'>
            <div className={classes.root}>
            <Typography variant="h4" className={classes.text}>Aapki Kuch Details</Typography>
                <TextField
                    variant="outlined"
                    required
                    fullWidth
                    // id="name"
                    className={classes.spacing}
                    // label="Your name"
                    placeholder="Your Name"
                    value={values.name}
                    name="name"
                    autoComplete="off"
                    onChange={changeHandler}
                    />
                <TextField
                    variant="outlined"
                    required
                    fullWidth
                    // id="whatsapp"
                    className={classes.spacing}
                    // label="Your Whatsapp Number"
                    placeholder="Your Whatsapp Number"
                    value={values.whatsapp}
                    name="whatsapp"
                    autoComplete="off"
                    onChange={changeHandler}
                    />
                <div className={classes.date}>
                <Date forDate={wantDate}/>
                </div>
                <FormControl fullWidth variant="outlined" align='left' className={classes.spacing}> 
                    <InputLabel id="demo-simple-select-outlined-label">
                        Select Gender
                    </InputLabel>
                    <Select
                        value={values.gender}
                        onChange={changeHandler}
                        label="Select Gender"
                        name="gender"
                    >
                        <MenuItem value={"selectGender"}>select Gender</MenuItem>
                        <MenuItem value={"female"}>female</MenuItem>
                        <MenuItem value={"male"}>male</MenuItem>
                        <MenuItem value={"other"}>other</MenuItem>
                    </Select>
                </FormControl>
                {/* <Link exact to="ekAurBaat"> */}
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    onClick={submitHandler}
                >
                    Test shuru karein
                </Button>
                {/* </Link> */}
            </div>
        </Container>
    )
}

export default Form
