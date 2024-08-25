import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Typography, Button, Card, CardContent, Box, TextField } from '@mui/material';

export default function Home() {
  const [groups, setGroups] = useState([]);
  const [editMode, setEditMode] = useState(null);
  const [name, setName] = useState('');

  const getAuthToken = () => {
    const authData = JSON.parse(localStorage.getItem('authData'));
    return authData ? authData.token : '';
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
      setGroups(data);
    } catch (error) {
      console.error('Error fetching groups:', error.message);
    }
  };

  const updateGroup = async (groupId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/groups/${groupId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify({ name })
      });
      if (!response.ok) {
        throw new Error('Failed to update group');
      }
      setEditMode(null);
      fetchGroups();
    } catch (error) {
      console.error('Error updating group:', error.message);
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
      {Object.keys(groups).length === 0 ? (
        <Typography variant="body1">No groups available</Typography>
      ) : (
        Object.values(groups).map((group) => (
          <Card key={group.id} style={{ marginTop: '20px' }}>
            <CardContent>
              {editMode === group.id ? (
                <Box>
                  <TextField
                    label="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    fullWidth
                    margin="normal"
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => updateGroup(group.id)}
                    style={{ marginTop: '20px', marginRight: '10px' }}
                  >
                    Save Changes
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => setEditMode(null)}
                    style={{ marginTop: '20px' }}
                  >
                    Cancel
                  </Button>
                </Box>
              ) : (
                <>
                  <Typography variant="h6">{group.name}</Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      setEditMode(group.id);
                      setName(group.name);
                    }}
                    style={{ marginTop: '20px', marginRight: '10px' }}
                  >
                    Edit Group
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => deleteGroup(group.id)}
                    style={{ marginTop: '20px' }}
                  >
                    Delete Group
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </Container>
  );
}