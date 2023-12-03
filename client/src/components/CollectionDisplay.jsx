import '../App.css';
import React from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';

const CollectionDisplay = ({ collectionData, setCollectionData }) => {

  const { getAccessTokenSilently } = useAuth0();

  // help function to format a timestamp as "YYYY-MM-DD"
  function formatDate(timestamp) {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  const handleEdit = async (movieId) => {
    const movieToEdit = collectionData.find(movie => movie.apiId === movieId);
    if (!movieToEdit) {
      console.error('Movie not found');
      return;
    }
  
    const newRating = prompt("Enter new rating", movieToEdit.rating);
    const newReview = prompt("Enter new review", movieToEdit.review);
  
    if (newRating != null && newReview != null) {
      try {
        const token = await getAccessTokenSilently();
        // update movie rating and review, we only need apiId, rating and review
        await axios.put(`http://localhost:8000/api/movie/rate-and-review/${movieId}`, {
          rating: parseInt(newRating),
          review: newReview
        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        // Update the movie in collectionData
        setCollectionData(collectionData.map(movie => 
          movie.apiId === movieId ? { ...movie, rating: newRating, review: newReview } : movie
        ));
      } catch (error) {
        console.error('Error updating movie:', error);
      }
    }
  };




  const handleDelete = async (movieId) => {
    try {
      const token = await getAccessTokenSilently();
      await axios.delete(`http://localhost:8000/api/movie/${movieId}`, {
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


            </div>
          <div className="collection-button-actions">
            <button onClick={() => handleEdit(movie.apiId)}>
              Edit
            </button>
            <button onClick={() => handleDelete(movie.apiId)}>
              Delete
            </button>
          </div>
        


        </div>
      ))}
    </div>
  );
};

export default CollectionDisplay;
