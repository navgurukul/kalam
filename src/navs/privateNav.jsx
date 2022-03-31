import React, { useEffect, useState } from "react";
import { List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import ExtensionIcon from "@mui/icons-material/Extension";
import axios from "axios";

/* import your desired icon from material-ui icons library */
import { NavLink } from "react-router-dom";
import user from "../utils/user";

export default () => {
  const baseUrl = import.meta.env.VITE_API_URL;
  const [access, setAccess] = useState({});
  const userLoggedIn = user();

  useEffect(() => {
    axios.get(`${baseUrl}rolebaseaccess`).then((res) => {
      setAccess(res.data);
    });
  }, []);
  const publicNavs = [
    access &&
      userLoggedIn &&
      userLoggedIn.email &&
      access.students &&
      access.students.view &&
      access.students.view.includes(userLoggedIn.email) && {
        url: "/students",
        name: "Students",
        icon: <HomeIcon />,
      },
    access &&
      userLoggedIn &&
      userLoggedIn.email &&
      access.partners &&
      access.partners.view &&
      access.partners.view.includes(userLoggedIn.email) && {
        url: "/partners",
        name: "Partners",
        icon: <ExtensionIcon />,
      },
    {
      url: "/donors",
      name: "Donors",
      icon: <ExtensionIcon />,
    },
    access &&
      userLoggedIn &&
      userLoggedIn.email &&
      access.campus &&
      access.campus.view &&
      access.campus.view.includes(userLoggedIn.email) && {
        url: "/campus",
        name: "Campuses",
        icon: <ExtensionIcon />,
      },
    {
      url: "/owner",
      name: "Owners",
      icon: <ExtensionIcon />,
    },
    {
      url: "/outreachDetails",
      name: "Outreach    Details",
      icon: <ExtensionIcon />,
    },
    {
      url: "/tasks",
      name: "My Tasks",
      icon: <ExtensionIcon />,
    },

    {
      url: "/report/all",
      name: "Reports",
      icon: <ExtensionIcon />,
    },

    {
      url: "/assign/user",
      name: "Assigned Users",
      icon: <ExtensionIcon />,
    },
    {
      url: "/update/mobile/number",
      name: "Update mobile Number",
      icon: <ExtensionIcon />,
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
