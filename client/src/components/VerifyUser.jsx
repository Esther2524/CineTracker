// VerifyUser.jsx
// The useEffect in VerifyUser is dependent on the isAuthenticated state. 
// Once Auth0 sets this state to true, indicating that the user is authenticated, 
// the component redirects to the home page.
import { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';

const VerifyUser = () => {
  const { isAuthenticated } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      // Redirect to home page after verification
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div>Verifying user...</div>
  );
};

export default VerifyUser;
