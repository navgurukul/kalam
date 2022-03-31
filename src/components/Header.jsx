import React from "react";
import AppBar from "@mui/material/AppBar";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";

import { useSelector, useDispatch } from "react-redux";
import Drawer from "@mui/material/Drawer";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { Link, useLocation } from "react-router-dom";
import Image from "@jy95/material-ui-image";
import logo from "../assets/img/logo.png";

import PublicNavList from "../navs/publicNav";
import PrivateNavList from "../navs/privateNav";
import ExpandNavList from "../navs/expandNavs";
import { logout } from "../store/actions/auth";

import ModalStages from "./ModalStages";

const Header = (props) => {
  const { isAuthenticated, isFetching } = useSelector((state) => state.auth);
  const { onChange, value } = props;
  const dispatch = useDispatch();
  const startLogout = () => dispatch(logout());
  const location = useLocation();
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
      open,
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
  };

  const renderProgressBar = () => (isFetching ? <LinearProgress /> : <span />);
  return (
    <div>
      <Drawer open={state.open} onClose={toggleDrawer(false)}>
        <div tabIndex={0} role="button">
          <div className="sidelistwrapper">
            {!isAuthenticated && (
              <>
                <PublicNavList /> <ExpandNavList />
              </>
            )}
            {isAuthenticated && <PrivateNavList />}
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
                      onChange={onChange}
                      defaultValue=""
                      value={value}
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
