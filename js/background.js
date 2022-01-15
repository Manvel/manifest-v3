const onSendHeaders = chrome.webRequest.onSendHeaders;
const onHeadersReceived = chrome.webRequest.onHeadersReceived;


const urls = {urls: ["<all_urls>"]};
onSendHeaders.addListener((request) => {
  console.log("onSendHeaders", request);
}, urls, ["requestHeaders"]);

onHeadersReceived.addListener((response) => {
  console.log("onHeadersReceived", response);
}, urls, ["responseHeaders"]);
