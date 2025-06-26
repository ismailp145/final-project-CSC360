import React from 'react';
import { Container, Navbar, Nav, Button, Row, Col } from 'react-bootstrap';

const LandingPage: React.FC = () => (
  <>
    <Navbar bg="light" expand="lg" className="mb-5">
      <Container>
        <Navbar.Brand href="/">Socal</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse>
          <Nav className="ms-auto">
            <Nav.Link href="/login">Login</Nav.Link>
            <Nav.Link href="/signup">Sign Up</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>

    {/* Hero Section */}
    <Container className="text-center mb-5">
      <Row className="align-items-center">
        <Col md={6}>
          <h1>Welcome to Socal</h1>
          <p className="lead">
            Publish posts, follow topics you care about, and join the conversation.
          </p>
          <Button href="/signup" size="lg">Get Started</Button>
        </Col>
        <Col md={6}>
          {/* <img src={heroImage} alt="Hero" className="img-fluid rounded" /> */}
        </Col>
      </Row>
    </Container>

    {/* Features Section */}
    <Container id="features" className="py-5">
      <h2 className="text-center mb-4">Features</h2>
      <Row>
        {[
          { icon: '📝', title: 'Write & Share', text: 'Compose rich posts with images & video.' },
          { icon: '💬', title: 'Comment Threads', text: 'Discuss and reply in nested threads.' },
          { icon: '🔖', title: 'Follow Topics', text: 'Subscribe to categories that matter to you.' },
        ].map((f, i) => (
          <Col md={4} className="text-center mb-4" key={i}>
            <div style={{ fontSize: '3rem' }}>{f.icon}</div>
            <h5 className="mt-3">{f.title}</h5>
            <p>{f.text}</p>
          </Col>
        ))}
      </Row>
    </Container>

    {/* Footer */}
    <footer className="bg-light text-center py-4">
      <Container>
        <small>&copy; {new Date().getFullYear()} SOCAL. All rights reserved.</small>
      </Container>
    </footer>
  </>
);

export default LandingPage;
  
