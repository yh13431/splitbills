import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Select, MenuItem, Button, Box, FormControl, InputLabel, Snackbar, Alert, Chip } from '@mui/material';

export default function AddUsers() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
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

  useEffect(() => {
    fetchUsers();
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
        const data = await response.json();
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
    <Container>
      <Box style={{ marginTop: '10px' }}>
        <Typography variant="h4" gutterBottom>
          Add Users to Group {id}
        </Typography>
        <FormControl fullWidth margin="normal">
          <InputLabel id="user-select-label">Select Users</InputLabel>
          <Select
            labelId="user-select-label"
            multiple
            value={selectedUsers}
            onChange={handleChange}
            renderValue={(selected) => (
              <div>
                {selected.map((userId) => {
                  const user = allUsers.find((u) => u.id === userId);
                  return <Chip key={userId} label={user?.username} />;
                })}
              </div>
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
          style={{ marginTop: '10px' }}
        >
          Add Users
        </Button>
        {error && (
          <Snackbar open={Boolean(error)} autoHideDuration={6000} onClose={() => setError('')}>
            <Alert onClose={() => setError('')} severity="error">
              {error}
            </Alert>
          </Snackbar>
        )}
        {success && (
          <Snackbar open={Boolean(success)} autoHideDuration={6000} onClose={() => setSuccess('')}>
            <Alert onClose={() => setSuccess('')} severity="success">
              {success}
            </Alert>
          </Snackbar>
        )}
      </Box>
    </Container>
  );
}
