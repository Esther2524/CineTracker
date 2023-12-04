import '../App.css';

// CardDisplay.jsx
// every data is a movie object from external api
import '../App.css';

// CardDisplay.jsx
const CardDisplay = ({ data, onMovieSelect }) => {
  return (
    <div className="column-movies-container">
      {data.map(movie => (
        movie.poster_path && (
          <div key={movie.id} className="column-movie-card">
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="column-movie-poster"
            />

            <div className="movie-title">
              <h2>{movie.title}</h2>
            </div>

            <button className='view-detail-button' onClick={() => onMovieSelect(movie)}>
              View Details
            </button>
          </div>
        )
      ))}
    </div>
  );
};

export default CardDisplay;





