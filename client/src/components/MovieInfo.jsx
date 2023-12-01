// MovieInfo.jsx
import React from 'react';

const MovieInfo = ({ movie }) => {
  return (
    <div className="details-movie-info">
      <h1>{movie.title}</h1>
      <p>{movie.tagline}</p>
      <p>Overview: {movie.overview}</p>
      <p>Genres: {movie.genres.map(genre => genre.name).join(', ')}</p>
      <p>Release Date: {movie.release_date}</p>
    </div> 
  );
};

export default MovieInfo;

