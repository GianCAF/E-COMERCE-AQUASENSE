// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Header from './components/Header/Header';
import HeroProduct from './components/HeroProduct/HeroProduct';
import ProductDetails from './components/ProductDetails/ProductDetails';
import SensorDetailsSection from './components/SensorDetailsSection/SensorDetailsSection';
import MembershipPrograms from './components/MembershipPrograms/MembershipPrograms';
import { ContactForm } from './components/ContactForm/ContactForm.jsx';
import ProblemSolver from './components/ProblemSolver/ProblemSolver';
import FAQ from './components/FAQ/FAQ';
import Footer from './components/Footer/Footer';
import FloatingCart from './components/FloatingCart/FloatingCart';
import CartPage from './components/CartPage/CartPage';
import PurchaseFlow from './components/PurchaseFlow/PurchaseFlow'; // Importa el nuevo componente
import RutaMapa from './components/map/RutaMapa.jsx';
import MonitoringPage from './components/MonitoringPage/MonitoringPage.jsx'; // ¡Importa el nuevo componente de graficacion!

// Componente para la página de inicio que agrupa las secciones
const HomePage = () => (
  <>
    <HeroProduct />
    <ProductDetails />
    <SensorDetailsSection />
    <PurchaseFlow /> {/* Agrega la nueva sección aquí */}
    <ProblemSolver />
    <RutaMapa />
    <FAQ />
    <ContactForm />

  </>
);

function App() {
  return (
    <Router>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/product-details" element={<ProductDetails />} />
          <Route path="/cart" element={<CartPage />} />
          {/* Aquí puedes agregar más rutas para otras páginas */}
          <Route path="/monitoreo" element={<MonitoringPage />} /> {/* Nueva ruta */}

        </Routes>
      </main>
      <FloatingCart />
      <Footer />
    </Router>
  );
}

export default App;