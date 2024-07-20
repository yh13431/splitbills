import React from 'react';
import { AppBar, Link, Toolbar, Typography, ListItemButton } from '@mui/material';

const Header = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <ListItemButton component={Link} to="/">
            Split Bills
          </ListItemButton>
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
