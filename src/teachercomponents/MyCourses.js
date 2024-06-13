import React, { useState, useEffect } from 'react';
import { Box, Button, Grid, Typography, Avatar, TextField, Card, CardActionArea, CardContent, CardMedia, Tabs, Tab, MenuItem, Select, FormControl, InputLabel, List, ListItem, ListItemText } from '@mui/material';
import { Person, Schedule, School, CreditCard, ExpandMore, ExpandLess } from '@mui/icons-material';
import axios from 'axios';

const MyCourses = ({ courses }) => {
  const [value, setValue] = useState(0);
  const [expandedWeek, setExpandedWeek] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [allStudents, setAllStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [assignmentFile, setAssignmentFile] = useState(null);
  const [errorMessages, setErrorMessages] = useState({});

  useEffect(() => {
    // Fetch all students when the component mounts
    const fetchStudents = async () => {
      try {
        const response = await axios.get('http://localhost:8002/students');
        setAllStudents(response.data);
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };
    fetchStudents();
  }, []);

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleWeekClick = (week) => {
    setExpandedWeek(expandedWeek === week ? null : week);
  };

  const handleRegisterStudent = async () => {
    const selectedStudentDetails = allStudents.find(student => student._id === selectedStudent);

    if (!selectedStudentDetails) {
      setErrorMessages(prev => ({ ...prev, general: 'Please select a student' }));
      return;
    }

    try {
      const response = await axios.put(`http://localhost:8002/courses/${selectedCourse._id}/register`, selectedStudentDetails);
      setSelectedCourse(response.data);
      setSelectedStudent('');
      alert('Student registered successfully');
      console.log(selectedCourse.students)

    } catch (error) {
      console.error('Error registering student:', error.response ? error.response.data : error.message);
      setErrorMessages(prev => ({ ...prev, general: 'Failed to register student' }));
    }
  

  };

  const handleFileUpload = (event) => {
    setAssignmentFile(event.target.files[0]);
  };

  const handleUploadAssignment = async () => {
    if (!assignmentFile || !expandedWeek) {
      alert('Please select a file to upload and ensure a week is expanded.');
      return;
    }

    const formData = new FormData();
    formData.append('file', assignmentFile);
    formData.append('week', expandedWeek);
    formData.append('courseId', selectedCourse._id);

    try {
      const response = await axios.post('/courses/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const updatedCourse = await axios.get(`/courses/${selectedCourse._id}`);
      setSelectedCourse(updatedCourse.data);
      setAssignmentFile(null);
      setErrorMessages(prev => ({ ...prev, [expandedWeek]: '' }));
      alert('File uploaded successfully!');
    } catch (error) {
      console.error('Error uploading file:', error.response ? error.response.data : error.message);
      setErrorMessages(prev => ({ ...prev, [expandedWeek]: 'Failed to upload file' }));
    }
  };

  const renderWeekDetail = (week) => (
    <Box sx={{ p: 2, border: '1px solid grey', mt: 2, borderRadius: 2 }}>
      <Button variant="contained" component="label" sx={{ mr: 2 }}>
        Upload File
        <input type="file" hidden onChange={handleFileUpload} />
      </Button>
      <Button variant="contained" color="primary" onClick={handleUploadAssignment}>
        Upload
      </Button>
      {errorMessages[week] && (
        <Typography color="error" variant="body2" sx={{ mt: 2 }}>
          {errorMessages[week]}
        </Typography>
      )}
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', padding: "40px" }}>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          marginLeft: '-24px',
        }}
      >
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" gutterBottom>
            My Courses
          </Typography>
          <Avatar src="path_to_teacher_profile_pic.png" alt="Teacher Profile" />
        </Box>
        {!selectedCourse ? (
          <Grid container spacing={3}>
            {courses.map((course, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card onClick={() => setSelectedCourse(course)} sx={{ cursor: 'pointer', height: '100%' }}>
                  <CardActionArea sx={{ height: '100%' }}>
                    <CardMedia
                      component="img"
                      height="140"
                      image={`http://localhost:8002${course.coverImage}`}
                      alt={course.name}
                    />
                    <CardContent>
                      <Typography variant="h5" component="div">
                        {course.name}
                      </Typography>
                      <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Person sx={{ mr: 1 }} />
                          <Typography variant="body2">{course.students.length} students</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <School sx={{ mr: 1 }} />
                          <Typography variant="body2">Modules</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Schedule sx={{ mr: 1 }} />
                          <Typography variant="body2">1</Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box sx={{ width: '100%', mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar src="path_to_course_teacher_pic.png" alt="Mrs. Ben" sx={{ mr: 2 }} />
              <Typography variant="h5" gutterBottom>
                {selectedCourse.name}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Person sx={{ mr: 1 }} />
              <Typography variant="body1" sx={{ mr: 3 }}>{selectedCourse.students.length} students</Typography>
              <School sx={{ mr: 1 }} />
              <Typography variant="body1" sx={{ mr: 3 }}>Module</Typography>
              <Schedule sx={{ mr: 1 }} />
              <Typography variant="body1" sx={{ mr: 3 }}>3 Months</Typography>
              <CreditCard sx={{ mr: 1 }} />
              <Typography variant="body1">3 Credits</Typography>
            </Box>
            <Tabs value={value} onChange={handleTabChange} sx={{ alignSelf: 'flex-start', mb: 3 }}>
              <Tab label="Materials" />
              <Tab label="Register Student" />
            </Tabs>
            <Box sx={{ width: '100%' }}>
              {value === 0 && (
                <Grid container spacing={2}>
                  {['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'].map((week) => (
                    <Grid item xs={12} key={week}>
                      <Button
                        fullWidth
                        variant="outlined"
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          textTransform: 'none',
                        }}
                        onClick={() => handleWeekClick(week)}
                      >
                        <Typography>{week}</Typography>
                        {expandedWeek === week ? <ExpandLess /> : <ExpandMore />}
                      </Button>
                      {expandedWeek === week && renderWeekDetail(week)}
                    </Grid>
                  ))}
                </Grid>
              )}
              {value === 1 && (
                <Box>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Box sx={{ border: '1px solid grey', borderRadius: 2, p: 2, height: '100%' }}>
                        <Typography variant="h6">Enrolled student list</Typography>
                        <List>
                          {selectedCourse.students.map((student, index) => (
                            <ListItem key={index}>
                              <ListItemText primary={student.email} />
                            </ListItem>
                          ))}
                        </List>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Box sx={{ border: '1px solid grey', borderRadius: 2, p: 2, height: '100%' }}>
                        <Typography variant="h6">Select student</Typography>
                        <FormControl fullWidth sx={{ mb: 2 }}>
                          <InputLabel id="student-select-label">Select Student</InputLabel>
                          <Select
                            labelId="student-select-label"
                            id="student-select"
                            value={selectedStudent}
                            label="Select Student"
                            onChange={(e) => setSelectedStudent(e.target.value)}
                          >
                            {allStudents.map((student) => (
                              <MenuItem key={student._id} value={student._id}>
                               {student.id}       {student.email}  
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        <Button variant="contained" color="primary" onClick={handleRegisterStudent} fullWidth>
                          Register
                        </Button>
                        {errorMessages.general && (
                          <Typography color="error" variant="body2" sx={{ mt: 2 }}>
                            {errorMessages.general}
                          </Typography>
                        )}
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default MyCourses;
