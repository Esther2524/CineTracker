import '../App.css';
import React from 'react';
import { useState } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import MovieEditPopup from './MovieEditPopup';

const CollectionDisplay = ({ collectionData, setCollectionData }) => {

  const { getAccessTokenSilently } = useAuth0();
  const [editPopupVisible, setEditPopupVisible] = useState(false);
  const [currentEditingMovie, setCurrentEditingMovie] = useState(null);

  // help function to format a timestamp as "YYYY-MM-DD"
  function formatDate(timestamp) {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }



  const handleEditClick = (movieId) => {
    const movieToEdit = collectionData.find(movie => movie.apiId === movieId);
    setCurrentEditingMovie(movieToEdit);
    // console.log('Current Editing Movie:', movieToEdit); 
    setEditPopupVisible(true);
  };

  const handleSaveEdit = async (editedData) => {
    try {
      const token = await getAccessTokenSilently();

      // Assuming the backend expects the movie ID as part of the URL
      await axios.put(`${process.env.REACT_APP_API_URL}/api/movie/rate-and-review/${currentEditingMovie.apiId}`, {
        rating: parseInt(editedData.rating),
        review: editedData.review
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Update the movie in the local state
      setCollectionData(collectionData.map(movie =>
        movie.apiId === currentEditingMovie.apiId ? { ...movie, ...editedData } : movie
      ));

      // Close the popup
      setEditPopupVisible(false);
    } catch (error) {
      console.error('Error updating movie:', error);
    }
  };





  const handleDelete = async (movieId) => {
    try {
      const token = await getAccessTokenSilently();
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/movie/${movieId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      // Filter out the deleted movie from collectionData
      setCollectionData(collectionData.filter(movie => movie.apiId !== movieId));
    } catch (error) {
      console.error('Error deleting movie:', error);
    }
  };





  return (
    <div>
      {collectionData.map((movie, index) => (
        <div key={index} className="collection-movie-item">

          <div className='collection-poster'>
            <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
          </div>

          <div className='collection-text'>
            <h2>{`${movie.title || 'N/A'}`}</h2>

            <div className='collection-rating-and-review'>
              <p><span className='bold-text'>My Rating: </span>{movie.rating}</p>
              <p><span className='bold-text'>My Review: </span>{movie.review}</p>
              <p><span className='bold-text'>Collected at: </span>{formatDate(movie.updatedAt)}</p>
            </div>

            <div className='collection-movie-info'>
              <p><span className='bold-text'>Overview: </span>{movie.overview}</p>
              <p><span className='bold-text'>Genres: </span>{movie.genres.map(genre => genre.name).join(', ')}</p>
              <p><span className='bold-text'>Release Date: </span>{movie.release_date}</p>
            </div>

            <div className="collection-button-actions">

              <button onClick={() => handleEditClick(movie.apiId)}>
                Edit
              </button>

              <button onClick={() => handleDelete(movie.apiId)}>
                Delete
              </button>

            </div>


          </div>




        </div>
      ))}

      <MovieEditPopup
        isOpen={editPopupVisible}
        onClose={() => setEditPopupVisible(false)}
        onSave={handleSaveEdit}
        defaultData={currentEditingMovie || {}}
      />
    </div>
  );
};

export default CollectionDisplay;
