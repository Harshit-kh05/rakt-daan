import React from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

export default function CustomNavbar() {
  const url = "home";

  return (
    <Navbar className={"fixed-top bg-dark"} bg="light" expand="lg">
      <Container>
        <LinkContainer to="/">
          <Navbar.Brand>Rakt Daan</Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Nav className="me-auto">
            {(url === "home" ||
              url === "loginBloodBank" ||
              url === "loginHospital") && (
              <>
                <LinkContainer to="/login">
                  <Nav.Link>Login</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/register">
                  <Nav.Link>Register</Nav.Link>
                </LinkContainer>
              </>
            )}
            {url === "bloodBankHome" && (
              <LinkContainer to="/bloodCollection">
                <Nav.Link>Blood Collection</Nav.Link>
              </LinkContainer>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
