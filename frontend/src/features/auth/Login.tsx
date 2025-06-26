// src/components/LoginPage.tsx
import React, { useContext, useState } from 'react';
import { Form, Button, Card, Container, Row, Col, Alert, Navbar } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../../services/authService';
import { AuthContext } from '../../context/AuthContext';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string| null>(null);
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    const result = await login(email, password);
    if (result) {
      authContext.logIn();
      navigate('/home');
    } else {
      setError('Login failed');
    }
  }

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
              <h3 className="mb-4 text-center">Log In</h3>

              {error && <Alert variant="danger">{error}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="loginEmail" className="mb-3">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="loginPassword" className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                  />
                </Form.Group>

                <div className="d-grid mb-3">
                  <Button variant="primary" type="submit">
                    Sign In
                  </Button>
                </div>
              </Form>

              <div className="text-center mb-3">
                <Link to="/forgot-password">Forgot password?</Link>
              </div>
              <hr />
              <div className="mt-4 text-center">
                <span>Don't have an account? </span>
                <Link to="/signup">Sign up</Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
 </>
  );
};

export default LoginPage;