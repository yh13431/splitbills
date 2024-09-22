import React, { useState, useEffect, useMemo } from 'react';
import { Container, Box, Typography, Button, List, ListItem, ListItemText, CircularProgress, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

export default function ViewGroup() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [groupName, setGroupName] = useState('');
  const [bills, setBills] = useState([]);
  const [users, setUsers] = useState({});
  const [groupUsers, setGroupUsers] = useState([]);
  const [groupImageUrl, setGroupImageUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');

  const getAuthToken = () => {
    const authData = JSON.parse(localStorage.getItem('authData'));
    return authData ? authData.token : '';
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const groupResponse = await fetch(`http://localhost:8080/api/groups/${id}`, {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${getAuthToken()}` },
        });
        if (!groupResponse.ok) throw new Error('Failed to fetch group details');
        const groupData = await groupResponse.json();
        setGroupName(groupData.name);
        setGroupUsers(groupData.users);

        const imageResponse = await fetch(`http://localhost:8080/s3bucketstorage/splitbillsbucket/groups/${id}/files`, {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${getAuthToken()}` },
        });
        if (!imageResponse.ok) throw new Error('Failed to fetch group image');
        const imageData = await imageResponse.text();
        try {
          const urls = JSON.parse(imageData);
          if (Array.isArray(urls) && urls.length > 0) setGroupImageUrl(urls[0]);
        } catch (error) {
          console.error('Error parsing JSON:', error);
        }

        await Promise.all(groupData.users.map(async (userId) => {
          const userResponse = await fetch(`http://localhost:8080/api/users/${userId}`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${getAuthToken()}` },
          });
          if (!userResponse.ok) throw new Error('Failed to fetch user details');
          const userData = await userResponse.json();
          setUsers(prev => ({ ...prev, [userId]: userData.username }));
        }));

        const billsResponse = await fetch(`http://localhost:8080/api/groups/${id}/bills`, {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${getAuthToken()}` },
        });
        if (!billsResponse.ok) throw new Error('Failed to fetch bills');
        const billsData = await billsResponse.json();
        setBills(billsData);

      } catch (error) {
        console.error('Error fetching data:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleUpdateBillClick = (billId) => {
    navigate(`/update-bill/groups/${id}/bills/${billId}`);
  };

  const handleAddBillClick = () => {
    navigate(`/add-bills/${id}`);
  };

  const handleAddUserClick = () => {
    navigate(`/add-users/${id}`);
  };

  const handleEditGroupName = () => {
    setEditDialogOpen(true);
    setNewGroupName(groupName);
  };

  const handleDialogClose = () => {
    setEditDialogOpen(false);
  };

  const handleGroupNameChange = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/groups/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newGroupName }),
      });
      if (!response.ok) throw new Error('Failed to update group name');
      setGroupName(newGroupName);
      handleDialogClose();
    } catch (error) {
      console.error('Error updating group name:', error.message);
    }
  };

  const deleteGroup = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/groups/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${getAuthToken()}` },
      });
      if (!response.ok) throw new Error('Failed to delete group');
      navigate('/');
    } catch (error) {
      console.error('Error deleting group:', error.message);
    }
  };

  const columnDefs = useMemo(() => [
    { headerName: 'Bill Name', field: 'name', sortable: true, filter: true, flex: 1 },
    { headerName: 'Amount', field: 'price', sortable: true, filter: true, flex: 1, valueFormatter: params => `$${params.value.toFixed(2)}` },
    { headerName: 'Belongs to', field: 'userId', sortable: true, filter: true, flex: 1, valueGetter: params => users[params.data.userId] || 'Loading...' },
    { headerName: 'Pay to', field: 'recipientUserId', sortable: true, filter: true, flex: 1, valueGetter: params => users[params.data.recipientUserId] || 'Loading...' },
    {
      headerName: 'Actions',
      field: 'actions',
      cellRenderer: (params) => (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="contained"
            onClick={() => handleUpdateBillClick(params.data.id)}
            sx={{
              marginRight: 1,
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
            Update
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => deleteBill(params.data.id)}
            sx={{
              borderRadius: '30px',
              fontWeight: '500',
              backgroundColor: '#d32f2f',
              color: '#fff',
              boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.3s',
              '&:hover': {
                backgroundColor: '#c62828',
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
              },
            }}
          >
            Delete
          </Button>
        </Box>
      ),
    }
  ], [users, bills]);

  const deleteBill = async (billId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/groups/${id}/bills/${billId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${getAuthToken()}` },
      });
      if (!response.ok) throw new Error('Failed to delete bill');
      setBills(prevBills => prevBills.filter(bill => bill.id !== billId));
    } catch (error) {
      console.error('Error deleting bill:', error.message);
    }
  };

  return (
    <Container>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', marginTop: 4, marginBottom: 2 }}>
        {groupImageUrl && (
          <Box sx={{ mr: 2 }}>
            <img
              src={groupImageUrl}
              alt={`${groupName} Image`}
              style={{ maxWidth: '300px', height: 'auto', borderRadius: '8px' }}
            />
          </Box>
        )}
        <Box sx={{ ml: 6 }}>
          <Typography variant="h4" fontWeight={500} gutterBottom>
            {groupName}
          </Typography>
          <Box sx={{ display: 'flex', mb: 4, gap: 2 }}>
              <Button
                variant="contained"
                onClick={handleEditGroupName}
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
                Edit Group Name
              </Button>
              <Button
                variant="contained"
                onClick={handleAddUserClick}
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
                Add User
              </Button>
              <Button
                variant="contained"
                onClick={handleAddBillClick}
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
                Add Bill
              </Button>
              <Button
                variant="contained"
                onClick={deleteGroup}
                sx={{
                  borderRadius: '30px',
                  fontWeight: '500',
                  backgroundColor: '#d32f2f',
                  color: '#fff',
                  boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.3s',
                  '&:hover': {
                    backgroundColor: '#c62828',
                    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
                  },
                }}
              >
                Delete Group
              </Button>
          </Box>
          <Box sx={{ marginBottom: 2 }}>
            <Typography variant="h6" fontWeight={500} gutterBottom>
              Users
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, marginBottom: 2 }}>
              {groupUsers.length > 0 ? (
                groupUsers.map(userId => (
                  <Box key={userId} sx={{ display: 'flex', alignItems: 'center' }}>
                    <i className="fas fa-user" style={{ marginRight: 8 }} />
                    <Typography variant="body1">{users[userId] || 'Loading...'}</Typography>
                  </Box>
                ))
              ) : (
                <Typography variant="body1">No users in this group.</Typography>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
      {loading ? (
        <CircularProgress />
      ) : (
        <div className="ag-theme-alpine" style={{ height: 400, width: '100%', marginBottom: '4%' }}>
          <AgGridReact
            rowData={bills}
            columnDefs={columnDefs}
            pagination={true}
          />
        </div>
      )}

      <Dialog open={editDialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Edit Group Name</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Group Name"
            type="text"
            fullWidth
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ marginBottom: 2, mr: 2 }}>
          <Button onClick={handleDialogClose} sx={{
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
          }}>
            Cancel
          </Button>
          <Button onClick={handleGroupNameChange} sx={{
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
          }}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
