// App.jsx
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ItemScanPage from "./pages/ItemScanPage";
import MobileNav from "./components/MobileNav";
import ShoppingCartPage from "./pages/ShoppingCartPage";


function App() {
  return (
    <>
      <Navbar />
      
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/item-scan" element={<ItemScanPage/>} />
        <Route path="/shopping" element={<ShoppingCartPage/>} />
      </Routes>
      <Footer/>
      <MobileNav/>
    </>
  );
}

export default App;
