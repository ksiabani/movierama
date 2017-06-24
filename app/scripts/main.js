//infinite scroll
var distToBottom, data, dataObj;
var page = 1;
var searchPage = 1;
var pollingForData = false; //?
var apiKey = 'bc50218d91157b1ba4f142ef7baaa6a0';
var baseUrl = 'https://api.themoviedb.org/3/movie/now_playing?api_key=' + apiKey;
var searchUrl = 'https://api.themoviedb.org/3/search/movie?api_key=' + apiKey;
var fetchUrl = baseUrl + '&page=' + page;
var cardClone;
var flexOrder = 1;


// A hash to store our routes:
var routes = {};
//
function route(path, templateId, controller) {
    routes[path] = {templateId: templateId, controller: controller};
}

var el = null;
//
function router() {
    // Lazy load view element:
    el = el || document.getElementById('view');
    // Current route url (getting rid of '#' in hash as well):
    var url = location.hash.slice(1) || '/';
    var liveTemplate = location.hash.slice(1) || '/';
    // Get route by url:
    var route = routes[url];
    // Do we have both a view and a route?
    // if (el && route.controller) {
    //   // Render route template with John Resig's template engine:
    //   el.innerHTML = tmpl(route.templateId, new route.controller());
    // }
    // console.log('Route change!', route, url, document.getElementById(liveTemplate));


    Array.prototype.map.call(document.getElementsByTagName('section'), function (el) {
        el.style.display = 'none';
    });

    // is this es6 equivalent
    // Array.from(classname).forEach(function(element) {
    //   element.addEventListener('click', myFunction);
    // });
    document.getElementById(liveTemplate).style.display = 'flex';

    Array.prototype.map.call(document.querySelectorAll('nav a'), function (el) {
        el.classList.remove('is-active');
    });
    document.querySelector('nav a[href="#' + liveTemplate + '"]').classList.add('is-active');


}

// Listen on hash change:
window.addEventListener('hashchange', router);
// Listen on page load:
window.addEventListener('load', router);


// route('/', 'now-playing', function () {
// });
// route('/now-playing', 'now-playing', function () {
//   console.log('now-playing');
// });
// route('/search', 'search', function () {
//   console.log('search');
// });


// el.style.display = 'none';
// el.style.display = '';


//let's fetch


fetch(baseUrl + '&page=' + page)
    .then(response => response.json())
    .then(function (data) {
        loadContent(data)
    })
    .catch(function (err) {
        console.log('Error:' + err);
    });


function loadContent(data) {
    // pollingForData = false;
    // console.log(data.results);
    data.results.map(function (movie, i) {

        cardClone = document.getElementsByClassName('movie-card')[0].cloneNode(true);
        document.getElementById('now-playing').appendChild(cardClone);
        cardClone.setAttribute('data-id', movie.id);
        cardClone.style.display = 'flex';
        cardClone.style.order = flexOrder;
        cardClone.querySelector('.movie-card__title').textContent = movie.title;
        cardClone.style.backgroundImage = 'url(http://image.tmdb.org/t/p/w300' + movie.poster_path + ')';
        flexOrder++;

        if ((i + 1) % 4 == 0) {
            cardClone = document.getElementsByClassName('jawbone')[0].cloneNode(true);
            document.getElementById('now-playing').appendChild(cardClone);
            cardClone.style.display = 'flex';
            cardClone.style.height = 0;
            cardClone.style.visibility = 'hidden';
            cardClone.style.opacity = 0;
            cardClone.style.backgroundImage = 'url(http://image.tmdb.org/t/p/w300' + movie.poster_path + ')';
            cardClone.classList.add('mdl-cell--12-col');
            cardClone.style.order = flexOrder;
            flexOrder++;
        }


    });
}

var content = document.getElementsByClassName('mdl-layout__content')[0];

content.addEventListener('scroll', function () { //window or document
    // distToBottom = getDistFromBottom();
    // console.log('scrolling', getDistFromBottom());

    var reachedBottom = content.scrollHeight - content.scrollTop === content.clientHeight;

    // if (!pollingForData && distToBottom > 0 && distToBottom <= 8888) {
    if (reachedBottom) {
        pollingForData = true;
        // loadingContainer.classList.add('no-content');

        page++;
        fetch(baseUrl + '&page=' + page)
            .then(response => response.json())
            .then(function (data) {
                loadContent(data)
            })
            .catch(function (err) {
                console.log('Error:' + err);
            });

    }
});

