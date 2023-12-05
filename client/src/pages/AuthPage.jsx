// The useEffect in AuthPage is dependent on the isAuthenticated state. 
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
            await axios.post(`${process.env.REACT_APP_API_URL}/api/user/collection/sync`, userData, {
              headers: {
                  Authorization: `Bearer ${token}`
              }
            });
            // Make sure that the navigation to the homepage (navigate('/')) occurs only after the user data has been successfully posted to the backend and a response has been received. 
            navigate('/'); // Move navigation here
          } catch (error) {
            console.error('Error sending user data to backend:', error);
          }
        }
      };

      if (isAuthenticated) {
        sendUserDataToBackend();
      }
    }, [isAuthenticated, user, getAccessTokenSilently, navigate]);

    return (
      <div><h2 className='center-title'>Verifying user 🫡...</h2></div>
    );
};

export default AuthPage;
