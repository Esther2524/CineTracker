import axios from 'axios';

const fetchPopularMovies = async (page) => {
    if (page <= 0) {
        throw new Error("Page number must be a positive integer.");
    }

    const url = `https://api.themoviedb.org/3/movie/popular?language=en-US&page=${page}`;
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4YjFlOWY3ZDAzOTg1NDcyNmQ2NWRlMjI4ZWZjY2E0OSIsInN1YiI6IjY1NjU4N2JjODlkOTdmMDExYjRjYTc2OSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.c2ZcC1fSKTedCZv_224tlHweITdCAycNHa1bPihv2Ro'
        }
    };
    try {
        const response = await axios.get(url, options);
        return response.data;
    } catch (err) {
        throw err; // Re-throw the error to be handled by the caller
    }
};

export default fetchPopularMovies;
