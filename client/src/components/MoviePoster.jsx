// MoviePoster.jsx
import React from 'react';

const MoviePoster = ({ movie }) => {
  return (
    <div className="details-movie-poster">
        <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
    </div>
  );
};

export default MoviePoster;

