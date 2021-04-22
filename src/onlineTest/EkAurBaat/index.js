import React, { useState } from 'react'
import axios from "axios";
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import history from '../../utils/history';


const baseUrl = process.env.API_URL;

const tutorialSteps = {
    heading: "Ek aur baat:",
    content: "Aapse ab test mein kuch questions pooche jaenge. Aapko answers araam se soch samajh kar dena hai.",
    imp1: "Par time ka bhi khyaal rakhe!", 
    imp2: "Aapko next 18 questions, 1 Hour me karne hai!"
}

const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: 800,
        paddingTop: theme.spacing(6),
        paddingBottom: theme.spacing(3),
    },
    heading: {
        paddingTop: theme.spacing(3),
        backgroundColor: theme.palette.background.default,
    },
    content: {
    paddingTop: theme.spacing(4),
    paddingLeft: theme.spacing(8),
    paddingRight: theme.spacing(8),
    backgroundColor: theme.palette.background.default,
    },
    imp: {
        paddingTop: theme.spacing(1),
        paddingLeft: theme.spacing(8),
        paddingRight: theme.spacing(8),
        backgroundColor: theme.palette.background.default,
    },
    button: {
        paddingTop: theme.spacing(2),
        paddingLeft: theme.spacing(8),
        paddingRight: theme.spacing(8),
        paddingBottom: theme.spacing(3),
        backgroundColor: theme.palette.background.default,
    }
}));


function EkAurBaat(props) {
    console.log("Props in ek aur baat", props.location.enrolment_key)
    const classes = useStyles();

    const fetchQuestionsAndOptions = () => {
        axios.post(`${baseUrl}on_assessment/questions/${props.location.enrolment_key}`)
        .then(res => {
            console.log("response",res.data.data)
            history.push({ pathname: "/Questions", questions: res.data.data})
        })
        .catch(err => {
            console.log("error", err)
        })
    }

    return (
        <Container maxWidth="lg" align="center" justifyContent="center">
            <div className={classes.root}>
                <Paper square elevation={0} className={classes.heading}>
                    <Typography variant="h4">{tutorialSteps.heading}</Typography>
                </Paper>
                <Paper square elevation={0} className={classes.content}>
                    <Typography>{tutorialSteps.content}</Typography>
                </Paper>
                <Paper square elevation={0} className={classes.imp}>
                    <Typography variant="h5">{tutorialSteps.imp1}</Typography>
                </Paper>
                <Paper square elevation={0} className={classes.imp}>
                    <Typography variant="h5">{tutorialSteps.imp2}</Typography>
                </Paper>
                <Paper square elevation={0} className={classes.button}>
                <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                onClick={fetchQuestionsAndOptions}
                >
                    Shuru karein
                </Button>
                </Paper>
            </div>
        </Container>
    )
}

export default EkAurBaat
