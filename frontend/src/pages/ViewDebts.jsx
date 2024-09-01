import React, { useState, useEffect } from 'react';
import { Container, Typography, Card, CardContent, List, ListItem } from '@mui/material';

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
      return await response.json();
    } catch (error) {
      console.error('Error fetching bills:', error.message);
      return [];
    }
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
  
      debtsByGroup[groupId] = { bills: filteredBills, userDebts };
      namesByGroup[groupId] = groupName;
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
                  <ListItem key={bill.id}>
                    <Typography variant="body1">
                      {bill.name}: ${bill.price}
                    </Typography>
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
