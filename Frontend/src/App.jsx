import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./Components/Navbar";
import AboutUs from "./Components/AboutUs";
import SignUp_Login from "./Components/Signup_Login";
import SignUpSelection from "./Components/SignUpSelection";
import CustomerSignup from "./Components/CustomerSignup";
import VendorSignup from "./Components/VendorSignup";
import Home from "./Components/Home";
import Profile from "./Components/Profile";
import AddProduct from "./Components/AddProduct";
import VendorProductList from "./Components/VendorProductList";
import ResetPassword from "./Components/ResetPassword";
import CustomerLayout from "./Components/CustomerLayout";
import VendorLayout from "./Components/VendorLayout";
import ProductList from "./Components/ProductList";
import ProductProfile from "./Components/ProductProfile";
import Wishlist from "./Components/Wishlist";
import Cart from "./Components/Cart";
import SearchResults from "./Components/SearchResults";
import CustomerOrderList from "./Components/CustomerOrderList";
import IncomingVendorOrders from "./Components/IncomingVendorOrders";
import Dashboard from "./Components/Dashboard";
import VendorProfileDetails from "./Components/VendorProfileDetails";
function App() {
  const location = useLocation();

  const showOldNavbar = [
    "/",
    "/signup-selection",
    "/signup/user",
    "/signup/vendor",
    "/about",
  ].includes(location.pathname);

  return (
    <div>
      {showOldNavbar && <Navbar />}

      <Routes>
        <Route path="/" element={<SignUp_Login />} />
        <Route path="/signup-selection" element={<SignUpSelection />} />
        <Route path="/signup/user" element={<CustomerSignup />} />
        <Route path="/signup/vendor" element={<VendorSignup />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        <Route element={<CustomerLayout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/products/:categoryName" element={<ProductList />} />
          <Route path="/product/:id" element={<ProductProfile />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/search/:searchTerm" element={<SearchResults />} />
          <Route path="/orders" element={<CustomerOrderList />} />
        </Route>

        <Route element={<VendorLayout />}>
          <Route path="/add-product" element={<AddProduct />} />
          <Route path="/vendor-product-list" element={<VendorProductList />} />
          <Route path="/products/:categoryName" element={<ProductList />} />
          <Route path="/incoming-orders" element={<IncomingVendorOrders />} />
          <Route path="/details" element={< VendorProfileDetails/>} />
          <Route path="/dashboard" element={< Dashboard/>} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
