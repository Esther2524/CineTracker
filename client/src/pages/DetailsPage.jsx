// DetailsPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import fetchMovieDetails from '../externalAPI/fetchMovieDetails';
import MoviePoster from '../components/MoviePoster';
import RatingAndReview from '../components/RatingAndReview';
import MovieInfo from '../components/MovieInfo';

const DetailsPage = () => {
  const { movieId } = useParams();
  const [movie, setMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, isAuthenticated, loginWithRedirect, getAccessTokenSilently } = useAuth0();

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


  const handleRatingAndReviewSubmit = async ({ rating, review }) => {
    if (!isAuthenticated) {
      loginWithRedirect();
      return;
    }
    try {
      const token = await getAccessTokenSilently();
      await axios.post(`http://localhost:8000/api/movie/rate-and-review`, {
        apiId: parseInt(movieId), //
        rating: parseInt(rating),
        review: review,
        userEmail: user.email // I need the user's email from Auth0 and pass it to backend 
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    } catch (error) {
      console.error('Error submitting rating and review:', error);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="details-page-container">
      {movie && (
        <div className="details-left-column">
          <MoviePoster movie={movie} />
        </div>
      )}
      <div className="details-right-column">
        {movie && <MovieInfo movie={movie} />}
        <RatingAndReview onSubmit={handleRatingAndReviewSubmit} movieId={movieId} />
      </div>
    </div>
  );
};

export default DetailsPage;
