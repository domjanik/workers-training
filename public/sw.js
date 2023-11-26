let timeout;
// Create debounce function that takes func and wait time as arguments

const debounce = (func, wait) => {
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    func();
  }, wait);
};

let cachedRequests = [];
const cacheAnalyticsEvents = async (event) => {
  const url = new URL(event.request.url);
  if (url.pathname.includes("__track")) {
    putInCache(event.request);
    return new Response("OK");
  }
  return fetch(event.request);
};

const putInCache = async (request) => {
  cachedRequests.push(request);
};

const sentCachedRequests = async () => {
  const batch = [];
  cachedRequests.forEach((request) => {
    batch.push(fetch(request));
  });

  fetch("http://localhost:1234/__track/batch", {
    method: "POST",
    body: JSON.stringify(batch),
    keepalive: true,
  });
  cachecRequests = [];
};

const enableNavigationPreload = async () => {
  if (self.registration.navigationPreload) {
    await self.registration.navigationPreload.enable();
  }
};

self.addEventListener("activate", (event) => {
  event.waitUntil(enableNavigationPreload());
});

self.addEventListener("fetch", (event) => {
  event.respondWith(cacheAnalyticsEvents(event));
  debounce(sentCachedRequests, 10000);
});
