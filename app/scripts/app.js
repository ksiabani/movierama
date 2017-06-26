(function () {
    'use strict';

    let genres;

    var s, page = 1, searchPage = 1,
        state, polling = false
        ;

    return {
        settings: {
            section: document.getElementsByTagName('section'),
            searchSection: document.getElementById('search'),
            nowPlayingSection: document.getElementById('now-playing'),
            navLinks: document.querySelectorAll('nav a'),
            content: document.getElementsByClassName('mdl-layout__content')[0],
            searchInput: document.getElementById('search-input'),
            loader: document.getElementsByClassName('loader')[0]
        },
        init: function () {
            s = this.settings;
            getGenres(); //TODO: Why here? explain
            bindUIActions();
        }
    };

    function bindUIActions() {

        //TODO: Is onload the propriate event here?
        window.addEventListener('hashchange', router);
        window.addEventListener('load', router);

        // Infinite scrolling
        s.content.addEventListener('scroll', function () {
            var reachedBottom = s.content.scrollHeight - s.content.scrollTop === s.content.clientHeight;
            if (reachedBottom && !polling && s.content.scrollTop > s.content.clientHeight) {
                if (state === 'now-playing') {
                    page++;
                    getLatestMovies(page);
                }
                else if (state === 'search') {
                    searchPage++;
                    searchMovies(s.searchInput.value, searchPage);
                }
            }
        });

        // Search as we type
        s.searchInput.addEventListener('keyup', function (e) {
            clearSearchResults();
            if (s.searchInput.value.length > 0 && !polling) {
                searchMovies(s.searchInput.value);
            }
        });
    }

    // Routing happens here
    function router() {
        // Get page state
        state = location.hash.slice(1) || '/';
        // Hide all sections
        Array.from(s.section, function (el) {
            el.style.display = 'none';
        });
        // Remove 'is-active' class from all navigation links
        Array.from(s.navLinks).map(function (navLink) {
            navLink.classList.remove('is-active');
        });
        // Manage states
        switch (state) {
            case 'now-playing':
                document.getElementById(state).style.display = 'flex';
                document.querySelector('nav a[href="#' + state + '"]').classList.add('is-active');
                if (s.nowPlayingSection.querySelectorAll('.movie-card').length === 1) {
                    getLatestMovies();
                }
                break;
            case 'search':
                document.getElementById(state).style.display = 'flex';
                document.querySelector('nav a[href="#' + state + '"]').classList.add('is-active');
                break;
            default:
                window.location.hash = '#now-playing';
        }
    }

    // Logic for the now playing page. Typically this would go to its own file
    function getLatestMovies(page) {
        toggleLoader();
        dataservice.getLatestMovies(page).then(function (data) {
            toggleLoader();
            loadMovies(data);
        })
            .catch(function (err) {
                console.log('Error:' + err);
            });
    }

    // Load movies, building from templates
    function loadMovies(data) {
        data.results.map(function (movie) {
            moviecard
                .create(state, movie)
                .addEventListener('click', function(){
                    showJawbone(movie.id)
                });
        });
    }

    // Get gernres
    function getGenres() {
        dataservice.getGenres().then(function (data) {
            genres = data;
        })
    }

    // Logic for the search page. Typically this would go to its own file
    function searchMovies(searchText, page) {
        toggleLoader();
        dataservice.getSearchResults(searchText, page).then(function (data) {
            loadMovies(data);
            toggleLoader();
        })
            .catch(function (err) {
                console.log('Error:' + err);
            });
    }

    // Clear search results on keystroke
    function clearSearchResults() {
        var movieCards = s.searchSection.getElementsByClassName('movie-card');
        var jawbones = s.searchSection.getElementsByClassName('jawbone');

        Array.from(movieCards).map(function (card, i) {
            if (i > 0) {
                s.searchSection.removeChild(card);
            }
        });

        Array.from(jawbones).map(function (jawbone, i) {
            if (i > 0) {
                s.searchSection.removeChild(jawbone);
            }
        });

    }

    function showJawbone(movieId) {

        toggleLoader();
        dataservice.getMovieDetails(movieId)
            .then(function (data) {
                toggleLoader();
                jawbone.create(state, data);
            })
            .catch(function (err) {
                console.log('Error:' + err);
            });

        // Scroll to top
        // s.content.scroll({
        //     top: (450 * Math.ceil(this.style.order / 5)) - 450,
        //     left: 0,
        //     behavior: 'smooth'
        //
        // });

    }

    function toggleLoader() {
        polling = !polling;
        s.loader.style.display = polling ? 'flex' : 'none';
    }


})().init();
