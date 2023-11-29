import './App.css';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';



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

  return (
    <div className="App">
    
      <h1> Test Auth0 Authentication</h1>
      <ul>
        <li>
          <button onClick={loginWithPopup}>loginWithPopUp</button>
          </li>
        <li>
          <button onClick={loginWithRedirect}>loginWithRedirect</button>
          </li>
        <li>
          <button onClick={logout}>logout</button>
          </li>
      </ul>

      <h3>User is {isAuthenticated? "Logged In" : "Not Logged In"}</h3>

      <ul>
        <li><button onClick={callApi}>Call API Route</button></li>
        <li><button onClick={callProtectedApi}>Call protected API Route</button></li>
      </ul>

      {
        isAuthenticated && (
          <pre style={{textAlign: 'start'}}>
            {JSON.stringify(user, null, 2)}
          </pre>
        )
          
    
      }
    </div>
  );
}

export default App;
