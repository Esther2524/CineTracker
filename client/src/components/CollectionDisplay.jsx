import '../App.css';
import React from 'react';

const CollectionDisplay = ({ collectionData }) => {

  // help function to format a timestamp as "YYYY-MM-DD"
  function formatDate(timestamp) {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }


  return (
    <div>
      {collectionData.map((movie, index) => (
        <div key={index} className="collection-movie-item">

          <div className='collection-poster'>
            <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
          </div>

          <div className='collection-text'>
            <h2>{`${movie.title || 'N/A'}`}</h2>
            <p>{`My Rating: ${movie.rating}`}</p>
            <p>{`My Review: ${movie.review}`}</p>
            <p>{`Collection Date: ${formatDate(movie.updatedAt)}`}</p>
            <p>Overview: {movie.overview}</p>
            <p>Genres: {movie.genres.map(genre => genre.name).join(', ')}</p>
            <p>Release Date: {movie.release_date}</p>
          </div>

        </div>
      ))}
    </div>
  );
};

export default CollectionDisplay;
