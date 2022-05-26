console.log("CONTENT SCRIPT")
const port = chrome.runtime.connect({name: "RPC"});
const button = document.createElement("button");
button.textContent = "Send MSG to BG";
button.addEventListener("click", () => {
  port.postMessage({message: "Request"});
});
port.onMessage.addListener((resp) => {
  console.log("RESPONSE", resp);
  setTimeout(() => {
    port.postMessage({message: "Request"})
  }, 30000);
});
document.querySelector("body").appendChild(button);
