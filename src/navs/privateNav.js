
import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import PropTypes from "prop-types";
import HomeIcon from '@material-ui/icons/Home';
import ExtensionIcon from '@material-ui/icons/Extension';
import PhoneIcon from '@material-ui/icons/Phone';

/* import your desired icon from material-ui icons library */
import { NavLink } from 'react-router-dom';


export const publicNavs = [
    {
        url: '/students',
        name: 'Students',
        icon: <HomeIcon />
    },
    {
        url: '/partners',
        name: 'Partners',
        icon: <ExtensionIcon />
    }, 
    {
        url: '/tasks',
        name: 'My Tasks',
        icon: <ExtensionIcon />
    },
    // {
    //     url: '/report/dangling',
    //     name: 'Overview dangling',
    //     icon: <ExtensionIcon />
    // },
    {
        url: '/report/all',
        name: 'Reports',
        icon: <ExtensionIcon />
    },
    // {
    //     url: '/feedbackble/report',
    //     name: "Feedbackble Overview",
    //     icon: <ExtensionIcon />
    // },
    {
        url: '/assign/user',
        name: 'Assigned Users',
        icon: <ExtensionIcon />
    },
    {
        url: '/update/mobile/number',
        name: 'Update mobile Number',
        icon: <ExtensionIcon/>
    },
    // {
    //     url: '/movies',
    //     name: 'Movies',
    //     icon: <PhoneIcon />
    // },
    // add new Nav links here as a json object, in this file the public navigations
];



export default () => (
    publicNavs.map((navItem) => {
        return <NavLink to={navItem.url} className="NavLinkItem" key={navItem.url} activeClassName="NavLinkItem-selected"> <List component="nav" >  <ListItem button>
            <ListItemIcon className="innernavitem">
                {navItem.icon}
            </ListItemIcon>
            <ListItemText primary={navItem.name} className="innernavitem" color="black" />
        </ListItem></List> </NavLink>
    })
);