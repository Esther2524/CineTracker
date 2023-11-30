// DetailsPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import fetchMovieDetails from '../externalAPI/fetchMovieDetails';
import MovieDetails from '../components/MovieDetails';

const DetailsPage = () => {
    const { movieId } = useParams();
    const [movie, setMovie] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const movieData = await fetchMovieDetails(movieId);
                setMovie(movieData);
                setIsLoading(false);
            } catch (err) {
                setError(err);
                setIsLoading(false);
            }
        };

        fetchDetails();
    }, [movieId]);

    // if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div>
            {movie && <MovieDetails movie={movie} />}
        </div>
    );
};

export default DetailsPage;
