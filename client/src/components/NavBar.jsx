import React, { useState, useRef, useEffect } from 'react';
import AuthButton from "./AuthButton";
import { Link } from "react-router-dom";
import { useAuth0 } from '@auth0/auth0-react';

export const NavBar = () => {
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const sidebarRef = useRef(); // Create a ref for the sidebar

  const handleProtectedItemClick = (e, path) => {
    if (!isAuthenticated) {
      e.preventDefault();
      loginWithRedirect({ appState: { returnTo: path } });
    }
    setSidebarVisible(false); // Close the sidebar after navigating
  };

  const handleClickOutside = (event) => {
    if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      setSidebarVisible(false); // Close the sidebar if clicked outside
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible); // Toggle the sidebar visibility
  };

  return (
    <>
      <div className="navbar">
        
        <div className="navbar-icon" onClick={toggleSidebar} alt="Sidebar Icon">
          ☰
        </div>

        <div className="navbar-right">
          <AuthButton />
        </div>

      </div>

      <div ref={sidebarRef} className={`sidebar ${sidebarVisible ? 'sidebar-visible' : ''}`}>
        <Link to="/" className="sidebar-item" onClick={() => handleProtectedItemClick(null, '/')}>
          Home
        </Link>
        <Link to="/collections" className="sidebar-item" onClick={(e) => handleProtectedItemClick(e, '/collections')}>
          My Collection
        </Link>
        <Link to="/profile" className="sidebar-item" onClick={(e) => handleProtectedItemClick(e, '/profile')}>
          Profile
        </Link>
        <Link to="/auth-debugger" className="sidebar-item" onClick={(e) => handleProtectedItemClick(e, '/auth-debugger')}>
          Auth Debugger
        </Link>
      </div>

      {/* Overlay element */}
      {sidebarVisible && <div className="overlay" onClick={toggleSidebar}></div>}
    </>
  );
};

export default NavBar;
