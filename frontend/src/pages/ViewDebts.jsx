import React, { useState, useEffect } from 'react';
import { Container, Typography, Card, CardContent, List, ListItem, Button, Box, Stack, Paper, Grid } from '@mui/material';

export default function ViewDebts() {
  const [debts, setDebts] = useState({});
  const [groupNames, setGroupNames] = useState({});
  const [owedToMe, setOwedToMe] = useState({});

  const getAuthToken = () => {
    const authData = JSON.parse(localStorage.getItem('authData'));
    return authData ? authData.token : '';
  };

  const getUserId = () => {
    const authData = JSON.parse(localStorage.getItem('authData'));
    return authData ? authData.user: null;
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

  const handleGoToGroup = (groupId) => {
    window.location.href = `/view-group/${groupId}`;
  };

  const calculateDebts = async () => {
    const groupIds = await fetchUserGroups();
    const debtsByGroup = {};
    const namesByGroup = {};
    const owedToMeByGroup = {};

    for (const groupId of groupIds) {
      const bills = await fetchBills(groupId);
      const groupName = await fetchGroupName(groupId);
      const userDebts = {};
      const owedToMe = {};

      bills.forEach(bill => {
        const amountPerUser = (bill.price * bill.quantity);

        if (bill.userId === getUserId()) {
          userDebts[bill.userId] = (userDebts[bill.userId] || 0) + amountPerUser;
        }

        if (bill.recipientUserId === getUserId()) {
          owedToMe[bill.userId] = (owedToMe[bill.userId] || 0) + amountPerUser;
        }
      });

      if (Object.keys(userDebts).length > 0) {
        debtsByGroup[groupId] = { bills, userDebts };
      }

      if (Object.keys(owedToMe).length > 0) {
        owedToMeByGroup[groupId] = { bills: bills.filter(bill => bill.recipientUserId === getUserId()), owedToMe };
      }

      namesByGroup[groupId] = groupName;
    }

    setDebts(debtsByGroup);
    setOwedToMe(owedToMeByGroup);
    setGroupNames(namesByGroup);
  };

  useEffect(() => {
    calculateDebts();
  }, []);

  return (
    <Container>
      <Typography variant="h4" sx={{ marginTop: 4, marginBottom: 3 }}>
        <i className="fas fa-money-bill-wave" style={{ marginRight: 8 }} />
        What I Owe
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ padding: 3, marginBottom: 4 }}>
            {Object.keys(debts).length === 0 ? (
              <Typography variant="body1">
                <i className="fas fa-check-circle" style={{ marginRight: 8 }} />
                I have no debts!
              </Typography>
            ) : (
              Object.entries(debts).map(([groupId, { bills }]) => (
                <Card key={groupId} sx={{ marginTop: 3, boxShadow: 3 }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ marginBottom: 2 }}>
                      <i className="fas fa-users" style={{ marginRight: 8 }} />
                      {groupNames[groupId]}
                    </Typography>
                    <List>
                      {bills.map(bill => (
                        <ListItem
                          key={bill.id}
                          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingY: 2 }}
                        >
                          <Stack spacing={1} sx={{ flex: 1 }}>
                            <Typography variant="body1">
                              <i className="fas fa-receipt" style={{ marginRight: 8 }} />
                              {bill.name}
                            </Typography>
                            <Typography variant="body1">
                              <i className="fas fa-dollar-sign" style={{ marginRight: 8 }} />
                              ${bill.price}
                            </Typography>
                            <Typography variant="body1">
                              <i className="fas fa-hand-holding-usd" style={{ marginRight: 8 }} />
                              {bill.recipientUserName}
                            </Typography>
                          </Stack>
                          <Box>
                            <Button
                              variant="contained"
                              onClick={() => handleGoToGroup(groupId)}
                              sx={{
                                marginRight: 1,
                                borderRadius: '30px',
                                backgroundColor: '#333',
                                color: '#fff',
                                boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
                                transition: 'all 0.3s',
                                '&:hover': {
                                  backgroundColor: '#444',
                                },
                              }}
                            >
                              Go to Group
                              <i className="fas fa-arrow-right" style={{ marginLeft: 8 }} />
                            </Button>
                          </Box>
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              ))
            )}
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h4" sx={{ marginTop: 4, marginBottom: 5 }}>
            <i className="fas fa-hand-holding-usd" style={{ marginRight: 8 }} />
            Money Owed to Me
          </Typography>
          <Paper elevation={3} sx={{ padding: 3, marginBottom: 20 }}>
            {Object.keys(owedToMe).length === 0 ? (
              <Typography variant="body1">
                <i className="fas fa-check-circle" style={{ marginRight: 8 }} />
                No one owes me money!
              </Typography>
            ) : (
              Object.entries(owedToMe).map(([groupId, { bills }]) => (
                <Card key={groupId} sx={{ marginTop: 3, boxShadow: 3 }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ marginBottom: 3 }}>
                      <i className="fas fa-users" style={{ marginRight: 8 }} />
                      {groupNames[groupId]}
                    </Typography>
                    <List>
                      {bills.map(bill => (
                        <ListItem
                          key={bill.id}
                          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingY: 2 }}
                        >
                          <Stack spacing={1} sx={{ flex: 1 }}>
                            <Typography variant="body1">
                              <i className="fas fa-receipt" style={{ marginRight: 8 }} />
                              {bill.name}
                            </Typography>
                            <Typography variant="body1">
                              <i className="fas fa-dollar-sign" style={{ marginRight: 8 }} />
                              ${bill.price}
                            </Typography>
                            <Typography variant="body1">
                              <i className="fas fa-user" style={{ marginRight: 8 }} />
                              {bill.recipientUserName} {/* Display the user name here */}
                            </Typography>
                          </Stack>
                          <Box>
                            <Button
                              variant="contained"
                              onClick={() => handleGoToGroup(groupId)}
                              sx={{
                                marginRight: 1,
                                borderRadius: '30px',
                                backgroundColor: '#333',
                                color: '#fff',
                                boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
                                transition: 'all 0.3s',
                                '&:hover': {
                                  backgroundColor: '#444',
                                },
                              }}
                            >
                              Go to Group
                              <i className="fas fa-arrow-right" style={{ marginLeft: 8 }} />
                            </Button>
                          </Box>
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              ))
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );  
}
