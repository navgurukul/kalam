import React from 'react';
import AppBar from '@material-ui/core/AppBar';

import { connect } from 'react-redux';
import Drawer from '@material-ui/core/Drawer';
import Toolbar from '@material-ui/core/Toolbar';
import Box from '@material-ui/core/Box';
import LinearProgress from '@material-ui/core/LinearProgress';
import DialogContent from '@material-ui/core/DialogContent';

import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';

import logo from '../assets/img/logo.png';

import { Link } from 'react-router-dom';
import PublicNavList from '../navs/publicNav';
import PrivateNavList from '../navs/privateNav';
import ExpandNavList from '../navs/expandNavs'
import { logout } from '../store/actions/auth';
import { NavLink } from 'react-router-dom';

import { withRouter } from 'react-router-dom';

import Image from 'material-ui-image';
import ModalStages from './ModalStages';

export class Header extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      value: 1,
      open: false,
      componentsmenuopen: false,
      modalOpen: false
    };
  }

  handleChange = (event, index, value) => this.setState({ value });
  onLeftIconButtonClick = (event, index, value) => {
    this.setState({ open: !this.state.open });
  };

  toggleDrawer = (open) => () => {
    this.setState({
      open: open,
    });
  };

  handleClick = () => {
    this.setState({ componentsmenuopen: !this.state.componentsmenuopen });
  };

  handleClose = event => {
    if (this.target1.contains(event.target) || this.target2.contains(event.target)) {
      return;
    }

    this.setState({ componentsmenuopen: false });
  };

  conditRenderEssential = () => this.props.isAuthenticated ? (
    <Button color="inherit" align="right" onClick={this.props.startLogout}>
      Logout
    </Button>)
    : (
      <Button color="inherit" align="right">
        <Link to="/login">
          Login
      </Link>
      </Button>)

  dashboardModal = () => {
    if (this.props.location) {
      if (this.props.location.pathname.indexOf('partner') > -1)
        return <ModalStages />
    }
    return
  }

  renderProgressBar = () => this.props.isFetching ? (<LinearProgress />) : (<span></span>)

  render() {
    const { open } = this.state.componentsmenuopen;

    return (
      <div>
        <Drawer open={this.state.open} onClose={this.toggleDrawer(false)} >
          <div
            tabIndex={0}
            role="button"
          >
            <div className="sidelistwrapper">
              {!this.props.isAuthenticated && (<React.Fragment><PublicNavList /> <ExpandNavList /></React.Fragment>)}
              {this.props.isAuthenticated && (<React.Fragment>
                <PrivateNavList />
              </React.Fragment>
              )}
            </div>
          </div>
        </Drawer>
        <div className="appbarwrapper">
          <AppBar
            position="fixed"
            color="default"
          >
            {this.renderProgressBar()}
            <Toolbar style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Box style={{ display: 'flex' }}>
                <IconButton className="iconbuttonsyle" color="inherit" aria-label="Menu" onClick={this.onLeftIconButtonClick}>
                  <MenuIcon />
                </IconButton>
                <Box pt={0.5}>
                  <Link to="/">
                    <Image
                      src={logo}
                      color="inherit"
                      style={{ height: 40, width: 165, paddingTop: 0, flex: 1 }}
                      imageStyle={{ height: 40, width: 165 }}
                    />
                  </Link>
                </Box>
              </Box>
              {this.conditRenderEssential()}
              {this.dashboardModal()}
            </Toolbar>
          </AppBar>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  isFetching: state.auth.isFetching
});

const mapDispatchToProps = (dispatch, props) => ({
  startLogout: () => dispatch(logout())
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header))