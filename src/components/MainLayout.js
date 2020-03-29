import React from "react";
import Box from '@material-ui/core/Box';
import MUIDataTable from "mui-datatables";
import { withStyles, MuiThemeProvider } from '@material-ui/core/styles';
import GlobalService from '../services/GlobalService';
import { connect } from 'react-redux';
import { theme } from '../theme/theme';

const styles = theme => ({
    innerTable: {
      marginLeft: '3vw',
      marginRight: '3vw',
      width: '94vw',
      marginTop: '5',
      marginBottom: '5',
      [theme.breakpoints.up('md')]: {
        margin: 'auto',
        width: '50%',
        marginTop: 5,
        marginBottom: 5
      },
    },
    clear: {
      clear: 'both'
    }
  })


export class MainLayout extends React.Component{
    render(){
        const { classes } = this.props;
        return  <Box>
        <MuiThemeProvider theme={theme}>
          <div className={classes.clear}></div>
          <MUIDataTable
            columns={this.props.columns}
            data={this.props.data}
            icons={GlobalService.tableIcons}
            options={
              {
                headerStyle: {
                  color: theme.palette.primary.main
                },
                exportButton: true,
                pageSize: 100,
                showTitle: false,
                selectableRows: 'none',
                toolbar: false,
                filtering: true,
                filter: true,
                filterType: 'doprdown',
                responsive: 'stacked',
              }
            }
          />
        </MuiThemeProvider>
      </Box>
    }

}

const mapDispatchToProps = (dispatch)=>({
    fetchingStart: () => dispatch(changeFetching(true)),
    fetchingFinish: () => dispatch(changeFetching(false)),
    usersSetup: (users) => dispatch(setupUsers(users))
  });



  export default withStyles(styles)(connect(undefined, mapDispatchToProps)(MainLayout));