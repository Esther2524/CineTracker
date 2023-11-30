// MovieDetails.jsx
import React from 'react';

const MovieDetails = ({ movie }) => {
    return (
        <div className="details-movie-container">
            <div className="details-movie-poster">
                <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
            </div>
            <div className="details-movie-info">
                <h1>{movie.title}</h1>
                <p>{movie.tagline}</p>
                <p>Overview: {movie.overview}</p>
                <p>Genres: {movie.genres.map(genre => genre.name).join(', ')}</p>
                <p>Release Date: {movie.release_date}</p>
            </div>
        </div>
    );
};

export default MovieDetails;

