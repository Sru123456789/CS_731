# Course Management Platform

## Overview
This project is a course management platform designed to allow instructors to create courses, register students, and upload course content. Students can view the courses they are registered in and access the course materials.

## Features
- Account creation (student, instructor)
- Login and logout
- Create a course (instructor)
- Register a student in a course (instructor)
- Upload course content (instructor)
- View course list (student, instructor)
- View course detail (student, instructor)

## Technology Stack
- **Frontend:** HTML/CSS/JavaScript, React.js
- **Backend:** Node.js, Express.js
- **Database:** MongoDB

## Setup Instructions

### Prerequisites
- Node.js (https://nodejs.org/)
- MongoDB (https://www.mongodb.com/)

### Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/yourusername/course-management-platform.git
   cd course-management-platform
2. **Install backend dependencies:**
    ```sh
    cd backend
    npm install
    Install frontend dependencies:
3. **Install frontend dependencies:**
    ```sh
    cd ../frontend
    npm install

4. **Set up environment variables:**

- Create a .env file in the backend directory.
- Add the following variables:
    ```sh
    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret

 ## Running the Application ##

1. **Start the backend server:**

    ```sh
    cd backend
    npm start

2. **Start the frontend server:**

    ```sh
    cd ../frontend
    npm start

3. **Access the application:**
- Open your browser and go to http://localhost:3000


## Usage ##

#### Instructors ###
-Register and login.
-Create a new course.
-Register students in the course.
-Upload course content.

### Students ###

-Register and login.
-View the list of courses you are registered in.
-Access the course details and content.