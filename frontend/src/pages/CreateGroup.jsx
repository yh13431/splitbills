import React, { useState } from 'react';
import { Container, Typography, Button, Box, TextField } from '@mui/material';
import { useFormik } from 'formik';
import CustomSnackbar from '../components/CustomSnackbar';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';

const validationSchema = Yup.object({
  name: Yup.string().required('Group name is required')
});

export default function CreateGroup() {
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: '' });
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();

  const getAuthToken = () => {
    const authData = JSON.parse(localStorage.getItem('authData'));
    return authData ? authData.token : '';
  };

  const formik = useFormik({
    initialValues: {
      name: ''
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await fetch(`http://localhost:8080/api/groups`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getAuthToken()}`
          },
          body: JSON.stringify(values)
        });
        if (!response.ok) {
          throw new Error('Failed to create group');
        }
        const data = await response.json();

        // Upload file after group creation
        if (selectedFile) {
          const formData = new FormData();
          formData.append('file', selectedFile);

          const uploadResponse = await fetch(`http://localhost:8080/s3bucketstorage/splitbillsbucket/groups/${data.id}/upload`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${getAuthToken()}`
            },
            body: formData
          });

          if (!uploadResponse.ok) {
            throw new Error('File upload failed');
          }
        }

        setSnackbar({ open: true, message: 'Group created successfully', severity: 'success' });
        navigate(`/add-users/${data.id}`);
      } catch (error) {
        setSnackbar({ open: true, message: error.message || 'Failed to create group', severity: 'error' });
      }
    }
  });

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ open: false, message: '', severity: '' });
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          mt: 4,
          p: 3,
          boxShadow: 3,
          borderRadius: 2,
          backgroundColor: 'background.paper',
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Create Group
        </Typography>
        <form onSubmit={formik.handleSubmit}>
          <TextField
            label="Group Name"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
            fullWidth
            margin="normal"
          />
          <Button
            variant="contained"
            component="label"
            fullWidth
            sx={{ mt: 2, mb: 2 }}
          >
            Upload Group Image
            <input
              type="file"
              hidden
              onChange={handleFileChange}
            />
          </Button>

          <Button
            variant="contained"
            color="primary"
            type="submit"
            fullWidth
            sx={{ mt: 2 }}
          >
            Create
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