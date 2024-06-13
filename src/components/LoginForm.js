import React, { useState } from 'react';
import axios from 'axios';
import { CssBaseline, Container, Box, Typography, TextField, Button, Link, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Logo from './Logo';
import background from './background.jpg';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleClickShowPassword = () => setShowPassword((prev) => !prev);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:8002/login', { email, password });
      alert(response.data.message);
  
      // Store user data in local storage
      localStorage.setItem('user', JSON.stringify(response.data));
      localStorage.setItem('email', email); // Store the email separately
  
      console.log('User data stored:', response.data);
  
      // Redirect based on role
      if (response.data.role === 'teacher') {
        navigate('/teacher/mycourses');
      } else {
        navigate('/student/mycourses');
      }
    } catch (error) {
      alert('Login failed: ' + error.response.data.message);
    }
  };
  

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundImage: `url(${background})`,
        backgroundSize: 'cover',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <CssBaseline />
      <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
        <Logo />
        <Typography variant="h4" component="h1" sx={{ marginLeft: 2 }}>
          DeCourses
        </Typography>
      </Box>
      <Container component="main" maxWidth="xs" sx={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', padding: 4, borderRadius: 2 }}>
        <Typography variant="h6" component="h2" sx={{ textAlign: 'center', marginBottom: 3 }}>
          Welcome to the course
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    edge="end"
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ marginTop: 2, marginBottom: 2 }}
          >
            Sign In
          </Button>
        </form>
        <Typography variant="body2" color="textSecondary" align="center">
          New user? <Link href="/register">Create an account</Link>
        </Typography>
      </Container>
    </Box>
  );
};

export default LoginForm;
