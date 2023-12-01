// RatingAndReview.jsx

import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const RatingAndReview = ({ onSubmit, movieId }) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const { isAuthenticated, loginWithRedirect } = useAuth0();

  const handleSubmit = async (event) => {
    event.preventDefault();


    // Check if user is authenticated
    if (!isAuthenticated) {
      loginWithRedirect();
      return; // Prevent form submission and redirect to login
    }

    // Check if the rating and review are provided
    if (rating === 0 || review.trim() === '') {
      window.alert('Please provide a rating and a review.');
      return; // Prevent form submission
    }

    try {
      await onSubmit({ movieId, rating, review });
      window.alert("Your rating and review have been submitted and the movie has been added to your collection.");

      // Reset the form fields after successful submission
      setRating(0);
      setReview('');
    } catch (error) {
      // Handle errors here, if any
      console.error("An error occurred while submitting the review:", error);
      window.alert("There was an error submitting your review. Please try again.");
    }
  };



  return (
    <form onSubmit={handleSubmit} className="rating-review-form">
      <div className="rating-container">
        <label className="rating-label">Rating (1-5): </label>
        <div className="rating-radio-buttons">
          {[1, 2, 3, 4, 5].map((value) => (
            <label key={value} className="radio-label">
              <input
                type="radio"
                name="rating"
                value={value}
                checked={rating === value}
                onChange={e => setRating(e.target.value)}
                className="radio-input"
              />
              {value}
            </label>
          ))}
        </div>
      </div>
      <div className="review-container">
        <label className="review-label">Review: </label>
        <textarea
          className="review-textarea"
          value={review}
          onChange={e => setReview(e.target.value)}
        />
      </div>
      <div className="submit-button-container">
        <button type="submit" className="submit-button">Submit</button>
      </div>
    </form>
  );



};

export default RatingAndReview;
