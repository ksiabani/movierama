//infinite scroll
var distToBottom, data, dataObj;
var page = 1;
var pollingForData = false; //?
var apiKey = 'bc50218d91157b1ba4f142ef7baaa6a0';
var baseUrl = 'https://api.themoviedb.org/3/movie/now_playing?api_key=' + apiKey;
var fetchUrl = baseUrl + '&page=' + page;
var cardClone;




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
  data.results.map(function(movie){
    cardClone = document.getElementsByClassName('movie-card')[0].cloneNode(true);
    document.getElementById('now-playing').appendChild(cardClone);
    cardClone.style.display = 'flex';
    cardClone.querySelector('.movie-card__title').textContent = movie.title;
    cardClone.style.backgroundImage = 'url(http://image.tmdb.org/t/p/w300' + movie.poster_path + ')';
  });
}

var content = document.getElementsByClassName('mdl-layout__content')[0];

content.addEventListener('scroll', function() { //window or document
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

function getDistFromBottom () {

  var scrollPosition = window.pageYOffset;
  var windowSize     = window.innerHeight;
  var bodyHeight     = document.body.offsetHeight;

  console.log(content.scrollHeight - content.scrollTop === content.clientHeight);

  console.log(content.scrollHeight, content.scrollTop, content.clientHeight);

  return Math.max(bodyHeight - (scrollPosition + windowSize), 0);

}

// var objDiv = document.getElementById("your_div");
// objDiv.scrollTop = objDiv.scrollHeight;