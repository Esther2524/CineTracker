import './App.css';
import { useAuth0 } from '@auth0/auth0-react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { NavBar } from './components/NavBar';
import { QueryClient, QueryClientProvider } from 'react-query';
import axios from 'axios';

import VerifyUser from './components/VerifyUser';
import HomePage from './pages/HomePage';
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


  // this is actually the HomePage
  function callApi() {
    axios.get("http://localhost:8000/")
    .then(response => console.log(response.data))
    .catch(error => console.log(error.message));
  }


  // this is the Profile page
  async function callProtectedApi() {
    try {
      const token = await getAccessTokenSilently();
      // console.log(token);
  
      const response = await axios.get("http://localhost:8000/profile", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log("from front-end", response.data);// get user info from back-end
      // console.log(response.data); // output: hello from protected route

    } catch(error) {
      console.log(error.message);
    }
    
  }

  // A helper component for protected routes
  const ProtectedRoute = ({ children, ...rest }) => {
    return isAuthenticated ? children : <h1 className="center-text">Access Denied</h1>;
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div>

        <Router>

          <NavBar />

          <div className="content-container">
            <Routes>
              <Route path='/' element={<HomePage />} />
              <Route path='/search/:searchTerm' element={<SearchResultPage />} />
              <Route path="/verify-user" element={<VerifyUser />} />
              <Route path='/details/:movieId' element={<DetailsPage />} />

              {/* protected routes */}
              {isAuthenticated && <Route path="/profile" element={<ProfilePage />} />}
              {isAuthenticated && <Route path="/collections" element={<CollectionPage />} />}
            </Routes>
          </div>

          
        </Router>
      </div>
    </QueryClientProvider>
  )

}

export default App;
