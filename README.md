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
  '/': () => render('<h1>Home Page</h1>'),  // entry point for home page
  '/about': () => render('<h1>About Us</h1>'),  // if value is a function, run it for this route
  '/old': '/new',  // if value is a string, will redirect to it
  '/protected': {  // if value is an object, run "middleware" first, then run "handler"
    middleware: [
      async (context, next) => {
        console.log('Route-specific check');
        if (!isAdmin()) {
          context.navigateTo('/');
          return;
        }
        await next();
      }
    ],
    handler: async () => { /* handler function */ }
  },
  '/profile/:username': ({params, query}) => render('<h1>Profile for ' + params.username + '</h1><p>Query: ' + query.search</p>),
  '*': () => render('<h1>404 Not Found</h1>'), //catch all
};

const router = NanoRouter.createRouter(routes, {
  useHash: false,  //whether to use hash(#) in url, good for static site that cannot redirect everything to index.html. default is false
  useTag: '',  //if set, only <a href="/link" ${useTag}>Link</a> with 'useTag' attribute will work, default is '', which means all <a> tag will work
  middleware: [  // array of global middlewares that run before the route-specific middlewares
    async (context, next) => {
      console.log('Navigating to:', context.path);
      await next(); // Continue to next middleware or handler
    },
    async (context, next) => {
      // Auth check
      if (!isLoggedIn()) {
        context.navigateTo('/login');
        return; // Don't call next() to stop execution
      }
      await next();
    },
    async (context, next) => {
      console.log('Global check');  
      await next();
    }
  ],
});
router.run();
```

The `context` object passed to middleware includes `params`, `query`, `path`, and `navigateTo` for easy access. Call `next()` to continue the chain, or don't call it to stop execution (useful for redirects or auth failures).
