console.log("BACKGROUND PAGE LAUNCHED");
const CACHE_NAME = "CACHE_TEST";

async function cacheAdd(resource) {
  const cache = await caches.open(CACHE_NAME);
  await cache.add(resource);
  const addedCache = await cache.match(resource);
  console.log("CACHED RESOURCE", addedCache);
}

async function cacheClear() {
  const cache = await caches.open(CACHE_NAME);
  for (const request of await cache.keys()) {
    console.log("CLEARING CACHE FOR", request);
    cache.delete(request);
  }
  console.log("CACHE IS CLEAN");
}

async function cacheReadAll() {
  const cache = await caches.open(CACHE_NAME);
  console.log("READING CACHED REQUESTS", await cache.keys());
}

chrome.runtime.onConnect.addListener((port) => {
  console.log("RPC CONNECTED");
  port.onMessage.addListener(async (req, sender) => {
    if (req.message === "buffer") {
      console.log("REQUEST", sender);
      const image = await chrome.tabs.captureVisibleTab();
      // TODO: Use sharedArrayBuffer
      const buffer = _base64ToArrayBuffer(image.split(",")[1]);
      if (port.name = "RPC") {
        port.postMessage({message: "Buffer", buffer});
      }
    }
    else if (req.message === "cache") {
      await cacheAdd(req.resource);
      if (port.name = "RPC") {
        port.postMessage({message: "Cache"});
      }
    } else if (req.message === "cache_clear") {
      await cacheClear();
    } else if (req.message === "cache_read") {
      await cacheReadAll();
      await fetch("https://example.com/");
      console.log("FETCHED");
    }
  });
});

self.addEventListener('activate', function(event) {
  console.log('Claiming control');
  return self.clients.claim();
});

self.addEventListener('fetch', async (event) => {
  // ServiceWorker intercepting a fetch
  console.log("FETCH EVENT LISTENER", event);
  const cache = await caches.open(CACHE_NAME);
  const response = await cache.match(event.request);
  if (response) {
    console.log("FETCHING FROM CACHE", response);
    event.respondWith(response);
  } else {
    console.log("NO CACHE MATCH");
    return;
  }

});

function _base64ToArrayBuffer(base64) {
  var binary_string = self.atob(base64);
  var len = binary_string.length;
  // TODO use shared array buffer.
  var bytes = new Uint8Array(len);
  for (var i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes.buffer;
}
