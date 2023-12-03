import React from 'react';
import { Link } from "react-router-dom";

const TextDisplay = ({ movie, formatDate }) => {
    return (
        <div key={movie.apiId} className="text-display-movie-item">
            <Link to={`/details/${movie.apiId}`} className="text-display-movie-title">{movie.title}</Link>
            <p className='text-display-time'>Rated and Reviewed at {formatDate(movie.updatedAt)}</p>
            <div className='text-display-movie-rating-and-review'>
                <p>My Rating: {movie.rating}</p>
                <p>My Review: {movie.review}</p>
            </div>
        </div>
    );
};

export default TextDisplay;
