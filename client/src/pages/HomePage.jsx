import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import CardDisplay from '../components/CardDisplay';
import fetchPopularMovies from '../externalAPI/fetchPopularMovies';

const HomePage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, error } = useQuery(['movies', currentPage],
    () => fetchPopularMovies(currentPage),
    { keepPreviousData: true }
  );

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
    </div>
  );
};

export default HomePage;
