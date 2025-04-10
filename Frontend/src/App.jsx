import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./Components/Navbar";
import AboutUs from "./Components/AboutUs";
import SignUp_Login from "./Components/Signup_Login";
import SignUpSelection from "./Components/SignUpSelection";
import CustomerSignup from "./Components/CustomerSignup";
import VendorSignup from "./Components/VendorSignup";
import Home from "./Components/Home";
import Profile from "./Components/Profile";
import VendorHome from "./Components/VendorHome";
import AddProduct from "./Components/AddProduct";
import VendorProductList from "./Components/VendorProductList";
import ResetPassword from "./Components/ResetPassword";
import CustomerLayout from "./Components/CustomerLayout";
import VendorLayout from "./Components/VendorLayout";
import VendorProfile from "./Components/VendorProfile";

function App() {
  const location = useLocation();

  const showOldNavbar = [
    "/",
    "/signup-selection",
    "/signup/user",
    "/signup/vendor",
  ].includes(location.pathname);

  return (
    <div>
      {showOldNavbar && <Navbar />}

      <Routes>
        {/* Public routes */}
        <Route path="/" element={<SignUp_Login />} />
        <Route path="/signup-selection" element={<SignUpSelection />} />
        <Route path="/signup/user" element={<CustomerSignup />} />
        <Route path="/signup/vendor" element={<VendorSignup />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* Customer Routes with layout */}
        <Route element={<CustomerLayout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* Vendor Routes with layout */}
        <Route element={<VendorLayout />}>
          <Route path="/vendorHome" element={<VendorHome />} />
          <Route path="/add-product" element={<AddProduct />} />
          <Route path="/vendor-product-list" element={<VendorProductList />} />
          <Route path="/vendor/profile" element={<VendorProfile />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
