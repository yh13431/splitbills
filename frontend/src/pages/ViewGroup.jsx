import React, { useState, useEffect, useMemo } from 'react';
import { Container, Box, Typography, Button, List, ListItem, ListItemText, CircularProgress } from '@mui/material';
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

  const getAuthToken = () => {
    const authData = JSON.parse(localStorage.getItem('authData'));
    return authData ? authData.token : '';
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch group details
        const groupResponse = await fetch(`http://localhost:8080/api/groups/${id}`, {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${getAuthToken()}` },
        });
        if (!groupResponse.ok) throw new Error('Failed to fetch group details');
        const groupData = await groupResponse.json();
        setGroupName(groupData.name);
        setGroupUsers(groupData.users);

        // Fetch group image
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

        // Fetch user details
        await Promise.all(groupData.users.map(async (userId) => {
          const userResponse = await fetch(`http://localhost:8080/api/users/${userId}`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${getAuthToken()}` },
          });
          if (!userResponse.ok) throw new Error('Failed to fetch user details');
          const userData = await userResponse.json();
          setUsers(prev => ({ ...prev, [userId]: userData.username }));
        }));

        // Fetch bills
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
            color="primary"
            onClick={() => handleUpdateBillClick(params.data.id)}
            sx={{ marginRight: 1 }}
          >
            Update
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => deleteBill(params.data.id)}
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
        <Box sx={{ flexGrow: 1, ml: 6 }}>
          <Typography variant="h4" fontWeight={500} gutterBottom>
            {groupName}
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', mb: 4 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddUserClick}
              sx={{ mb: 2 }}
            >
              Add User
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddBillClick}
            >
              Add Bill
            </Button>
          </Box>
          <Box sx={{ marginBottom: 2 }}>
            <Typography variant="h6" fontWeight={500} gutterBottom>
              Users
            </Typography>
            <List dense>
              {groupUsers.map(userId => (
                <ListItem key={userId} disableGutters>
                  <i className="fas fa-user" style={{ marginRight: 8 }} />
                  <ListItemText primary={users[userId] || 'Loading...'} />
                </ListItem>
              ))}
            </List>
          </Box>
        </Box>
      </Box>
      <div className="ag-theme-alpine" style={{ height: 400, width: '100%' }}>
        <AgGridReact
          rowData={bills}
          columnDefs={columnDefs}
          pagination={true}
        />
      </div>
    </Container>
  );
}
