import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import axios from 'axios';
import { Container, Typography, Button, Card, CardContent, Box, TextField } from '@mui/material';
import CustomSnackbar from '../components/CustomSnackbar';

const Register = () => {
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'error' });
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            username: "",
            email: "",
            password: ""
        },
        onSubmit: async (values, { setSubmitting }) => {
            try {
                const response = await axios.post(`http://localhost:8080/auth/signup`, values);
                const payload = {
                    token: response.data.token,   
                    user: response.data.userId      
                };
                localStorage.setItem('authData', JSON.stringify(payload));
                navigate("/");
            } catch (err) {
                let errorMessage = "An unexpected error occurred";
                if (err.response && err.response.data) {
                    const errorData = err.response.data;
                    errorMessage = typeof errorData === 'string'
                        ? errorData
                        : errorData.message || errorData.detail || errorMessage;
                }
                setSnackbar({ open: true, message: errorMessage, severity: 'error' });
            } finally {
                setSubmitting(false);
            }
        }
    });

    const handleSnackbarClose = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    return (
        <Container maxWidth="sm" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
            <Card sx={{ borderRadius: 2, boxShadow: 3, p: 3, width: '100%', maxWidth: 400 }}>
                <CardContent>
                    <Box mb={3}>
                        <Typography variant="h4" component="h1" align="center" gutterBottom>
                            Register
                        </Typography>
                    </Box>
                    <form onSubmit={formik.handleSubmit}>
                        <Box mb={2}>
                            <TextField
                                fullWidth
                                required
                                type="text"
                                label="Username"
                                name="username"
                                value={formik.values.username}
                                onChange={formik.handleChange}
                                variant="outlined"
                                size="small"
                                sx={{ borderRadius: 1 }}
                            />
                        </Box>
                        <Box mb={2}>
                            <TextField
                                fullWidth
                                required
                                type="email"
                                label="Email"
                                name="email"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                variant="outlined"
                                size="small"
                                sx={{ borderRadius: 1 }}
                            />
                        </Box>
                        <Box mb={2}>
                            <TextField
                                fullWidth
                                required
                                type="password"
                                label="Password"
                                name="password"
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                variant="outlined"
                                size="small"
                                sx={{ borderRadius: 1 }}
                            />
                        </Box>
                        <Button
                            fullWidth
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={formik.isSubmitting}
                            sx={{
                                borderRadius: 1,
                                boxShadow: 2,
                                '&:hover': {
                                    boxShadow: 4
                                }
                            }}
                        >
                            Register
                        </Button>
                        <Box mt={2} textAlign="center">
                            <Typography variant="body2">
                                Have an account? <Link to="/login" style={{ color: '#1976d2' }}>Log In</Link>
                            </Typography>
                        </Box>
                    </form>
                </CardContent>
            </Card>
            <CustomSnackbar
                open={snackbar.open}
                onClose={handleSnackbarClose}
                message={snackbar.message}
                severity={snackbar.severity}
            />
        </Container>
    );
};

export default Register;