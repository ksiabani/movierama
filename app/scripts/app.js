(function () {
    'use strict';

    let genres;

    var s, page = 1, searchPage = 1,
        pollingForData = false,
        flexOrder = 1,
        state
        ;

    return {

        settings: {
            section: document.getElementsByTagName('section'),
            navLinks: document.querySelectorAll('nav a'),
            content: document.getElementsByClassName('mdl-layout__content')[0],
            searchInput: document.getElementById('search-input'),
            jawbones: document.getElementsByClassName('jawbone')
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

        s.content.addEventListener('scroll', function () { //window or document
            var reachedBottom = s.content.scrollHeight - s.content.scrollTop === s.content.clientHeight;
            // if (!pollingForData && distToBottom > 0 && distToBottom <= 8888) {
            if (reachedBottom) {
                pollingForData = true;
                page++;
                getLatestMovies(page);
            }
        });

        s.searchInput.addEventListener('keyup', function (e) {
            searchMovies(document.getElementById('search-input').value);
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
                getLatestMovies();
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
        dataservice.getLatestMovies(page).then(function (data) {
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
        // pollingForData = false;
        data.results.map(function (movie, i) {
            // console.log(genres);
            cardClone = movieCard.cloneNode(true);
            section.appendChild(cardClone);
            cardClone.setAttribute('data-id', movie.id);
            cardClone.style.display = 'flex';
            cardClone.style.order = flexOrder;
            cardClone.querySelector('.movie-card__title').textContent = movie.title;
            cardClone.querySelector('.movie-card__overview').textContent = movie.overview;
            cardClone.querySelector('.movie-card__genres').textContent = movie.genre_ids;
            cardClone.querySelector('.movie-card__meta__year').textContent = movie.release_date.substring(0, 4);
            cardClone.querySelector('.movie-card__meta__rating').textContent = movie.vote_average + '/10';
            cardClone.style.backgroundImage = 'url(http://image.tmdb.org/t/p/w300' + movie.poster_path + ')';
            flexOrder++;
            cardClone.addEventListener('click', showJawbone);

            if ((i + 1) % 4 == 0) {
                jawboneClone = jawbone.cloneNode(true);
                section.appendChild(jawboneClone);
                jawboneClone.style.order = flexOrder;
                flexOrder++;
            }

        });
    }

    function getGenres() {
        dataservice.getGenres().then(function (data) {
            genres = data;
        })
    }

    // function searchMovies(searchText) {
    //     fetch(searchUrl + '&query=' + searchText + '&page=' + searchPage)
    //         .then(response => response.json())
    //         .then(function (data) {
    //             loadSearchResults(data)
    //         })
    //         .catch(function (err) {
    //             console.log('Error:' + err);
    //         });
    // }

    // function loadSearchResults(data) {
    //     // pollingForData = false;
    //     data.results.map(function (movie) {
    //         cardClone = document.getElementsByClassName('movie-card')[0].cloneNode(true);
    //         document.getElementById('search').appendChild(cardClone);
    //         cardClone.style.display = 'flex';
    //         cardClone.querySelector('.movie-card__title').textContent = movie.title;
    //         cardClone.style.backgroundImage = 'url(http://image.tmdb.org/t/p/w300' + movie.poster_path + ')';
    //     });
    // }


    function showJawbone() {

        var jawbone, jawboneOrder, movieId, movieDetails, tabsNav;
        var overviewTab, trailersTab, reviewsTab, similarTab;
        var trailers, reviews, similarMovies;

        jawboneOrder = Math.ceil(this.style.order / 5) * 5;
        jawbone = document.querySelector('div[style*="order: ' + jawboneOrder + ';"]');
        overviewTab = jawbone.querySelector('.js-tab-overview');
        trailersTab = jawbone.querySelector('.js-tab-trailers');
        reviewsTab = jawbone.querySelector('.js-tab-reviews');
        similarTab = jawbone.querySelector('.js-tab-similar');

        trailers = trailersTab.querySelectorAll('.jawbone__trailers__trailer');
        reviews = reviewsTab.querySelectorAll('.js-review');
        similarMovies = similarTab.querySelectorAll('.js-similar');


        movieId = this.getAttribute('data-id');
        dataservice.getMovieDetails(movieId)
            .then(function (data) {
                movieDetails = data;
                jawbone.classList.add('is-open');
                jawbone.style.backgroundImage = 'url(http://img.youtube.com/vi/' + movieDetails.trailers.youtube[0].source + '/maxresdefault.jpg)';

                overviewTab.querySelector('.jawbone__overview__title').textContent = movieDetails.original_title;
                overviewTab.querySelector('.jawbone__overview__description').textContent = movieDetails.overview;
                overviewTab.querySelector('.jawbone__overview__genres').textContent = movieDetails.genres;
                overviewTab.querySelector('.jawbone__overview__meta__year').textContent = movieDetails.release_date.substring(0, 4);
                overviewTab.querySelector('.jawbone__overview__meta__rating').textContent = movieDetails.vote_average + '/10';

                Array.from(trailers).map(function(trailer, i){
                    if(movieDetails.trailers.youtube[i]) {
                        trailer.querySelector('img').src = 'http://img.youtube.com/vi/' + movieDetails.trailers.youtube[i].source + '/sddefault.jpg';
                        trailer.style.display = 'block';
                        trailer.querySelector('.jawbone__trailers__trailer__title').textContent = movieDetails.trailers.youtube[i].name;
                    }
                });

                Array.from(reviews).map(function(review, i){
                    if(movieDetails.reviews.results[i]) {
                        review.style.display = 'block';
                        review.querySelector('.js-review-author').textContent = " " + movieDetails.reviews.results[i].author;
                        review.querySelector('.js-review-text').textContent = movieDetails.reviews.results[i].content;
                    }
                });

                Array.from(similarMovies).map(function(similar, i){
                    if(movieDetails.similar.results[i]) {
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
        Array.from(s.jawbones).map(function (jawbone) {
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


})().init();
