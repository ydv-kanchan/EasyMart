import { Router, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";
import AboutUs from "./Components/AboutUs";
import SignUp_Login from "./Components/Signup_Login";
import SignUpSelection from "./Components/SignUpSelection";
import CustomerSignup from "./Components/CustomerSignup";
import VendorSignup from "./Components/VendorSignup";

function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<SignUp_Login />} />
        <Route path="/signup-selection" element={<SignUpSelection />} />
        <Route path="/signup/user" element={<CustomerSignup />} />
        <Route path="/signup/vendor" element={<VendorSignup />} />{" "}
        <Route
          path="/ab
        out"
          element={<AboutUs />}
        />
      </Routes>
    </div>
  );
}

export default App;
