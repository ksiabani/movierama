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
        window.addEventListener('load', router);
        window.addEventListener('hashchange', router);

        // Infinite scrolling
        Array.from(s.section, function (section) {
            section.addEventListener('scroll', function () {
                var reachedBottom = section.scrollHeight - section.scrollTop === section.clientHeight;
                if (reachedBottom && !polling && section.scrollTop > section.clientHeight) {
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
        Array.from(s.navLinks, function (navLink) {
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
                .addEventListener('click', function (e) {
                    showJawbone(movie.id, e)
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

    function showJawbone(movieId, e) {

        toggleLoader();
        dataservice.getMovieDetails(movieId)
            .then(function (data) {
                toggleLoader();
                jawbone.create(state, data, e)
                    .scrollIntoView({
                        behavior: 'smooth'
                    });
            })
            .catch(function (err) {
                console.log('Error:' + err);
            });

    }

    function toggleLoader() {
        polling = !polling;
        s.loader.style.display = polling ? 'flex' : 'none';
    }


})().init();
