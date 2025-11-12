import React, { useState } from 'react';
import { Navbar, Nav, Container, Button, NavDropdown } from 'react-bootstrap';
import AuthModal from '../AuthModal/AuthModal'; // Importar el modal
import { useAuth } from '../../context/AuthContext'; // Importar el contexto de auth
import { Link } from 'react-router-dom'; // Asegúrate de importar Link

const Header = () => {
    const [showModal, setShowModal] = useState(false);
    const { currentUser, userData, logout } = useAuth(); // Usar el hook de autenticación

    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
            // Uso de console.error() en lugar de alert()
            console.error("Hubo un error al cerrar sesión.");
        }
    };

    return (
        <>
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
                            <Nav.Link href="#purchase-flow">Membresías</Nav.Link>
                            <Nav.Link href="#faq">FAQ</Nav.Link>
                        </Nav>

                        {/* Contenedor para el botón de Monitoreo y la autenticación */}
                        <div className="d-flex align-items-center">
                            {/* BOTÓN DE MONITOREO CORREGIDO: to="/monitoreo" */}
                            <Link
                                to="/monitoreo" // <-- RUTA DE URL CORREGIDA
                                className="btn btn-outline-info me-3"
                                style={{ whiteSpace: 'nowrap' }}
                            >
                                Monitoreo
                            </Link>

                            {/* Lógica condicional del botón Soy Cliente/Usuario */}
                            {currentUser && userData ? (
                                <NavDropdown
                                    title={`Hola, ${userData.names} ${userData.surnames}`}
                                    id="basic-nav-dropdown"
                                    align="end"
                                >
                                    <NavDropdown.Item href="/data-dashboard">Mi Dashboard</NavDropdown.Item>
                                    <NavDropdown.Item href="#action/3.2">Configuración</NavDropdown.Item>
                                    <NavDropdown.Divider />
                                    <NavDropdown.Item onClick={handleLogout}>Cerrar Sesión</NavDropdown.Item>
                                </NavDropdown>
                            ) : (
                                <Button variant="outline-primary" onClick={handleShow}>
                                    Soy Cliente
                                </Button>
                            )}
                        </div>

                    </Navbar.Collapse>
                </Container>
            </Navbar>

            {/* El Modal de Login */}
            <AuthModal show={showModal} handleClose={handleClose} />
        </>
    );
};

export default Header;