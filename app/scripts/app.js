(function () {
    'use strict';

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
        // console.log(data.results);
        data.results.map(function (movie, i) {
            cardClone = movieCard.cloneNode(true);
            section.appendChild(cardClone);
            cardClone.setAttribute('data-id', movie.id);
            cardClone.style.display = 'flex';
            cardClone.style.order = flexOrder;
            cardClone.querySelector('.movie-card__title').textContent = movie.title;
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


    function searchMovies(searchText) {
        fetch(searchUrl + '&query=' + searchText + '&page=' + searchPage)
            .then(response => response.json())
            .then(function (data) {
                loadSearchResults(data)
            })
            .catch(function (err) {
                console.log('Error:' + err);
            });
    }

    function loadSearchResults(data) {
        // pollingForData = false;
        // console.log(data.results);
        data.results.map(function (movie) {
            cardClone = document.getElementsByClassName('movie-card')[0].cloneNode(true);
            document.getElementById('search').appendChild(cardClone);
            cardClone.style.display = 'flex';
            cardClone.querySelector('.movie-card__title').textContent = movie.title;
            cardClone.style.backgroundImage = 'url(http://image.tmdb.org/t/p/w300' + movie.poster_path + ')';
        });
    }


    function showJawbone() {

        var jawbone, jawboneOrder, movieId, movieDetails, tabsNav, jtabs;

        jawboneOrder = Math.ceil(this.style.order / 5) * 5;
        jawbone = document.querySelector('div[style*="order: ' + jawboneOrder + ';"]');
        movieId = this.getAttribute('data-id');
        dataservice.getMovieDetails(movieId)
            .then(function (data) {
                movieDetails = data;
                jawbone.classList.add('is-open');
                jawbone.style.backgroundImage = 'url(http://img.youtube.com/vi/' + movieDetails.trailers.youtube[0].source + '/maxresdefault.jpg)';
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
        // tabsNav = jawbone.getElementsByClassName('js-jtabs-nav')[0];
        // jtabs = jawbone.querySelectorAll('div[class*="js-tab-"]');
        // Array.from(tabsNav.querySelectorAll('span')).map(function (tabNavItem) {
        //     tabNavItem.addEventListener('click', function (e) {
        //         Array.from(jtabs).map(function (tab) {
        //             tab.classList.remove('is-active');
        //         });
        //         jawbone.getElementsByClassName('js-tab-' + this.getAttribute('data-target'))[0].classList.add('is-active');
        //         tabsNav.getElementsByClassName('is-active')[0].classList.remove('is-active');
        //         this.classList.add('is-active');
        //     });
        // });


    }


})().init();
