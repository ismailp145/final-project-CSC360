// src/components/LoginPage.tsx
import React, { useContext, useState } from 'react';
import { Form, Button, Card, Container, Row, Col, Alert, Navbar} from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { signup } from '../../services/authService';
import { AuthContext } from '../../context/AuthContext';

const SignUp: React.FC = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string| null>(null);
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  const checkPassword = (password: string, confirmPassword: string) => {
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }
    if (!password.match(/[A-Z]/)) {
      setError('Password must contain at least one uppercase letter');
      return false;
    }
    if (!password.match(/[a-z]/)) {
      setError('Password must contain at least one lowercase letter');
      return false;
    }
    if (!password.match(/[0-9]/)) {
      setError('Password must contain at least one number');
      return false;
    }
    if (!password.match(/[!@#$%^&*]/)) {
      setError('Password must contain at least one special character');
      return false;
    }
    setError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!checkPassword(password, confirmPassword)) {
      return;
    }
    
    setError(null);
    
    const result = await signup(email, username, password);
    if (result) {
      authContext.logIn();
      navigate('/home');
    } else {
      setError('Signup failed');
    }
  };
  
  return (
    <>
    <Navbar 
    bg="light"
    expand="lg"
    className="mb-4"
    >
    <Container>
        <Navbar.Brand href="/">MySocialApp</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
        </Navbar.Collapse>
    </Container>
    </Navbar>
    <Container fluid className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <Row className="w-100 justify-content-center">
        <Col xs={12} md={6} lg={4}>
          <Card className="shadow-sm">
            <Card.Body>
              <h3 className="mb-4 text-center">Sign Up</h3>
              {/* Conditional Rendering of error message */}
              {error && <Alert variant="danger">{error}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="signupEmail" className="mb-3">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="signupUsername" className="mb-3">

                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="signupPassword" className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="signupConfirmPassword" className="mb-3">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={e => {
                      setConfirmPassword(e.target.value);
                      checkPassword(password, e.target.value);
                    }}
                    required
                  />
                </Form.Group>

                <div className="d-grid mb-3">
                  <Button variant="primary" type="submit">
                    Sign Up
                  </Button>
                </div>
              </Form>
              <div className="mt-4 text-center">
                <span>Already have an account? </span>
                <Link to="/login">Login</Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
    <footer className="text-center mt-4">
      <p>© 2025 MySocialApp. Venmo @ismailp145</p>
      <p>
        <Link to="/privacy">Privacy Policy</Link> | <Link to="/terms">Terms of Service</Link>
      </p>
    </footer>
    </>
  );
};

export default SignUp;