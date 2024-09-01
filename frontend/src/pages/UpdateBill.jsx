import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, Box, TextField, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { useFormik } from 'formik';
import CustomSnackbar from '../components/CustomSnackbar';
import * as Yup from 'yup';
import { useParams, useNavigate } from 'react-router-dom';

const validationSchema = Yup.object({
  name: Yup.string().required('Bill name is required'),
  price: Yup.number().positive('Price must be a positive number').required('Price is required'),
  recipientUserId: Yup.string().required('Recipient user selection is required')
});

export default function UpdateBill() {
  const { groupId, billId } = useParams();
  const navigate = useNavigate();
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: '' });
  const [users, setUsers] = useState([]);
  const [bill, setBill] = useState(null);

  const getAuthToken = () => {
    const authData = JSON.parse(localStorage.getItem('authData'));
    return authData ? authData.token : '';
  };

  useEffect(() => {
    const fetchGroupUsers = async () => {
      try {
        const groupResponse = await fetch(`http://localhost:8080/api/groups/${groupId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${getAuthToken()}`
          },
        });
        if (!groupResponse.ok) {
          throw new Error('Failed to fetch group data');
        }
        const groupData = await groupResponse.json();
        const groupUserIds = groupData.users;

        const usersResponse = await fetch('http://localhost:8080/api/users', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${getAuthToken()}`
          },
        });
        if (!usersResponse.ok) {
          throw new Error('Failed to fetch users');
        }
        const usersData = await usersResponse.json();
        const filteredUsers = usersData.filter(user => groupUserIds.includes(user.id));
        setUsers(filteredUsers);
      } catch (error) {
        console.error('Error fetching data:', error.message);
      }
    };

    const fetchBill = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/groups/${groupId}/bills/${billId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${getAuthToken()}`
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch bill details');
        }
        const data = await response.json();
        setBill(data);
      } catch (error) {
        console.error('Error fetching bill details:', error.message);
      }
    };

    fetchGroupUsers();
    fetchBill();
  }, [groupId, billId]);

  const formik = useFormik({
    initialValues: {
      name: bill?.name || '',
      price: bill?.price || '',
      userId: bill?.userId,
      recipientUserId: bill?.recipientUserId || ''
    },
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        const response = await fetch(`http://localhost:8080/api/groups/${groupId}/bills/${billId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getAuthToken()}`
          },
          body: JSON.stringify(values)
        });
        if (!response.ok) {
          throw new Error('Failed to update bill');
        }
        resetForm();
        setSnackbar({ open: true, message: 'Bill updated successfully', severity: 'success' });

        navigate(`/view-group/${groupId}`);
      } catch (error) {
        setSnackbar({ open: true, message: 'Failed to update bill', severity: 'error' });
      }
    }
  });

  const handleCloseSnackbar = () => {
    setSnackbar({ open: false, message: '', severity: '' });
  };

  return (
    <Container>
      <Box style={{ marginTop: '10px' }}>
        <Typography variant="h4" gutterBottom>
          Update Bill
        </Typography>
        <form onSubmit={formik.handleSubmit}>
          <TextField
            label="Bill Name"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Price"
            name="price"
            value={formik.values.price}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.price && Boolean(formik.errors.price)}
            helperText={formik.touched.price && formik.errors.price}
            fullWidth
            margin="normal"
            type="number"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Recipient User</InputLabel>
            <Select
              label="Recipient User"
              name="recipientUserId"
              value={formik.values.recipientUserId}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.recipientUserId && Boolean(formik.errors.recipientUserId)}
            >
              {users.map(user => (
                <MenuItem key={user.id} value={user.id}>
                  {user.username}
                </MenuItem>
              ))}
            </Select>
            {formik.touched.recipientUserId && formik.errors.recipientUserId && (
              <Typography color="error" variant="body2">{formik.errors.recipientUserId}</Typography>
            )}
          </FormControl>
          <Button variant="contained" color="primary" type="submit" style={{ marginTop: '10px' }}>
            Update Bill
          </Button>
        </form>
      </Box>
      <CustomSnackbar 
        open={snackbar.open} 
        onClose={handleCloseSnackbar} 
        message={snackbar.message} 
        severity={snackbar.severity} 
      />
    </Container>
  );
}