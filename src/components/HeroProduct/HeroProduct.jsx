// src/components/HeroProduct/HeroProduct.jsx
import React from 'react';
import { Container, Button } from 'react-bootstrap';
// Nota: Puedes crear un archivo CSS para esta sección si lo deseas

const HeroProduct = () => {
    return (
        <div
            className="hero-section text-center d-flex align-items-center justify-content-center"
            style={{
                backgroundImage: 'url(/assets/product-images/aquasense-hero.jpg)', // Asegúrate de tener esta imagen en la ruta
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                height: '60vh',
                color: 'white',
                position: 'relative',
                marginBottom: '2rem',
            }}
        >
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.4)',
                }}
            ></div>
            <Container style={{ zIndex: 1 }}>
                <h1>Monitorea la Calidad del Agua con AquaSense</h1>
                <p className="lead">La solución inteligente para el cuidado de tu agua.</p>
                <Button variant="primary" size="lg" href="#product-info">
                    Conoce más de AquaSense
                </Button>
            </Container>
        </div>
    );
};

export default HeroProduct;