import React, { Fragment } from 'react';
import { withStyles } from '@material-ui/core/styles';

import axios from 'axios';
import { Button } from '@material-ui/core';
import { withSnackbar } from 'notistack';
import { Dialog } from '@material-ui/core';
import { Box } from '@material-ui/core';
import { FormControl, InputLabel, Input, FormHelperText } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';

const baseUrl = process.env.API_URL;

const styles = theme => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
        flexDirection: 'column',
        maxWidth: 400,
    },
    btn: {
        marginTop: theme.spacing(4)
    },
    text: {
        marginBottom: theme.spacing(1)
    }
})

export class EditPartner extends React.Component {

    async editPartner() {
        try {
            const { partnerId, change, columnIndex } = this.props
            const { name, notes, slug } = this.state;
            const dataURL = `${baseUrl}partners/${partnerId}`
            await axios.put(dataURL, {
                "name": name,
                "notes": notes,
                "slug": slug
            }).then(response => {
                console.log(response.data)
                this.setState({
                    dialogOpen: false,
                });
                this.props.enqueueSnackbar('Partner successfully edited with slug!', { variant: 'success' });
                change(slug, columnIndex)
            })
        } catch (e) {
            console.log(e);
            this.props.enqueueSnackbar('Please add valid slug atleast add minmum character and number', { variant: 'error' });
        }
    }

    onSubmit = () => {
        this.setState({
            loading: true,
        })
        this.editPartner();
    };

    constructor(props) {
        super(props);
        this.state = {
            "name": '',
            "notes": '',
            "slug": '',
            "dialogOpen": false,
        }
    }

    componentDidMount() {
        const { name, notes, } = this.props;
        this.setState({
            name: name,
            notes: notes
        })
    }
    
    handleChange = name => (event) => {
        let valChange = {}
        valChange[name] = event.target.value;

        this.setState(
            valChange
        );
    };

    handleClose = () => {
        this.setState({
            dialogOpen: false
        })
    };

    handleOpen = () => {
        this.setState({
            dialogOpen: true
        })
    }
    render = () => {
        const { classes } = this.props;
        return (
            <Fragment>
                <Box onClick={this.handleOpen} style={{cursor: "pointer"}}>
                    <EditIcon /> Add Slug
                </Box>
                <Dialog
                    open={this.state.dialogOpen}
                    onClose={this.handleClose}
                >
                    <form className={classes.container}>
                        <FormControl>
                            <InputLabel htmlFor="partnerName">Partner Name</InputLabel>
                            <Input id="partnerName" aria-describedby="my-helper-text" name="name" defaultValue={this.props.name} onChange={this.handleChange('name')} />
                            <FormHelperText className={classes.text} id="my-helper-text">Partner ka Name Enter karein.</FormHelperText>
                        </FormControl>

                        <FormControl>
                            <InputLabel htmlFor="partnerNotes">Partner Notes</InputLabel>
                            <Input id="partnerNotes" aria-describedby="my-helper-text" name="notes" defaultValue={this.props.notes} onChange={this.handleChange('notes')} />
                            <FormHelperText className={classes.text} id="my-helper-text">Partner ki thodi details add karein.</FormHelperText>
                        </FormControl>

                        <FormControl>
                            <InputLabel htmlFor="partnerNotes">Partner Slug</InputLabel>
                            <Input id="partnerNotes" aria-describedby="my-helper-text" name="notes" value={this.state.slug} onChange={this.handleChange('slug')} />
                            <FormHelperText className={classes.text} id="my-helper-text">Partner ke student ko online test dene ke liye Slug add karo.</FormHelperText>
                        </FormControl>

                        <Button variant="contained" color="primary" onClick={this.onSubmit} className={classes.btn}>Edit Partner</Button>
                    </form>
                </Dialog>
            </Fragment>
        );
    }
}

export default withSnackbar(withStyles(styles)(EditPartner))