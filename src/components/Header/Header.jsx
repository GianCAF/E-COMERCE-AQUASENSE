// src/components/Header/Header.jsx
import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';

const Header = () => {
    return (
        <Navbar bg="light" expand="lg" className="shadow-sm sticky-top">
            <Container>
                <Navbar.Brand href="#home">
                    <img
                        src="/assets/logos/aquasense-logo.png"
                        height="30"
                        className="d-inline-block align-top"
                        alt="AquaSense Logo"
                    />
                    {' '}AquaSense
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mx-auto">
                        <Nav.Link href="#product-info">Producto</Nav.Link>
                        <Nav.Link href="#sensors">Sensores</Nav.Link>
                        <Nav.Link href="#memberships">Membresías</Nav.Link>
                        <Nav.Link href="#faq">FAQ</Nav.Link>
                    </Nav>
                    <Button variant="outline-primary" href="/login">Soy Cliente</Button>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Header;