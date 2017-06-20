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
    console.log('Route change!', route, url, document.getElementById(liveTemplate));

    document.getElementsByTagName('section')[0].style.display = 'none';
    document.getElementsByTagName('section')[1].style.display = 'none';
    document.getElementById(liveTemplate).style.display = 'block';
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

