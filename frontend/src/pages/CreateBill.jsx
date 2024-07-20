import React, { useState } from 'react';
import { Container, Typography, Button, Card, CardContent, Box, TextField } from '@mui/material';
import { useFormik } from 'formik';
import CustomSnackbar from '../components/CustomSnackbar';
import * as Yup from 'yup';

const validationSchema = Yup.object({
  name: Yup.string().required('Bill name is required'),
  price: Yup.number().required('Price is required').typeError('Quantity must be a valid number').min(0, 'Price must be 0 or above'),
  quantity: Yup.number().required('Quantity is required').typeError('Quantity must be a valid number').min(0, 'Price must be 0 or above'),
});

export default function CreateBill() {
  const [bills, setBills] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: '' });

  const formik = useFormik({
    initialValues: {
      name: '',
      price: '',
      quantity: ''
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        const response = await fetch(`http://localhost:8080/api/bills`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(values)
        });
        if (!response.ok) {
          throw new Error('Failed to create bill');
        }
        const data = await response.json();
        setBills(prevBills => [...prevBills, data]);
        resetForm();
        setSnackbar({ open: true, message: 'Bill created successfully', severity: 'success' });
      } catch (error) {
        setSnackbar({ open: true, message: 'Failed to create bill', severity: 'error' });
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
          Create Bill
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
            label="Quantity"
            name="quantity"
            value={formik.values.quantity}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.quantity && Boolean(formik.errors.quantity)}
            helperText={formik.touched.quantity && formik.errors.quantity}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Price ($)"
            name="price"
            value={formik.values.price}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.price && Boolean(formik.errors.price)}
            helperText={formik.touched.price && formik.errors.price}
            fullWidth
            margin="normal"
          />
          <Button type="submit" variant="contained" color="primary" style={{ marginTop: '10px' }}>
            Create Bill
          </Button>
        </form>
      </Box>
      <Box style={{ marginTop: '20px' }}>
        <Typography variant="h5" gutterBottom>
          Bills
        </Typography>
        <ul>
          {bills.map((bill) => (
            <li key={bill.id}>
              <Card style={{ marginTop: '20px' }}>
                <CardContent>
                  <Typography variant="h6">{bill.name}</Typography>
                  <Typography variant="body2">Price: {bill.price}</Typography>
                  <Typography variant="body2">Quantity: {bill.quantity}</Typography>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
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