import React, { useState, useEffect } from 'react';

const MovieEditPopup = ({ isOpen, onClose, onSave, defaultData }) => {
  const [rating, setRating] = useState('');
  const [review, setReview] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Update state when defaultData changes
  useEffect(() => {
    if (defaultData) {
      setRating(defaultData.rating || ''); // Fallback to empty string if undefined
      setReview(defaultData.review || '');
    }
  }, [defaultData]);

  const handleRatingChange = (e) => {
    const newRating = e.target.value;
    if (newRating >= 1 && newRating <= 5) {
      setRating(newRating);
      setErrorMessage(''); // Clear error message if within range
    } else {
      setErrorMessage('Rating must be between 1 and 5'); // Set error message
    }
  };

  const handleSave = () => {
    onSave({ rating, review });
    onClose();
  };

  if (!isOpen) return null;


  return (
    <div className="collection-popup-overlay">
      <div className="collection-popup-content">
        <label>Rating:</label>
        <input
          type="number"
          value={rating}
          onChange={handleRatingChange}
          min="1"
          max="5"
        />
        <label>Review:</label>
        <textarea value={review} onChange={(e) => setReview(e.target.value)}></textarea>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        <button onClick={handleSave}>Save</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default MovieEditPopup;
