import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';
import Header from './components/Header';
import Footer from './components/Footer';
import ToastContainer from './components/ToastContainer';
import Shop from './pages/Shop';
import Product from './pages/Product';
import Cart from './pages/Cart';
import './index.css';

export default function App() {
  return (
    <ToastProvider>
      <CartProvider>
        <BrowserRouter>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex flex-col grow">
              <Routes>
                <Route path="/" element={<Shop />} />
                <Route path="/product/:id" element={<Product />} />
                <Route path="/cart" element={<Cart />} />
              </Routes>
            </main>
            <Footer />
          </div>
          <ToastContainer />
        </BrowserRouter>
      </CartProvider>
    </ToastProvider>
  );
}
