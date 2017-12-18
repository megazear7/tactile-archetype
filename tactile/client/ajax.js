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
    if (typeof error === "function") {
      errorCallback(error);
    }
  });
}
