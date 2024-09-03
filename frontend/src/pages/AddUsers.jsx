import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Box, Typography, FormControl, InputLabel, Select, MenuItem, Chip, Button, Snackbar, Alert } from '@mui/material';

export default function AddUsers() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [groupName, setGroupName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const getAuthToken = () => {
    const authData = JSON.parse(localStorage.getItem('authData'));
    return authData ? authData.token : '';
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/users', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await response.json();
      setAllUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error.message);
    }
  };

  const fetchGroupDetails = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/groups/${id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch group details');
      }
      const data = await response.json();
      setGroupName(data.name);
    } catch (error) {
      console.error('Error fetching group details:', error.message);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchGroupDetails();
  }, []);

  const handleAddUser = async () => {
    if (selectedUsers.length < 2) {
      setError('At least 2 users must be added to the group.');
      return;
    }

    try {
      for (const userId of selectedUsers) {
        const response = await fetch(`http://localhost:8080/api/groups/${id}/users/${userId}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${getAuthToken()}`
          }
        });
        if (!response.ok) {
          throw new Error(`Failed to add user with ID ${userId}`);
        }
      }
      setSuccess('Users added successfully!');
      setError('');
      setSelectedUsers([]);
      navigate(`/view-group/${id}`);
    } catch (error) {
      setError('Error adding users: ' + error.message);
    }
  };

  const handleChange = (event) => {
    setSelectedUsers(event.target.value);
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          mt: 4,
          p: 3,
          boxShadow: 3,
          borderRadius: 2,
          backgroundColor: 'background.paper',
        }}
      >
        <Typography variant="h5" component="h1" align="center" gutterBottom>
          Add Users to {groupName ? `${groupName}` : 'Group'}
        </Typography>
        <FormControl fullWidth margin="normal" variant="outlined">
          <InputLabel id="user-select-label">Select Users</InputLabel>
          <Select
            labelId="user-select-label"
            multiple
            value={selectedUsers}
            onChange={handleChange}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((userId) => {
                  const user = allUsers.find((u) => u.id === userId);
                  return <Chip key={userId} label={user?.username} />;
                })}
              </Box>
            )}
          >
            {allUsers.map((user) => (
              <MenuItem key={user.id} value={user.id}>
                {user.username}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddUser}
          fullWidth
          sx={{ mt: 2 }}
        >
          Add Users
        </Button>
      </Box>
      <Snackbar open={Boolean(error)} autoHideDuration={6000} onClose={() => setError('')}>
        <Alert onClose={() => setError('')} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
      <Snackbar open={Boolean(success)} autoHideDuration={6000} onClose={() => setSuccess('')}>
        <Alert onClose={() => setSuccess('')} severity="success" sx={{ width: '100%' }}>
          {success}
        </Alert>
      </Snackbar>
    </Container>
  );
}
