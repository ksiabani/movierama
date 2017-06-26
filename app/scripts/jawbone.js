var jawbone = (function () {

    'use strict';

    var s, section, jawbone, clone,
        trailers, reviews, similarMovies, navbar;

    return {
        create: create
    };

    function init() {
        s = this.settings;
    }

    function create(state, movie, e) {

        // Create jawbone from template
        section = document.getElementById(state);
        jawbone = section.getElementsByClassName('jawbone')[0];
        clone = section.appendChild(jawbone.cloneNode(true));

        console.log('Remaining cards to right end: ', Math.floor((window.innerWidth-e.target.getBoundingClientRect().right)/e.target.getBoundingClientRect().width));

        // From our newly created clone, let's get elements that we will use later
        navbar = clone.querySelector('.js-jtabs-nav'); // Bottom navigation bar
        trailers = clone.querySelectorAll('.js-trailer'); // Get trailers
        reviews = clone.querySelectorAll('.js-review'); // Get reviews
        similarMovies = clone.querySelectorAll('.js-similar'); // Get similar movies

        // If a jawbone already exists, remove it
        if (section.querySelector('.js-jawbone.is-open')) {
            section.querySelector('.js-jawbone.is-open').parentNode.removeChild(section.querySelector('.js-jawbone.is-open'));
        }

        // Use YouTube thumbnail as jawbone's background. If none, use movie's poster
        // As a last resort, use a random image from lorempixel
        if (movie.trailers.youtube[0]) {
            clone.style.backgroundImage = 'url(http://img.youtube.com/vi/' + movie.trailers.youtube[0].source + '/maxresdefault.jpg)';
        }
        else {
            clone.style.backgroundImage = movie.poster_path ? 'url(http://image.tmdb.org/t/p/w300' + movie.poster_path + ')' : 'url(http://lorempixel.com/300/450/nightlife/)';
            clone.style.backgroundSize = 'cover';
        }

        // Movie overview
        /////////////////

        clone.querySelector('.js-title').textContent = movie.original_title;
        clone.querySelector('.js-description').textContent = movie.overview;
        clone.querySelector('.js-genres').textContent = movie.genres;
        clone.querySelector('.js-year').textContent = movie.release_date.substring(0, 4);
        clone.querySelector('.js-rating').textContent = movie.vote_average + '/10';

        // Trailers
        ///////////

        // If no trailers, prompt user to add one
        if (movie.trailers.youtube.length === 0) {
            clone.querySelector('.js-no-trailer').style.display = 'block';
            clone.querySelector('.js-no-trailer a').href = 'http://www.imdb.com/title/' + movie.imdb_id;
        }
        else {
            // Load up to 4 trailers
            Array.from(trailers).map(function (trailer, i) {
                if (movie.trailers.youtube[i]) {
                    trailer.href = 'https://www.youtube.com/watch?v=' + movie.trailers.youtube[i].source;
                    trailer.querySelector('img').src = 'http://img.youtube.com/vi/' + movie.trailers.youtube[i].source + '/sddefault.jpg';
                    trailer.style.display = 'block';
                    trailer.querySelector('.jawbone__trailers__trailer__title').textContent = movie.trailers.youtube[i].name;
                }
            });
        }

        // Reviews
        //////////

        // If no review, prompt user to add one
        if (movie.reviews.results.length === 0) {
            clone.querySelector('.js-no-review a').href = 'http://www.imdb.com/title/' + movie.imdb_id;
            clone.querySelector('.js-no-review').style.display = 'block';
        }
        else {
            // Load up tp 2 reviews
            Array.from(reviews).map(function (review, i) {
                if (movie.reviews.results[i]) {
                    review.style.display = 'block';
                    review.querySelector('.js-review-author').textContent = ' ' + movie.reviews.results[i].author;
                    review.querySelector('.js-review-text').textContent = movie.reviews.results[i].content;
                }
            });
        }

        // Similar movies
        /////////////////

        // If no similar movie, let the user know
        if (movie.similar.results.length === 0) {
            clone.querySelector('.js-no-similar').style.display = 'block';
        }
        else {
            // Load up tp 4 similar movies
            Array.from(similarMovies).map(function (similar, i) {
                if (movie.similar.results[i]) {
                    similar.style.display = 'block';
                    similar.style.backgroundImage = 'url(http://image.tmdb.org/t/p/w300' + movie.similar.results[i].poster_path + ')';
                    similar.querySelector('.js-similar-title').textContent = movie.similar.results[i].original_title;
                    similar.querySelector('.js-similar-year').textContent = movie.similar.results[i].release_date.substring(0, 4);
                    similar.querySelector('.js-similar-rating').textContent = movie.similar.results[i].vote_average + '/10';
                    similar.querySelector('.js-similar-overview').textContent = movie.similar.results[i].overview;
                }
            });
        }


        // Enable navigation interaction and show relevant tab on user's click
        Array.from(navbar.querySelectorAll('span')).map(function (navItem) {
            navItem.addEventListener('click', function (e) {
                showTab(clone, navbar, e);
            });
        });

        // Close button
        clone.querySelector('.js-jawbone-close').addEventListener('click', function () {
            clone.classList.remove('is-open');
        });

        // Unleash the clone!
        clone.classList.add('is-open');

        return clone;
    }

    function showTab(clone, navbar, e) {

        var navItem = e.target;

        // Remove active classes
        navbar.querySelector('.is-active').classList.remove('is-active');
        clone.querySelector('.is-active').classList.remove('is-active');

        // Add active classes to corresponding elements
        navItem.classList.add('is-active');
        clone.querySelector('.js-' + navItem.getAttribute('data-target')).classList.add('is-active');

    }

})();

