import './App.css';
import axios from 'axios';

import { useAuth0 } from '@auth0/auth0-react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { NavBar } from './components/NavBar';
import { QueryClient, QueryClientProvider } from 'react-query';

import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import AuthDebuggerPage from './pages/AuthDebuggerPage';
import DetailsPage from './pages/DetailsPage';
import SearchResultPage from './pages/SearchResultPage';
import ProfilePage from './pages/ProfilePage';
import CollectionPage from './pages/CollectionPage';


const queryClient = new QueryClient();


function App() {


  const {
    loginWithPopup,
    loginWithRedirect,
    logout,
    user,
    isAuthenticated,
    getAccessTokenSilently // the access token will be used in the backend
  } = useAuth0();

  // Since the roles are in the ID token, we can check the `user` object for the 'Admin' role
  // const isAdmin = user?.[`${process.env.REACT_APP_AUTH0_NAMESPACE}roles`]?.includes('Admin') || false;



  return (
    <QueryClientProvider client={queryClient}>
      <div>
        <Router>

          <NavBar />

          <div className="content-container">
            <Routes>
              <Route path='/' element={<HomePage />} />
              <Route path='/search/:searchTerm' element={<SearchResultPage />} />
              <Route path='/details/:movieId' element={<DetailsPage />} />
              <Route path="/verify-user" element={<AuthPage />} />

              {/* protected routes: only for logged-in users */}
              {isAuthenticated && <Route path="/profile" element={<ProfilePage />} />}
              {isAuthenticated && <Route path="/collections" element={<CollectionPage />} />}
              {isAuthenticated && <Route path="/auth-debugger" element={<AuthDebuggerPage />} />}

            </Routes>
          </div>


        </Router>
      </div>
    </QueryClientProvider>
  )

}

export default App;
