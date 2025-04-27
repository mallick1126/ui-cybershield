// import "./Navbar.css";
// import { NavLink } from "react-router-dom";

// function Navbar() {
//   return (
//     <nav className="navbar">
//       <div className="navbar-logo">
//         <h1>
//           <span className="quiz">Cyber</span>
//           <span className="grad">Shield</span>
//         </h1>
//       </div>
//       <ul className="navbar-links">
//         <li>
//           <NavLink to="/" className="link" activeClassName="active">
//             Home
//           </NavLink>
//         </li>
//         <li>
//           <NavLink to="/quiz" className="link" activeClassName="active">
//             Quiz
//           </NavLink>
//         </li>
//         <li>
//           <NavLink to="/feed" className="link" activeClassName="active">
//             Feed
//           </NavLink>
//         </li>
//         <li>
//           <NavLink to="/forum" className="link" activeClassName="active">
//             Forum
//           </NavLink>
//         </li>
//       </ul>
//       <button className="login-btn">
//         <NavLink to="/auth/login" className="link">
//           Login
//         </NavLink>
//       </button>
//     </nav>
//   );
// }

// export default Navbar;

import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { FaBars, FaTimes } from "react-icons/fa"; // Icons for the menu
import { CommonContants } from "../utils/Constants";
import Cookies from "js-cookie"; // For handling cookies

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate =  useNavigate();
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <h1>
            <span className="quiz">Cyber</span>
            <span className="grad">Shield</span>
          </h1>
        </div>

        {/* Hamburger menu button */}
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Navbar links */}
        <ul className={`navbar-links ${menuOpen ? "open" : ""}`}>
          <li>
            <NavLink to="/" className="link" onClick={() => setMenuOpen(false)}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/quiz" className="link" onClick={() => setMenuOpen(false)}>
              Quiz
            </NavLink>
          </li>
          <li>
            <NavLink to="/feed" className="link" onClick={() => setMenuOpen(false)}>
              Feed
            </NavLink>
          </li>
          <li>
            <NavLink to="/forum" className="link" onClick={() => setMenuOpen(false)}>
              Forum
            </NavLink>
          </li>
          {
            !Cookies.get(CommonContants.acTokenKey) && (
              <li>
                <NavLink to="/auth/login" className="login-btn" onClick={() => setMenuOpen(false)}>
                  Login
                </NavLink>
              </li>
            )
          }
          {
            Cookies.get(CommonContants.acTokenKey) && (
              <li>
                <NavLink to="/auth/login" className="login-btn" onClick={() => {
                  setMenuOpen(false)
                  Cookies.remove(CommonContants.acTokenKey);
                  Cookies.remove(CommonContants.rfTokenKey); 
                  navigate("/auth/login");
                }}>
                  Logout
                </NavLink>
              </li>
            )
          }
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
