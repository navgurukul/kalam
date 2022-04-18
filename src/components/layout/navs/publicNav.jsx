import React from "react";
import { List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import ExtensionIcon from "@mui/icons-material/Extension";
import PhoneIcon from "@mui/icons-material/Phone";

/* import your desired icon from material-ui icons library */
import { NavLink } from "react-router-dom";

export const publicNavs = [
  {
    url: "/home",
    name: "Home",
    icon: <HomeIcon />,
  },
  {
    url: "/products",
    name: "Products",
    icon: <ExtensionIcon />,
  },
  {
    url: "/contact",
    name: "Contact",
    icon: <PhoneIcon />,
  },
  // add new Nav links here as a json object, in this file the public navigations
];

export default () =>
  publicNavs.map((navItem) => (
    <NavLink
      to={navItem.url}
      className="NavLinkItem"
      key={navItem.url}
      activeClassName="NavLinkItem-selected"
    >
      {" "}
      <List component="nav">
        {" "}
        <ListItem button>
          <ListItemIcon className="innernavitem">{navItem.icon}</ListItemIcon>
          <ListItemText
            primary={navItem.name}
            className="innernavitem"
            color="black"
          />
        </ListItem>
      </List>{" "}
    </NavLink>
  ));
