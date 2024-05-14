import React, { useEffect } from "react";
import {
  AppBar,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  Drawer,
  Toolbar,
  Container,
  Box,
  Menu,
  ListItemAvatar,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  LinearProgress,
  Button,
  IconButton,
  Avatar,
} from "@mui/material";

import { useSelector, useDispatch } from "react-redux";

import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import LogoutIcon from "@mui/icons-material/Logout";
import ContactPhoneIcon from "@mui/icons-material/ContactPhone";

import { Link, useLocation } from "react-router-dom";
import Image from "@jy95/material-ui-image";
import logo from "../../assets/img/logo.png";

import NavList from "./navs";
import { logout } from "../../store/slices/authSlice";

import ModalStages from "./ModalStages";
import {
  changeLanguage,
  toggleDrawer as toggleDrawerAction,
} from "../../store/slices/uiSlice";

const Header = () => {
  const { isAuthenticated, loggedInUser } = useSelector((state) => state.auth);
  const { isFetching, drawerOpen, lang } = useSelector((state) => state.ui);
  const dispatch = useDispatch();
  const startLogout = () => dispatch(logout());
  const toggleDrawer = React.useCallback(
    () => dispatch(toggleDrawerAction()),
    []
  );
  const onLangChange = (e) => dispatch(changeLanguage(e.target.value));
  const location = useLocation();
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [appBarScroll, setAppBarScroll] = React.useState(false);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const dashboardModal = () => {
    if (location) {
      if (location.pathname.indexOf("partner") > -1) return <ModalStages />;
    }
  };

  const renderProgressBar = React.useCallback(
    () => isFetching && <LinearProgress color="primary" />,
    [isFetching]
  );

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setAppBarScroll(true);
      } else if (window.scrollY === 0) {
        setAppBarScroll(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <Drawer
        open={drawerOpen}
        onClose={toggleDrawer}
        keepMounted
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
            {isAuthenticated && <NavList toggleDrawer={toggleDrawer} />}
          </div>
        </div>
      </Drawer>
      <Container maxWidth="xl" className="appbarwrapper">
        <AppBar
          id="appheader"
          position="fixed"
          color="default"
          style={{
            boxShadow: !appBarScroll && "none",
            backgroundColor: !appBarScroll && "white",
          }}
        >
          {renderProgressBar()}
          <Toolbar style={{ display: "flex" }}>
            {/* <Box style={{ display: "flex" }}> */}
            {isAuthenticated && (
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
                  data-cy="logo"
                  alt="ngLogo"
                  src={logo}
                  color="inherit"
                  style={{ height: 40, width: 165, paddingTop: 0, flex: 1 }}
                  imageStyle={{ height: 40, width: 165 }}
                />
              </Link>
              {/* </Box> */}
              {(location.pathname === "/" ||
                location.pathname === "/amravati" ||
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
                    data-cy="lang-dropdown"
                    label="Select Language"
                    onChange={onLangChange}
                    value={lang}
                    variant="outlined"
                    size="small"
                  >
                    <MenuItem disabled value="">
                      Select a Language
                    </MenuItem>
                    <MenuItem data-cy="en" value="en">
                      English
                    </MenuItem>
                    <MenuItem data-cy="hi" value="hi">
                      Hindi
                    </MenuItem>
                    <MenuItem data-cy="ma" value="ma">
                      Marathi
                    </MenuItem>
                  </Select>
                </FormControl>
              )}
            </Box>
            <Box style={{ display: "flex", gap: "12px" }}>
              {dashboardModal()}
              {isAuthenticated ? (
                <>
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    {loggedInUser ? (
                      <Avatar
                        alt={loggedInUser.user_name}
                        src={loggedInUser.profile_pic}
                      />
                    ) : (
                      <Avatar />
                    )}
                  </IconButton>
                  <Menu
                    sx={{ mt: "2rem" }}
                    id="user-menu"
                    anchorEl={anchorElUser}
                    anchorOrigin={{ vertical: "top", horizontal: "right" }}
                    keepMounted
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                  >
                    <MenuItem>
                      {loggedInUser ? (
                        <>
                          <ListItemAvatar>
                            <Avatar
                              alt={loggedInUser.user_name}
                              src={loggedInUser.profile_pic}
                            />
                          </ListItemAvatar>
                          <ListItemText
                            primary={loggedInUser.user_name}
                            secondary={loggedInUser.email}
                          />
                        </>
                      ) : (
                        ""
                      )}
                    </MenuItem>
                    <Divider />
                    <Link to="/update/mobile/number">
                      <MenuItem>
                        <ListItemIcon>
                          <ContactPhoneIcon />
                        </ListItemIcon>
                        <ListItemButton>Update mobile Number</ListItemButton>
                      </MenuItem>
                    </Link>
                    <MenuItem>
                      <ListItemIcon>
                        <LogoutIcon />
                      </ListItemIcon>
                      <ListItemButton
                        onClick={() => {
                          handleCloseUserMenu();
                          startLogout();
                        }}
                      >
                        Logout
                      </ListItemButton>
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <Link to="/login">
                  <Button color="primary" variant="contained" align="right">
                    admin Login
                  </Button>
                </Link>
              )}
            </Box>
          </Toolbar>
        </AppBar>
      </Container>
    </>
  );
};

export default Header;
