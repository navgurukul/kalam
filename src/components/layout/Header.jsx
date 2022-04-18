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
import CloseIcon from "@mui/icons-material/Close";

import { Link, useLocation } from "react-router-dom";
import Image from "@jy95/material-ui-image";
import logo from "../../assets/img/logo.png";

import PublicNavList from "./navs/publicNav";
import PrivateNavList from "./navs/privateNav";
import ExpandNavList from "./navs/expandNavs";
import { logout } from "../../store/slices/authSlice";

import ModalStages from "./ModalStages";
import {
  changeLanguage,
  toggleDrawer as toggleDrawerAction,
} from "../../store/slices/uiSlice";

const Header = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { isFetching, drawerOpen, lang } = useSelector((state) => state.ui);
  const dispatch = useDispatch();
  const startLogout = () => dispatch(logout());
  const toggleDrawer = () => dispatch(toggleDrawerAction());
  const onLangChange = (e) => dispatch(changeLanguage(e.target.value));
  const location = useLocation();

  const conditRenderEssential = () =>
    isAuthenticated ? (
      <Button
        color="primary"
        variant="text"
        align="right"
        onClick={startLogout}
      >
        Logout
      </Button>
    ) : (
      <Link to="/login">
        <Button color="primary" variant="contained" align="right">
          Login
        </Button>
      </Link>
    );

  const dashboardModal = () => {
    if (location) {
      if (location.pathname.indexOf("partner") > -1) return <ModalStages />;
    }
  };

  const renderProgressBar = () =>
    isFetching ? <LinearProgress color="primary" /> : <span />;
  return (
    <div>
      <Drawer
        open={drawerOpen}
        onClose={toggleDrawer}
        style={{ display: "flex", flexDirection: "column" }}
      >
        <Box
          style={{
            display: "flex",
            justifyContent: "flex-end",
            paddingRight: "0.8rem",
            // border: "1px solid black",
          }}
        >
          <IconButton edge="end" size="large" onClick={toggleDrawer}>
            <CloseIcon />
          </IconButton>
        </Box>
        <div tabIndex={0} role="button">
          <div className="sidelistwrapper">
            {isAuthenticated ? (
              <PrivateNavList toggleDrawer={toggleDrawer} />
            ) : (
              <>
                <PublicNavList /> <ExpandNavList />
              </>
            )}
          </div>
        </div>
      </Drawer>
      <div className="appbarwrapper">
        <AppBar position="fixed" color="default">
          {renderProgressBar()}
          <Toolbar style={{ display: "flex" }}>
            {/* <Box style={{ display: "flex" }}> */}
            {!isAuthenticated ? null : (
              <IconButton
                className="iconbuttonsyle"
                size="large"
                edge="start"
                color="inherit"
                aria-label="Menu"
                onClick={toggleDrawer}
              >
                <MenuIcon />
              </IconButton>
            )}
            <Box
              // pt={0.5}
              style={{ flexGrow: 1, display: "flex", alignItems: "center" }}
            >
              <Link to="/">
                <Image
                  alt="ngLogo"
                  src={logo}
                  color="inherit"
                  style={{ height: 40, width: 165, paddingTop: 0, flex: 1 }}
                  imageStyle={{ height: 40, width: 165 }}
                />
              </Link>
              {/* </Box> */}
              {(location.pathname === "/" ||
                location.pathname.indexOf("partnerLanding") > -1) && (
                <FormControl
                  style={{
                    marginLeft: "0.8rem",
                    marginTop: "0.8rem",
                    marginBottom: "0.4rem",
                    minWidth: 121,
                  }}
                >
                  <InputLabel id="lang-input">Select Language</InputLabel>
                  <Select
                    label="Select Language"
                    onChange={onLangChange}
                    value={lang}
                    variant="outlined"
                    size="small"
                  >
                    <MenuItem disabled value="">
                      Select a Language
                    </MenuItem>
                    <MenuItem value="en">English</MenuItem>
                    <MenuItem value="hi">Hindi</MenuItem>
                  </Select>
                </FormControl>
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
