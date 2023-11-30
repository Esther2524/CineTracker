import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Auth0Provider } from '@auth0/auth0-react';
import "semantic-ui-css/semantic.min.css"


const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    {/* wrap App component inside Auth0Provider */}
    <Auth0Provider
      domain='dev-1s3jn85gc06w6mec.us.auth0.com'
      clientId='n9InjD9TVFKtWNAYJ2yUDO9QZP1GPrrK'
      authorizationParams={{
        redirect_uri: `${window.location.origin}/verify-user`,
        audience: 'https://api.cinetracker',
        scope: 'openid profile email',
        prompt: 'login'
      }}
    >
      <App />
    </Auth0Provider>

  </React.StrictMode>
);



