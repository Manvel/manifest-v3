function createButton(text, onClick, target ) {
  const tr = document.createElement("tr");
  const tdAction = document.createElement("td");
  const tdAddedToDom = document.createElement("td");
  const tdConnected = document.createElement("td");
  const button = document.createElement("button");
  button.textContent = text;
  button.addEventListener("click", async () => {
    let timeout = () => {
      if (!timeout) return;
      chrome.runtime.onMessage.removeListener(onMessage);
      if (target === "n/a") {
        tdConnected.textContent = "n/a";
      } else {
        tdConnected.textContent = "Timeout";
      }
    };
    if (timeout) {
      setTimeout(timeout, 3000);
    }
    const onMessage = (resp) => {
      if (resp.target === target) {
        chrome.runtime.onMessage.removeListener(onMessage);
        tdConnected.textContent = "Ok";
        clearTimeout(timeout);
        timeout = null;
      }
    };

    chrome.runtime.onMessage.addListener(onMessage);
    
    const res = await onClick();
    tdAddedToDom.textContent = res.toString();
  });
  tdAction.appendChild(button);
  tr.appendChild(tdAction);
  tr.appendChild(tdAddedToDom);
  tr.appendChild(tdConnected);
  document.querySelector("table").appendChild(tr);
}

createButton("Root iframe", () => {
  return new Promise(async(resolve) => {
    chrome.tabs.sendMessage(await getCurrentTabId(), {message: "root-iframe"}, (response) => {
      resolve(response.isLoaded ? "OK" : "Not Ok");
      setTimeout(() => {
        resolve("Timeout")
      }, 3000);
    });
  })
}, "root-iframe");

createButton("Root Div", () => {
  return new Promise(async(resolve) => {
    chrome.tabs.sendMessage(await getCurrentTabId(), {message: "root-div"}, (response) => {
      resolve(response.isLoaded ? "OK" : "Not Ok");
      setTimeout(() => {
        resolve("Timeout")
      }, 3000);
    });
  });
}, "n/a");

createButton("Div wrapped iframe", () => {
  return new Promise(async(resolve) => {
    chrome.tabs.sendMessage(await getCurrentTabId(), {message: "div-wrapped-iframe"}, (response) => {
      resolve(response.isLoaded ? "OK" : "Not Ok");
      setTimeout(() => {
        resolve("Timeout")
      }, 3000);
    });
  });
}, "div-wrapped-iframe");

createButton("Shadow iframe", () => {
  return new Promise(async(resolve) => {
    chrome.tabs.sendMessage(await getCurrentTabId(), {message: "shadow-iframe"}, (response) => {
      resolve(response.isLoaded ? "OK" : "Not Ok");
      setTimeout(() => {
        resolve("Timeout")
      }, 3000);
    });
  });
}, "shadow-iframe");


function getCurrentTabId() {
  return new Promise((res) => {
    chrome.tabs.query({currentWindow: true, active: true}, (tabs) => {
      res(tabs[0].id)
    });
  });
}

