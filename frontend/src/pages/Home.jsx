import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, Card, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const [groups, setGroups] = useState([]);
  const navigate = useNavigate();

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
                <>
                  <Typography variant="h6">{group.name}</Typography>
                  <Button
                    variant="contained"
                    color="info"
                    onClick={() => navigate(`/view-group/${group.id}`)}
                    style={{ marginTop: '20px', marginLeft: '10px' }}
                  >
                    View Group
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
            </CardContent>
          </Card>
        ))
      )}
    </Container>
  );
}