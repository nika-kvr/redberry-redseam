import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Products from "./pages/Products";
import ProductsDetail from "./pages/ProductDetail";
import Checkout from "./pages/Checkout";
import Header from "./pages/Header";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />

        <Route path="/products/:id" element={<ProductsDetail />} />
        <Route path="/products" element={<Products />} />
        <Route path="*" element={<Navigate to="/products" />} />
      </Routes>
    </Router>
  );
}

export default App;
