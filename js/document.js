console.log("DOCUMENT LOADED LAUNCHED");

async function sendRequest() {
  const params = (new URL(document.location)).searchParams;
  const target = params.get("target");

  chrome.runtime.sendMessage({target});
}

function getCurrentTabId() {
  return new Promise((res) => {
    chrome.tabs.query({currentWindow: true, active: true}, (tabs) => {
      res(tabs[0].id)
    });
  });
}

sendRequest();