import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';



const fetchUserData = async (getAccessTokenSilently) => {
  try {
    const token = await getAccessTokenSilently();
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/user`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data; // the user data including the name
  } catch (error) {
    return null;
  }
};


const AuthButton = () => {
  const { user, loginWithRedirect, logout, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [isHovering, setIsHovering] = useState(false);
  const [userName, setUserName] = useState('User');


  useEffect(() => {
    const fetchAndSetUserData = async () => {
      const userData = await fetchUserData(getAccessTokenSilently);
      if (userData) {
        setUserName(userData.name);
      } else {
        // Retry fetching user data after a delay
        setTimeout(() => fetchUserData(getAccessTokenSilently).then(userData => {
          if (userData) {
            setUserName(userData.name);
          }
        }), 2000); // Adjust delay as needed
      }
    };

    if (isAuthenticated) {
      fetchAndSetUserData();
    }
  }, [isAuthenticated, getAccessTokenSilently]);

  return (
    <div>
      {!isAuthenticated && (
        <span onClick={loginWithRedirect} className="login-link">
          Log In
        </span>
      )}

      {isAuthenticated && (
        <div 
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          className="user-interaction-container" // Container for both user name and dropdown
        >
          <span className="user-name">{userName || user.name}</span> 

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


export default AuthButton;