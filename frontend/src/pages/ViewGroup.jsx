import React, { useState, useEffect, useMemo } from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
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
    { headerName: 'Bill Name', field: 'name', sortable: true, filter: true, flex: 1 },
    { headerName: 'Price', field: 'price', sortable: true, filter: true, flex: 1  },
    {
      headerName: 'Belongs to',
      field: 'userId',
      sortable: true,
      filter: true,
      flex: 1,
      valueGetter: params => users[params.data.userId] || 'Loading...',
    },
    {
      headerName: 'Pay to',
      field: 'userId',
      sortable: true,
      filter: true,
      flex: 1,
      valueGetter: params => users[params.data.recipientUserId] || 'Loading...',
    },
    {
      headerName: 'Update Bill',
      field: 'actions',
      cellRenderer: (params) => (
        <div>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => handleUpdateBillClick(params.data.id)}
          >
            Update
          </Button>
        </div>
      )
    },
    {
      headerName: 'Delete Bill',
      field: 'actions',
      cellRenderer: (params) => (
        <div>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => deleteBill(params.data.id)}
          >
            Delete
          </Button>
        </div>
      )
    },
  ], [users, bills]);

  useEffect(() => {
    fetchGroupDetails();
    fetchBills();
  }, [id]);

  return (
    <Container>
      <Box style={{ marginTop: '20px' }}>
        <Typography variant="h4">{groupName}</Typography>
        <Typography variant="h6">Bills: {bills.length}</Typography>
        <Typography variant="h6" gutterBottom>
          Users in Group:
        </Typography>
        <ul>
          {groupUsers.map(userId => (
            <li key={userId}>{users[userId] || 'Loading...'}</li>
          ))}
        </ul>
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddBillClick}
          style={{ marginBottom: '20px' }}
        >
          Add Bill
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddUserClick}
          style={{ marginBottom: '20px', marginLeft: '10px' }}
        >
          Add User
        </Button>
        <Box style={{ height: '400px' }}>
          <div className="ag-theme-alpine" style={{ height: '100%', width: '100%' }}>
            <AgGridReact
              rowData={bills}
              columnDefs={columnDefs}
              pagination={true}
            />
          </div>
        </Box>
      </Box>
    </Container>
  );
}
