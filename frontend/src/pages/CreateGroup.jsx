import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, Box, TextField } from '@mui/material';
import { useFormik } from 'formik';
import LoadingScreen from '../components/LoadingScreen';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';

const validationSchema = Yup.object({
  name: Yup.string().required('Group name is required')
});

export default function CreateGroup() {
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [navigateAfterLoading, setNavigateAfterLoading] = useState('');
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
    validateOnChange: true,
    onSubmit: async (values) => {
      setLoading(true);
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

        setNavigateAfterLoading(`/add-users/${data.id}`);
      } catch (error) {
        console.error(error.message || 'Failed to create group');
      } finally {
        setLoading(false);
      }
    }
  });

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setFileName(file ? file.name : '');
  };

  useEffect(() => {
    if (!loading && navigateAfterLoading) {
      navigate(navigateAfterLoading);
      setNavigateAfterLoading('');
    }
  }, [loading, navigateAfterLoading, navigate]);

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
            sx={{
              mt: 2,
              mb: 2,
              borderRadius: '30px',
              backgroundColor: '#333',
              color: '#fff',
              boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.3s',
              '&:hover': {
                backgroundColor: '#444',
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
              },
            }}
          >
            Upload Group Image
            <input
              type="file"
              hidden
              onChange={handleFileChange}
            />
          </Button>
          
          {fileName && (
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
              Selected file: {fileName}
            </Typography>
          )}
  
          <Button
            variant="contained"
            type="submit"
            fullWidth
            sx={{
              mt: 2,
              borderRadius: '30px',
              backgroundColor: formik.isValid && formik.dirty ? '#333' : 'grey.400',
              color: '#fff',
              boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.3s',
              '&:hover': {
                backgroundColor: formik.isValid && formik.dirty ? '#444' : 'grey.500',
              },
              cursor: formik.isValid && formik.dirty ? 'pointer' : 'not-allowed',
            }}
            disabled={!formik.isValid || !formik.dirty}
          >
            Create
          </Button>
        </form>
      </Box>
      {loading && <LoadingScreen />}
    </Container>
  );  
}
