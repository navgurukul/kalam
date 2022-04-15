import React, { useEffect, useState } from "react";
import { List, ListItem, ListItemIcon, ListItemText } from "@mui/material";

import HomeIcon from "@mui/icons-material/Home";
// import ExtensionIcon from "@mui/icons-material/Extension";
import AssessmentIcon from "@mui/icons-material/Assessment";
import ContactPhoneIcon from "@mui/icons-material/ContactPhone";
import AssignmentIcon from "@mui/icons-material/Assignment";
import MapsHomeWorkIcon from "@mui/icons-material/MapsHomeWork";
import GroupIcon from "@mui/icons-material/Group";

import axios from "axios";

/* import your desired icon from material-ui icons library */
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

export default ({ toggleDrawer }) => {
  const baseUrl = import.meta.env.VITE_API_URL;
  const { loggedInUser } = useSelector((state) => state.auth);
  const [access, setAccess] = useState({});

  useEffect(() => {
    axios.get(`${baseUrl}rolebaseaccess`).then((res) => {
      setAccess(res.data);
    });
  }, []);
  const publicNavs = [
    access &&
      loggedInUser &&
      loggedInUser.email &&
      access.students &&
      access.students.view &&
      access.students.view.includes(loggedInUser.email) && {
        url: "/students",
        name: "Students",
        icon: <HomeIcon />,
      },
    access &&
      loggedInUser &&
      loggedInUser.email &&
      access.partners &&
      access.partners.view &&
      access.partners.view.includes(loggedInUser.email) && {
        url: "/partners",
        name: "Partners",
        icon: <GroupIcon />,
      },
    {
      url: "/donors",
      name: "Donors",
      icon: <GroupIcon />,
    },
    access &&
      loggedInUser &&
      loggedInUser.email &&
      access.campus &&
      access.campus.view &&
      access.campus.view.includes(loggedInUser.email) && {
        url: "/campus",
        name: "Campuses",
        icon: <MapsHomeWorkIcon />,
      },
    {
      url: "/owner",
      name: "Owners",
      icon: <GroupIcon />,
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
