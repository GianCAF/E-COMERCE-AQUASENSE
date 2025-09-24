// src/components/ProductDetails/ProductDetails.jsx
import React, { useState } from 'react';
import { Container, Row, Col, Card, ListGroup, Button, Image, Badge } from 'react-bootstrap';
import { useCart } from '../../context/CartContext';

const ProductDetails = () => {
    const { addToCart } = useCart();

    const productData = {
        // Es crucial que el producto tenga un 'id' único
        id: 'aquasense-monitor-123',
        name: 'AquaSense - Monitor de Calidad de Agua Inteligente',
        price: 999.99,
        discount: '12 meses sin intereses',
        deliveryTime: 'Llega gratis mañana',
        stock: 25,
        seller: 'AquaSense Oficial',
        sellerLink: '#',
        description: `El AquaSense es la solución definitiva para el monitoreo de la calidad del agua. Con un diseño robusto y sensores de alta precisión (pH, Turbidez, Conductividad), te permite tener control total sobre tu fuente de agua en tiempo real.`,
        features: [
            'Monitoreo en tiempo real de pH, Turbidez y Conductividad',
            'Diseño compacto y resistente al agua',
            'Conectividad Wi-Fi para acceso remoto a datos',
            'Alertas personalizables en tu smartphone',
            'Batería de larga duración',
            'Fácil instalación y mantenimiento',
        ],
        specs: [
            { label: 'Sensores incluidos', value: 'pH, Turbidez, Conductividad' },
            { label: 'Conectividad', value: 'Wi-Fi 2.4GHz' },
            { label: 'Material', value: 'Plástico ABS de alta resistencia' },
            { label: 'Batería', value: 'Ion-Litio 3000mAh' },
            { label: 'Dimensiones', value: '15cm x 10cm x 5cm' },
        ],
        reviews: [
            { author: 'Juan P.', rating: 5, comment: '¡Excelente producto! Muy fácil de usar y la precisión es increíble. Ahora sé exactamente qué pasa con mi agua.', date: '2023-10-26' },
            { author: 'Maria G.', rating: 4, comment: 'Funciona muy bien, aunque la app podría mejorar en diseño. Aun así, cumple su función perfectamente.', date: '2023-10-20' },
        ]
    };

    const [mainImage, setMainImage] = useState('/assets/product-images/aquasense-main.jpg');
    const productImages = [
        { src: '/assets/product-images/aquasense-main.jpg', alt: 'AquaSense Main' },
        { src: '/assets/product-images/aquasense-sensor1.jpg', alt: 'AquaSense Sensor 1' },
        { src: '/assets/product-images/aquasense-display.jpg', alt: 'AquaSense Display' },
        { src: '/assets/product-images/aquasense-packaging.jpg', alt: 'AquaSense Packaging' },
    ];

    const handleThumbnailClick = (imageSrc) => {
        setMainImage(imageSrc);
    };

    const handleAddToCart = () => {
        addToCart(productData);
        alert(`${productData.name} ha sido agregado al carrito.`);
    };

    return (
        <Container className="my-5" id="product-info">
            <Row>
                {/* Columna de Imágenes */}
                <Col md={5}>
                    <div className="position-relative">
                        <Image src={mainImage} fluid className="border shadow-sm mb-3" />
                    </div>
                    <div className="d-flex overflow-auto" style={{ maxWidth: '100%' }}>
                        {productImages.map((img, index) => (
                            <div
                                key={index}
                                className={`thumbnail-wrapper me-2 mb-2 border ${mainImage === img.src ? 'border-primary' : ''}`}
                                onClick={() => handleThumbnailClick(img.src)}
                                style={{ width: '80px', height: '80px', cursor: 'pointer', flexShrink: 0 }}
                            >
                                <Image src={img.src} thumbnail />
                            </div>
                        ))}
                    </div>
                </Col>

                {/* Columna de Información Central del Producto */}
                <Col md={4}>
                    <h1 className="mb-2">{productData.name}</h1>
                    <div className="d-flex align-items-center mb-3">
                        <div className="text-warning me-2">
                            {'★'.repeat(Math.floor(productData.rating))}
                            {'☆'.repeat(5 - Math.floor(productData.rating))}
                        </div>
                        <span>({productData.reviewsCount} calificaciones)</span>
                    </div>

                    <h2 className="text-primary my-3">${productData.price.toFixed(2)} MXN</h2>
                    <p className="text-success">{productData.discount}</p>

                    <h5 className="mt-4">Características principales:</h5>
                    <ListGroup variant="flush">
                        {productData.features.map((feature, index) => (
                            <ListGroup.Item key={index}>• {feature}</ListGroup.Item>
                        ))}
                    </ListGroup>
                    <hr />
                </Col>

                {/* Columna de Opciones de Compra */}
                <Col md={3}>
                    <Card className="shadow-sm">
                        <Card.Body>
                            <Card.Title className="text-success">
                                {productData.deliveryTime}
                            </Card.Title>
                            <Card.Text>
                                <Badge bg={productData.stock > 0 ? "success" : "danger"} className="me-2">
                                    {productData.stock > 0 ? 'En Stock' : 'Agotado'}
                                </Badge>
                                {productData.stock > 0 && `(${productData.stock} disponibles)`}
                            </Card.Text>

                            <Button variant="primary" size="lg" className="w-100 mb-2" disabled={productData.stock === 0}>
                                Comprar ahora
                            </Button>
                            <Button
                                variant="outline-primary"
                                size="lg"
                                className="w-100"
                                onClick={handleAddToCart}
                                disabled={productData.stock === 0}
                            >
                                Agregar al carrito
                            </Button>

                            <div className="mt-3 text-muted small">
                                Vendido por <a href={productData.sellerLink}>{productData.seller}</a>
                            </div>
                            <hr />
                            <p className="small">
                                <i className="bi bi-shield-check me-1"></i>Compra Protegida: recibes el producto que esperabas o te devolvemos tu dinero.
                            </p>
                            <p className="small">
                                <i className="bi bi-arrow-return-left me-1"></i>Devolución gratis. Tienes 30 días para devolver el producto.
                            </p>
                        </Card.Body>
                    </Card>

                    <Card className="mt-4 shadow-sm">
                        <Card.Body>
                            <Card.Title>Medios de Pago</Card.Title>
                            <div className="d-flex flex-wrap gap-2 mt-3">
                                <Image src="/assets/payment-logos/visa-logo.png" height="25" alt="Visa" />
                                <Image src="/assets/payment-logos/mastercard-logo.png" height="25" alt="Mastercard" />
                            </div>
                            <Button variant="link" className="p-0 mt-3">Ver más medios de pago</Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Características Detalladas (expandido) */}
            <Row className="mt-5">
                <Col md={12}>
                    <h3 className="mb-3">Características del producto</h3>
                    <Row>
                        {productData.specs.map((spec, index) => (
                            <Col sm={6} md={4} key={index} className="mb-3">
                                <strong>{spec.label}:</strong> {spec.value}
                            </Col>
                        ))}
                    </Row>
                    <hr />
                </Col>
            </Row>

            {/* Descripción Detallada */}
            <Row className="mt-4">
                <Col md={12}>
                    <h3 className="mb-3">Descripción</h3>
                    <p>{productData.description}</p>
                    <Button variant="link" className="p-0">Ver descripción completa</Button>
                    <hr />
                </Col>
            </Row>

            {/* Opiniones del Producto */}
            <Row className="mt-4">
                <Col md={12}>
                    <h3 className="mb-3">Opiniones del producto</h3>
                    <div className="d-flex align-items-center mb-3">
                        <h4 className="me-2">{productData.rating}</h4>
                        <div className="text-warning">
                            {'★'.repeat(Math.floor(productData.rating))}
                            {'☆'.repeat(5 - Math.floor(productData.rating))}
                        </div>
                        <span className="ms-2">({productData.reviewsCount} calificaciones)</span>
                    </div>

                    <h5 className="mt-4">Opiniones destacadas</h5>
                    {productData.reviews.map((review, index) => (
                        <Card key={index} className="mb-3 shadow-sm">
                            <Card.Body>
                                <div className="d-flex justify-content-between">
                                    <h6 className="mb-1">{review.author}</h6>
                                    <small className="text-muted">{review.date}</small>
                                </div>
                                <div className="text-warning mb-2">
                                    {'★'.repeat(review.rating)}
                                    {'☆'.repeat(5 - review.rating)}
                                </div>
                                <Card.Text>{review.comment}</Card.Text>
                            </Card.Body>
                        </Card>
                    ))}
                    <Button variant="outline-secondary">Ver todas las opiniones</Button>
                    <hr />
                </Col>
            </Row>
        </Container>
    );
};

export default ProductDetails;