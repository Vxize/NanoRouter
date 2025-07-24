# NanoRouter
## CDN
`<script src="https://cdn.jsdelivr.net/gh/Vxize/NanoRouter/nano-router.min.js"></script>`
## HTML
```
<nav>
  <a href="/">Home</a>
  <a href="/about">About</a>
  <a href="/profile/alice">Alice's Profile</a>
  <a href="/profile/bob?search=name">Bob's Profile</a>
</nav>

<div id="app"></div>
```
## JS
```
const render = (html) => {
  document.getElementById('app').innerHTML = html;
}

const routes = {
  '/': () => render('<h1>Home Page</h1>'),
  '/about': () => render('<h1>About Us</h1>'),
  '/profile/:username': ({params, query}) => render('<h1>Profile for ' + params.username + '</h1><p>Query: ' + query.search</p>),
  '*': () => render('<h1>404 Not Found</h1>'), //catch all
};

const router = NanoRouter.createRouter(routes, {
  useHash: false,  //whether to use hash(#) in url, good for static site that cannot redirect everything to index.html. default is false
  useTag: '',  //if set, only <a href="/link" ${useTag}>Link</a> with 'useTag' attribute will work, default is '', which means all <a> tag will work
});
router.init();
```
