import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, Box, TextField, MenuItem, Select, InputLabel, FormControl, Grid, CircularProgress, Backdrop, Paper } from '@mui/material';
import { useFormik } from 'formik';
import CustomSnackbar from '../components/CustomSnackbar';
import * as Yup from 'yup';
import { useParams, useNavigate } from 'react-router-dom';

const validationSchema = Yup.object({
  name: Yup.string().required('Bill name is required'),
  price: Yup.number().positive('Price must be a positive number').required('Price is required'),
  recipientUserId: Yup.string().required('Recipient user selection is required')
});

export default function AddBills() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: '' });
  const [groupUsers, setGroupUsers] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const getAuthToken = () => {
    const authData = JSON.parse(localStorage.getItem('authData'));
    return authData ? authData.token : '';
  };

  const getUserId = () => {
    const authData = JSON.parse(localStorage.getItem('authData'));
    return authData ? authData.user : '';
  };

  const userId = getUserId();

  useEffect(() => {
    const fetchGroupAndUsers = async () => {
      setLoading(true);
      try {
        const groupResponse = await fetch(`http://localhost:8080/api/groups/${id}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${getAuthToken()}`
          },
        });
        if (!groupResponse.ok) {
          throw new Error('Failed to fetch group data');
        }
        const groupData = await groupResponse.json();
        setGroupUsers(groupData.users);

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
        const filteredUsers = usersData.filter(user => groupData.users.includes(user.id));
        setUsers(filteredUsers);
      } catch (error) {
        console.error('Error fetching data:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGroupAndUsers();
  }, [id]);

  const formik = useFormik({
    initialValues: {
      name: '',
      price: '',
      userId: userId,
      recipientUserId: ''
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm }) => {
      setLoading(true);
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

        navigate(`/view-group/${id}`);
      } catch (error) {
        setSnackbar({ open: true, message: 'Failed to add bill', severity: 'error' });
      } finally {
        setLoading(false);
      }
    }
  });

  const handleCloseSnackbar = () => {
    setSnackbar({ open: false, message: '', severity: '' });
  };

  return (
    <Container maxWidth="sm">
      <Backdrop open={loading} style={{ zIndex: 1200 }}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Paper elevation={3} sx={{ padding: 3, mt: 4 }}>
        <Typography variant="h5" component="h1" align="center" gutterBottom>
          Add Bill
        </Typography>
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Bill Name"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
                fullWidth
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Price"
                name="price"
                value={formik.values.price}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.price && Boolean(formik.errors.price)}
                helperText={formik.touched.price && formik.errors.price}
                fullWidth
                variant="outlined"
                type="number"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Recipient</InputLabel>
                <Select
                  name="recipientUserId"
                  value={formik.values.recipientUserId}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.recipientUserId && Boolean(formik.errors.recipientUserId)}
                  label="Recipient"
                >
                  {users.map(user => (
                    <MenuItem key={user.id} value={user.id}>
                      {user.username}
                    </MenuItem>
                  ))}
                </Select>
                {formik.touched.recipientUserId && formik.errors.recipientUserId && (
                  <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                    {formik.errors.recipientUserId}
                  </Typography>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                fullWidth
              >
                Add
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
      <CustomSnackbar 
        open={snackbar.open} 
        onClose={handleCloseSnackbar} 
        message={snackbar.message} 
        severity={snackbar.severity} 
      />
    </Container>
  );
}
