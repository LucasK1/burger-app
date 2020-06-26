import React from 'react';
import classes from './NavigationItems.module.css';
import NavigationItem from './NavigationItem/NavigationItem';
import Aux from '../../../hoc/Auxiliary/Auxiliary';

const navigationItems = (props) => {
  let buttons = props.isAuthenticated ? (
    <Aux>
      <NavigationItem link="/orders">Orders</NavigationItem>
      <NavigationItem link="/logout">Logout</NavigationItem>
    </Aux>
  ) : (
    <NavigationItem link="/auth">Sign Up/Sign In</NavigationItem>
  );
  return (
    <ul className={classes.NavigationItems}>
      <NavigationItem link="/">Burger Builder</NavigationItem>
      {buttons}
    </ul>
  );
};

export default navigationItems;
