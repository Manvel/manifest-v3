console.log("SERVICE WORKER");
chrome.runtime.onConnect.addListener((port) => {
  console.log("RPC CONNECTED");
  port.onMessage.addListener((message) => {
    console.log("REQUEST", message);
    if (port.name = "RPC") {
      port.postMessage({message: "answer"});
    }
  });
});
