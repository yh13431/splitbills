import React, { useState, useEffect } from 'react';
import { Container, Typography, Card, CardContent, List, ListItem, Button, Box, Stack } from '@mui/material';

export default function ViewDebts() {
  const [debts, setDebts] = useState({});
  const [groupNames, setGroupNames] = useState({});

  const getAuthToken = () => {
    const authData = JSON.parse(localStorage.getItem('authData'));
    return authData ? authData.token : '';
  };

  const getUserId = () => {
    const authData = JSON.parse(localStorage.getItem('authData'));
    return authData ? authData.user : null;
  };

  const fetchUserGroups = async () => {
    try {
      const userId = getUserId();
      const response = await fetch(`http://localhost:8080/api/users/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch user groups');
      }
      const userData = await response.json();
      return userData.groups;
    } catch (error) {
      console.error('Error fetching user groups:', error.message);
      return [];
    }
  };

  const fetchGroupName = async (groupId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/groups/${groupId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch group name');
      }
      const groupData = await response.json();
      return groupData.name;
    } catch (error) {
      console.error('Error fetching group name:', error.message);
      return '';
    }
  };

  const fetchUserName = async (userId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/users/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch user name');
      }
      const userData = await response.json();
      return userData.username;
    } catch (error) {
      console.error('Error fetching user name:', error.message);
      return '';
    }
  };

  const fetchBills = async (groupId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/groups/${groupId}/bills`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch bills');
      }
      const bills = await response.json();
      const billsWithUserNames = await Promise.all(bills.map(async (bill) => {
        const userName = await fetchUserName(bill.recipientUserId);
        return { ...bill, recipientUserName: userName };
      }));
      return billsWithUserNames;
    } catch (error) {
      console.error('Error fetching bills:', error.message);
      return [];
    }
  };

  const handleDeleteBill = async (groupId, billId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/groups/${groupId}/bills/${billId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`
        },
      });
      if (!response.ok) {
        throw new Error('Failed to delete bill');
      }
      calculateDebts();
    } catch (error) {
      console.error('Error deleting bill:', error.message);
    }
  };

  const handleGoToGroup = (groupId) => {
    window.location.href = `/view-group/${groupId}`;
  };

  const calculateDebts = async () => {
    const groupIds = await fetchUserGroups();
    const debtsByGroup = {};
    const namesByGroup = {};

    for (const groupId of groupIds) {
      const bills = await fetchBills(groupId);
      const groupName = await fetchGroupName(groupId);
      const userDebts = {};

      const filteredBills = bills.filter(bill => bill.userId === getUserId());
      
      filteredBills.forEach(bill => {
        const amountPerUser = (bill.price * bill.quantity);
        userDebts[bill.userId] = (userDebts[bill.userId] || 0) + amountPerUser;
      });

      if (filteredBills.length > 0) {
        debtsByGroup[groupId] = { bills: filteredBills, userDebts };
        namesByGroup[groupId] = groupName;
      }
    }

    setDebts(debtsByGroup);
    setGroupNames(namesByGroup);
  };

  useEffect(() => {
    calculateDebts();
  }, []);

  return (
    <Container>
      <Typography variant="h4" style={{ marginTop: '20px' }}>Outstanding Bills</Typography>
      {Object.keys(debts).length === 0 ? (
        <Typography variant="body1">I have no debts!</Typography>
      ) : (
        Object.entries(debts).map(([groupId, { bills }]) => (
          <Card key={groupId} style={{ marginTop: '20px' }}>
            <CardContent>
              <Typography variant="h6">{groupNames[groupId]}</Typography>
              <List>
                {bills.map(bill => (
                  <ListItem key={bill.id} style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <Stack spacing={1} style={{ flex: 1 }}>
                      <Typography variant="body1">
                        {bill.name}
                      </Typography>
                      <Typography variant="body1">
                        ${bill.price}
                      </Typography>
                      <Typography variant="body1">
                        Pay to: {bill.recipientUserName}
                      </Typography>
                    </Stack>
                    <Box>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleGoToGroup(groupId)}
                      >
                        Go to Group
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleDeleteBill(groupId, bill.id)}
                      >
                        Delete Bill
                      </Button>
                    </Box>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        ))
      )}
    </Container>
  );
}
