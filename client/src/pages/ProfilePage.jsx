import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';

const ProfilePage = () => {
  const { user, isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
  const [userData, setUserData] = useState(null);
  const [loadingUserData, setLoadingUserData] = useState(true);
  const [movieCollection, setMovieCollection] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (isAuthenticated && user) {
        try {
          const token = await getAccessTokenSilently();
          const userResponse = await axios.get('http://localhost:8000/api/user', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUserData(userResponse.data);

          const collectionResponse = await axios.get('http://localhost:8000/api/user/collection', {
            headers: { Authorization: `Bearer ${token}` }
          });
					console.log(collectionResponse.data)
          setMovieCollection(collectionResponse.data);
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          setLoadingUserData(false);
        }
      }
    };

    fetchUserData();
  }, [isAuthenticated, user, getAccessTokenSilently]);

  if (isLoading || loadingUserData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-page">
      <h1 className="center-title">Profile Page</h1>
      {user && (
        <div>
          <img src={userData.picture} alt={userData.name} />
          <h2>{userData.name}</h2>
          <p>Email: {userData.email}</p>

          <h3>Your Movie Collection</h3>
          {movieCollection.length > 0 ? (
            <ul>
              {movieCollection.map((movie, index) => (
                <li key={index}>{movie.rating}</li> // Adjust display as needed
              ))}
            </ul>
          ) : (
            <p>No movies in your collection.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
