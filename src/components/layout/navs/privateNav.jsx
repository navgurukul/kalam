import React from "react";
import { List, ListItem, ListItemIcon, ListItemText } from "@mui/material";

import HomeIcon from "@mui/icons-material/Home";
// import ExtensionIcon from "@mui/icons-material/Extension";
import AssessmentIcon from "@mui/icons-material/Assessment";
import ContactPhoneIcon from "@mui/icons-material/ContactPhone";
import AssignmentIcon from "@mui/icons-material/Assignment";
import MapsHomeWorkIcon from "@mui/icons-material/MapsHomeWork";
import GroupIcon from "@mui/icons-material/Group";
import WorkIcon from "@mui/icons-material/Work";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

export default ({ toggleDrawer }) => {
  const { roles, privileges } = useSelector((state) => state.auth);

  const publicNavs = [
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
    {
      url: "/tasks",
      name: "My Tasks",
      icon: <AssignmentIcon />,
    },

    {
      url: "/report/all",
      name: "Reports",
      icon: <AssessmentIcon />,
    },

    {
      url: "/assign/user",
      name: "Assigned Users",
      icon: <GroupIcon />,
    },
    {
      url: "/update/mobile/number",
      name: "Update mobile Number",
      icon: <ContactPhoneIcon />,
    },
  ];

  // const data = filter(function (element) {
  //   return element !== undefined;
  // });

  return publicNavs.map(
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
          {" "}
          <List component="nav">
            {" "}
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
          </List>{" "}
        </NavLink>
      )
  );
};
