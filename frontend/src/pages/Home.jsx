import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, Card, CardContent, Grid, Box, TextField, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import exampleImage from '../assets/istockphoto-678605672-612x612.jpg';

export default function Home() {
  const [groups, setGroups] = useState([]);
  const [filteredGroups, setFilteredGroups] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const getAuthToken = () => {
    const authData = JSON.parse(localStorage.getItem('authData'));
    return authData ? authData.token : '';
  };

  const getUserId = () => {
    const authData = JSON.parse(localStorage.getItem('authData'));
    return authData ? authData.user : '';
  };

  const fetchGroups = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/groups`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch groups');
      }
      const data = await response.json();
      const userId = getUserId();
      const userGroups = data.filter(group => group.users.includes(userId));
      setGroups(userGroups);
      setFilteredGroups(userGroups);
    } catch (error) {
      console.error('Error fetching groups:', error.message);
    }
  };

  const deleteGroup = async (groupId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/groups/${groupId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`
        },
      });
      if (!response.ok) {
        throw new Error('Failed to delete group');
      }
      fetchGroups();
    } catch (error) {
      console.error('Error deleting group:', error.message);
    }
  };

  const handleSearchChange = (event) => {
    const term = event.target.value;
    setSearchTerm(term);
    const filtered = groups.filter(group =>
      group.name.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredGroups(filtered);
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  return (
    <Container>
      <Box>
        <Paper elevation={2} style={{ padding: '40px', marginBottom: '5%', marginTop: '5%', borderRadius: '8px' }}>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box flex={1} paddingRight={2}>
              <Typography variant="h1" gutterBottom>
                SplitBills
              </Typography>
              <Typography variant="h5" color="textSecondary" paragraph>
                Effortlessly add users to groups and split bills. Stay organized and manage expenses with ease.
              </Typography>
              <Box display="flex" justifyContent="flex-start" mb={3}>
                <Button
                  variant="contained"
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
                  onClick={() => navigate('/create-group')}
                  style={{ marginRight: '10px' }}
                >
                  Create New Group
                </Button>
              </Box>
            </Box>
            <Box flex={1} display="flex" justifyContent="center">
              <img
                src={exampleImage}
                alt="Background"
                style={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: '8px',
                  objectFit: 'cover',
                }}
              />
            </Box>
          </Box>
        </Paper>
      </Box>
      <Box display="flex" justifyContent="center" alignItems="center" mb={2}>
        <TextField
          label="Search Groups"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={handleSearchChange}
          style={{ maxWidth: '400px' }}
        />
      </Box>
      <Box mb={5}>
        {filteredGroups.length === 0 ? (
          <Typography variant="body1" align="center" color="textSecondary" style={{ marginTop: '20px' }}>
            No groups available
          </Typography>
        ) : (
          <Grid container spacing={3} style={{ marginTop: '20px' }}>
            {filteredGroups.map((group) => (
              <Grid item xs={12} sm={6} md={4} key={group.id}>
                <Card elevation={3} style={{ borderRadius: '8px', overflow: 'hidden' }}>
                  <CardContent>
                    <Typography variant="h6" style={{ fontWeight: 600 }}>
                      {group.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {group.users.length} users
                    </Typography>
                    <div style={{ marginTop: '20px' }}>
                      <Button
                        variant="contained"
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
                        onClick={() => navigate(`/view-group/${group.id}`)}
                        style={{ marginRight: '10px' }}
                      >
                        View Group
                      </Button>
                      <Button
                        variant="outlined"
                        sx={{
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
                        onClick={() => deleteGroup(group.id)}
                      >
                        Delete Group
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Container>
  );
}
