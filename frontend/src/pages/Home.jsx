import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, Card, CardContent, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const [groups, setGroups] = useState([]);
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

  useEffect(() => {
    fetchGroups();
  }, []);

  return (
    <Container>
      {groups.length === 0 ? (
        <Typography variant="body1" align="center" color="textSecondary" style={{ marginTop: '20px' }}>
          No groups available
        </Typography>
      ) : (
        <Grid container spacing={3} style={{ marginTop: '20px' }}>
          {groups.map((group) => (
            <Grid item xs={12} sm={6} md={4} key={group.id}>
              <Card elevation={3} style={{ borderRadius: '8px', overflow: 'hidden' }}>
                <CardContent>
                  <Typography variant="h6" style={{ fontWeight: 600 }}>
                    {group.name}
                  </Typography>
                  <div style={{ marginTop: '20px' }}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => navigate(`/view-group/${group.id}`)}
                      style={{ marginRight: '10px' }}
                    >
                      View Group
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
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
    </Container>
  )
}
