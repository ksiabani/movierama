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
var fetchUrl = 'https://api.themoviedb.org/3/movie/now_playing?api_key=bc50218d91157b1ba4f142ef7baaa6a0';
fetch(fetchUrl)
  .then(response => response.json())
  .then(function (data) {
    console.log(data.results);
  })
  .catch(function (err) {
    console.log('Error:' + err);
  });



