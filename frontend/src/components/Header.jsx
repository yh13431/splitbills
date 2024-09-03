import React, { useState } from 'react';
import { Drawer, List, ListItem, ListItemText, IconButton, Typography, Box, Toolbar, AppBar } from '@mui/material'; 
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const authData = localStorage.getItem('authData');

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('authData');
    navigate('/');
  };

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={handleDrawerOpen}>
            <i className="fas fa-bars" />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: 'left', marginLeft: '15px' }}>
            <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
              Split Bills
            </Link>
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        anchor="left"
        open={open}
        onClose={handleDrawerClose}
        sx={{ width: 240, flexShrink: 0 }}
      >
        <Box
          sx={{ width: 240 }}
          role="presentation"
          onClick={handleDrawerClose}
          onKeyDown={handleDrawerClose}
        >
          <List>
            <ListItem>
              <ListItemText>
                <Typography variant="h6">
                  <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <i className="fas fa-home" style={{ marginRight: 8 }} />
                    Home
                  </Link>
                </Typography>
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText>
                <Typography variant="h6">
                  <Link to="/create-group" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <i className="fas fa-users" style={{ marginRight: 8 }} />
                    Create New Group
                  </Link>
                </Typography>
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText>
                <Typography variant="h6">
                  <Link to="/view-debts" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <i className="fas fa-credit-card" style={{ marginRight: 8 }} />
                    View Debts
                  </Link>
                </Typography>
              </ListItemText>
            </ListItem>
            {!authData && (
              <>
                <ListItem>
                  <ListItemText>
                    <Typography variant="h6">
                      <Link to="/login" style={{ textDecoration: 'none', color: 'inherit' }}>
                        <i className="fas fa-sign-in-alt" style={{ marginRight: 8 }} />
                        Log In
                      </Link>
                    </Typography>
                  </ListItemText>
                </ListItem>
                <ListItem>
                  <ListItemText>
                    <Typography variant="h6">
                      <Link to="/register" style={{ textDecoration: 'none', color: 'inherit' }}>
                        <i className="fas fa-user-plus" style={{ marginRight: 8 }} />
                        Register
                      </Link>
                    </Typography>
                  </ListItemText>
                </ListItem>
              </>
            )}
            {authData && (
              <ListItem>
                <ListItemText>
                  <Typography variant="h6">
                    <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }} onClick={handleLogout}>
                      <i className="fas fa-sign-out-alt" style={{ marginRight: 8 }} />
                      Logout
                    </Link>
                  </Typography>
                </ListItemText>
              </ListItem>
            )}
          </List>
        </Box>
      </Drawer>
    </Box>
  );
}

export default Header;