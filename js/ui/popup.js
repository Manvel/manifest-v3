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

