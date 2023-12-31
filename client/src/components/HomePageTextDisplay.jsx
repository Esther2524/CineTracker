import React from 'react';
import { Link } from "react-router-dom";

const HomePageTextDisplay = ({ movie, user, formatDate }) => {
    return (
        <div key={movie.apiId} className="text-display-movie-item">
            <Link to={`/details/${movie.apiId}`} className="text-display-movie-title">{movie.title}</Link>
            <p className='text-display-time'>Posted at {formatDate(movie.updatedAt)}</p>
            <div className='text-display-movie-rating-and-review'>
                <p>User Name: <span className='test-display-user-name'>{user.name}</span></p> {/* Use user prop for user information */}
                <p>Rating: <span className='test-display-user-name'>{movie.rating}</span></p>
                <p>Review: {movie.review}</p>
            </div>
        </div>
    );
};

export default HomePageTextDisplay;
