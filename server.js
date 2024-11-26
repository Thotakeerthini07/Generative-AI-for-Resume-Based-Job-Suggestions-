// Importing required libraries
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const multer = require('multer');
const pdf = require('pdf-parse');
const fs = require('fs');
const cors = require('cors');

// Creating an Express app
const app = express();
const port = 5500; // Fixed port number

// Middleware setup
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MySQL database connection setup
const db = mysql.createConnection({
  host: '34.47.247.135',
  user: 'root',
  password: 'root',
  database: 'job_matching_db',
});

db.connect(err => {
  if (err) {
    console.error('Database connection error: ' + err.stack);
    return;
  }
  console.log('Connected to database');
});

// Setup multer to handle file uploads
const upload = multer({ dest: 'uploads/' });

// Endpoint to handle PDF resume uploads and extract text
app.post('/uploadResume', upload.single('resume'), (req, res) => {
  const resumePath = req.file.path;

  // Read and parse the PDF file
  fs.readFile(resumePath, (err, data) => {
    if (err) {
      return res.status(500).send('Error reading PDF file');
    }

    pdf(data).then(function (pdfData) {
      const extractedText = pdfData.text;

      // Extract necessary details from the resume (basic example)
      const resumeData = extractResumeData(extractedText);

      // Insert the extracted resume data into the database
      const query = 'INSERT INTO resumes (name, skills, experience, education) VALUES (?, ?, ?, ?)';
      db.query(query, [resumeData.name, resumeData.skills, resumeData.experience, resumeData.education], (err, result) => {
        if (err) {
          return res.status(500).send('Error inserting resume data into the database');
        }
        res.send('Resume uploaded and data saved successfully');
      });
    }).catch((err) => {
      return res.status(500).send('Error parsing PDF file');
    });
  });
});

// Helper function to extract resume details (for example purposes, you'll need to improve this)
function extractResumeData(text) {
  const nameMatch = text.match(/Name: (.*)/);
  const skillsMatch = text.match(/Skills: (.*)/);
  const experienceMatch = text.match(/Experience: (.*)/);
  const educationMatch = text.match(/Education: (.*)/);

  const name = nameMatch ? nameMatch[1] : 'Not Provided';
  const skills = skillsMatch ? skillsMatch[1] : 'Not Provided';
  const experience = experienceMatch ? experienceMatch[1] : 'Not Provided';
  const education = educationMatch ? educationMatch[1] : 'Not Provided';

  return { name, skills, experience, education };
}

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
