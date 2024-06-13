import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Grid, Typography, Box } from '@mui/material';
import TeacherSidebar from './TeacherSidebar';

const CreateCourse = ({ addCourse }) => {
  const [courseName, setCourseName] = useState('');
  const [courseID, setCourseID] = useState('');
  const [courseDescription, setCourseDescription] = useState('');
  const [courseDuration, setCourseDuration] = useState('');
  const [coverImage, setCoverImage] = useState(null);

  const handleCreateCourse = async () => {
    const formData = new FormData();
    formData.append('name', courseName);
    formData.append('courseID', courseID);
    formData.append('description', courseDescription);
    formData.append('duration', courseDuration);
    if (coverImage) {
      formData.append('coverImage', coverImage);
    }

    try {
      const response = await axios.post('http://localhost:8002/create-course', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      addCourse(response.data);
      setCourseName('');
      setCourseID('');
      setCourseDescription('');
      setCourseDuration('');
      setCoverImage(null);
    } catch (error) {
      console.error('There was an error creating the course!', error);
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <TeacherSidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#f5f5f5',
          minHeight: '100vh',
        }}
      >
        <Typography variant="h4" gutterBottom align="left" sx={{ mb: 3, fontWeight: 'bold', color: '#1976d2' }}>
          Create Course
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Box sx={{ backgroundColor: 'white', borderRadius: 2, p: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Course Name"
                    variant="outlined"
                    value={courseName}
                    onChange={(e) => setCourseName(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Course ID"
                    variant="outlined"
                    value={courseID}
                    onChange={(e) => setCourseID(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Course Description"
                    variant="outlined"
                    multiline
                    rows={4}
                    value={courseDescription}
                    onChange={(e) => setCourseDescription(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Course Duration"
                    variant="outlined"
                    value={courseDuration}
                    onChange={(e) => setCourseDuration(e.target.value)}
                  />
                </Grid>
              </Grid>
            </Box>
          </Grid>
          <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Box
              sx={{
                border: '2px dashed #1976d2',
                borderRadius: 2,
                padding: 2,
                textAlign: 'center',
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#e3f2fd',
              }}
            >
              <Typography variant="body1" sx={{ mb: 2, color: '#1976d2' }}>Course Cover Image</Typography>
              <Button variant="contained" component="label" sx={{ color: 'white', backgroundColor: '#1976d2' }}>
                Upload
                <input type="file" hidden onChange={(e) => setCoverImage(e.target.files[0])} />
              </Button>
            </Box>
          </Grid>
        </Grid>
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Button variant="contained" color="primary" onClick={handleCreateCourse} sx={{ px: 5, py: 1.5, fontSize: '1rem' }}>
            Create
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default CreateCourse;
