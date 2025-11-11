CREATE TABLE Patient (
    patient_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    dob DATE NOT NULL,
    contact_info VARCHAR(255)
);

CREATE TABLE MedicalHistory (
    history_id INT PRIMARY KEY AUTO_INCREMENT,
    patient_id INT,
    diagnosis TEXT,
    medication TEXT,
    allergies TEXT,
    date_recorded DATE,
    FOREIGN KEY (patient_id) REFERENCES Patient(patient_id)
);

CREATE TABLE CallRecord (
    call_id INT PRIMARY KEY AUTO_INCREMENT,
    patient_id INT,
    `timestamp` TIMESTAMP,
    transcription_text TEXT,
    doctor_id INT,
    FOREIGN KEY (patient_id) REFERENCES Patient(patient_id)
);
