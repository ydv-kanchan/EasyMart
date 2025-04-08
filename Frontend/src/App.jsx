import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./Components/Navbar"; // Old Navbar
import Navbar2 from "./Components/Navbar2"; // New Navbar after login
import AboutUs from "./Components/AboutUs";
import SignUp_Login from "./Components/Signup_Login";
import SignUpSelection from "./Components/SignUpSelection";
import CustomerSignup from "./Components/CustomerSignup";
import VendorSignup from "./Components/VendorSignup";
import Home from "./Components/Home";
import Profile from "./Components/Profile";

function App() {
  const location = useLocation();

  // Define all paths where Navbar (old) should be shown
  const showOldNavbar = [
    "/",
    "/signup-selection",
    "/signup/user",
    "/signup/vendor",
  ].includes(location.pathname);

  return (
    <div>
      {showOldNavbar ? <Navbar /> : <Navbar2 />}

      <Routes>
        <Route path="/" element={<SignUp_Login />} />
        <Route path="/signup-selection" element={<SignUpSelection />} />
        <Route path="/signup/user" element={<CustomerSignup />} />
        <Route path="/signup/vendor" element={<VendorSignup />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </div>
  );
}

export default App;
