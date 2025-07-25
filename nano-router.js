(function (global) {
  function createRouter(routeMap, options = {}) {
    const useHash = options.useHash || false;
    const useTag = options.useTag || '';

    const pathToRegex = path =>
      new RegExp("^" + path.replace(/\//g, "\\/").replace(/:\w+/g, "([^\\/]+)") + "$");

    const getParams = (routePath, result) => {
      const values = result.slice(1);
      const keys = Array.from(routePath.matchAll(/:(\w+)/g)).map(r => r[1]);
      return Object.fromEntries(keys.map((key, i) => [key, values[i]]));
    };

    const getCurrentPath = () => {
      const path = useHash ? location.hash.replace(/^#/, "") : location.pathname;
      return path.split("?")[0] || "/";
    };

    const getQueryParams = () => {
      const queryString = useHash
        ? (location.hash.includes("?") ? location.hash.split("?")[1] : "")
        : location.search.slice(1);
      return Object.fromEntries(new URLSearchParams(queryString));
    };

    const navigateTo = url => {
      if (useHash) {
        location.hash = url;
      } else {
        history.pushState(null, null, url);
        router();
      }
    };

    const router = async () => {
      const currentPath = getCurrentPath();
      const query = getQueryParams();

      const entries = Object.entries(routeMap).filter(([key]) => key !== "*");
      const potentialMatches = entries.map(([routePath, handler]) => ({
        routePath,
        handler,
        result: currentPath.match(pathToRegex(routePath))
      }));

      let match = potentialMatches.find(m => m.result !== null);

      if (! match) {
        match = {
          handler: routeMap["*"] || (() => "404 Not Found"),
          routePath: "*",
          result: [currentPath]
        };
      }

      const params = getParams(match.routePath, match.result);
      await match.handler({ params, query });
    };

    const run = () => {
      if (useHash) {
        window.addEventListener("hashchange", router);
      } else {
        window.addEventListener("popstate", router);
      }

      if (useTag) {
        document.body.addEventListener("click", event => {
          if (event.target.matches('[' + useTag + ']')) {
            event.preventDefault();
            navigateTo(event.target.getAttribute("href"));
          }
        });
      } else {
        document.querySelectorAll('a').forEach(link => 
          link.addEventListener('click', event => {
            event.preventDefault();
            navigateTo(event.target.getAttribute("href"));
          })
        );
      }

      router();
    };

    return {
      run,
      navigateTo
    };
  }

  global.NanoRouter = {
    createRouter
  };
})(window);
