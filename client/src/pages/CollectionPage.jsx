import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import fetchMovieDetails from '../externalAPI/fetchMovieDetails';
import CollectionDisplay from '../components/CollectionDisplay';

const CollectionPage = () => {
  const { user, isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
  const [collectionData, setCollectionData] = useState([]);
  const [loadingUserData, setLoadingUserData] = useState(true); // Define the loadingUserData state
  
  // The useEffect hook fetches data from the backend 
  // and then enriches each movie with additional details from the external API using apiID we shored in database
  // from backend: rating and review
  useEffect(() => {
    const fetchCollectionData = async () => {
      if (isAuthenticated && user) {
        setLoadingUserData(true);

        try {
          const token = await getAccessTokenSilently();
          const response = await axios.get('http://localhost:8000/api/user/collection', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

          const collection = response.data;
          const detailedMovies = await Promise.all(
            collection.map(async (movie) => {
              try {
                const movieDetails = await fetchMovieDetails(movie.apiId);
                return { ...movie, ...movieDetails };
              } catch (error) {
                console.error('Error fetching movie details:', error);
                return movie; // return original data in case of error
              }
            })
          );

          setCollectionData(detailedMovies);
        } catch (error) {
          console.error('Error fetching collection data:', error);
        } finally {
          setLoadingUserData(false);
        }
      }
    };

    fetchCollectionData();
  }, [isAuthenticated, user, getAccessTokenSilently]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="collection-page">
      <h1 className="center-title">Collection Page📚</h1>
      {collectionData && collectionData.length > 0 ? (
        <CollectionDisplay collectionData={collectionData} setCollectionData={setCollectionData} />
      ) : (
        <p>No movies in your collection.</p>
      )}
    </div>
  );
  
};

export default CollectionPage;
