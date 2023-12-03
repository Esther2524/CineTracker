import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import CardDisplay from '../components/CardDisplay';
import fetchMoviesByName from '../externalAPI/fetchMoviesByName';

// 1. Separation of Concerns: SearchResultPage is dedicated to handling and displaying search results, making it more focused and easier to manage.
// 2. Maintain State and Pagination: Ensure that SearchResultPage handles its state, particularly if you implement pagination for search results.
// 3. Navigation to Details Page: If you want to view details of a movie from the search results, ensure that SearchResultPage has the functionality to navigate to DetailsPage.
const SearchResultPage = () => {
    const { searchTerm } = useParams();
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);

    const { data, isLoading, error } = useQuery(
        ['search', searchTerm, currentPage],
        () => fetchMoviesByName(searchTerm, currentPage),
        { keepPreviousData: true }
    );

    const handleMovieSelect = (movie) => {
        navigate(`/details/${movie.id}`);
    };

    const handleNextPage = () => setCurrentPage((prevPage) => prevPage + 1);
    const handlePrevPage = () => currentPage > 1 && setCurrentPage((prevPage) => prevPage - 1);


    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div>
            <h1 className="center-title">Search Results for "{searchTerm}"</h1>
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
    );
};

export default SearchResultPage;
