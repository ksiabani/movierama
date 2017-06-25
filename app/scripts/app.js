(function () {
    'use strict';

    let genres;

    var s, page = 1, searchPage = 1,
        flexOrder = 1, flexOrderSearch = 1,
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
            // jawbones: document.getElementsByClassName('jawbone')
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

        s.searchInput.addEventListener('keyup', function (e) {
            clearSearchResults();
            if (s.searchInput.value.length > 0 && !polling) {
                searchMovies(s.searchInput.value);
            }
        });

    }


    ///////
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

    function getLatestMovies(page) {
        polling = true;
        toggleLoader();
        dataservice.getLatestMovies(page).then(function (data) {
            polling = false;
            toggleLoader();
            loadMovies(data);
        })
            .catch(function (err) {
                console.log('Error:' + err);
            });
    }


    function loadMovies(data) {
        var section = document.getElementById(state),
            movieCard = section.getElementsByClassName('movie-card')[0],
            cardClone,
            jawbone = section.getElementsByClassName('jawbone')[0],
            jawboneClone
            ;
        data.results.map(function (movie, i) {

            cardClone = movieCard.cloneNode(true);
            section.appendChild(cardClone);
            cardClone.setAttribute('data-id', movie.id);
            cardClone.style.display = 'flex';
            cardClone.style.order = state === 'now-playing' ? flexOrder : flexOrderSearch;
            cardClone.querySelector('.movie-card__title').textContent = movie.title;
            cardClone.querySelector('.movie-card__overview').textContent = movie.overview;
            cardClone.querySelector('.movie-card__genres').textContent = movie.genre_ids;
            cardClone.querySelector('.movie-card__meta__year').textContent = movie.release_date.substring(0, 4);
            cardClone.querySelector('.movie-card__meta__rating').textContent = movie.vote_average + '/10';
            cardClone.style.backgroundImage = movie.poster_path ? 'url(http://image.tmdb.org/t/p/w300' + movie.poster_path + ')' : 'url(http://lorempixel.com/300/450/nightlife/)';
            state === 'now-playing' ? flexOrder++ : flexOrderSearch++;
            cardClone.addEventListener('click', showJawbone);

            if ((i + 1) % 4 == 0) {
                jawboneClone = jawbone.cloneNode(true);
                section.appendChild(jawboneClone);
                jawboneClone.style.order = state === 'now-playing' ? flexOrder : flexOrderSearch;
                state === 'now-playing' ? flexOrder++ : flexOrderSearch++;
            }

        });
    }

    function getGenres() {
        dataservice.getGenres().then(function (data) {
            genres = data;
        })
    }

    function searchMovies(searchText, page) {
        polling = true;
        toggleLoader();
        dataservice.getSearchResults(searchText, page).then(function (data) {
            loadMovies(data);
            polling = false;
            toggleLoader();
        })
            .catch(function (err) {
                console.log('Error:' + err);
            });
    }

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

        flexOrderSearch = 1;

    }

    function showJawbone() {

        var jawbone, jawboneOrder, movieId, movieDetails, tabsNav;
        var overviewTab, trailersTab, reviewsTab, similarTab;
        var trailers, reviews, similarMovies;
        var activeSection = state === 'now-playing' ? s.nowPlayingSection : s.searchSection;

        jawboneOrder = Math.ceil(this.style.order / 5) * 5;
        jawbone = activeSection.querySelector('div[style*="order: ' + jawboneOrder + ';"]');
        overviewTab = jawbone.querySelector('.js-tab-overview');
        trailersTab = jawbone.querySelector('.js-tab-trailers');
        reviewsTab = jawbone.querySelector('.js-tab-reviews');
        similarTab = jawbone.querySelector('.js-tab-similar');

        trailers = trailersTab.querySelectorAll('.jawbone__trailers__trailer');
        reviews = reviewsTab.querySelectorAll('.js-review');
        similarMovies = similarTab.querySelectorAll('.js-similar');


        movieId = this.getAttribute('data-id');
        polling = true;
        toggleLoader();
        dataservice.getMovieDetails(movieId)
            .then(function (data) {
                polling = false;
                toggleLoader();
                movieDetails = data;
                jawbone.classList.add('is-open');
                if (movieDetails.trailers.youtube[0]) {
                    jawbone.style.backgroundImage = 'url(http://img.youtube.com/vi/' + movieDetails.trailers.youtube[0].source + '/maxresdefault.jpg)';
                }
                else {
                    // jawbone.style.backgroundImage = 'url(http://image.tmdb.org/t/p/w300' + movieDetails.poster_path + ')';
                    jawbone.style.backgroundImage = movieDetails.poster_path ? 'url(http://image.tmdb.org/t/p/w300' + movieDetails.poster_path + ')' : 'url(http://lorempixel.com/300/450/nightlife/)';
                    jawbone.style.backgroundSize = 'cover';
                }

                overviewTab.querySelector('.jawbone__overview__title').textContent = movieDetails.original_title;
                overviewTab.querySelector('.jawbone__overview__description').textContent = movieDetails.overview;
                overviewTab.querySelector('.jawbone__overview__genres').textContent = movieDetails.genres;
                overviewTab.querySelector('.jawbone__overview__meta__year').textContent = movieDetails.release_date.substring(0, 4);
                overviewTab.querySelector('.jawbone__overview__meta__rating').textContent = movieDetails.vote_average + '/10';

                Array.from(trailers).map(function (trailer, i) {
                    if (movieDetails.trailers.youtube[i]) {
                        trailer.querySelector('img').src = 'http://img.youtube.com/vi/' + movieDetails.trailers.youtube[i].source + '/sddefault.jpg';
                        trailer.style.display = 'block';
                        trailer.querySelector('.jawbone__trailers__trailer__title').textContent = movieDetails.trailers.youtube[i].name;
                    }
                });

                Array.from(reviews).map(function (review, i) {
                    if (movieDetails.reviews.results[i]) {
                        review.style.display = 'block';
                        review.querySelector('.js-review-author').textContent = " " + movieDetails.reviews.results[i].author;
                        review.querySelector('.js-review-text').textContent = movieDetails.reviews.results[i].content;
                    }
                });

                Array.from(similarMovies).map(function (similar, i) {
                    if (movieDetails.similar.results[i]) {
                        similar.style.display = 'block';
                        similar.style.backgroundImage = 'url(http://image.tmdb.org/t/p/w300' + movieDetails.similar.results[i].poster_path + ')';
                        similar.querySelector('.js-similar-title').textContent = movieDetails.similar.results[i].original_title;
                        similar.querySelector('.js-similar-year').textContent = movieDetails.similar.results[i].release_date.substring(0, 4);
                        similar.querySelector('.js-similar-rating').textContent = movieDetails.similar.results[i].vote_average + '/10';
                        similar.querySelector('.js-similar-overview').textContent = movieDetails.similar.results[i].overview;
                    }
                });


            })
            .catch(function (err) {
                console.log('Error:' + err);
            });

        // Close all other's
        Array.from(activeSection.getElementsByClassName('jawbone')).map(function (jawbone) {
            if (jawbone.style.order != jawboneOrder) {
                jawbone.classList.remove('is-open');
            }
        });


        // Scroll to top
        s.content.scroll({
            top: (450 * Math.ceil(this.style.order / 5)) - 450,
            left: 0,
            behavior: 'smooth'

        });

        // TODO: Some elements can go to settings?
        tabsNav = jawbone.getElementsByClassName('js-jtabs-nav')[0];
        Array.from(tabsNav.querySelectorAll('span')).map(function (tabNavItem) {
            tabNavItem.addEventListener('click', showJawboneTab);
        });


    }

    function showJawboneTab() {
        var tabsNav = this.parentNode;
        var jawbone = tabsNav.parentNode;
        var jtabs = jawbone.querySelectorAll('div[class*="js-tab-"]');
        tabsNav.querySelector('.is-active').classList.remove('is-active');
        this.classList.add('is-active');
        Array.from(jtabs).map(function (tab) {
            tab.classList.remove('is-active');
        });
        jawbone.getElementsByClassName('js-tab-' + this.getAttribute('data-target'))[0].classList.add('is-active');
    }

    function toggleLoader() {
        s.loader.style.display = polling ? 'flex' : 'none';
    }


})().init();
