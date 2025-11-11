require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');

const app = express();
app.use(express.json());
const port = process.env.PORT || 3000;

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect(err => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the MySQL database.');
});

app.get('/api/patient/:patientId', (req, res) => {
  const patientId = req.params.patientId;
  const query = `
    SELECT
      p.patient_id,
      p.name,
      p.dob,
      p.contact_info,
      mh.history_id,
      mh.diagnosis,
      mh.medication,
      mh.allergies,
      mh.date_recorded
    FROM Patient p
    LEFT JOIN MedicalHistory mh ON p.patient_id = mh.patient_id
    WHERE p.patient_id = ?
  `;

  db.query(query, [patientId], (err, results) => {
    if (err) {
      console.error('Error querying the database:', err);
      return res.status(500).send('Server error');
    }

    if (results.length === 0) {
      return res.status(404).send('Patient not found');
    }

    const patientData = {
      patient_id: results[0].patient_id,
      name: results[0].name,
      dob: results[0].dob,
      contact_info: results[0].contact_info,
      medical_history: results.map(row => ({
        history_id: row.history_id,
        diagnosis: row.diagnosis,
        medication: row.medication,
        allergies: row.allergies,
        date_recorded: row.date_recorded
      }))
    };

    res.json(patientData);
  });
});

app.post('/api/call/symptoms', (req, res) => {
  const { patientId, liveTranscript, doctorId } = req.body;

  if (!patientId || !liveTranscript || !doctorId) {
    return res.status(400).send('Missing required fields');
  }

  const query = 'INSERT INTO CallRecord (patient_id, transcription_text, doctor_id, timestamp) VALUES (?, ?, ?, NOW())';
  db.query(query, [patientId, liveTranscript, doctorId], (err, results) => {
    if (err) {
      console.error('Error inserting into the database:', err);
      return res.status(500).send('Server error');
    }
    res.status(201).send({ message: 'Symptom logged successfully', callId: results.insertId });
  });
});

app.listen(port, () => {
  console.log(\`Server is running on port \${port}\`);
});
