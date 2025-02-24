import { Routes, Route } from "react-router-dom";
import Navbar from './Components/Navbar';
import AboutUs from "./Components/AboutUs";

export default function App() {
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUp_Login from "./Components/Signup_Login";
import SignUpSelection from "./Components/SignUpSelection";
import CustomerSignup from "./Components/CustomerSignup";
import VendorSignup from "./Components/VendorSinup";

function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/about" element={<AboutUs />} />
      </Routes>
    </div>
    <Router>
      <Routes>
        <Route path="/" element={<SignUp_Login />} />
        <Route path="/signup-selection" element={<SignUpSelection />} />
        <Route path="/signup/user" element={<CustomerSignup />} />
        <Route path="/signup/vendor" element={<VendorSignup />} />{" "}
      </Routes>
    </Router>
  );
}

export default App;
