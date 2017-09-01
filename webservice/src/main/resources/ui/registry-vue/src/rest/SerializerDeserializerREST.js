import fetch from 'isomorphic-fetch';
import {
  baseUrl
} from '../utils/Constants';

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response.json();
  } else {
    const error = new Error(response.statusText);
    error.response = response.json();
    throw error;
  }
}

const SerializerDeserializerREST = {
  getSerDess(schemaName, options) {
    options = options || {};
    options.method = options.method || 'GET';
    options.credentials = 'same-origin';
    return fetch(baseUrl + 'schemaregistry/schemas/'+ schemaName +'/serdes', options)
      .then(checkStatus);
  },
  postSerDes(options) {
    options = options || {};
    options.method = options.method || 'POST';
    options.credentials = 'same-origin';
    options.headers = options.headers || {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
    return fetch(baseUrl + 'schemaregistry/serdes', options)
      .then(checkStatus);
  },
  getSerDes(id, options) {
    options = options || {};
    options.method = options.method || 'GET';
    options.credentials = 'same-origin';
    return fetch(baseUrl + 'schemaregistry/serdes/'+id, options)
      .then(checkStatus);
  },
  postMapping(schemaName, serDesId, options) {
    options = options || {};
    options.method = options.method || 'POST';
    options.credentials = 'same-origin';
    return fetch(baseUrl + 'schemaregistry/schemas/'+schemaName+'/mapping/'+serDesId, options)
      .then(checkStatus);
  }
};

export default SerializerDeserializerREST;
