var app = (function () {
    'use strict';

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
            loader: document.getElementsByClassName('loader')[0],
            drawer: document.querySelector('.mdl-layout__drawer'),
            obfuscator: ''
        },
        init: function () {
            s = this.settings;
            storeGenresLocally();
            bindUIActions();
        }
    };

    function bindUIActions() {

        window.addEventListener('load', router);
        window.addEventListener('hashchange', router);

        // We choose to close all open jawbones on window resize
        window.addEventListener('resize', closeJawbone);

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

        // Close drawer on selecting a menu item
        Array.from(s.navLinks, function (navLink) {
            navLink.addEventListener('click', function () {
                // Obfuscator is lazy loaded by Material Lite, so we can only catch it here
                var obfuscator = document.querySelector('.mdl-layout__obfuscator');
                s.drawer.classList.remove('is-visible');
                obfuscator.classList.remove('is-visible');
            })
        })
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
                if (s.nowPlayingSection.querySelectorAll('.movie-card').length === 1) {
                    getLatestMovies();
                }
            // Intentional fallthrough
            case 'search':
                document.getElementById(state).style.display = 'flex';
                Array.from(document.querySelectorAll('nav a[href="#' + state + '"]'), function(navLink) {
                    navLink.classList.add('is-active');
                });
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
                    if (window.innerWidth > 479) {
                        showJawbone(movie.id, e);
                    }
                });
        });
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

    // Show jawbone
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

    // Close Jawbone
    function closeJawbone() {
        Array.from(s.section, function (section) {
            // If a jawbone already exists, remove it
            if (section.querySelector('.js-jawbone.is-open')) {
                section.querySelector('.js-jawbone.is-open').parentNode.removeChild(section.querySelector('.js-jawbone.is-open'));
            }
        });
    }

    // Loader helper
    function toggleLoader() {
        polling = !polling;
        s.loader.style.visibility = polling ? 'visible' : 'hidden';
    }

    // Store genres in localstorage, no need for extra calls
    function storeGenresLocally() {
        dataservice.getGenres().then(function (data) {
            data.genres.map(function (genreObj) {
                localStorage.setItem(genreObj.id, genreObj.name);
            })
        })
    }

})().init();

