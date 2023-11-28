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
let unregister = false;
const sentCachedRequests = async () => {
  const batch = [];
  if (cachedRequests.length) {
    cachedRequests.forEach((request) => {
      batch.push(request.url);
    });

    fetch("http://localhost:1234/__track/batch", {
      method: "POST",
      body: JSON.stringify({ requests: batch }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    cachedRequests = [];
  }
  if (unregister) {
    self.registration.unregister();
  }
};

const enableNavigationPreload = async () => {
  if (self.registration.navigationPreload) {
    await self.registration.navigationPreload.enable();
  }
};

self.addEventListener("beforeunload", (event) => {
  unregister = true;
});

self.addEventListener("activate", (event) => {
  event.waitUntil(enableNavigationPreload());
});

self.addEventListener("fetch", (event) => {
  event.respondWith(cacheAnalyticsEvents(event));
  debounce(sentCachedRequests, 5_000);
});
