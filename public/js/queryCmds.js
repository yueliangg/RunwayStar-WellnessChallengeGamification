// FETCH METHOD
// This function uses the fetch API to make a request to the server.
function fetchMethod(url, callback, method = "GET", data = null, token = null) {

    const headers = {};

    if (data) {
        headers["Content-Type"] = "application/json";
    }

    if (token) {
        headers["Authorization"] = "Bearer " + token;
    }

    let options = {
        method: method.toUpperCase(),
        headers: headers,
    };

    if (method.toUpperCase() !== "GET" && data !== null) {
        options.body = JSON.stringify(data);
    }

    fetch(url, options)
        .then((response) => {
        if (response.status == 204) {
            // if 204 just send the status to front end
            callback(response.status, {});
        } else {
            //if not 204 send (res.status) and data (res.json) to frontend
            response.json().then((responseData) => callback(response.status, responseData));
        }
        })
        .catch((error) => console.error(`Error from ${method} ${url}:`, error));
}