import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Box, Typography, FormControl, InputLabel, Select, MenuItem, Chip, Button } from '@mui/material';
import CustomSnackbar from '../components/CustomSnackbar';
import LoadingScreen from '../components/LoadingScreen'; 

export default function AddUsers() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [groupName, setGroupName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [userIds, setUserIds] = useState([]);

  const getAuthToken = () => {
    const authData = JSON.parse(localStorage.getItem('authData'));
    return authData ? authData.token : '';
  };

  const getCurrentUserId = () => {
    const authData = JSON.parse(localStorage.getItem('authData'));
    return authData ? authData.user : '';
  };

  const fetchUsers = async () => {
    setLoading(true);
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
      setError('Error fetching users: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchGroupDetails = async () => {
    setLoading(true);
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
      setUserIds(data.users)
    } catch (error) {
      setError('Error fetching group details: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchUsers();
      await fetchGroupDetails();
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    if (allUsers.length > 0 && userIds.length > 0) {
      const userIdsInGroup = allUsers
        .filter(user => userIds.includes(user.id))
        .map(user => user.id);
      setSelectedUsers(userIdsInGroup);
    }
  }, [allUsers, userIds]);

  const handleAddUser = async () => {
    const currentUserId = getCurrentUserId();
    if (selectedUsers.length < 2 || !selectedUsers.includes(currentUserId)) {
      setError('You must add yourself and at least one other user to the group.');
      return;
    }

    setLoading(true);
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
      setTimeout(() => navigate(`/view-group/${id}`), 1000);
    } catch (error) {
      setError('Error adding users: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    const value = event.target.value;
    setSelectedUsers(value);
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
          <InputLabel id="user-select-label">
            Select Users
          </InputLabel>
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
          onClick={handleAddUser}
          fullWidth
          sx={{
            mt: 2,
            borderRadius: '30px',
            backgroundColor: selectedUsers.length > 0 ? '#333' : 'grey.400',
            color: '#fff',
            boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s',
            '&:hover': {
              backgroundColor: selectedUsers.length > 0 ? '#444' : 'grey.500',
            },
            cursor: selectedUsers.length > 0 ? 'pointer' : 'not-allowed'
          }}
          disabled={selectedUsers.length === 0}
        >
          Add Users
        </Button>
      </Box>
      {loading && <LoadingScreen />}
      <CustomSnackbar
        open={Boolean(error)}
        onClose={() => setError('')}
        message={error}
        severity="error"
      />
      <CustomSnackbar
        open={Boolean(success)}
        onClose={() => setSuccess('')}
        message={success}
        severity="success"
      />
    </Container>
  );  
}
