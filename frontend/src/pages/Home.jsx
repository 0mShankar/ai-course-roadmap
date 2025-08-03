// src/pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Welcome to AI Course Builder</h1>
      <p style={styles.subheading}>Learn anything with AI-generated roadmaps, videos & articles.</p>
      <div style={styles.buttonContainer}>
        <Link to="/login" style={styles.button}>Login</Link>
        <Link to="/register" style={styles.buttonOutline}>Register</Link>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    padding: '2rem',
    textAlign: 'center',
    background: '#f0f4f8',
  },
  heading: {
    fontSize: '2.5rem',
    marginBottom: '1rem',
  },
  subheading: {
    fontSize: '1.25rem',
    color: '#666',
    marginBottom: '2rem',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem',
  },
  button: {
    padding: '0.75rem 1.5rem',
    background: '#007bff',
    color: '#fff',
    textDecoration: 'none',
    borderRadius: '5px',
    fontWeight: 'bold',
  },
  buttonOutline: {
    padding: '0.75rem 1.5rem',
    border: '2px solid #007bff',
    color: '#007bff',
    textDecoration: 'none',
    borderRadius: '5px',
    fontWeight: 'bold',
  }
};

export default Home;
