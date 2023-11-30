import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

export const AuthButton = () => {
  const { loginWithRedirect, logout, isAuthenticated, user } = useAuth0();
  const [isHovering, setIsHovering] = useState(false);

  return (
    <div>
      {!isAuthenticated && (
        <span 
          onClick={loginWithRedirect} // Directly use loginWithRedirect
          className="login-link"
        >
          Log In
        </span>
      )}

      {isAuthenticated && (
        <div 
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          className="user-name-container"
        >
          <span className="user-name">{user.name}</span>
          {isHovering && (
            <div className="dropdown-menu">
              <span 
                onClick={() => logout({ returnTo: window.location.origin })}
                className="logout-link"
              >
                Log Out
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
