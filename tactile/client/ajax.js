export function ajaxGet(url, successCallback, errorCallback) {
  fetch(url)
  .then(response => {
    if (response.ok) {
      return Promise.resolve(response);
    }
    else {
      return Promise.reject(new Error('Failed to load'));
    }
  })
  .then(response => response.json()) // parse response as JSON
  .then(data => {
    successCallback(data);
  })
  .catch(function(error) {
    console.log(`Error: ${error.message}`);
    if (typeof errorCallback === "function") {
      errorCallback(error);
    }
  });
}

export function ajaxPost(url, data, successCallback, errorCallback) {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  
  fetch(url, {method: "POST", headers: myHeaders, body: JSON.stringify(data)})
  .then(response => {
    if (response.ok) {
      return Promise.resolve(response);
    }
    else {
      return Promise.reject(new Error('Failed to post data'));
    }
  })
  .then(response => response.json()) // parse response as JSON
  .then(data => {
    if (typeof successCallback === "function") {
      successCallback(data);
    }
  })
  .catch(function(error) {
    console.log(`Error: ${error.message}`);
    if (typeof errorCallback === "function") {
      errorCallback(error);
    }
  });
}
