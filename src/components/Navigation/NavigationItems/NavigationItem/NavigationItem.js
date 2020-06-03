import React from 'react';
import { NavLink } from 'react-router-dom';
import classes from './NavigationItem.module.css';

export const navigationItem = (props) => (
  <li className={classes.NavigationItem}>
    <NavLink to={props.link} exact activeClassName={classes.active}>
      {props.children}
    </NavLink>
  </li>
);

export default navigationItem;