function getDistFromBottom() {

    var scrollPosition = window.pageYOffset;
    var windowSize = window.innerHeight;
    var bodyHeight = document.body.offsetHeight;

    console.log(content.scrollHeight - content.scrollTop === content.clientHeight);

    console.log(content.scrollHeight, content.scrollTop, content.clientHeight);

    return Math.max(bodyHeight - (scrollPosition + windowSize), 0);

}

// var objDiv = document.getElementById("your_div");
// objDiv.scrollTop = objDiv.scrollHeight;


document.getElementById('search-input')
    .addEventListener('keyup', function (e) {
        searchMovies(document.getElementById('search-input').value);
    });


function searchMovies(searchText) {
//https://api.themoviedb.org/3/search/movie?api_key=bc50218d91157b1ba4f142ef7baaa6a0&query=x-men
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

// setTimeout(function(){
//   document.querySelector('div[style*="order: 4;"]').addEventListener('click', function () {
//     document.querySelector('div[style*="order: 4;"]').classList.add('mdl-cell--12-col');
//     // document.querySelector('div[style*="order: 4;"]').style.width = '750px';
//     // document.querySelector('div[style*="order: 1;"]').style.width = '150px';
//     // document.querySelector('div[style*="order: 2;"]').style.width = '150px';
//     // document.querySelector('div[style*="order: 3;"]').style.width = '150px';
//   });
// },2000);

document.addEventListener("DOMContentLoaded", function (event) {

    let jawboneEl, jawboneElOrder, movieId, videoId, movieDetails;
    Array.from(document.getElementsByClassName('movie-card')).map(function (element) {
        element.addEventListener('click', function () {

            jawboneElOrder = Math.ceil(this.style.order / 5) * 5;
            jawboneEl = document.querySelector('div[style*="order: ' + jawboneElOrder + ';"]');
            movieId = this.getAttribute('data-id');

            fetch('https://api.themoviedb.org/3/movie/' + movieId + '?api_key=' + apiKey + '&append_to_response=trailers,reviews,similar')
                .then(response => response.json())
                .then(function (data) {
                    console.log(data);
                    movieDetails = data;


                    jawboneEl.style.height = '450px';
                    jawboneEl.style.visibility = 'visible';
                    jawboneEl.style.opacity = 1;
                    jawboneEl.style.backgroundImage = 'url(http://img.youtube.com/vi/' + movieDetails.trailers.youtube[0].source + '/maxresdefault.jpg)';
                    jawboneEl.style.backgroundPositionX = 'right';
                    // jawboneEl.style.backgroundPositionY = '50px';
                    jawboneEl.style.backgroundSize = 'contain';
                    // jawboneEl.style.backgroundRepeat = 'no-repeat';
                    // http://img.youtube.com/vi/<insert-youtube-video-id-here>/hqdefault.jpg


                })
                .catch(function (err) {
                    console.log('Error:' + err);
                });

            //close all other's first
            Array.from(document.getElementsByClassName('mdl-cell--12-col')).map(function (element) {
                element.style.height = 0;
                element.style.visibility = 'hidden';
                element.style.opacity = 0;
            });


            // console.log(document.querySelector('div[style*="order: ' + Math.ceil(this.style.order/5)*5 + ';"]'));
            // height: 450px !important;
            // visibility: visible !important;
            // opacity: 1 !important;


            // content.scrollTop = (450 * Math.ceil(this.style.order/5)) - 450;
            content.scroll({top: (450 * Math.ceil(this.style.order / 5)) - 450, left: 0, behavior: 'smooth'});


            //tabs
            var tabsNav = jawboneEl.getElementsByClassName('js-jtabs-nav')[0];
            var jtabs = jawboneEl.querySelectorAll('div[class*="js-tab-"]');
            Array.from(tabsNav.querySelectorAll('span')).map(function (tabNavItem) {
                tabNavItem.addEventListener('click', function (e) {
                    // this.getAttribute('data-target');
                    Array.from(jtabs).map(function(tab){
                        // tab.style.display = 'none';
                        tab.classList.remove('is-active');
                    });
                    // jawboneEl.getElementsByClassName('js-tab-' + this.getAttribute('data-target'))[0].style.display = 'flex';
                    jawboneEl.getElementsByClassName('js-tab-' + this.getAttribute('data-target'))[0].classList.add('is-active');
                    tabsNav.getElementsByClassName('is-active')[0].classList.remove('is-active');
                    this.classList.add('is-active');
                });
            });

        });
    });


});



