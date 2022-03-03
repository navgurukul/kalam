import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";

import { useSelector, useDispatch } from "react-redux";
import Drawer from "@material-ui/core/Drawer";
import Toolbar from "@material-ui/core/Toolbar";
import Box from "@material-ui/core/Box";
import LinearProgress from "@material-ui/core/LinearProgress";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";

import logo from "../assets/img/logo.png";

import { Link } from "react-router-dom";
import PublicNavList from "../navs/publicNav";
import PrivateNavList from "../navs/privateNav";
import ExpandNavList from "../navs/expandNavs";
import { logout } from "../store/actions/auth";
import { useHistory } from "react-router-dom";

import Image from "material-ui-image";
import ModalStages from "./ModalStages";

const Header = (props) => {
  const { isAuthenticated, isFetching } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const startLogout = () => dispatch(logout());
  const { location } = useHistory();
  const [state, setState] = React.useState({
    check: "",
    value: 1,
    open: false,
    componentsmenuopen: false,
    modalOpen: false,
  });

  // const handleChange = (event, index, value) => setState({ ...state, value });
  const onLeftIconButtonClick = () => {
    setState((prevState) => ({ ...prevState, open: !prevState.open }));
  };

  const toggleDrawer = (open) => () => {
    setState({
      ...state,
      open: open,
    });
  };

  // const handleClick = () => {
  //   setState((prevState) => ({
  //     ...prevState,
  //     componentsmenuopen: !prevState.componentsmenuopen,
  //   }));
  // };

  // const handleClose = (event) => {
  //   if (target1.contains(event.target) || target2.contains(event.target)) return;
  //   setState({ ...state, componentsmenuopen: false });
  // };

  const conditRenderEssential = () =>
    isAuthenticated ? (
      <Button color="inherit" align="right" onClick={startLogout}>
        Logout
      </Button>
    ) : (
      <Button color="inherit" align="right">
        <Link to="/login">Login</Link>
      </Button>
    );

  const dashboardModal = () => {
    if (location) {
      if (location.pathname.indexOf("partner") > -1) return <ModalStages />;
    }
    return;
  };

  const renderProgressBar = () =>
    isFetching ? <LinearProgress /> : <span></span>;
  return (
    <div>
      <Drawer open={state.open} onClose={toggleDrawer(false)}>
        <div tabIndex={0} role="button">
          <div className="sidelistwrapper">
            {!isAuthenticated && (
              <React.Fragment>
                <PublicNavList /> <ExpandNavList />
              </React.Fragment>
            )}
            {isAuthenticated && (
              <React.Fragment>
                <PrivateNavList />
              </React.Fragment>
            )}
          </div>
        </div>
      </Drawer>
      <div className="appbarwrapper">
        <AppBar position="fixed" color="default">
          {renderProgressBar()}
          <Toolbar style={{ display: "flex", justifyContent: "space-between" }}>
            <Box style={{ display: "flex" }}>
              {!isAuthenticated ? null : (
                <IconButton
                  className="iconbuttonsyle"
                  color="inherit"
                  aria-label="Menu"
                  onClick={onLeftIconButtonClick}
                >
                  <MenuIcon />
                </IconButton>
              )}
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
              {(location.pathname === "/" ||
                location.pathname.indexOf("partnerLanding") > -1) && (
                <Box pt={0.5} pl={2}>
                  <FormControl style={{ margin: 0, minWidth: 121 }}>
                    <InputLabel id="demo-controlled-open-select-label">
                      Select Language
                    </InputLabel>
                    <Select
                      onChange={props.onChange}
                      defaultValue={"Select Language"}
                      value={props.value}
                      inputProps={{
                        id: "filled-age-native-simple",
                      }}
                    >
                      <MenuItem value="">
                        <em>Selected Language</em>
                      </MenuItem>
                      <MenuItem value="en">English</MenuItem>
                      <MenuItem value="hi">Hindi</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              )}
            </Box>
            <Box style={{ display: "flex" }}>
              {dashboardModal()}
              {conditRenderEssential()}
            </Box>
          </Toolbar>
        </AppBar>
      </div>
    </div>
  );
};

export default Header;
