var dataservice = (function () {

    const API_KEY = 'bc50218d91157b1ba4f142ef7baaa6a0';

    function getLatestMovies(page) {
        page = page || 1;
        var url = 'https://api.themoviedb.org/3/movie/now_playing?api_key=' + API_KEY + '&page=' + page;
        return fetch(url)
            .then(response => response.json());
    }

    function getSearchResults(searchText, page) {
        page = page || 1;
        var url = 'https://api.themoviedb.org/3/search/movie?api_key=' + API_KEY + '&query=' + searchText + '&page=' + page;
        return fetch(url)
            .then(response => response.json());
    }

    function getMovieDetails(movieId) {
        var url = 'https://api.themoviedb.org/3/movie/' + movieId + '?api_key=' + API_KEY + '&append_to_response=trailers,reviews,similar';
        return fetch(url)
            .then(response => response.json())
    }

    function getGenres() {
        var url = 'https://api.themoviedb.org/3/genre/movie/list' + '?api_key=' + API_KEY;
        return fetch(url)
            .then(response => response.json())
    }

    return {
        getLatestMovies: getLatestMovies,
        getMovieDetails: getMovieDetails,
        getSearchResults: getSearchResults,
        getGenres: getGenres
    };


})();
