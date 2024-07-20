import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Typography, Button, Card, CardContent, Box, TextField } from '@mui/material';

export default function Home() {
  const [bills, setBills] = useState([]);
  const [editMode, setEditMode] = useState(null);
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('')

  const fetchBills = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/bills`, {
        method: 'GET',
        headers: {},
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

  const updateBill = async (billId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/bills/${billId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, price, quantity })
      });
      if (!response.ok) {
        throw new Error('Failed to update bill');
      }
      setEditMode(null);
      fetchBills();
    } catch (error) {
      console.error('Error updating bill:', error.message);
    }
  };

  const deleteBill = async (billId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/bills/${billId}`, {
        method: 'DELETE',
        headers: {},
      });
      if (!response.ok) {
        throw new Error('Failed to delete bill');
      }
      fetchBills();
    } catch (error) {
      console.error('Error deleting bill:', error.message);
    }
  };

  useEffect(() => {
    fetchBills();
  }, []);

  return (
    <Container>
      <Box style={{ marginTop: '10px' }}>
        <Typography variant="h4" gutterBottom>
          Bills
        </Typography>
      </Box>
      <Button variant="contained" color="primary" component={Link} to="/create-bill">
        Create New Bill
      </Button>
      {Object.keys(bills).length === 0 ? (
        <Typography variant="body1">No bills available</Typography>
      ) : (
        Object.values(bills).map((bill) => (
          <Card key={bill.id} style={{ marginTop: '20px' }}>
            <CardContent>
              {editMode === bill.id ? (
                <Box>
                  <TextField
                    label="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    fullWidth
                    margin="normal"
                  />
                  <TextField
                    label="Price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    fullWidth
                    margin="normal"
                  />
                  <TextField
                    label="Quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    fullWidth
                    margin="normal"
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => updateBill(bill.id)}
                    style={{ marginTop: '20px', marginRight: '10px' }}
                  >
                    Save Changes
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => setEditMode(null)}
                    style={{ marginTop: '20px' }}
                  >
                    Cancel
                  </Button>
                </Box>
              ) : (
                <>
                  <Typography variant="h6">{bill.name}</Typography>
                  <Typography variant="body2">Price: {bill.price}</Typography>
                  <Typography variant="body2">Quantity: {bill.quantity}</Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      setEditMode(bill.id);
                      setName(bill.name);
                      setPrice(bill.price);
                      setQuantity(bill.quantity);
                    }}
                    style={{ marginTop: '20px', marginRight: '10px' }}
                  >
                    Edit Bill
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => deleteBill(bill.id)}
                    style={{ marginTop: '20px' }}
                  >
                    Delete Bill
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </Container>
  );
}