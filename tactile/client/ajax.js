export function ajax(url, data, method, headers, successCallback, errorCallback) {
  var config = {method: method, headers: headers};
  if (typeof data != "undefined") {
    config.body = JSON.stringify(data);
  }
  fetch(url, config)
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

export function ajaxGet(url, successCallback, errorCallback) {
  var headers = new Headers();
  ajax(url, undefined, "GET", headers, successCallback, errorCallback);
}

export function ajaxPost(url, data, successCallback, errorCallback) {
  var headers = new Headers();
  headers.append("Content-Type", "application/json");
  ajax(url, data, "POST", headers, successCallback, errorCallback);
}

export function ajaxPut(url, data, successCallback, errorCallback) {
  var headers = new Headers();
  headers.append("Content-Type", "application/json");
  ajax(url, data, "PUT", headers, successCallback, errorCallback);
}
