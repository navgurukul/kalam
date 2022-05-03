import React from "react";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
} from "@mui/material";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import StarBorder from "@mui/icons-material/StarBorder";
import LabelIcon from "@mui/icons-material/Label";
import { NavLink } from "react-router-dom";

const ExpandNav = () => {
  const [componentsmenuopen, setComponentMenuOpen] = React.useState(false);

  const handleClick = () => {
    //console.log("clicked");
    setComponentMenuOpen((prev) => !prev);
  };

  return (
    <List component="nav">
      <ListItem button onClick={handleClick}>
        <ListItemIcon className="innernavitem">
          <LabelIcon />
        </ListItemIcon>
        <ListItemText inset primary="Components" />
        {componentsmenuopen ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={componentsmenuopen} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <NavLink to="/forms" className="NavLinkItem">
            <ListItem button>
              <ListItemIcon className="innernavitem">
                <StarBorder />
              </ListItemIcon>
              <ListItemText inset primary="Forms" />
            </ListItem>
          </NavLink>
        </List>
      </Collapse>
    </List>
  );
};

export default ExpandNav;
