import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Box, Button } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Header = () => {
  const [username, setUsername] = useState('');
  const navigate = useNavigate();
  const authData = JSON.parse(localStorage.getItem('authData'));

  useEffect(() => {
    if (authData && authData.token) {
      axios.get('http://localhost:8080/api/users/me', {
        headers: { Authorization: `Bearer ${authData.token}` }
      })
      .then(response => {
        setUsername(response.data.username);
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
        setUsername('');
      });
    }
  }, [authData]);

  const handleLogout = () => {
    localStorage.removeItem('authData');
    setUsername('');
    navigate('/');
    window.location.reload();
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Box sx={{ display: 'flex', flexGrow: 1 }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button color="inherit" sx={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
              <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                SplitBills
              </Link>
            </Button>
            <Button color="inherit">
              <Link to="/create-group" style={{ textDecoration: 'none', color: 'inherit' }}>
                Create New Group
              </Link>
            </Button>
            <Button color="inherit">
              <Link to="/view-debts" style={{ textDecoration: 'none', color: 'inherit' }}>
                View Debts
              </Link>
            </Button>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {authData ? (
            <>
              <Typography variant="h6" sx={{ marginRight: 5, fontSize: '1rem', fontWeight: 400 }}>
                {username}
              </Typography>
              <Button color="inherit" onClick={handleLogout} sx={{ fontSize: '1rem', fontWeight: 400 }}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit">
                <Link to="/login" style={{ textDecoration: 'none', color: 'inherit' }}>
                  Log In
                </Link>
              </Button>
              <Button color="inherit" sx={{ marginLeft: 1 }}>
                <Link to="/register" style={{ textDecoration: 'none', color: 'inherit' }}>
                  Register
                </Link>
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;