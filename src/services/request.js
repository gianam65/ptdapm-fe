import axios from 'axios';

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

export function checkHttpStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response?.data;
  } else {
    var isJSON = true;
    var result;

    try {
      result = response.then(data => {
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
      error.response = response.then(data => {
        data.status = response.status;
        return data;
      });
      throw error;
    }
  }
}

export function httpGet(url) {
  const options = { headers: headers };
  return fetch(url, options).then(res => checkHttpStatus(res));
}

export function httpPost(url, body = {}) {
  return axios.post(url, body).then(res => checkHttpStatus(res));
}

export function httpPut(url, body = {}) {
  return axios.put(url, body).then(res => checkHttpStatus(res));
}

export function httpDelete(url, body = {}) {
  return axios.delete(url, body).then(res => checkHttpStatus(res));
}
