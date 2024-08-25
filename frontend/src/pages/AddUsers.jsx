import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, TextField, Button, Box } from '@mui/material';

export default function AddUsers() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [userId, setUserId] = useState('');
  const [users, setUsers] = useState([]);

  const getAuthToken = () => {
    const authData = JSON.parse(localStorage.getItem('authData'));
    return authData ? authData.token : '';
  };

  const handleAddUser = async () => {
    if (!userId) return;
    try {
      const response = await fetch(`http://localhost:8080/api/groups/${id}/users/${userId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to add user');
      }
      const data = await response.json();
      setUsers(prevUsers => [...prevUsers, data]);
      setUserId('');
      navigate(`/add-bills/${id}`);
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  return (
    <Container>
      <Box style={{ marginTop: '10px' }}>
        <Typography variant="h4" gutterBottom>
          Add Users to Group {id}
        </Typography>
        <TextField
          label="User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddUser}
          style={{ marginTop: '10px' }}
        >
          Add User
        </Button>
      </Box>
      <Box style={{ marginTop: '20px' }}>
        <Typography variant="h5" gutterBottom>
          Added Users
        </Typography>
        <ul>
          {users.map((user, index) => (
            <li key={index}>{user.id}</li>
          ))}
        </ul>
      </Box>
    </Container>
  );
}
