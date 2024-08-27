import React, { useState, useEffect, useMemo } from 'react';
import { Container, Typography, Box } from '@mui/material';
import { useParams } from 'react-router-dom';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

export default function ViewGroup() {
  const { id } = useParams();
  const [groupName, setGroupName] = useState('');
  const [bills, setBills] = useState([]);
  const [users, setUsers] = useState({});

  const getAuthToken = () => {
    const authData = JSON.parse(localStorage.getItem('authData'));
    return authData ? authData.token : '';
  };

  const fetchGroupDetails = async () => {
    try {
      const groupResponse = await fetch(`http://localhost:8080/api/groups/${id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`
        },
      });
      if (!groupResponse.ok) {
        throw new Error('Failed to fetch group details');
      }
      const groupData = await groupResponse.json();
      setGroupName(groupData.name);
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

      const userIds = [...new Set(data.map(bill => bill.userId))];
      userIds.forEach(userId => fetchUserDetails(userId));
    } catch (error) {
      console.error('Error fetching bills:', error.message);
    }
  };

  const columnDefs = useMemo(() => [
    { headerName: 'Bill Name', field: 'name', sortable: true, filter: true, flex: 1 },
    { headerName: 'Price', field: 'price', sortable: true, filter: true, flex: 1  },
    { headerName: 'Quantity', field: 'quantity', sortable: true, filter: true, flex: 1  },
    {
      headerName: 'Belongs to',
      field: 'userId',
      sortable: true,
      filter: true,
      flex: 1,
      valueGetter: params => users[params.data.userId] || 'Loading...',
    },
  ], [users]);

  useEffect(() => {
    fetchGroupDetails();
    fetchBills();
  }, [id]);

  return (
    <Container>
      {bills.length > 0 ? (
        <Box style={{ marginTop: '20px' }}>
          <Typography variant="h4">{groupName}</Typography>
          <Typography variant="h6">Bills: {bills.length}</Typography>
          <Box style={{ height: '400px', marginTop: '20px' }}>
            <div className="ag-theme-alpine" style={{ height: '100%', width: '100%' }}>
              <AgGridReact
                rowData={bills}
                columnDefs={columnDefs}
                pagination={true}
              />
            </div>
          </Box>
        </Box>
      ) : (
        <Typography variant="body1">Loading group details...</Typography>
      )}
    </Container>
  );
}
