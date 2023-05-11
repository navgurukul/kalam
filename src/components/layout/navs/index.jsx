import React from "react";
import { List, ListItem, ListItemIcon, ListItemText } from "@mui/material";

import HomeIcon from "@mui/icons-material/Home";
import MapsHomeWorkIcon from "@mui/icons-material/MapsHomeWork";
import GroupIcon from "@mui/icons-material/Group";
import WorkIcon from "@mui/icons-material/Work";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import SchoolIcon from '@mui/icons-material/School';

import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

const NavLinks = ({ toggleDrawer }) => {
  const { roles, privileges } = useSelector((state) => state.auth);

  const navs = React.useMemo(
    () => [
      roles.some((role) => role.role === "Admin") && {
        url: "/admin",
        name: "Admin",
        icon: <AdminPanelSettingsIcon />,
      },
      privileges.some((priv) => priv.privilege === "ViewDashboard") && {
        url: "/students",
        name: "Students",
        icon: <HomeIcon />,
      },
      privileges.some((priv) => priv.privilege === "ViewPartners") && {
        url: "/partners",
        name: "Partners",
        icon: <GroupIcon />,
      },
      privileges.some((priv) => priv.privilege === "ViewPartners") && {
        url: "/partner/groups",
        name: "Partner Groups",
        icon: <GroupIcon />,
      },
      {
        url: "/donors",
        name: "Donors",
        icon: <GroupIcon />,
      },
      {
        url: "/campus",
        name: "Campuses",
        icon: <MapsHomeWorkIcon />,
      },
      {
        url:"/school",
        name:"School",
        icon: <SchoolIcon/>,
      },
      {
        url: "/owner",
        name: "Owners",
        icon: <GroupIcon />,
      },
      privileges.some((priv) => priv.privilege === "ViewPlacements") && {
        url: "/placements",
        name: "Placements",
        icon: <WorkIcon />,
      },
      {
        url: "/outreachDetails",
        name: "Outreach Details",
        icon: <GroupIcon />,
      },
    ],
    [roles, privileges]
  );

  const navLinks = React.useMemo(
    () =>
      navs.map(
        (navItem) =>
          navItem && (
            <NavLink
              to={navItem.url}
              className={({ isActive }) =>
                isActive ? "NavLinkItem-selected" : "NavLinkItem"
              }
              key={navItem.url}
              onClick={toggleDrawer}
            >
              <List component="nav">
                <ListItem button>
                  <ListItemIcon className="innernavitem">
                    {navItem.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={navItem.name}
                    className="innernavitem"
                    color="black"
                  />
                </ListItem>
              </List>
            </NavLink>
          )
      ),
    [navs]
  );
  return navLinks;
};

export default NavLinks;
