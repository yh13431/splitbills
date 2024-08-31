import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Select, MenuItem, Button, Box, FormControl, InputLabel } from '@mui/material';

export default function AddUsers() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedUser, setSelectedUser] = useState('');
  const [users, setUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  const getAuthToken = () => {
    const authData = JSON.parse(localStorage.getItem('authData'));
    return authData ? authData.token : '';
  };

  // Fetch all users to populate the dropdown
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
    if (!selectedUser) return;
    try {
      const response = await fetch(`http://localhost:8080/api/groups/${id}/users/${selectedUser}`, {
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
      setSelectedUser('');
      navigate(`/view-group/${id}`);
    } catch (error) {
      console.error('Error adding user:', error.message);
    }
  };

  return (
    <Container>
      <Box style={{ marginTop: '10px' }}>
        <Typography variant="h4" gutterBottom>
          Add Users to Group {id}
        </Typography>
        <FormControl fullWidth margin="normal">
          <InputLabel id="user-select-label">Select User</InputLabel>
          <Select
            labelId="user-select-label"
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
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
          Add User
        </Button>
      </Box>
    </Container>
  );
}
