import React from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Collapse from "@material-ui/core/Collapse";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import StarBorder from "@material-ui/icons/StarBorder";
import LabelIcon from "@material-ui/icons/Label";
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
