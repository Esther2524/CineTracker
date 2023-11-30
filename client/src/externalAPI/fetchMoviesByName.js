// externalAPI/fetchMoviesByKeyword.js
import axios from 'axios';

const fetchMoviesByName = async (name, page) => {

    console.log(name);
    const url = `https://api.themoviedb.org/3/search/movie?query=${name}&include_adult=false&language=en-US&page=${page}`;
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

export default fetchMoviesByName;
