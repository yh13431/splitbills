import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import axios from "axios";
import { Container, Typography, Button, Card, CardContent, Box, TextField } from '@mui/material';
import CustomSnackbar from '../components/CustomSnackbar';

const Login = () => {
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'error' });
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            email: "",
            password: ""
        },
        onSubmit: async (values, { setSubmitting }) => {
            try {
                const response = await axios.post("http://localhost:8080/auth/login", values);
                const { token, userId } = response.data;
                localStorage.setItem('token', token);
                localStorage.setItem('userId', userId);
                const decodedToken = JSON.parse(atob(token.split('.')[1]));
                localStorage.setItem('username', decodedToken.sub);
                navigate("/");
            } catch (err) {
                let errorMessage = "An unexpected error occurred";

                if (err.response && err.response.data) {
                    const errorData = err.response.data;
                    
                    if (typeof errorData === 'string') {
                        errorMessage = errorData;
                    } else if (typeof errorData === 'object') {
                        errorMessage = errorData.message || errorData.detail || errorMessage;
                    }
                }
                setSnackbar({ open: true, message: "User does not exist!", severity: 'error' });
            } finally {
                setSubmitting(false);
            }
        }
    });

    const handleSnackbarClose = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    return (
        <Container maxWidth="sm">
            <Card>
                <CardContent>
                    <Box mb={3}>
                        <Typography variant="h4" component="h1" align="center">
                            Log In
                        </Typography>
                    </Box>
                    <form onSubmit={formik.handleSubmit}>
                        <Box mb={2}>
                            <TextField
                                fullWidth
                                required
                                type="text"
                                label="Email"
                                name="email"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                variant="outlined"
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
                            />
                        </Box>
                        <Button
                            fullWidth
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={formik.isSubmitting}
                        >
                            Log In
                        </Button>
                        <Box mt={2} textAlign="center">
                            <Typography variant="body2">
                                No account? <Link to="/register">Register Here</Link>
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

export default Login;
