console.log("BACKGROUND PAGE LAUNCHED");

chrome.runtime.onConnect.addListener((port) => {
  console.log("RPC CONNECTED");
  port.onMessage.addListener(async (message, sender) => {
    console.log("REQUEST", sender);
    const image = await chrome.tabs.captureVisibleTab();
    console.log(image);

    if (port.name = "RPC") {
      // TODO: send image reference to the front-end and render it there.
      port.postMessage({message: "answer"});
    }
  });
});
