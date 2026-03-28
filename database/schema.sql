CREATE TABLE employers (
    id SERIAL PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL,
    registration_number VARCHAR(100) UNIQUE,
    industry VARCHAR(100),
    contact_person VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    password_hash TEXT,
    role VARCHAR(50) DEFAULT 'employer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE workers (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255),
    passport_number VARCHAR(100) UNIQUE,
    nationality VARCHAR(100),
    date_of_birth DATE,
    email VARCHAR(255),
    phone VARCHAR(50)
);

CREATE TABLE work_permit_applications (
    id SERIAL PRIMARY KEY,
    employer_id INTEGER REFERENCES employers(id),
    worker_id INTEGER REFERENCES workers(id),
    position VARCHAR(255),
    salary NUMERIC,
    contract_duration INTEGER,
    status VARCHAR(50),
    submission_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ihc_records (
    id SERIAL PRIMARY KEY,
    application_id INTEGER REFERENCES work_permit_applications(id),
    fee_amount NUMERIC,
    payment_status VARCHAR(50),
    medical_status VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE medical_results (
    id SERIAL PRIMARY KEY,
    worker_id INTEGER REFERENCES workers(id),
    clinic_name VARCHAR(255),
    result VARCHAR(50),
    doctor_name VARCHAR(255),
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE work_permits (
    id SERIAL PRIMARY KEY,
    worker_id INTEGER REFERENCES workers(id),
    permit_number VARCHAR(100),
    issue_date DATE,
    expiry_date DATE,
    status VARCHAR(50)
);