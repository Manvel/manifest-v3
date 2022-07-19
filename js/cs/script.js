console.log("CONTENT SCRIPT LAUNCHED");

const assets = {
  bardeenLogo: "https://assets-global.website-files.com/61f1e1f5e79d214f7f0df5a0/61f4b43b9374c140f1270842_Bardeen_logo_invert_x40.svg"
}

const port = chrome.runtime.connect({name: "RPC"});

function createButton(text, onClick ) {
  const button = document.createElement("button");
  button.textContent = text;
  button.addEventListener("click", onClick);
  document.querySelector("body").appendChild(button);
}

createButton("Use buffer", () => {
  port.postMessage({message: "buffer"});
});

createButton("Add cache", () => {
  port.postMessage({message: "cache", resource: assets.bardeenLogo});
});

createButton("Clear cache", () => {
  port.postMessage({message: "cache_clear"});
});

createButton("Read cache", () => {
  port.postMessage({message: "cache_read"});
});

createButton("Load Image", () => {
  const imgId = "image_loader";
  const prevImg = document.querySelector(`#${imgId}`);
  if (prevImg) {
    document.querySelector("body").removeChild(prevImg);
  }
  const img = document.createElement("img");
  img.id = imgId;
  img.src = assets.bardeenLogo;
  document.querySelector("body").appendChild(img);
});

createButton("Trigger fetch", () => {
  fetch("https://example.com/");
});

const deleteCacheButton = document.createElement("button");
const image = document.createElement("img");

port.onMessage.addListener(async (resp) => {
  console.log("RESPONSE", resp);
  if (resp.message === "Buffer") {
    const blob = new Blob([resp.buffer], { type: "image/png" });
    const url = URL.createObjectURL(blob);
    image.src = url;
    document.querySelector("body").appendChild(image);
  } else if (resp.message === "Cache") {
    const cache = await caches.open("CACHE_TEST");
    console.log("cache.keys()", await cache.keys());
  }
});

function loadPopupInIFrame() {
  const popup = document.createElement("iframe");
  popup.src = chrome.runtime.getURL("popup.html");
  document.querySelector("body").appendChild(popup);
}

createButton("Popup to page", loadPopupInIFrame);

createButton("Chunked receive",async () => {
  const url = await chunkedDataReceive(port, "test");
  console.log('open=', url);
});

function chunkedDataReceive(port, id) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    console.time("RXTime");
    const handler = (req) => {
      if (req.stream === id) {
        if (req.message === "stream_chunk") {
          chunks.push(req.chunk);
        } else if (req.message === "stream_end") {
          const blob = new Blob(chunks, {type: req.type});
          port.onMessage.removeListener(handler);
          console.timeEnd("RXTime");
          resolve(URL.createObjectURL(blob));
        } else if (req.message === "stream_error") {
          port.onMessage.removeListener(handler);
          console.timeEnd("RXTime");
          reject(req.error);
        }
      }
    };
    port.onMessage.addListener(handler);
    port.postMessage({message: "stream_get", stream: id})
  })
}
