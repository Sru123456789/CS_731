import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CssBaseline, Container, Box, Typography, TextField, Button, Link, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Logo from './Logo';
import background from './background.jpg';

const RegistrationForm = ({ setFormType }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [id, setId] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleClickShowPassword = () => setShowPassword((prev) => !prev);
  const handleClickShowConfirmPassword = () => setShowConfirmPassword((prev) => !prev);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      const response = await axios.post('http://localhost:8002/register', { email, password, id });
      alert(response.data.message);
      navigate('/'); // Redirect to login page
    } catch (error) {
      alert('Registration failed: ' + error.response.data.message);
    }
  };

  useEffect(() => {
    alert('If you are a teacher, start your ID with T. If you are a student, start your ID with S.');
  }, []);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />
      <Box
        sx={{
          width: '60%', // Adjusted width
          backgroundImage: `url(${background})`,
          backgroundSize: 'cover',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          alignItems: 'center',
          margin: '0.3%', // Added padding
          boxSizing: 'border-box'
        }}
      >
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.2)', // Semi-transparent background
            padding: 1,
            borderRadius: 1,
            marginBottom: 4,
            boxSizing: 'border-box'
          }}
        >
          <Logo />
          <Typography variant="h4" component="h1" sx={{ marginTop: 2, color: 'white' }}>
            DeCourses
          </Typography>
          <Typography variant="h6" component="p" sx={{ marginTop: 2, color: 'white' }}>
            Improve your skill with DeCourses
          </Typography>
        </Box>
      </Box>
      <Box
        sx={{
          width: '65%',
          display: 'flex',
          justifyContent: 'flex-start', // Changed to start
          alignItems: 'center',
          padding: 2,
          paddingLeft: 5 // Move form slightly to the left
        }}
      >
        <Container component="main" maxWidth="xs" sx={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', padding: 4, borderRadius: 2 }}>
          <Typography variant="h5" component="h1" sx={{ textAlign: 'center', marginBottom: 1 }}>
            Create An Account
          </Typography>
          <Typography variant="body2" component="p" sx={{ textAlign: 'center', marginBottom: 3 }}>
            Already have an account? <Link href="/" onClick={() => setFormType('login')}>Login</Link>
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
              id="-id"
              label="ID"
              name="-id"
              value={id}
              onChange={(e) => setId(e.target.value)}
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
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="confirm-password"
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle confirm password visibility"
                      onClick={handleClickShowConfirmPassword}
                      edge="end"
                    >
                      {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
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
              Create
            </Button>
          </form>
        </Container>
      </Box>
    </Box>
  );
};

export default RegistrationForm;
