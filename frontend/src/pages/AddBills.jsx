import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, Box, TextField, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { useFormik } from 'formik';
import CustomSnackbar from '../components/CustomSnackbar';
import * as Yup from 'yup';
import { useParams, useNavigate } from 'react-router-dom';

const validationSchema = Yup.object({
  name: Yup.string().required('Bill name is required'),
  price: Yup.number().positive('Price must be a positive number').required('Price is required'),
  quantity: Yup.number().positive('Quantity must be a positive number').required('Quantity is required'),
  userId: Yup.string().required('User selection is required')
});

export default function AddBills() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: '' });
  const [users, setUsers] = useState([]);

  const getAuthToken = () => {
    const authData = JSON.parse(localStorage.getItem('authData'));
    return authData ? authData.token : '';
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/users', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${getAuthToken()}`
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error.message);
      }
    };

    fetchUsers();
  }, []);

  const formik = useFormik({
    initialValues: {
      name: '',
      price: '',
      quantity: '',
      userId: ''
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        const response = await fetch(`http://localhost:8080/api/groups/${id}/bills`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getAuthToken()}`
          },
          body: JSON.stringify(values)
        });
        if (!response.ok) {
          throw new Error('Failed to add bill');
        }
        resetForm();
        setSnackbar({ open: true, message: 'Bill added successfully', severity: 'success' });

        navigate('/');
      } catch (error) {
        setSnackbar({ open: true, message: 'Failed to add bill', severity: 'error' });
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
          Add Bills to Group
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
          <TextField
            label="Quantity"
            name="quantity"
            value={formik.values.quantity}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.quantity && Boolean(formik.errors.quantity)}
            helperText={formik.touched.quantity && formik.errors.quantity}
            fullWidth
            margin="normal"
            type="number"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>User</InputLabel>
            <Select
              label="User"
              name="userId"
              value={formik.values.userId}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.userId && Boolean(formik.errors.userId)}
            >
              {users.map(user => (
                <MenuItem key={user.id} value={user.id}>
                  {user.username}
                </MenuItem>
              ))}
            </Select>
            {formik.touched.userId && formik.errors.userId && (
              <Typography color="error" variant="body2">{formik.errors.userId}</Typography>
            )}
          </FormControl>
          <Button variant="contained" color="primary" type="submit" style={{ marginTop: '10px' }}>
            Add Bill
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