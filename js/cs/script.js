console.log("CONTENT SCRIPT LAUNCHED");

const iframeId = "ext-iframe";
const iframeWrapperId = "ext-iframe-wrapper";

function clear() {
  const iframe = document.querySelector(`#${iframeId}`);
  const iframeWrapper = document.querySelector(`#${iframeWrapperId}`);
  if (iframe) {
    iframe.parentElement.removeChild(iframe);
  }
  if (iframeWrapper) {
    iframeWrapper.parentElement.removeChild(iframeWrapper);
  }
}

function appendIframe(parent, target) {
  const frame = document.createElement("iframe");
  frame.src = chrome.runtime.getURL("document.html") + `?target=${target}`;
  frame.id = iframeId;
  parent.appendChild(frame);
}

function createWrapperDiv() {
  const div = document.createElement("div");
  div.src = chrome.runtime.getURL("document.html");
  div.id = iframeWrapperId;
  return document.body.appendChild(div);
}

function isIframeLoaded() {
  return !!document.querySelector(`#${iframeId}`);
}

function isWrapperLoaded() {
  return !!document.querySelector(`#${iframeWrapperId}`);
}

function isIframeInShadowLoaded() {
  const iframeWrapper = document.querySelector(`#${iframeWrapperId}`);
  return !!iframeWrapper.shadowRoot.querySelector(`#${iframeId}`);
}

chrome.runtime.onMessage.addListener(async (resp, sender, sendResponse) => {
  if (resp.message === "root-iframe") {
    clear();
    appendIframe(document.body, "root-iframe");
    sendResponse({isLoaded: isIframeLoaded()});
    console.log(resp.message, isIframeLoaded());
  } else if(resp.message === "root-div") {
    clear();
    createWrapperDiv();
    sendResponse({isLoaded: isWrapperLoaded()});
    console.log(resp.message, isWrapperLoaded());
  } else if (resp.message === "div-wrapped-iframe") {
    clear();
    const div = createWrapperDiv();
    appendIframe(div, "div-wrapped-iframe");
    sendResponse({isLoaded: isIframeLoaded()});
    console.log(resp.message, isIframeLoaded());
  } else if (resp.message === "shadow-iframe") {
    clear();
    const div = createWrapperDiv();
    const shadow = div.attachShadow({mode: 'open'});
    appendIframe(shadow, "shadow-iframe");
    sendResponse({isLoaded: isIframeInShadowLoaded()});
    console.log(resp.message, isIframeInShadowLoaded());
  }
});
