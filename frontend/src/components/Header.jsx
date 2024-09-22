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
    <AppBar position="static" sx={{ backgroundColor: '#fff', color: '#333', zIndex: 1201 }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '1.5rem', marginRight: 2 }}>
            <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
              SplitBills
            </Link>
          </Typography>
          <Button
            variant="outlined"
            sx={{
              marginX: 1,
              borderRadius: '30px',
              fontWeight: '500',
              borderColor: '#333',
              color: '#333',
              backgroundColor: 'transparent',
              boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.3s',
              '&:hover': {
                backgroundColor: '#333',
                color: '#fff',
                borderColor: '#333',
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
              },
            }}
          >
            <Link to="/create-group" style={{ textDecoration: 'none', color: 'inherit' }}>
              Create New Group
            </Link>
          </Button>
          <Button
            variant="outlined"
            sx={{
              marginX: 1,
              borderRadius: '30px',
              fontWeight: '500',
              borderColor: '#333',
              color: '#333',
              backgroundColor: 'transparent',
              boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.3s',
              '&:hover': {
                backgroundColor: '#333',
                color: '#fff',
                borderColor: '#333',
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
              },
            }}
          >
            <Link to="/view-debts" style={{ textDecoration: 'none', color: 'inherit' }}>
              View Debts
            </Link>
          </Button>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {authData ? (
            <>
              <Typography variant="h6" sx={{ marginRight: 2, fontSize: '1rem', fontWeight: 400 }}>
                {username}
              </Typography>
              <Button
                variant="contained"
                onClick={handleLogout}
                sx={{
                  borderRadius: '30px',
                  fontWeight: '500',
                  backgroundColor: '#333',
                  color: '#fff',
                  boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.3s',
                  '&:hover': {
                    backgroundColor: '#444',
                    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
                  },
                }}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outlined"
                sx={{
                  marginX: 1,
                  borderRadius: '30px',
                  fontWeight: '500',
                  borderColor: '#333',
                  color: '#333',
                  backgroundColor: 'transparent',
                  boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.3s',
                  '&:hover': {
                    backgroundColor: '#333',
                    color: '#fff',
                    borderColor: '#333',
                    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
                  },
                }}
              >
                <Link to="/login" style={{ textDecoration: 'none', color: 'inherit' }}>
                  Log In
                </Link>
              </Button>
              <Button
                variant="contained"
                sx={{
                  borderRadius: '30px',
                  fontWeight: '500',
                  marginLeft: 1,
                  backgroundColor: '#333',
                  color: '#fff',
                  boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.3s',
                  '&:hover': {
                    backgroundColor: '#444',
                    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
                  },
                }}
              >
                <Link to="/register" style={{ textDecoration: 'none', color: '#fff' }}>
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