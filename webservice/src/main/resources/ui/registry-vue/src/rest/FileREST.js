import fetch from 'isomorphic-fetch';
import {
  baseUrl
} from '../utils/Constants';

const FileREST = {
  getFile(id, options) {
    options = options || {};
    options.method = options.method || 'GET';
    options.credentials = 'same-origin';
    return fetch(baseUrl + 'schemaregistry/files/download/' + id, options)
      .then((response) => {
        return response.json();
      });
  },
  postFile(options) {
    options = options || {};
    options.method = options.method || 'POST';
    options.credentials = 'same-origin';
    return fetch(baseUrl + 'schemaregistry/files', options)
      .then((response) => {
        return response.text();
      });
  }
};

export default FileREST;
