const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const fs = require('fs');

// Load environment variables
dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ensure the uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define Mongoose schemas and models
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  id: { type: String, required: true, unique: true },
  role: { type: String, enum: ['teacher', 'student'], required: true }
});

const CourseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  courseID: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  duration: { type: String, required: true },
  coverImage: String,
  students: [{ name: String, email: String, id: String }],
  materials: [{ week: String, note: String, file: String }]
});

const AssignmentSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  week: { type: String, required: true },
  fileLink: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);
const Course = mongoose.model('Course', CourseSchema);
const Assignment = mongoose.model('Assignment', AssignmentSchema);

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log('Setting upload destination');
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    console.log('Generating filename for uploaded file');
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  console.log('Filtering file type');
  const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, and PDF are allowed.'));
  }
};

const upload = multer({ storage, fileFilter });

// JWT token generation
const generateToken = (user) => {
  return jwt.sign({ id: user.id, role: user.role , email: user.email}, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Routes
app.post('/register', async (req, res) => {
  const { email, password, id } = req.body;
  const role = id.startsWith('T') ? 'teacher' : 'student';
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ email, password: hashedPassword, id, role });
  try {
    await newUser.save();
    // Generate token for the newly registered user
    const token = generateToken(newUser);
    res.send({ message: 'User registered successfully', token });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).send({ message: 'Error registering user', error });
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    console.log('Login attempt:', email);
    const user = await User.findOne({ email });
    if (!user) {
      console.error('User not found');
      return res.status(401).send({ message: 'Invalid email or password' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.error('Invalid password');
      return res.status(401).send({ message: 'Invalid email or password' });
    }
    // Generate token for the logged-in user
    const token = generateToken(user);
    res.send({ message: 'Login successful', role: user.role, token });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).send({ message: 'Error logging in', error });
  }
});

app.post('/create-course', upload.single('coverImage'), async (req, res) => {
  const { name, courseID, description, duration } = req.body;
  const coverImage = req.file ? `/uploads/${req.file.filename}` : '';
  const newCourse = new Course({ name, courseID, description, duration, coverImage, students: [], materials: [] });
  try {
    await newCourse.save();
    res.status(201).json(newCourse);
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({ message: 'Error creating course', error });
  }
});

app.get('/courses', async (req, res) => {
  try {
    const courses = await Course.find();
    res.status(200).json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ message: 'Failed to fetch courses', error });
  }
});

app.get('/courses/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    res.status(200).json(course);
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({ message: 'Failed to fetch course', error });
  }
});

app.get('/students', async (req, res) => {
  try {
    const students = await User.find({ role: 'student' });
    res.status(200).json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ message: 'Failed to fetch students', error });
  }
});

app.put('/courses/:id/register', async (req, res) => {
  const { id } = req.params;
  const { name, email, studentId } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) {
      const newUser = new User({ email, password: await bcrypt.hash('defaultpassword', 10), id: studentId, role: 'student' });
      user = await newUser.save();
    }

    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    course.students.push({ name, email, id: studentId });
    await course.save();
    res.json(course);
  } catch (error) {
    console.error('Error registering student:', error);
    res.status(500).json({ message: 'Failed to register student', error });
  }
});

// app.post('/courses/upload', upload.single('file'), async (req, res) => {
//   console.log('Upload endpoint hit');
//   const { courseId, week } = req.body;
//   const file = req.file ? `/uploads/${req.file.filename}` : '';

//   console.log('Received data:', { courseId, week, file });

//   if (!courseId || !week || !file) {
//     console.error('Missing required fields');
//     return res.status(400).json({ message: 'Course ID, week, and file are required' });
//   }

//   try {
//     // Check if the assignments collection exists
//     const collections = await mongoose.connection.db.listCollections().toArray();
//     const assignmentCollectionExists = collections.some(collection => collection.name === 'assignments');

//     if (!assignmentCollectionExists) {
//       console.log('Creating assignments collection');
//       await mongoose.connection.createCollection('assignments');
//     }

//     const assignment = new Assignment({ courseId, week, file });
//     await assignment.save();
//     console.log('File uploaded and assignment saved');
//     res.status(201).json({ message: 'File uploaded successfully', assignment });
//   } catch (error) {
//     console.error('Error uploading file:', error);
//     res.status(500).json({ message: 'Failed to upload file', error });

//   }
// });
app.post('/courses/upload', async (req, res) => {
  console.log('Upload endpoint hit');
  const { courseId, week,fileLink } = req.body;
  
  console.log('Received data:', { courseId, week, fileLink });
  
  if (!courseId || !week || !fileLink) {
  console.error('Missing required fields');
  return res.status(400).json({ message: 'Course ID, week, and file Link are required' });
  }
  try {
  // Check if the assignments collection exists
  
  const collections = await mongoose.connection.db.listCollections().toArray();
  const assignmentCollectionExists = collections.some(collection => collection.name === 'assignments');
  if (!assignmentCollectionExists) {
  console.log('Creating assignments collection');
  
  await mongoose.connection.createCollection('assignments');
  }
  const assignment = new Assignment({ courseId, week, fileLink });
  await assignment.save();
  
  console.log('File uploaded and assignment saved');
  res.status(201).json({ message: 'File uploaded successfully', assignment });
  } catch (error) {
  console.error('Error uploading file:', error);
  res.status(500).json({ message: 'Failed to upload file', error });
  }
  });

app.listen(process.env.PORT || 3000, () => console.log(`Server running on port ${process.env.PORT || 3000}`));


app.get('/api/courses/user/:email', async (req, res) => {
  const { email } = req.params;

  try {
    // Find the user based on the provided ID
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const courses = await Course.find({ 'students.email': email });

    res.status(200).json({ user, courses });
  } catch (error) {
    console.error('Error fetching user courses:', error);
    res.status(500).json({ message: 'Failed to fetch user courses', error });
  }
});



// Middleware to authenticate user
const authenticateUser = (req, res, next) => {
  // Get token from request header
  const token = req.header('Authorization');
  if (!token) {
    return res.status(401).json({ message: 'Authorization token missing' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Attach user information to request object
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Error authenticating user:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
};

app.get('/api/user', authenticateUser, async (req, res) => {
  try {
    // Extract the user information from the request object
    const user = req.user;
    
    // Include the email field in the user data
    const { email, role } = user;
    
    // Send the user data as the response
    res.status(200).json({ email, role, ...user });
  } catch (error) {
    console.error('Error finding user:', error);
    res.status(500).json({ message: 'Error finding user', error });
  }
});


