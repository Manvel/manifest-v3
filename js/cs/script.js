console.log("CONTENT SCRIPT LAUNCHED");

const assets = {
  bardeenLogo: "/images/icon/48x48.png"
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
  fetch("/blob/foo.txt");
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
  console.log("chrome.runtime.id", chrome.runtime.id);
  popup.src = `chrome-extension://${chrome.runtime.id}/popup.html`;
  document.querySelector("body").appendChild(popup);
}

createButton("Popup to page", loadPopupInIFrame);
