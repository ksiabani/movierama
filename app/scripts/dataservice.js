var dataservice = (function () {

    const API_KEY = 'bc50218d91157b1ba4f142ef7baaa6a0';

    function getLatestMovies(page) {

        page = page || 1;
        var url = 'https://api.themoviedb.org/3/movie/now_playing?api_key=' + API_KEY + '&page=' + page;

        return fetch(url)
            .then(response => response.json());

    }

    function getSearchResults() {

    }

    function getMovieDetails(movieId) {

        var url = 'https://api.themoviedb.org/3/movie/' + movieId + '?api_key=' + API_KEY + '&append_to_response=trailers,reviews,similar';
        return fetch(url)
            .then(response => response.json())

    }

    // var printerInstance;
    //
    // function create () {
    //
    //     function print() {
    //         // underlying printer mechanics
    //     }
    //
    //     function turnOn() {
    //         // warm up
    //         // check for paper
    //     }
    //
    //     return {
    //         // public + private states and behaviors
    //         print: print,
    //         turnOn: turnOn
    //     };
    // }
    //
    return {
        // getInstance: function() {
        //     if(!printerInstance) {
        //         printerInstance = create();
        //     }
        //     return printerInstance;
        // }
        getLatestMovies: getLatestMovies,
        getMovieDetails: getMovieDetails,
        getSearchResults: getSearchResults
    };
    //
    // function Singleton () {
    //     if(!printerInstance) {
    //         printerInstance = intialize();
    //     }
    // };

})();


// The create method is private because we do not want the client to access this,
// however, notice that the getInstance method is public. Each officer worker can
// generate a printer instance by interacting with the getInstance method, like so:
//var officePrinter = printer.getInstance();
//var movies = dataservice.getMovies();