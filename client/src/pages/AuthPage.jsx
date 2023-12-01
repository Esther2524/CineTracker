// VerifyUserPage.jsx
// The useEffect in VerifyUser is dependent on the isAuthenticated state. 
// Once Auth0 sets this state to true, indicating that the user is authenticated, 
// the component redirects to the home page.
import { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AuthPage = () => {
    const { isAuthenticated, user, getAccessTokenSilently } = useAuth0();
    const navigate = useNavigate();

    useEffect(() => {
      const sendUserDataToBackend = async () => {
        if (user) {
          try {
            const token = await getAccessTokenSilently();
            const userData = { email: user.email, name: user.name, picture: user.picture };
            // handle the creation of the user and their collection at the same time
            await axios.post('http://localhost:8000/api/user/collection/sync', userData, {
              headers: {
                  Authorization: `Bearer ${token}`
              }
            });
          } catch (error) {
            console.error('Error sending user data to backend:', error);
          }
        }
      };

      if (isAuthenticated) {
        sendUserDataToBackend();
        navigate('/');
      }
    }, [isAuthenticated, user, getAccessTokenSilently, navigate]);

    return (
      <div>Verifying user...</div>
    );
};

export default AuthPage;
