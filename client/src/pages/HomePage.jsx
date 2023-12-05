import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react'; //
import CardDisplay from '../components/CardDisplay';
import fetchPopularMovies from '../externalAPI/fetchPopularMovies';
import axios from 'axios';
import HomePageTextDisplay from '../components/HomePageTextDisplay';

const HomePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, getAccessTokenSilently } = useAuth0(); // Destructure isAuthenticated
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [userMovieCollection, setUserMovieCollection] = useState([]);

  const { data, isLoading, error } = useQuery(['movies', currentPage],
    () => fetchPopularMovies(currentPage),
    { keepPreviousData: true }
  );

  useEffect(() => {
    const fetchUserMovies = async () => {
      if (isAuthenticated) {
        try {
          const token = await getAccessTokenSilently();
          const response = await axios.get('http://localhost:8000/api/users-with-movies', {
            headers: { Authorization: `Bearer ${token}` }
          });

          // Flatten and sort the movie collection in chronological order
          const allMovies = response.data
            .flatMap(user =>
              user.collection ?
                user.collection.movies.map(movie => ({ ...movie, user })) : []
            )
            .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

          setUserMovieCollection(allMovies);

        } catch (error) {
          console.error('Error fetching user movies:', error);
        }
      }
    };

    fetchUserMovies();
  }, [isAuthenticated, getAccessTokenSilently]);


  // Helper function to format a timestamp
  function formatDate(timestamp) {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  const handleMovieSelect = (movie) => {
    navigate(`/details/${movie.id}`);
  };

  const handleSearch = (event) => {
    event.preventDefault();
    navigate(`/search/${searchTerm}`);
  };

  const handleNextPage = () => setCurrentPage((prevPage) => prevPage + 1);
  const handlePrevPage = () => currentPage > 1 && setCurrentPage((prevPage) => prevPage - 1);

  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1 className="center-title">Popular Movies</h1>
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for movies..."
          className="search-input"
        />
        <button type="submit" className="search-button">Search</button>
      </form>


      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div>
          <CardDisplay data={data?.results} onMovieSelect={handleMovieSelect} />
          <div className="pagination-container">
            <button className="prev-page-button" onClick={handlePrevPage} disabled={currentPage === 1}>
              Previous Page
            </button>
            <button className="next-page-button" onClick={handleNextPage}>
              Next Page
            </button>
          </div>
        </div>
      )}


      <div className='homepage-log-in-section'>
        {/* Display Greeting for Logged-in Users */}
        {isAuthenticated && (
          <div className="homepage-user-greeting">
            <h2>Welcome back!💫</h2>
            <p>Come and take a look at what other people are thinking 🤔...</p>
          </div>
        )}

        {/* Display TextDisplay for logged-in users */}
        {isAuthenticated && userMovieCollection.map(movie =>
          <HomePageTextDisplay
            key={`${movie.user.id}-${movie.id}`}
            movie={movie}
            user={movie.user} // As each movie now includes its user
            formatDate={formatDate}
          />
        )}



      </div>


    </div>


  );
};

export default HomePage;
