export function objectToFormData(obj, form, namespace) {
  var fd = form || new FormData();
  var formKey;
  for (var property in obj) {
    if (obj.hasOwnProperty(property)) {
      if (namespace) {
        formKey = namespace + '[' + property + ']';
      } else {
        formKey = property;
      }

      if (typeof obj[property] === 'object' && !(obj[property] instanceof File)) {
        objectToFormData(obj[property], fd, formKey);
      } else {
        fd.append(formKey, obj[property]);
      }
    }
  }

  return fd;
}

const headers = {
  Accept: 'application/json'
};

export function checkHttpStatus(response, requestOptions) {
  if (response.status >= 200 && response.status < 300) {
    return response.json();
  } else {
    var isJSON = true;
    var result;

    try {
      result = response.json().then(data => {
        if (typeof data == 'object') {
          data.status = response.status;
          return data;
        } else {
          return data;
        }
      });
      result.success = false;
    } catch (e) {
      isJSON = false;
    }

    if (isJSON) {
      return result;
    } else {
      var error = new Error(response.statusText);
      error.response = response.json().then(data => {
        data.status = response.status;
        return data;
      });
      throw error;
    }
  }
}

export function httpGet(url) {
  const options = { headers: headers };
  return fetch(url, options).then(res => checkHttpStatus(res, { ...options, url }));
  // .then(parseJSON)
}

export function httpPost(url, body) {
  const options = {
    method: 'post',
    headers: headers,
    body: objectToFormData(body)
  };
  return fetch(url, options).then(res => checkHttpStatus(res, { ...options, url }));
  // .then(parseJSON)
}

export function httpPut(url, body) {
  const options = {
    method: 'put',
    headers: headers,
    body: objectToFormData(body)
  };
  return fetch(url, options).then(res => checkHttpStatus(res, { ...options, url }));
}

export function httpDelete(url) {
  const options = {
    method: 'delete',
    headers: headers
  };
  return fetch(url, options).then(res => checkHttpStatus(res, { ...options, url }));
  // .then(parseJSON)
}

export function httpDeleteDepartment(url, token) {
  const options = {
    method: 'DELETE',
    headers: { authorization: `Bearer ${token}` }
  };
  return fetch(url, options).then(res => checkHttpStatus(res, { ...options, url }));
}
