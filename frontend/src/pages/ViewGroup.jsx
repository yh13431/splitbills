import React, { useState, useEffect, useMemo } from 'react';
import { Container, Box, Typography, Button, List, ListItem, ListItemText } from '@mui/material';
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

  const getAuthToken = () => {
    const authData = JSON.parse(localStorage.getItem('authData'));
    return authData ? authData.token : '';
  };

  const fetchGroupDetails = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/groups/${id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch group details');
      }
      const groupData = await response.json();
      setGroupName(groupData.name);
      setGroupUsers(groupData.users);

      groupData.users.forEach(userId => fetchUserDetails(userId));
    } catch (error) {
      console.error('Error fetching group details:', error.message);
    }
  };

  const fetchGroupImage = async () => {
    try {
      const response = await fetch(`http://localhost:8080/s3bucketstorage/splitbillsbucket/groups/${id}/files`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch group image');
      }
      const data = await response.text();
      try {
        const urls = JSON.parse(data);
        if (Array.isArray(urls) && urls.length > 0) {
          setGroupImageUrl(urls[0]);
        } else {
          console.error('Unexpected data format:', urls);
        }
      } catch (error) {
        console.error('Error parsing JSON:', error);
      }

    } catch (error) {
      console.error('Error fetching group image:', error);
    }
  };

  const fetchUserDetails = async (userId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/users/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch user details');
      }
      const userData = await response.json();
      setUsers(prevUsers => ({ ...prevUsers, [userId]: userData.username }));
    } catch (error) {
      console.error('Error fetching user details:', error.message);
    }
  };

  const fetchBills = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/groups/${id}/bills`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch bills');
      }
      const data = await response.json();
      setBills(data);
    } catch (error) {
      console.error('Error fetching bills:', error.message);
    }
  };

  const deleteBill = async (billId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/groups/${id}/bills/${billId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`
        },
      });
      if (!response.ok) {
        throw new Error('Failed to delete bill');
      }
      setBills(bills.filter(bill => bill.id !== billId));
    } catch (error) {
      console.error('Error deleting bill:', error.message);
    }
  };

  const handleUpdateBillClick = (billId) => {
    navigate(`/update-bill/groups/${id}/bills/${billId}`);
  };

  const handleAddBillClick = () => {
    navigate(`/add-bills/${id}`);
  };

  const handleAddUserClick = () => {
    navigate(`/add-users/${id}`);
  };

  const columnDefs = useMemo(() => [
    { 
      headerName: 'Bill Name', 
      field: 'name', 
      sortable: true, 
      filter: true, 
      flex: 1,
      cellStyle: { textAlign: 'center' },
      headerClass: 'ag-header-custom'
    },
    { 
      headerName: 'Amount', 
      field: 'price', 
      sortable: true, 
      filter: true, 
      flex: 1,
      cellStyle: { textAlign: 'center' },
      headerClass: 'ag-header-custom',
      valueFormatter: params => `$${params.value.toFixed(2)}`
    },
    {
      headerName: 'Belongs to',
      field: 'userId',
      sortable: true,
      filter: true,
      flex: 1,
      cellStyle: { textAlign: 'center' },
      headerClass: 'ag-header-custom',
      valueGetter: params => users[params.data.userId] || 'Loading...',
    },
    {
      headerName: 'Pay to',
      field: 'recipientUserId',
      sortable: true,
      filter: true,
      flex: 1,
      cellStyle: { textAlign: 'center' },
      headerClass: 'ag-header-custom',
      valueGetter: params => users[params.data.recipientUserId] || 'Loading...',
    },
    {
      headerName: 'Update Bill',
      field: 'actions',
      cellRenderer: (params) => (
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100%' 
          }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleUpdateBillClick(params.data.id)}
          >
            Update
          </Button>
        </Box>
      ),
      headerClass: 'ag-header-custom'
    },
    {
      headerName: 'Delete Bill',
      field: 'actions',
      cellRenderer: (params) => (
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100%' 
          }}
        >
          <Button
            variant="contained"
            color="secondary"
            onClick={() => deleteBill(params.data.id)}
          >
            Delete
          </Button>
        </Box>
      ),
      headerClass: 'ag-header-custom'
    }
  ], [users, bills]);

  useEffect(() => {
    fetchGroupDetails();
    fetchBills();
    fetchGroupImage();
  }, [id]);

  return (
    <Container>
      <Box sx={{ marginTop: 4 }}>
        <Typography variant="h4" gutterBottom>
          <i className="fas fa-money-bill-wave" style={{ marginRight: 8 }}></i>
          {groupName}
        </Typography>
        {groupImageUrl && (
          <Box sx={{ textAlign: 'center', marginBottom: 2 }}>
            <img
              src={groupImageUrl}
              alt={`${groupName} Image`}
              style={{ maxWidth: '40%', height: 'auto' }}
            />
          </Box>
        )}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
          <Box>
            <Button
              variant="contained"
              color="primary"
              sx={{ marginRight: 1 }}
              onClick={handleAddBillClick}
            >
              <i className="fas fa-plus" style={{ marginRight: 8 }} />
              Add Bill
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddUserClick}
            >
              <i className="fas fa-user" style={{ marginRight: 8 }} />
              Add User
            </Button>
          </Box>
        </Box>
        <Box sx={{ marginBottom: 2 }}>
          <Typography variant="h6">Users:</Typography>
          <List dense>
            {groupUsers.map(userId => (
              <ListItem key={userId} disableGutters>
                <i className="fas fa-user" style={{ marginRight: 8 }} />
                <ListItemText primary={users[userId] || 'Loading...'} />
              </ListItem>
            ))}
          </List>
        </Box>
        <Box sx={{ height: 400 }}>
          <div className="ag-theme-alpine" style={{ height: '100%', width: '100%' }}>
            <AgGridReact
              rowData={bills}
              columnDefs={columnDefs}
              pagination={true}
              domLayout='autoHeight'
            />
          </div>
        </Box>
      </Box>
    </Container>
  );
};
